import { describe, expect, it } from 'vitest';

import { buildIntentSystemPrompt, validateIntent } from './chat-intent';
import { readAmountText } from './quick-entry';

const TODAY = '2026-10-10';
const v = (raw: unknown) => validateIntent(raw, TODAY, 'COP');

describe('validateIntent', () => {
  it('reads the amount itself, from the text the model copied', () => {
    expect(
      v({ intent: 'record_spend', amount_text: '12 mil', merchant: 'almuerzo', date: '2026-10-09' }),
    ).toEqual({
      kind: 'record_spend',
      amountMinor: 1_200_000n,
      merchant: 'almuerzo',
      type: 'expense',
      date: '2026-10-09',
    });
  });

  it('dates a spend today when the message did not say', () => {
    const intent = v({ intent: 'record_spend', amount_text: '20k', merchant: 'bershka' });
    expect(intent.kind === 'record_spend' && intent.date).toBe(TODAY);
  });

  it('marks income only when the model says so', () => {
    const intent = v({ intent: 'record_spend', amount_text: '2 millones', merchant: 'salario', is_income: true });
    expect(intent.kind === 'record_spend' && [intent.type, intent.amountMinor]).toEqual(['income', 200_000_000n]);
  });

  it.each([
    ['a converted figure the reader would misread', { amount_text: '20 lucas' }],
    ['spelled-out words', { amount_text: 'doce mil' }],
    ['no merchant', { merchant: '  ' }],
    ['a future date', { date: '2026-10-11' }],
    ['a date too old for chat', { date: '2026-01-01' }],
    ['an impossible date', { date: '2026-02-30' }],
    ['a zero amount', { amount_text: '0' }],
  ])('falls to unclear instead of storing %s', (_, override) => {
    expect(
      v({ intent: 'record_spend', amount_text: '12000', merchant: 'tienda', date: TODAY, ...override }),
    ).toEqual({ kind: 'unclear' });
  });

  it('answers queries with periods it can check', () => {
    expect(v({ intent: 'spending_on_day', date: '2026-10-09' })).toEqual({
      kind: 'spending_on_day',
      date: '2026-10-09',
    });
    expect(v({ intent: 'spending_in_month', month_offset: -1, category: ' comida ' })).toEqual({
      kind: 'spending_in_month',
      monthOffset: -1,
      category: 'comida',
    });
    expect(v({ intent: 'spending_in_month', month_offset: 1 })).toEqual({ kind: 'unclear' });
    expect(v({ intent: 'spending_on_day', date: '2026-12-01' })).toEqual({ kind: 'unclear' });
    expect(v({ intent: 'balance' })).toEqual({ kind: 'balance' });
    expect(v({ intent: 'unsupported', topic: 'budget' })).toEqual({ kind: 'unsupported', topic: 'budget' });
    expect(v({ intent: 'unsupported' })).toEqual({ kind: 'unsupported', topic: 'other' });
  });

  it('treats anything off-schema as unclear', () => {
    expect(v({ intent: 'transfer_money' })).toEqual({ kind: 'unclear' });
    expect(v('record_spend')).toEqual({ kind: 'unclear' });
    expect(v(null)).toEqual({ kind: 'unclear' });
  });
});

describe('readAmountText', () => {
  it('accepts one amount and nothing else', () => {
    expect(readAmountText('$15.000', 'COP')).toBe(1_500_000n);
    expect(readAmountText('1,5 millones', 'COP')).toBe(150_000_000n);
    expect(() => readAmountText('1.5 millones de pesos', 'COP')).toThrow();
  });
});

describe('buildIntentSystemPrompt', () => {
  it('tells the model what day it is, by name', () => {
    expect(buildIntentSystemPrompt(TODAY)).toContain('Hoy es sábado 2026-10-10.');
  });
});
