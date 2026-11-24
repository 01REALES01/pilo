import { describe, expect, it } from 'vitest';

import { CATEGORY_COLOR_PATTERN, CATEGORY_PALETTE, displayCategoryColor } from './category-palette';

describe('displayCategoryColor', () => {
  it('draws the old default colours as tones of the light, whatever their case', () => {
    expect(displayCategoryColor('#10B981')).toBe('var(--cat-tone-salmon)');
    expect(displayCategoryColor('#10b981')).toBe('var(--cat-tone-salmon)');
    expect(displayCategoryColor(' #3B82F6 ')).toBe('var(--cat-tone-rose)');
  });

  it('leaves any other stored colour exactly as it was saved', () => {
    expect(displayCategoryColor('#123456')).toBe('#123456');
    for (const swatch of CATEGORY_PALETTE) {
      expect(displayCategoryColor(swatch.hex)).toBe(swatch.hex);
    }
  });

  it('only offers swatches the server will accept', () => {
    for (const swatch of CATEGORY_PALETTE) {
      expect(swatch.hex).toMatch(CATEGORY_COLOR_PATTERN);
    }
  });
});
