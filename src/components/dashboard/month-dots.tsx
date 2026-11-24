import React from 'react';

import { Money } from '@/components/ui/money';
import { buildMonthGrid } from '@/core/calendar';
import { dotUnit, dotsFor } from '@/core/dot-chart';
import type { DayGroup } from '@/core/services/analytics.service';
import { formatDate, t } from '@/lib/i18n';

interface MonthDotsProps {
  readonly days: readonly DayGroup[];
  readonly monthKey: string;
  readonly todayKey: string;
  readonly currency: string;
}

/** Seven dots tall: enough to tell a heavy day from a light one at a glance,
    and short enough that thirty-one columns still fit a phone. */
const ROWS = 7;

/**
 * The month as a matrix of dots, one column per day.
 *
 * It does not replace the calendar below it - that one is where a day is
 * opened. This one answers a different question in one look: how the month
 * went, which days were heavy and which were empty. Every dot is worth the
 * same amount and the legend says how much, so the picture can be checked
 * against the numbers instead of taken on faith.
 */
export function MonthDots({
  days,
  monthKey,
  todayKey,
  currency,
}: MonthDotsProps): React.ReactElement {
  const totals = new Map(days.map((d) => [d.day, d.totalExpenseMinor]));
  const dayKeys = buildMonthGrid(monthKey)
    .flat()
    .filter((key): key is string => key !== null);

  const max = dayKeys.reduce((top, key) => {
    const total = totals.get(key) ?? 0n;
    return total > top ? total : top;
  }, 0n);
  const unit = dotUnit(max, ROWS);

  // Days still ahead are not "days with no spending": they have not happened.
  const idleDays = dayKeys.filter(
    (key) => key <= todayKey && (totals.get(key) ?? 0n) <= 0n,
  ).length;

  const monthName = formatDate(`${monthKey}-01T12:00:00Z`, 'UTC', undefined, {
    month: 'long',
  });

  return (
    <section className="month-dots" aria-labelledby="month-dots-title">
      <div className="month-dots-head">
        <div className="month-dots-title-group">
          <h2 id="month-dots-title" className="fin-stat-label">
            {t('month_dots_title')}
          </h2>
          <span className="month-dots-hint">{t('month_dots_hint')}</span>
        </div>
        {max > 0n && (
          <span className="dot-legend">
            <span className="dot-legend-mark" aria-hidden="true" />
            {t('dots_legend')}{' '}
            <Money amountMinor={unit} currency={currency} showFractionDeEmphasis={false} />
          </span>
        )}
      </div>

      {/* Decorative to a screen reader: the same days, with exact amounts, are
          in the calendar right below, which is the table view of this chart. */}
      <div
        className="month-dots-grid"
        style={{ '--dot-columns': dayKeys.length } as React.CSSProperties}
        role="img"
        aria-label={`${t('month_dots_title')}: ${monthName}`}
      >
        {dayKeys.map((key) => {
          const lit = dotsFor(totals.get(key) ?? 0n, unit, ROWS);
          const state =
            key === todayKey ? ' month-dots-col--today' : key > todayKey ? ' month-dots-col--future' : '';
          return (
            <span key={key} className={`month-dots-col${state}`}>
              {Array.from({ length: ROWS }, (_, row) => (
                <span
                  key={row}
                  className={`month-dot${row < lit ? ' month-dot--lit' : ''}`}
                  style={{ '--dot-row': row } as React.CSSProperties}
                />
              ))}
            </span>
          );
        })}
      </div>

      <div className="month-dots-foot">
        <div className="month-dots-stat">
          <span className="fin-stat-label">{t('month_dots_peak')}</span>
          <span className="month-dots-stat-value">
            <Money amountMinor={max} currency={currency} />
          </span>
        </div>
        <div className="month-dots-stat month-dots-stat--end">
          <span className="fin-stat-label">{t('month_dots_idle')}</span>
          <span className="month-dots-stat-value">{idleDays}</span>
        </div>
      </div>
    </section>
  );
}
