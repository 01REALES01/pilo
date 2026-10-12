import { multiply, parseMoney } from '@/core/money';

/**
 * Reading a spend out of a sentence somebody typed.
 *
 * `12000 juan valdez` is the whole interface for cash, and cash is the hole in
 * this app: a card fires an SMS, a QR and a bill in a pocket fire nothing. The
 * cost of writing one down has to be one line in a chat the user already has
 * open, or it does not get written down at all.
 *
 * Pure, like money.ts and categorization.ts. No database, no network, and no
 * model - which matters more than it looks: an LLM asked to read "12000 juan
 * valdez" will answer confidently on the day it misreads the amount, and this
 * is the number that ends up in the ledger. A regex that refuses is safe; a
 * guess that is wrong is not.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 * --------------------------------
 * No dates ("ayer"), no currencies other than the profile's, no categories, no
 * multiple spends in one line. Those go to the language model (block L1), and
 * only after this parser has said no - it stays the first door, and the cheap
 * one.
 *
 * WHAT IT DOES READ, SINCE L1
 * ---------------------------
 * The way amounts are actually written in a Colombian chat: "20k", "20 mil",
 * "1,5M", "2 millones". And a spend said as a sentence, "gasté 20k en
 * bershka": one opening verb from a short fixed list and an "en" after the
 * amount are dropped. Both are rules that fit in a sentence, so the user can
 * predict them, and every message they catch is one the model never sees. Every one of those is a guess about intent, and
 * the doctrine here - the SMS parsers, the amount reader - is that a wrong
 * answer costs more than no answer. When it cannot read something it says so
 * and the user retypes; it never files an approximation.
 */

export interface QuickEntry {
  readonly amountMinor: bigint;
  readonly type: 'expense' | 'income';
  readonly merchant: string;
  readonly note: string | null;
}

export type QuickEntryFailure =
  /** Nothing in the line looks like an amount. Probably not a spend at all. */
  | 'no_amount'
  /** An amount and nothing to call it. "12000" alone says nothing in a month's time. */
  | 'no_merchant'
  /** Zero, or a negative that survived. Neither is a transaction. */
  | 'not_positive';

export type QuickEntryResult =
  | { readonly ok: true; readonly entry: QuickEntry }
  | { readonly ok: false; readonly reason: QuickEntryFailure };

/** The column is varchar(255); truncating here keeps the write path honest. */
const MAX_MERCHANT = 255;
const MAX_NOTE = 1000;

/**
 * Only the first and last word are considered as the amount.
 *
 * Scanning every token would find the 7 in "carrera 7" and the 24 in "tienda
 * 24". People write the amount at one end of the line or the other, and a rule
 * you can state in one sentence is one the user can predict - which matters far
 * more here than catching an extra phrasing.
 */
const AMOUNT_TOKEN = /^[+-]?\$?\d[\d.,]*(?:k|mil|m)?$/i;

/** The suffix that multiplies, read off an amount token. */
const SHORTHAND = /(k|mil|m)$/i;
const MULTIPLIER: Readonly<Record<string, bigint>> = { k: 1_000n, mil: 1_000n, m: 1_000_000n };

/**
 * Glues "32 k" into "32k", "20 mil" into "20mil" and "1,5 millones" into
 * "1,5m", so the amount is one token again and the first-or-last-word rule
 * still holds. "k" is how most people write thousands in a chat - "32k",
 * "100k" - and a stray space before it must not turn $32.000 into $32 with a
 * merchant called "k bershka".
 */
function joinSpelledMultipliers(text: string): string {
  return text
    .replace(/(\d)\s+k\b/giu, '$1k')
    .replace(/(\d)\s+mil\b/giu, '$1mil')
    .replace(/(\d)\s*(?:millones|millón|millon)\b/giu, '$1m');
}

/**
 * Verbs a spend is announced with. Fixed and short on purpose: each is a word
 * that can only mean "I spent", so dropping it never eats a merchant.
 */
const OPENING_VERBS = new Set(['gasté', 'gaste', 'pagué', 'pague', 'compré', 'compre']);

/**
 * With a multiplier, only a plain number with up to two decimals: "1,5k",
 * "2.25M". "1,234k" could be 1.234 thousand or 1,234 thousand, and a
 * thousand-fold disagreement is not one to settle by guessing.
 */
const SHORTHAND_DIGITS = /^[+-]?\$?\d+(?:[.,]\d{1,2})?$/;

/**
 * Slang units. "20 lucas" is twenty thousand to a person and twenty pesos to
 * parseMoney, and slang is out of scope by decision - so a line that uses one
 * is refused rather than stored a thousand times too small.
 */
const SLANG_UNITS = new Set(['luca', 'lucas', 'luquitas', 'lukas', 'barra', 'barras', 'palo', 'palos']);

/** "20000 pesos almuerzo": the unit is not part of the merchant. */
const PLAIN_UNITS = new Set(['peso', 'pesos', 'pesitos', 'cop']);

/**
 * Words a sentence puts right before an amount at its end: "salió en 32 mil",
 * "por 15 mil". A merchant ending in one is a sentence, not a shop - better
 * left to the language model, which can pull the shop out of it.
 */
const TRAILING_CONNECTORS = new Set(['en', 'por', 'de', 'a', 'y', 'fue', 'salió', 'salio', 'costó', 'costo', 'vale', 'valió', 'valio']);

/** Reads an amount token, shorthand included. Throws when it will not guess. */
function readAmount(token: string, currency: string): bigint {
  const suffix = SHORTHAND.exec(token)?.[1]?.toLowerCase();
  const digits = suffix ? token.slice(0, -suffix.length) : token;
  if (suffix && !SHORTHAND_DIGITS.test(digits)) {
    throw new Error(`Ambiguous shorthand amount "${token}".`);
  }
  const amount = parseMoney(digits, currency);
  return suffix ? multiply(amount, MULTIPLIER[suffix] as bigint).minor : amount.minor;
}

/** A merchant has to be something you could recognise later. "15000" is not. */
const HAS_A_LETTER = /\p{L}/u;

/**
 * Splits off a trailing note.
 *
 * The dash has to be surrounded by spaces, so "7-11" and "coca-cola" stay in
 * the merchant where they belong.
 */
function splitNote(text: string): { head: string; note: string | null } {
  // `(?:\s+|$)` and not just `\s+`: the input is trimmed before it gets here,
  // so "12000 tienda - " arrives as "12000 tienda -" and a dash that ends the
  // line would otherwise be glued onto the merchant name.
  const match = /\s+[-—](?:\s+|$)/.exec(text);
  if (!match) {
    return { head: text, note: null };
  }
  const note = text.slice(match.index + match[0].length).trim();
  return {
    head: text.slice(0, match.index).trim(),
    note: note ? note.slice(0, MAX_NOTE) : null,
  };
}

/**
 * Reads an amount that arrives on its own - the text the language model copied
 * out of a message ("12 mil", "$15.000"). The whole string has to be one
 * amount: parseMoney alone would strip the letters from "20 lucas" and store
 * $20, and from "1.5 millones" and store $1,50. Positive, in minor units;
 * throws instead of guessing.
 */
export function readAmountText(text: string, currency: string): bigint {
  const token = joinSpelledMultipliers(text.trim()).replace(/\s+/g, '');
  if (!AMOUNT_TOKEN.test(token)) {
    throw new Error(`"${text}" is not an amount on its own.`);
  }
  const minor = readAmount(token, currency);
  return minor < 0n ? -minor : minor;
}

export function parseQuickEntry(input: string, currency: string): QuickEntryResult {
  // A full stop or an exclamation at the end is punctuation, not part of the
  // amount: "bershka 32k." is "bershka 32k".
  const { head, note } = splitNote(joinSpelledMultipliers(input.trim().replace(/[.!?]+$/, '')));
  const words = head.split(/\s+/).filter(Boolean);
  if (words.length > 1 && OPENING_VERBS.has((words[0] as string).toLowerCase())) {
    words.shift();
  }

  if (words.length < 2) {
    // One word is either a bare amount or a bare name; neither is a spend.
    return { ok: false, reason: words.length === 1 && AMOUNT_TOKEN.test(words[0] as string) ? 'no_merchant' : 'no_amount' };
  }

  const first = words[0] as string;
  const last = words[words.length - 1] as string;

  const amountIsFirst = AMOUNT_TOKEN.test(first);
  const rawAmount = amountIsFirst ? first : AMOUNT_TOKEN.test(last) ? last : null;

  if (rawAmount === null) {
    return { ok: false, reason: 'no_amount' };
  }

  let minor: bigint;
  try {
    minor = readAmount(rawAmount, currency);
  } catch {
    // parseMoney refuses more than two decimals, among other things. Its
    // refusals are deliberate and are not overridden here.
    return { ok: false, reason: 'no_amount' };
  }

  if (minor === 0n) {
    return { ok: false, reason: 'not_positive' };
  }

  const rest = amountIsFirst ? words.slice(1) : words.slice(0, -1);
  const lower = (word: string | undefined) => (word ?? '').toLowerCase();
  if (amountIsFirst) {
    if (SLANG_UNITS.has(lower(rest[0]))) {
      return { ok: false, reason: 'no_amount' };
    }
    if (rest.length > 1 && PLAIN_UNITS.has(lower(rest[0]))) rest.shift();
    // "20k en bershka": the "en" belongs to the sentence, not to the shop.
    if (rest.length > 1 && lower(rest[0]) === 'en') rest.shift();
  } else if (TRAILING_CONNECTORS.has(lower(rest[rest.length - 1]))) {
    return { ok: false, reason: 'no_amount' };
  }
  const merchant = rest.join(' ').replace(/[,;:]+$/, '');
  if (!HAS_A_LETTER.test(merchant)) {
    return { ok: false, reason: 'no_merchant' };
  }

  return {
    ok: true,
    entry: {
      // A leading '+' is the only way to say "this came in". Everything else is
      // a spend, because almost everything is - and making the common case the
      // default is what keeps this to one line.
      type: rawAmount.startsWith('+') ? 'income' : 'expense',
      // Absolute: a leading '-' is someone spelling out that it is an expense,
      // not asking for a negative row. The column forbids one anyway.
      amountMinor: minor < 0n ? -minor : minor,
      merchant: merchant.slice(0, MAX_MERCHANT),
      note,
    },
  };
}
