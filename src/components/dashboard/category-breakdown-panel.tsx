import React from 'react';

import { CategoryIcon } from '@/components/ui/category-icon';
import { Money } from '@/components/ui/money';
import { allocateHundred } from '@/core/dot-chart';
import type { CategorySpendingBreakdown } from '@/core/repositories/transaction.repository';
import { displayCategoryColor } from '@/lib/category-palette';
import { t } from '@/lib/i18n';

interface CategoryBreakdownPanelProps {
  readonly breakdown: CategorySpendingBreakdown[];
  readonly totalExpenseMinor: bigint;
  readonly currency: string;
}

const CATEGORICAL_COLORS = [
  'var(--cat-1)',
  'var(--cat-2)',
  'var(--cat-3)',
  'var(--cat-4)',
  'var(--cat-5)',
  'var(--cat-6)',
];

/**
 * Spending by category for one month (DESIGN_SYSTEM.md 6.6).
 *
 * Percentages are computed once. Computing them twice with different rounding
 * is how the same category ends up reading 1% in the bar and 0% in the list
 * directly under it.
 *
 * The bar distributes with flex-grow rather than percentage widths: `width: N%`
 * on each segment plus a gap between them always sums past 100%, and the
 * overflow is silently clipped off the end - which loses the smallest category,
 * the one most worth noticing.
 */
export function CategoryBreakdownPanel({
  breakdown,
  totalExpenseMinor,
  currency,
}: CategoryBreakdownPanelProps): React.ReactElement {
  if (breakdown.length === 0 || totalExpenseMinor <= 0n) {
    return (
      <section className="breakdown-panel">
        <h2 className="breakdown-panel-title">{t('breakdown_title')}</h2>
        <div className="breakdown-empty">
          <p>{t('breakdown_empty')}</p>
          <span className="breakdown-empty-hint">{t('breakdown_empty_hint')}</span>
        </div>
      </section>
    );
  }

  // Six rows at most, like the palette (DESIGN_SYSTEM.md 2.6): past that the
  // smallest ones are folded into "Otros". The grid and the list are built
  // from the same rows, so a category can no longer be in one and not in the
  // other - the bar used to draw every category while the list stopped at six.
  const MAX_ROWS = 6;
  const named = breakdown.map((item, idx) => ({
    key: item.categoryId ?? `cat-${idx}`,
    name: item.categoryName ?? t('uncategorized'),
    icon: item.categoryIcon,
    color: item.categoryColor
      ? displayCategoryColor(item.categoryColor)
      : (CATEGORICAL_COLORS[idx % CATEGORICAL_COLORS.length] ?? 'var(--cat-1)'),
    totalMinor: item.totalMinor,
  }));
  const kept = named.length > MAX_ROWS ? named.slice(0, MAX_ROWS - 1) : named;
  const folded = named.slice(kept.length);
  const rows =
    folded.length > 0
      ? [
          ...kept,
          {
            key: 'others',
            name: t('breakdown_others'),
            icon: 'MoreHorizontal',
            color: 'var(--ink-muted)',
            totalMinor: folded.reduce((sum, item) => sum + item.totalMinor, 0n),
          },
        ]
      : kept;

  // One dot per percentage point, and exactly a hundred of them: the shares
  // are split in integers so the grid never comes out a dot short.
  const dots = allocateHundred(rows.map((row) => row.totalMinor));
  const slices = rows.map((row, idx) => ({ ...row, pct: dots[idx] ?? 0 }));

  return (
    <section className="breakdown-panel">
      <h2 className="breakdown-panel-title">{t('breakdown_title')}</h2>

      <span className="dot-legend">
        <span className="dot-legend-mark" aria-hidden="true" />
        {t('breakdown_dots_legend')}
      </span>

      {/* The list below carries the same numbers as text. */}
      <div className="breakdown-dots" aria-hidden="true">
        {slices.flatMap((slice) =>
          Array.from({ length: slice.pct }, (_, i) => (
            <span
              key={`${slice.key}-${i}`}
              className="breakdown-dot"
              style={{ '--seg-ink': slice.color } as React.CSSProperties}
            />
          )),
        )}
      </div>

      <ul className="breakdown-list">
        {slices.map((slice) => (
          <li key={slice.key} className="breakdown-row">
            <span
              className="breakdown-icon"
              style={{ '--seg-ink': slice.color } as React.CSSProperties}
              aria-hidden="true"
            >
              <CategoryIcon name={slice.icon} size={14} />
            </span>
            <span className="breakdown-name">{slice.name}</span>
            <span className="breakdown-pct">{slice.pct}%</span>
            <span className="breakdown-amount">
              <Money
                amountMinor={slice.totalMinor}
                currency={currency}
                showFractionDeEmphasis={false}
              />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
