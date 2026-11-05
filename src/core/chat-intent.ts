/**
 * What a chat message the strict parser rejected is asking for (block L1).
 *
 * The model's whole job is to fill in this shape. It never answers the user,
 * never sees their ledger and never produces the number that gets stored: the
 * amount comes back as the text the user wrote ("12 mil") and is read by the
 * same deterministic code as everything else (quick-entry's readAmountText). That
 * is "option A" from the L1 plan, and it is why a confident wrong answer from
 * the model cannot put a wrong figure in anybody's books.
 *
 * Pure: the prompt, the schema and the validation are all here and tested
 * without a network. The call itself lives in infrastructure/ai/gemini.ts.
 */
import { z } from 'zod';

import { readAmountText } from '@/core/quick-entry';

export const INTENTS = [
  'record_spend',
  'spending_on_day',
  'spending_in_month',
  'balance',
  'unsupported',
  'unclear',
] as const;

const UNSUPPORTED_TOPICS = ['budget', 'advice', 'other'] as const;

/**
 * Flat on purpose: one object, every field nullable, an enum to pick the
 * intent. Small models fill a flat shape far more reliably than a union of
 * nested ones, and the validation below rebuilds the union on our side.
 */
export const INTENT_JSON_SCHEMA = {
  type: 'object',
  properties: {
    intent: { type: 'string', enum: [...INTENTS] },
    amount_text: {
      type: ['string', 'null'],
      description: 'The amount exactly as written in the message, never converted.',
    },
    merchant: { type: ['string', 'null'], description: 'Where or on what it was spent.' },
    is_income: { type: ['boolean', 'null'] },
    date: { type: ['string', 'null'], description: 'YYYY-MM-DD' },
    month_offset: { type: ['integer', 'null'], description: '0 this month, -1 last month' },
    category: {
      type: ['string', 'null'],
      description: "The category word the user used, e.g. 'comida', or null.",
    },
    topic: { type: ['string', 'null'], enum: [...UNSUPPORTED_TOPICS, null] },
  },
  required: ['intent'],
} as const;

const RawIntent = z.object({
  intent: z.enum(INTENTS),
  amount_text: z.string().nullish(),
  merchant: z.string().nullish(),
  is_income: z.boolean().nullish(),
  date: z.string().nullish(),
  month_offset: z.number().int().nullish(),
  category: z.string().nullish(),
  topic: z.enum(UNSUPPORTED_TOPICS).nullish(),
});

export type ChatIntent =
  | {
      readonly kind: 'record_spend';
      readonly amountMinor: bigint;
      readonly merchant: string;
      readonly type: 'expense' | 'income';
      /** 'YYYY-MM-DD', never after today. */
      readonly date: string;
    }
  | { readonly kind: 'spending_on_day'; readonly date: string }
  | {
      readonly kind: 'spending_in_month';
      /** 0 this month, negative before. */
      readonly monthOffset: number;
      readonly category: string | null;
    }
  | { readonly kind: 'balance' }
  | { readonly kind: 'unsupported'; readonly topic: 'budget' | 'advice' | 'other' }
  | { readonly kind: 'unclear' };

/** How far back a spend can be dated from chat. Older belongs in the app. */
const MAX_DAYS_BACK = 60;
/** Two years of months is more history than the app has. */
const MAX_MONTHS_BACK = 24;
const MAX_MERCHANT = 255;

function isDayKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number) as [number, number, number];
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/**
 * Turns whatever the model returned into an intent the app can act on, or
 * 'unclear'. Every check that fails falls to 'unclear', never to a guess: the
 * user is then asked for the short format, which costs them a retype - a
 * stored mistake would cost them a wrong month.
 */
export function validateIntent(raw: unknown, todayKey: string, currency: string): ChatIntent {
  const parsed = RawIntent.safeParse(raw);
  if (!parsed.success) return { kind: 'unclear' };
  const r = parsed.data;

  switch (r.intent) {
    case 'record_spend': {
      const merchant = r.merchant?.trim();
      const date = r.date ?? todayKey;
      if (!r.amount_text || !merchant || !isDayKey(date)) return { kind: 'unclear' };
      const age = daysBetween(date, todayKey);
      if (age < 0 || age > MAX_DAYS_BACK) return { kind: 'unclear' };
      let amountMinor: bigint;
      try {
        // The deterministic reader, not the model, decides the number.
        amountMinor = readAmountText(r.amount_text, currency);
      } catch {
        return { kind: 'unclear' };
      }
      if (amountMinor <= 0n) return { kind: 'unclear' };
      return {
        kind: 'record_spend',
        amountMinor,
        merchant: merchant.slice(0, MAX_MERCHANT),
        type: r.is_income ? 'income' : 'expense',
        date,
      };
    }
    case 'spending_on_day': {
      const date = r.date ?? todayKey;
      if (!isDayKey(date) || daysBetween(date, todayKey) < 0) return { kind: 'unclear' };
      return { kind: 'spending_on_day', date };
    }
    case 'spending_in_month': {
      const offset = r.month_offset ?? 0;
      if (offset > 0 || offset < -MAX_MONTHS_BACK) return { kind: 'unclear' };
      return { kind: 'spending_in_month', monthOffset: offset, category: r.category?.trim() || null };
    }
    case 'balance':
      return { kind: 'balance' };
    case 'unsupported':
      return { kind: 'unsupported', topic: r.topic ?? 'other' };
    default:
      return { kind: 'unclear' };
  }
}

const WEEKDAYS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/**
 * The instructions. Short, because every message pays for them in tokens, and
 * in Spanish, because that is what the users write. Today's date is in it:
 * the model has no clock, and "ayer" means nothing without one.
 */
export function buildIntentSystemPrompt(todayKey: string): string {
  const weekday = WEEKDAYS_ES[new Date(`${todayKey}T12:00:00Z`).getUTCDay()];
  return [
    'Clasificas mensajes de chat de Pilo, una app de finanzas personales en Colombia (pesos colombianos).',
    `Hoy es ${weekday} ${todayKey}.`,
    'Devuelve UNA intención. No respondas al usuario ni calcules nada.',
    '- record_spend: registra un gasto o ingreso. amount_text = el monto copiado tal cual aparece ("32k", "100k", "12 mil", "$15.000"), sin convertirlo; "k" significa mil. merchant = dónde o en qué. date = YYYY-MM-DD ("ayer" = un día antes de hoy); si no dice, hoy. is_income = true solo si recibió dinero.',
    '- spending_on_day: pregunta cuánto gastó un día concreto. date = YYYY-MM-DD.',
    '- spending_in_month: pregunta por el gasto de un mes, en total o en una categoría. month_offset = 0 este mes, -1 el mes pasado. category = la palabra de categoría que usó o null.',
    '- balance: pregunta por su saldo o cuánto tiene.',
    '- unsupported: pide presupuestos o metas (topic = budget), consejo financiero o de inversión (topic = advice), u otra función que no es registrar ni consultar gastos (topic = other).',
    '- unclear: saludo, charla, o no se entiende qué quiere.',
    'Nunca uses una fecha futura.',
  ].join('\n');
}

/** "Café", "cafe" and "CAFÉ" are one word to the person who typed it. */
function fold(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

/** "restaurante" asks for "Restaurantes". Spanish plurals end in -s or -es. */
function sameWord(a: string, b: string): boolean {
  return a === b || a === `${b}s` || b === `${a}s` || a === `${b}es` || b === `${a}es`;
}

/**
 * Which of the user's categories a word names, or null.
 *
 * Deterministic, which is the point: the model hands back the word the user
 * wrote and this decides, so "café" means the same category every time and a
 * category the user does not have is reported as missing instead of
 * approximated. The model never sees the list (option A) - "comida" for
 * "Restaurantes y Café" is a semantic leap, and a leap is a guess.
 *
 * The whole name first, then any one word of it. Either way only a single
 * match counts: two candidates means the word did not say which.
 */
export function matchCategory<T extends { readonly name: string }>(
  word: string,
  categories: readonly T[],
): T | null {
  const wanted = fold(word);
  if (!wanted) return null;

  const whole = categories.filter((c) => sameWord(fold(c.name), wanted));
  if (whole.length > 0) return whole.length === 1 ? (whole[0] ?? null) : null;

  const partial = categories.filter((c) =>
    fold(c.name)
      .split(/[^\p{L}\p{N}]+/u)
      .some((part) => sameWord(part, wanted)),
  );
  return partial.length === 1 ? (partial[0] ?? null) : null;
}

/**
 * The instant at midday of a local day - when a spend dated "ayer" is stored.
 *
 * A spend the user says was yesterday has no time of its own, and the row only
 * has to land on the right local day. Midnight would sit on the edge, where
 * one wrong hour of offset moves it to the day before; midday is twelve hours
 * from both edges in every zone, so the month totals and the calendar, which
 * group with AT TIME ZONE (rule 4), put it on the day the user named.
 */
export function localNoon(dayKey: string, timezone: string): Date {
  const [y, m, d] = dayKey.split('-').map(Number) as [number, number, number];
  const guess = Date.UTC(y, m - 1, d, 12);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).formatToParts(new Date(guess));
  const part = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((p) => p.type === type)?.value);

  // What the zone's clock reads at `guess`. The gap between that and `guess`
  // is the zone's offset on that day, DST included.
  const wall = Date.UTC(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'));
  return new Date(guess - (wall - guess));
}
