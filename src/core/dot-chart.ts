/**
 * Arithmetic behind the dot charts on /mes.
 *
 * A dot chart only tells the truth if every dot is worth the same amount and
 * the legend says how much. Both numbers are decided here, in integers, so the
 * component never divides money on its own: a bar that rounds differently from
 * its legend is a chart that lies by a dot.
 */

/** Mantissas of the "round" amounts a legend can state: 10, 15, 20, 25, 50. */
const NICE_STEPS = [10n, 15n, 20n, 25n, 50n] as const;

/**
 * The smallest round amount per dot that lets the tallest column fit in `rows`.
 *
 * Round on purpose. "1 punto = $ 15.000" can be read and multiplied in the
 * head; "1 punto = $ 14.971" cannot, even though it would fill the column
 * exactly.
 */
export function dotUnit(maxMinor: bigint, rows: number): bigint {
  if (maxMinor <= 0n || rows <= 0) return 1n;

  const rowCount = BigInt(rows);
  // Ceiling division: the unit must be big enough that max / unit <= rows.
  const needed = (maxMinor + rowCount - 1n) / rowCount;

  for (let scale = 1n; ; scale *= 10n) {
    for (const step of NICE_STEPS) {
      // Steps are tenths, so the smallest candidate is exactly 1.
      const candidate = (step * scale) / 10n;
      if (candidate >= needed) return candidate;
    }
  }
}

/**
 * How many dots an amount lights. Rounded to the nearest dot, but a day with
 * any spending never shows as empty: zero dots has to mean zero pesos.
 */
export function dotsFor(amountMinor: bigint, unitMinor: bigint, rows: number): number {
  if (amountMinor <= 0n || unitMinor <= 0n || rows <= 0) return 0;
  const rounded = Number((amountMinor + unitMinor / 2n) / unitMinor);
  return Math.min(rows, Math.max(1, rounded));
}

/**
 * Splits 100 dots among the parts, in proportion, and always adds up to 100.
 *
 * Largest remainder method. Rounding each share on its own gives 99 or 101
 * often enough to notice - and a grid with one dot missing reads as a bug.
 * Ties go to the earlier part, so the result does not depend on sort stability.
 */
export function allocateHundred(parts: readonly bigint[]): number[] {
  const total = parts.reduce((sum, p) => sum + (p > 0n ? p : 0n), 0n);
  if (total <= 0n) return parts.map(() => 0);

  const floors = parts.map((p) => (p > 0n ? Number((p * 100n) / total) : 0));
  const remainders = parts.map((p, index) => ({
    index,
    remainder: p > 0n ? (p * 100n) % total : 0n,
  }));

  let missing = 100 - floors.reduce((sum, n) => sum + n, 0);
  remainders.sort((a, b) =>
    a.remainder === b.remainder ? a.index - b.index : a.remainder > b.remainder ? -1 : 1,
  );
  for (const { index } of remainders) {
    if (missing === 0) break;
    floors[index] = (floors[index] ?? 0) + 1;
    missing -= 1;
  }
  return floors;
}
