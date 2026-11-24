/**
 * The colours a category can be given, in one place.
 *
 * WHY A HEX IS WHAT GETS STORED
 * -----------------------------
 * The drawer used to persist the CSS expression itself - `var(--cat-color-rose)`
 * - and that failed twice over. It is 24-28 characters against a
 * `varchar(20)` column, so every insert died with a raw Postgres error; and a
 * `var()` only means something inside this one stylesheet. The same row has to
 * be readable by the CSV export, the Telegram client and anything else that
 * never loads globals.css, so the column holds a plain `#rrggbb` - which is
 * also exactly what the seeded categories have always stored.
 *
 * `cssVar` is what paints the UI, so a component still names no colour of its
 * own (DESIGN_SYSTEM: no colour literals in src/components/). `hex` MUST equal
 * the value of that variable in globals.css; they are two spellings of one
 * decision, and the swatch is where a drift would show up first.
 */
export interface CategoryColor {
  readonly id: string;
  readonly label: string;
  /** Persisted. Portable to any client. */
  readonly hex: string;
  /** Rendered. Mirrors `hex`, defined in globals.css. */
  readonly cssVar: string;
}

export const CATEGORY_PALETTE: readonly CategoryColor[] = [
  { id: 'cream', label: 'Crema', hex: '#f6e3c4', cssVar: 'var(--cat-tone-cream)' },
  { id: 'champagne', label: 'Champaña', hex: '#e4cca6', cssVar: 'var(--cat-tone-champagne)' },
  { id: 'sand', label: 'Arena', hex: '#d4b382', cssVar: 'var(--cat-tone-sand)' },
  { id: 'blush', label: 'Rubor', hex: '#e9b7b0', cssVar: 'var(--cat-tone-blush)' },
  { id: 'salmon', label: 'Salmón', hex: '#ef9c8f', cssVar: 'var(--cat-tone-salmon)' },
  { id: 'rose', label: 'Rosa', hex: '#d9506a', cssVar: 'var(--cat-tone-rose)' },
  { id: 'wine', label: 'Vino', hex: '#b23a57', cssVar: 'var(--cat-tone-wine)' },
  { id: 'mauve', label: 'Malva', hex: '#b98aa0', cssVar: 'var(--cat-tone-mauve)' },
];

/**
 * What a stored colour looks like on screen since the night panel
 * (24-nov-2026).
 *
 * Categories keep the hex they were saved with: the old defaults and the old
 * drawer swatches were generic greens, blues and purples. Rewriting those rows
 * would be a data migration on three people's accounts for what is a matter of
 * paint, and could not be undone by reverting a commit. So the database stays
 * as it is and the translation happens here, at draw time: delete this map and
 * every category is back to its saved colour.
 *
 * A hex that is not in the map - one of the new tones, or anything else - is
 * drawn as stored.
 */
const DISPLAY_TONES: Readonly<Record<string, string>> = {
  // Default categories (category.repository.ts)
  '#10b981': 'var(--cat-tone-salmon)',
  '#f59e0b': 'var(--cat-tone-sand)',
  '#3b82f6': 'var(--cat-tone-rose)',
  '#8b5cf6': 'var(--cat-tone-cream)',
  '#ef4444': 'var(--cat-tone-wine)',
  '#ec4899': 'var(--cat-tone-blush)',
  '#06b6d4': 'var(--cat-tone-champagne)',
  '#6366f1': 'var(--cat-tone-plum)',
  '#14b8a6': 'var(--cat-tone-mauve)',
  '#6b7280': 'var(--cat-tone-grey)',
  // Swatches the drawer offered before
  '#f07aac': 'var(--cat-tone-blush)',
  '#a855f7': 'var(--cat-tone-cream)',
  '#fb7185': 'var(--cat-tone-wine)',
};

export function displayCategoryColor(stored: string): string {
  return DISPLAY_TONES[stored.trim().toLowerCase()] ?? stored;
}


export const DEFAULT_CATEGORY_COLOR = '#e4cca6';

/**
 * What the column accepts. Anything longer than this cannot physically fit in
 * `categories.color`, so validating against it is what keeps a presentation
 * decision from reaching the database as a 500.
 */
export const CATEGORY_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
