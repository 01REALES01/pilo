import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/repositories/ingestion-failure.repository', () => ({
  recordIngestionFailure: vi.fn(),
}));

vi.mock('@/core/repositories/category.repository', () => ({
  listCategories: vi.fn(),
}));

vi.mock('@/core/services/transaction.service', () => ({
  recordTransaction: vi.fn(),
}));

vi.mock('@/core/services/telemetry.service', () => ({
  recordMetric: vi.fn(),
}));

// Only the two reads are replaced. dayKeyReader and shiftDayKey are pure,
// and stubbing them would test the stub's idea of "yesterday".
vi.mock('@/core/services/analytics.service', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/core/services/analytics.service')>()),
  getDashboardData: vi.fn(),
  getMonthViewData: vi.fn(),
}));

import { uuidFromSeed } from '@/core/idempotency';
import { listCategories } from '@/core/repositories/category.repository';
import { recordIngestionFailure } from '@/core/repositories/ingestion-failure.repository';
import { getDashboardData, getMonthViewData } from '@/core/services/analytics.service';
import { recordMetric } from '@/core/services/telemetry.service';
import { recordTransaction } from '@/core/services/transaction.service';
import { toUserId } from '@/core/types';

import { answerChatText, type JsonModel, type JsonModelResult } from './chat-capture.service';

const userId = toUserId('11111111-1111-4111-8111-111111111111');
const profile = {
  id: userId,
  baseCurrency: 'COP',
  timezone: 'America/Bogota',
  locationEnabled: true,
} as never;
const options = { source: 'telegram_text', externalId: 'telegram:42:7' } as const;

/** 30 Oct 2026, 10:00 in Bogotá. Yesterday there is the 29th. */
const NOW = new Date('2026-10-30T15:00:00Z');

/** What recordTransaction was handed on its one call. */
function recorded() {
  return vi.mocked(recordTransaction).mock.calls[0]?.[2];
}

/** A model that answers `json`, as Gemini does on a good day. */
function modelSaying(json: Record<string, unknown>) {
  return vi.fn<JsonModel>().mockResolvedValue({
    ok: true,
    json,
    latencyMs: 800,
    usage: { promptTokens: 310, outputTokens: 60 },
    model: 'gemini-test',
  });
}

function modelFailing(reason: string) {
  return vi.fn<JsonModel>().mockResolvedValue({ ok: false, reason, latencyMs: 10_000 } as JsonModelResult);
}

/** The metadata of the one chat_intent row recorded. */
function reading() {
  return vi.mocked(recordMetric).mock.calls[0]?.[1];
}

const monthView = {
  baseCurrency: 'COP',
  monthlyTotals: { totalExpenseMinor: 100_000_000n, totalIncomeMinor: 0n, transactionCount: 9 },
  categoryBreakdown: [
    { categoryId: 'cat-transport', categoryName: 'Transporte', categoryIcon: 'Car', totalMinor: 15_000_000n },
  ],
  days: [
    { day: '2026-10-28', relative: null, totalExpenseMinor: 4_500_000n, transactions: [{}, {}] },
  ],
} as never;

describe('answering a line of chat text', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(recordTransaction).mockResolvedValue({
      ok: true,
      transaction: { id: 'tx-1' } as never,
      isDuplicate: false,
      autoCategorized: false,
      appliedCategory: null,
    });
    vi.mocked(getMonthViewData).mockResolvedValue(monthView);
    vi.mocked(getDashboardData).mockResolvedValue({ baseCurrency: 'COP' } as never);
    vi.mocked(listCategories).mockResolvedValue([
      { id: 'cat-transport', name: 'Transporte', icon: 'Car' },
      { id: 'cat-health', name: 'Salud', icon: 'HeartPulse' },
    ] as never);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('what the strict parser reads', () => {
    it('files what the parser read, under now', async () => {
      const result = await answerChatText(userId, profile, '12000 juan valdez', options);

      expect(result).toMatchObject({ kind: 'capture', capture: { ok: true }, day: null });
      expect(recorded()).toMatchObject({
        amountMinor: 1_200_000n,
        type: 'expense',
        merchant: 'juan valdez',
        source: 'telegram_text',
        transactionDate: NOW,
      });
    });

    it('never asks the model about a line the parser already read', async () => {
      // Free, instant and unable to misread "12000 juan valdez". The model is
      // only for what this door refuses.
      const model = modelSaying({ intent: 'unclear' });

      await answerChatText(userId, profile, '12000 juan valdez', { ...options, model });

      expect(model).not.toHaveBeenCalled();
      expect(recordMetric).not.toHaveBeenCalled();
    });

    it('keys idempotency to the EVENT, so a second identical coffee still counts', async () => {
      // Hashing the words would silently drop the second one.
      await answerChatText(userId, profile, '12000 juan valdez', options);

      expect(recorded()?.idempotencyKey).toBe(uuidFromSeed('telegram:42:7'));
      expect(recorded()?.idempotencyKey).not.toBe(uuidFromSeed('telegram:42:8'));
    });

    it('stores no coordinate, because a chat message has no GPS', async () => {
      await answerChatText(userId, profile, '12000 juan valdez', options);

      expect(recorded()?.location).toBeNull();
      expect(recorded()?.locationSource).toBe('manual');
    });

    it('never invents a category', async () => {
      await answerChatText(userId, profile, '12000 juan valdez', options);

      expect(recorded()?.categoryId).toBeNull();
    });

    it('records a write that was refused, not just one that was unreadable', async () => {
      vi.mocked(recordTransaction).mockResolvedValue({ ok: false, reason: 'unknown_account' });

      const result = await answerChatText(userId, profile, '12000 juan valdez', options);

      expect(result).toMatchObject({ kind: 'capture', capture: { ok: false, reason: 'unknown_account' } });
      expect(recordIngestionFailure).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({ error: 'unknown_account' }),
      );
    });
  });

  describe('what neither reader understood', () => {
    it('does not record a transaction it could not read', async () => {
      const result = await answerChatText(userId, profile, 'hola', options);

      expect(result).toEqual({ kind: 'capture', capture: { ok: false, reason: 'no_amount' }, day: null });
      expect(recordTransaction).not.toHaveBeenCalled();
    });

    it('keeps a failure that looks like a real attempt', async () => {
      // "12000" alone: an amount was found, the name was not. That is evidence.
      await answerChatText(userId, profile, '12000', options);

      expect(recordIngestionFailure).toHaveBeenCalledWith(userId, {
        source: 'telegram_text',
        rawPayload: { text: '12000', externalId: 'telegram:42:7' },
        error: 'no_merchant',
      });
    });

    it('does not file conversation in the review queue (P2)', async () => {
      // A greeting in the failure log buries the one message that mattered.
      await answerChatText(userId, profile, 'hola, buenos días', options);

      expect(recordIngestionFailure).not.toHaveBeenCalled();
    });

    it('keeps an unreadable message that at least contains a number', async () => {
      await answerChatText(userId, profile, 'pagué como 20 mil en algo', options);

      expect(recordIngestionFailure).toHaveBeenCalled();
    });

    it('answers normally when recording the failure itself fails', async () => {
      // Losing the diagnostic must not also lose the reply to the user.
      vi.mocked(recordIngestionFailure).mockRejectedValue(new Error('neon is asleep'));

      await expect(answerChatText(userId, profile, '12000', options)).resolves.toMatchObject({
        capture: { ok: false, reason: 'no_merchant' },
      });
    });

    it('stores nothing when the model is unsure either, and says what the parser said', async () => {
      const model = modelSaying({ intent: 'unclear' });

      const result = await answerChatText(userId, profile, 'pagué como 20 mil en algo', { ...options, model });

      expect(result).toMatchObject({ kind: 'capture', capture: { ok: false, reason: 'no_amount' } });
      expect(recordTransaction).not.toHaveBeenCalled();
      expect(recordIngestionFailure).toHaveBeenCalled();
      expect(reading()?.metadata).toMatchObject({ outcome: 'unclear' });
    });

    it('falls back to the bot before L1 when the model is down or slow', async () => {
      const model = modelFailing('timeout');

      const result = await answerChatText(userId, profile, 'ayer gasté 32k en uber', { ...options, model });

      expect(result).toMatchObject({ kind: 'capture', capture: { ok: false, reason: 'no_amount' } });
      expect(recordTransaction).not.toHaveBeenCalled();
      // Counted, not hidden: a timeout is a message the user did not get help with.
      expect(reading()?.metadata).toMatchObject({ outcome: 'unavailable', reason: 'timeout' });
    });

    it('does not spend tokens on a pasted paragraph', async () => {
      const model = modelSaying({ intent: 'balance' });

      await answerChatText(userId, profile, 'a'.repeat(501), { ...options, model });

      expect(model).not.toHaveBeenCalled();
    });

    it('refuses an amount the model copied but the deterministic reader will not read', async () => {
      // Slang is out of scope by decision: "20 lucas" stays unread rather
      // than being stored as $20.
      const model = modelSaying({ intent: 'record_spend', amount_text: '20 lucas', merchant: 'bershka' });

      const result = await answerChatText(userId, profile, 'gasté 20 lucas en bershka', { ...options, model });

      expect(result).toMatchObject({ kind: 'capture', capture: { ok: false } });
      expect(recordTransaction).not.toHaveBeenCalled();
    });
  });

  describe('a spend the model rescued', () => {
    it('stores yesterday at midday in the profile zone, and says it was yesterday', async () => {
      const model = modelSaying({
        intent: 'record_spend',
        amount_text: '32k',
        merchant: 'uber',
        date: '2026-10-29',
      });

      const result = await answerChatText(userId, profile, 'ayer gasté 32k en uber', { ...options, model });

      expect(result).toMatchObject({
        kind: 'capture',
        capture: { ok: true },
        day: { key: '2026-10-29', relative: 'yesterday' },
      });
      expect(recorded()).toMatchObject({
        // From readAmountText, never from the model.
        amountMinor: 3_200_000n,
        merchant: 'uber',
        type: 'expense',
        transactionDate: new Date('2026-10-29T17:00:00Z'),
        idempotencyKey: uuidFromSeed('telegram:42:7'),
      });
    });

    it('keeps the moment it was typed when the model dates it today', async () => {
      const model = modelSaying({ intent: 'record_spend', amount_text: '12 mil', merchant: 'almuerzo' });

      const result = await answerChatText(userId, profile, 'hoy almorcé por 12 mil', { ...options, model });

      expect(result).toMatchObject({ kind: 'capture', day: null });
      expect(recorded()?.transactionDate).toEqual(NOW);
    });

    it('does not file a rescued line as a failure', async () => {
      const model = modelSaying({ intent: 'record_spend', amount_text: '32k', merchant: 'uber', date: '2026-10-29' });

      await answerChatText(userId, profile, 'ayer gasté 32k en uber', { ...options, model });

      expect(recordIngestionFailure).not.toHaveBeenCalled();
    });

    it('tells the model what day it is in the profile zone, and shows "typing" once', async () => {
      const model = modelSaying({ intent: 'balance' });
      const onThinking = vi.fn();

      await answerChatText(userId, profile, '¿cuánto tengo?', { ...options, model, onThinking });

      expect(model.mock.calls[0]?.[0].system).toContain('2026-10-30');
      expect(model.mock.calls[0]?.[0].prompt).toBe('¿cuánto tengo?');
      expect(onThinking).toHaveBeenCalledTimes(1);
    });

    it('measures the reading without keeping what the user wrote', async () => {
      const model = modelSaying({ intent: 'balance' });

      await answerChatText(userId, profile, '¿cuánto tengo?', { ...options, model });

      expect(recordMetric).toHaveBeenCalledWith(userId, {
        metric: 'chat_intent',
        value: 800,
        metadata: {
          outcome: 'understood',
          intent: 'balance',
          reason: null,
          model: 'gemini-test',
          promptTokens: 310,
          outputTokens: 60,
        },
      });
      expect(JSON.stringify(reading())).not.toContain('cuánto');
    });

    it('still answers when the measurement cannot be written', async () => {
      vi.mocked(recordMetric).mockRejectedValue(new Error('neon is asleep'));
      const model = modelSaying({ intent: 'balance' });

      await expect(
        answerChatText(userId, profile, '¿cuánto tengo?', { ...options, model }),
      ).resolves.toMatchObject({ kind: 'balance' });
    });
  });

  describe('a question the model recognised', () => {
    it('answers the balance from the dashboard read', async () => {
      const model = modelSaying({ intent: 'balance' });

      const result = await answerChatText(userId, profile, '¿cuánto tengo?', { ...options, model });

      expect(result).toEqual({ kind: 'balance', data: { baseCurrency: 'COP' } });
      expect(getDashboardData).toHaveBeenCalledWith(userId);
    });

    it('answers "today" with the same read as /hoy', async () => {
      const model = modelSaying({ intent: 'spending_on_day', date: '2026-10-30' });

      const result = await answerChatText(userId, profile, '¿cuánto llevo hoy?', { ...options, model });

      expect(result.kind).toBe('today');
      expect(getMonthViewData).not.toHaveBeenCalled();
    });

    it('answers a past day from that month, with the calendar total', async () => {
      const model = modelSaying({ intent: 'spending_on_day', date: '2026-10-28' });

      const result = await answerChatText(userId, profile, '¿cuánto gasté el miércoles?', { ...options, model });

      expect(getMonthViewData).toHaveBeenCalledWith(userId, 0);
      expect(result).toEqual({
        kind: 'day',
        day: { key: '2026-10-28', relative: null },
        totalExpenseMinor: 4_500_000n,
        count: 2,
        currency: 'COP',
      });
    });

    it('reads the right month for a day in the previous one, and $0 for a day with nothing', async () => {
      const model = modelSaying({ intent: 'spending_on_day', date: '2026-09-29' });

      const result = await answerChatText(userId, profile, '¿cuánto gasté el 29 de septiembre?', {
        ...options,
        model,
      });

      expect(getMonthViewData).toHaveBeenCalledWith(userId, -1);
      expect(result).toMatchObject({ kind: 'day', totalExpenseMinor: 0n, count: 0 });
    });

    it('answers the whole month when no category was named', async () => {
      const model = modelSaying({ intent: 'spending_in_month', month_offset: -1 });

      const result = await answerChatText(userId, profile, '¿cuánto gasté el mes pasado?', { ...options, model });

      expect(getMonthViewData).toHaveBeenCalledWith(userId, -1);
      expect(listCategories).not.toHaveBeenCalled();
      expect(result).toMatchObject({ kind: 'month', category: null });
    });

    it('answers one category, matched by its name in our code', async () => {
      const model = modelSaying({ intent: 'spending_in_month', month_offset: 0, category: 'transporte' });

      const result = await answerChatText(userId, profile, '¿cuánto llevo en transporte?', { ...options, model });

      expect(listCategories).toHaveBeenCalledWith(userId, { type: 'expense' });
      expect(result).toMatchObject({
        kind: 'month',
        category: { found: true, name: 'Transporte', icon: 'Car', totalMinor: 15_000_000n, transactionCount: expect.any(Number) },
      });
    });

    it('answers $0 for a category the user has but did not use this month', async () => {
      const model = modelSaying({ intent: 'spending_in_month', category: 'salud' });

      const result = await answerChatText(userId, profile, '¿cuánto llevo en salud?', { ...options, model });

      expect(result).toMatchObject({ category: { found: true, name: 'Salud', totalMinor: 0n, transactionCount: 0 } });
    });

    it('reports a category the user does not have instead of approximating one', async () => {
      const model = modelSaying({ intent: 'spending_in_month', category: 'comida' });

      const result = await answerChatText(userId, profile, '¿cuánto llevo en comida?', { ...options, model });

      expect(result).toMatchObject({ kind: 'month', category: { found: false, word: 'comida' } });
    });

    it('passes on what does not exist yet, and writes nothing', async () => {
      const model = modelSaying({ intent: 'unsupported', topic: 'advice' });

      const result = await answerChatText(userId, profile, '¿en qué invierto?', { ...options, model });

      expect(result).toEqual({ kind: 'unsupported', topic: 'advice' });
      expect(recordTransaction).not.toHaveBeenCalled();
    });
  });
});
