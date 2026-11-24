import React from 'react';

import { Money } from '@/components/ui/money';
import { t } from '@/lib/i18n';

interface MonthNetTotalProps {
  readonly incomeMinor: bigint;
  readonly expenseMinor: bigint;
  readonly currency: string;
}

/**
 * What the month left: income minus spending.
 *
 * The profile menu promised a "balance" for the month and the screen only had
 * the two halves of it. The subtraction happens here in integers, and the sign
 * is written out rather than left to colour alone (DESIGN_SYSTEM.md 8).
 */
export function MonthNetTotal({
  incomeMinor,
  expenseMinor,
  currency,
}: MonthNetTotalProps): React.ReactElement {
  const net = incomeMinor - expenseMinor;
  const magnitude = net < 0n ? -net : net;
  const sign = net > 0n ? '+' : net < 0n ? '−' : '';

  return (
    <div className="month-total month-total--net">
      <span className="fin-stat-label">{t('month_net')}</span>
      <span className="month-total-value">
        {sign}
        <Money amountMinor={magnitude} currency={currency} />
      </span>
    </div>
  );
}
