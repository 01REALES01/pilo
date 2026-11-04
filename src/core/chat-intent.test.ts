import { describe, expect, it } from 'vitest';

import { buildIntentSystemPrompt, localNoon, matchCategory, validateIntent } from './chat-intent';
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

describe('matchCategory', () => {
  const categories = [
    { name: 'Supermercado' },
    { name: 'Restaurantes y Café' },
    { name: 'Transporte' },
    { name: 'Compras' },
    { name: 'Otros Gastos' },
  ];

  it('finds a category by its name, ignoring case and accents', () => {
    expect(matchCategory('supermercado', categories)?.name).toBe('Supermercado');
    expect(matchCategory('TRANSPORTE', categories)?.name).toBe('Transporte');
  });

  it('finds a category by one word of its name, singular or plural', () => {
    expect(matchCategory('cafe', categories)?.name).toBe('Restaurantes y Café');
    expect(matchCategory('restaurante', categories)?.name).toBe('Restaurantes y Café');
    expect(matchCategory('compra', categories)?.name).toBe('Compras');
  });

  it('reports a category the user does not have instead of approximating one', () => {
    // "comida" is what a restaurant is FOR, not what this one is called.
    expect(matchCategory('comida', categories)).toBeNull();
    expect(matchCategory('', categories)).toBeNull();
  });

  it('refuses a word that names two categories', () => {
    const twoGastos = [{ name: 'Gastos fijos' }, { name: 'Otros Gastos' }];
    expect(matchCategory('gastos', twoGastos)).toBeNull();
  });

  it('prefers a whole name over a word inside another one', () => {
    const both = [{ name: 'Café' }, { name: 'Restaurantes y Café' }];
    expect(matchCategory('café', both)?.name).toBe('Café');
  });
});

describe('localNoon', () => {
  it('is midday on that day in the profile zone', () => {
    // Bogotá is UTC-5 all year.
    expect(localNoon('2026-10-30', 'America/Bogota').toISOString()).toBe('2026-10-30T17:00:00.000Z');
  });

  it('stays on the named day in zones far from UTC on both sides', () => {
    expect(localNoon('2026-10-30', 'Asia/Tokyo').toISOString()).toBe('2026-10-30T03:00:00.000Z');
    expect(localNoon('2026-10-30', 'Pacific/Kiritimati').toISOString()).toBe('2026-10-29T22:00:00.000Z');
    expect(localNoon('2026-10-30', 'Pacific/Pago_Pago').toISOString()).toBe('2026-10-30T23:00:00.000Z');
  });

  it('follows daylight saving on the day itself', () => {
    // Madrid is UTC+2 until the last Sunday of October and UTC+1 after it.
    expect(localNoon('2026-10-24', 'Europe/Madrid').toISOString()).toBe('2026-10-24T10:00:00.000Z');
    expect(localNoon('2026-10-26', 'Europe/Madrid').toISOString()).toBe('2026-10-26T11:00:00.000Z');
  });
});
