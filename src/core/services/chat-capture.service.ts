import { monthOffsetForDay } from '@/core/calendar';
import {
  buildIntentSystemPrompt,
  INTENT_JSON_SCHEMA,
  localNoon,
  matchCategory,
  validateIntent,
  type ChatIntent,
} from '@/core/chat-intent';
import { uuidFromSeed } from '@/core/idempotency';
import { parseQuickEntry, type QuickEntryFailure } from '@/core/quick-entry';
import { listCategories } from '@/core/repositories/category.repository';
import { recordIngestionFailure } from '@/core/repositories/ingestion-failure.repository';
import type { ProfileRow } from '@/core/repositories/profile.repository';
import {
  countTransactionsBySource,
  type TransactionRow,
  type TransactionSource,
} from '@/core/repositories/transaction.repository';
import {
  dayKeyReader,
  getDashboardData,
  getMonthViewData,
  shiftDayKey,
  type DashboardData,
  type MonthViewData,
} from '@/core/services/analytics.service';
import { recordMetric } from '@/core/services/telemetry.service';
import { recordTransaction } from '@/core/services/transaction.service';
import type { UserId } from '@/core/types';

/**
 * A sentence typed in a chat, turned into a row - or into an answer.
 *
 * WHY THE CLIENT DOES NOT DO THIS
 * -------------------------------
 * The Telegram handler could have called `parseQuickEntry` and then
 * `recordTransaction` itself - it is only two calls. But between them sit three
 * decisions that are not the chat's to make: which source the row is filed
 * under, whether a retry is a second spend, and which failures are worth
 * keeping. Put them in the client and the WhatsApp client will answer them
 * differently, and the two surfaces will quietly disagree about what the same
 * sentence means (P9).
 *
 * TWO READERS, IN THIS ORDER (block L1)
 * -------------------------------------
 * The strict parser reads first, and whatever it accepts never reaches the
 * language model: it is free, instant, and cannot misread "12000 juan valdez".
 * Only a line it REJECTS is handed to the model, whose whole job is to say
 * what the line is asking for. It never answers the user and never produces a
 * figure: a spend's amount comes back as the text the user wrote and is read
 * by the same deterministic code (chat-intent.ts), and a question is answered
 * by the services behind /saldo, /hoy and /mes. If the model is down, slow or
 * unsure, the user gets exactly the bot they had before L1.
 */

export type ChatCaptureResult =
  | {
      readonly ok: true;
      readonly transaction: TransactionRow;
      readonly isDuplicate: boolean;
      readonly autoCategorized: boolean;
      readonly appliedCategory: { readonly name: string; readonly icon: string } | null;
    }
  | { readonly ok: false; readonly reason: QuickEntryFailure | 'unknown_account' | 'unknown_category' };

/**
 * A model that answers in JSON. The port, not the vendor: core never imports
 * infrastructure, so the client hands in the adapter the same way it hands
 * notification.service its MessagingAdapter. infrastructure/ai/gemini.ts's
 * generateJson fits it as it is.
 */
export interface JsonModelRequest {
  readonly system: string;
  readonly prompt: string;
  readonly schema: Record<string, unknown>;
  readonly timeoutMs?: number;
}

export type JsonModelResult =
  | {
      readonly ok: true;
      readonly json: unknown;
      readonly latencyMs: number;
      readonly usage: { readonly promptTokens: number; readonly outputTokens: number };
      readonly model: string;
    }
  | { readonly ok: false; readonly reason: string; readonly latencyMs: number };

export type JsonModel = (request: JsonModelRequest) => Promise<JsonModelResult>;

export interface ChatCaptureOptions {
  readonly source: TransactionSource;
  /**
   * The provider's own id for this message - `telegram:<chat>:<message>`.
   *
   * It is what stops a redelivered update from becoming a second spend, and
   * why it is an EVENT id rather than a hash of the text: two coffees at the
   * same place for the same amount on the same day is a real thing that
   * happens, and hashing the sentence would discard the second one.
   */
  readonly externalId: string;
  /** Left out, only the strict parser reads - which is the bot before L1. */
  readonly model?: JsonModel;
  /**
   * Called once, just before the model is asked: the one moment the user
   * would otherwise stare at nothing for a second. The client decides what
   * "thinking" looks like on its surface.
   */
  readonly onThinking?: () => void;
}

/** A spend the model dated to a day other than today. */
export interface ChatDay {
  /** 'YYYY-MM-DD' in the profile's zone. */
  readonly key: string;
  readonly relative: 'yesterday' | null;
}

export type MonthCategory =
  | { readonly found: true; readonly name: string; readonly icon: string; readonly totalMinor: bigint }
  /** The word the user wrote, for "you have no category called …". */
  | { readonly found: false; readonly word: string };

export type ChatTextResult =
  | {
      readonly kind: 'capture';
      readonly capture: ChatCaptureResult;
      /** null when it was filed under today, which is every strict-parser spend. */
      readonly day: ChatDay | null;
    }
  | { readonly kind: 'balance'; readonly data: DashboardData }
  | { readonly kind: 'today'; readonly data: DashboardData }
  | {
      readonly kind: 'day';
      readonly day: ChatDay;
      readonly totalExpenseMinor: bigint;
      readonly count: number;
      readonly currency: string;
    }
  | { readonly kind: 'month'; readonly data: MonthViewData; readonly category: MonthCategory | null }
  | { readonly kind: 'unsupported'; readonly topic: 'budget' | 'advice' | 'other' };

/** Measured p95 is under a second; the tail on the standard tier is not. */
const MODEL_TIMEOUT_MS = 10_000;

/**
 * Longer than any spend or question anybody types. A pasted paragraph is not
 * worth tokens, and the strict parser's answer is the right one for it.
 */
const MAX_MODEL_INPUT = 500;

/**
 * Which unparseable messages are worth keeping, and which are just chat.
 *
 * `recordIngestionFailure` feeds a review screen. Filing every "hola" there
 * would bury the one message that actually matters - a real spend the parser
 * could not read - under conversation, which is precisely the noise P2 forbids
 * an alert to fire on.
 *
 * So: anything where an amount WAS found and something else went wrong is
 * evidence. A message with no amount is only evidence if it contains a digit
 * at all; otherwise it was never an attempt to record money.
 */
function isWorthRecording(reason: QuickEntryFailure, text: string): boolean {
  return reason === 'no_amount' ? /\d/.test(text) : true;
}

async function fileFailure(
  userId: UserId,
  text: string,
  error: string,
  options: ChatCaptureOptions,
): Promise<void> {
  try {
    await recordIngestionFailure(userId, {
      source: options.source,
      rawPayload: { text, externalId: options.externalId },
      error,
    });
  } catch (failure) {
    // The user still gets told what went wrong. Losing the diagnostic is
    // not a reason to also lose the reply.
    console.error('[chat-capture] could not record a failure:', failure);
  }
}

interface ReadSpend {
  readonly amountMinor: bigint;
  readonly type: 'expense' | 'income';
  readonly merchant: string;
  readonly note: string | null;
  readonly transactionDate: Date;
}

/** The write, whichever reader produced the spend. */
async function saveSpend(
  userId: UserId,
  profile: ProfileRow,
  spend: ReadSpend,
  text: string,
  options: ChatCaptureOptions,
): Promise<ChatCaptureResult> {
  const result = await recordTransaction(userId, profile, {
    amountMinor: spend.amountMinor,
    type: spend.type,
    merchant: spend.merchant,
    note: spend.note,
    transactionDate: spend.transactionDate,
    source: options.source,
    idempotencyKey: uuidFromSeed(options.externalId),
    categoryId: null,
    // No currency override: unlike a bank SMS, which states what it charged,
    // a typed number is in whatever the account speaks.
    location: null,
    // A chat has no GPS. 'manual' is the honest source for a spend written
    // down by hand, and resolveLocation drops the reading anyway.
    locationSource: 'manual',
  });

  if (!result.ok) {
    await fileFailure(userId, text, result.reason, options);
    return result;
  }

  return {
    ok: true,
    transaction: result.transaction,
    isDuplicate: result.isDuplicate,
    autoCategorized: result.autoCategorized,
    appliedCategory: result.appliedCategory,
  };
}

/**
 * One row per reading, for the rescue rate in METRICS.md.
 *
 * The message itself is NOT in it. Telemetry is kept to measure the model,
 * and what people write about their money is not needed for that; the
 * failures the user may want to fix keep their text in ingestion_failures,
 * where they can be read and deleted with the account.
 */
async function recordReading(
  userId: UserId,
  result: JsonModelResult,
  intent: ChatIntent | null,
): Promise<void> {
  const outcome = !result.ok ? 'unavailable' : intent?.kind === 'unclear' ? 'unclear' : 'understood';
  try {
    await recordMetric(userId, {
      metric: 'chat_intent',
      value: result.latencyMs,
      metadata: {
        outcome,
        intent: intent?.kind ?? null,
        reason: result.ok ? null : result.reason,
        model: result.ok ? result.model : null,
        promptTokens: result.ok ? result.usage.promptTokens : 0,
        outputTokens: result.ok ? result.usage.outputTokens : 0,
      },
    });
  } catch (error) {
    // A missing measurement is not worth a missing answer.
    console.error('[chat-capture] could not record the model reading:', error);
  }
}

/** What the model says a rejected line asks for, or null when it was not asked. */
async function understand(
  userId: UserId,
  text: string,
  todayKey: string,
  profile: ProfileRow,
  options: ChatCaptureOptions,
): Promise<ChatIntent | null> {
  if (!options.model || text.length > MAX_MODEL_INPUT) {
    return null;
  }

  options.onThinking?.();
  const result = await options.model({
    // Today's date is in the prompt: "ayer" means nothing to a model with no
    // clock, and the profile's zone decides what today is, not the server's.
    system: buildIntentSystemPrompt(todayKey),
    prompt: text,
    schema: INTENT_JSON_SCHEMA,
    timeoutMs: MODEL_TIMEOUT_MS,
  });

  const intent = result.ok ? validateIntent(result.json, todayKey, profile.baseCurrency) : null;
  await recordReading(userId, result, intent);
  return intent;
}

function chatDay(key: string, todayKey: string): ChatDay {
  return { key, relative: key === shiftDayKey(todayKey, -1) ? 'yesterday' : null };
}

/** Everything the model can ask for except "I do not know". */
async function act(
  userId: UserId,
  profile: ProfileRow,
  intent: Exclude<ChatIntent, { kind: 'unclear' }>,
  text: string,
  todayKey: string,
  options: ChatCaptureOptions,
): Promise<ChatTextResult> {
  switch (intent.kind) {
    case 'record_spend': {
      const isToday = intent.date === todayKey;
      const capture = await saveSpend(
        userId,
        profile,
        {
          amountMinor: intent.amountMinor,
          type: intent.type,
          merchant: intent.merchant,
          note: null,
          // Today keeps the moment it was typed, like every other chat spend.
          // Another day has no moment, only a date - see localNoon.
          transactionDate: isToday ? new Date() : localNoon(intent.date, profile.timezone),
        },
        text,
        options,
      );
      return { kind: 'capture', capture, day: isToday ? null : chatDay(intent.date, todayKey) };
    }

    case 'balance':
      return { kind: 'balance', data: await getDashboardData(userId) };

    case 'spending_on_day': {
      if (intent.date === todayKey) {
        return { kind: 'today', data: await getDashboardData(userId) };
      }
      // The month view, not a new query: its day totals are the ones the
      // calendar on /mes shows, so the chat and the app cannot disagree about
      // what a Tuesday cost.
      const data = await getMonthViewData(userId, monthOffsetForDay(intent.date, todayKey));
      const group = data.days.find((day) => day.day === intent.date);
      return {
        kind: 'day',
        day: chatDay(intent.date, todayKey),
        totalExpenseMinor: group?.totalExpenseMinor ?? 0n,
        count: group?.transactions.length ?? 0,
        currency: data.baseCurrency,
      };
    }

    case 'spending_in_month': {
      const [data, categories] = await Promise.all([
        getMonthViewData(userId, intent.monthOffset),
        // Every expense category, not only those with spending this month:
        // a category with nothing in it yet is $0, not "you have no such
        // category".
        intent.category ? listCategories(userId, { type: 'expense' }) : Promise.resolve([]),
      ]);

      if (!intent.category) {
        return { kind: 'month', data, category: null };
      }

      const match = matchCategory(intent.category, categories);
      if (!match) {
        return { kind: 'month', data, category: { found: false, word: intent.category } };
      }

      const spent = data.categoryBreakdown.find((entry) => entry.categoryId === match.id);
      return {
        kind: 'month',
        data,
        category: { found: true, name: match.name, icon: match.icon, totalMinor: spent?.totalMinor ?? 0n },
      };
    }

    case 'unsupported':
      return { kind: 'unsupported', topic: intent.topic };
  }
}

export async function answerChatText(
  userId: UserId,
  profile: ProfileRow,
  text: string,
  options: ChatCaptureOptions,
): Promise<ChatTextResult> {
  const parsed = parseQuickEntry(text, profile.baseCurrency);

  if (parsed.ok) {
    const capture = await saveSpend(
      userId,
      profile,
      // When they typed it. A one-line entry carries no date of its own, and
      // asking for one would undo the entire point of it.
      { ...parsed.entry, transactionDate: new Date() },
      text,
      options,
    );
    return { kind: 'capture', capture, day: null };
  }

  const todayKey = dayKeyReader(profile.timezone)(new Date());
  const intent = await understand(userId, text, todayKey, profile, options);

  if (intent === null || intent.kind === 'unclear') {
    // Filed only now, after the model also gave up: a line it rescued is a
    // stored spend, and listing it under "could not read" would be a lie on
    // the review screen.
    if (isWorthRecording(parsed.reason, text)) {
      await fileFailure(userId, text, parsed.reason, options);
    }
    return { kind: 'capture', capture: { ok: false, reason: parsed.reason }, day: null };
  }

  return act(userId, profile, intent, text, todayKey, options);
}

/**
 * Whether this is the moment to tell the user what else the bot can do.
 *
 * WHY THE THIRD AND NOT THE FIRST
 * -------------------------------
 * On the first spend the user is still finding out whether this works at all,
 * and a second message about unrelated features competes with the one thing
 * they were trying to do. By the third they have a habit, and the question
 * "can it tell me how I am going?" is one they might actually have.
 *
 * Exactly once, ever. There is no flag to store: the count of rows this
 * channel produced IS the state, so a tip cannot be shown twice and cannot be
 * shown to somebody who has been using the bot for months.
 */
const TIP_AT_NTH_CAPTURE = 3;

export async function shouldOfferCommandsTip(
  userId: UserId,
  source: TransactionSource,
): Promise<boolean> {
  try {
    return (await countTransactionsBySource(userId, source)) === TIP_AT_NTH_CAPTURE;
  } catch (error) {
    // A tip is not worth a failed reply. The spend is already stored.
    console.error('[chat-capture] could not count captures:', error);
    return false;
  }
}
