import { describe, expect, it } from 'vitest';

import { allocateHundred, dotUnit, dotsFor } from './dot-chart';

describe('dotUnit', () => {
  it('picks a round amount that fits the tallest column', () => {
    // $105.000 in 7 rows needs at least $15.000 per dot.
    expect(dotUnit(10_500_000n, 7)).toBe(1_500_000n);
    expect(dotUnit(10_500_001n, 7)).toBe(2_000_000n);
  });

  it('never returns a unit that overflows the rows', () => {
    for (const max of [1n, 7n, 99n, 12_345_678n, 999_999_999_999n]) {
      const unit = dotUnit(max, 7);
      expect((max + unit - 1n) / unit <= 7n).toBe(true);
    }
  });

  it('falls back to 1 when there is nothing to draw', () => {
    expect(dotUnit(0n, 7)).toBe(1n);
    expect(dotUnit(-5n, 7)).toBe(1n);
    expect(dotUnit(100n, 0)).toBe(1n);
  });
});

describe('dotsFor', () => {
  it('rounds to the nearest dot', () => {
    expect(dotsFor(10_500_000n, 1_500_000n, 7)).toBe(7);
    expect(dotsFor(6_000_000n, 1_500_000n, 7)).toBe(4);
    expect(dotsFor(6_800_000n, 1_500_000n, 7)).toBe(5);
  });

  it('keeps one dot for any spending, and none for zero', () => {
    expect(dotsFor(1n, 1_500_000n, 7)).toBe(1);
    expect(dotsFor(0n, 1_500_000n, 7)).toBe(0);
    expect(dotsFor(-1n, 1_500_000n, 7)).toBe(0);
  });

  it('never exceeds the rows', () => {
    expect(dotsFor(99_000_000n, 1_500_000n, 7)).toBe(7);
  });
});

describe('allocateHundred', () => {
  it('always adds up to 100', () => {
    for (const parts of [
      [1n, 1n, 1n],
      [160_000_000n, 106_960_000n, 68_760_000n, 45_840_000n],
      [1n, 999n],
      [7n, 7n, 7n, 7n, 7n, 7n, 7n],
    ]) {
      expect(allocateHundred(parts).reduce((a, b) => a + b, 0)).toBe(100);
    }
  });

  it('gives the leftover dots to the largest remainders, earlier part first on a tie', () => {
    expect(allocateHundred([1n, 1n, 1n])).toEqual([34, 33, 33]);
    expect(allocateHundred([42n, 28n, 18n, 12n])).toEqual([42, 28, 18, 12]);
  });

  it('returns zeros when there is nothing to split', () => {
    expect(allocateHundred([0n, 0n])).toEqual([0, 0]);
    expect(allocateHundred([])).toEqual([]);
  });
});
