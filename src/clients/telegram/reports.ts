import { formatMoney, money } from '@/core/money';
import type { CategorySpendingBreakdown } from '@/core/repositories/transaction.repository';
import type { DashboardData, MonthViewData } from '@/core/services/analytics.service';
import type { ChatDay, MonthCategory } from '@/core/services/chat-capture.service';
import { formatDate, intlTag, t, type Locale } from '@/lib/i18n';

import { categoryLabel } from './category-emoji';

/**
 * The dashboard, said out loud.
 *
 * WHY THIS IS PURE, AND WHY THAT MATTERS MORE THAN IT LOOKS
 * ---------------------------------------------------------
 * Every figure here comes from analytics.service.ts, which already groups by
 * `AT TIME ZONE` (rule 4) and already keeps money in minor units (rule 3).
 * This file adds no arithmetic on money beyond a percentage, so there is no
 * second place where "the total for September" could be computed differently
 * from what the dashboard shows. A bot that disagrees with the app about a
 * number is worse than a bot with no numbers at all.
 *
 * It is also the shape the language model will narrate in the next phase: the
 * model picks a tool, the tool returns these same structures, and the model
 * describes them. It never adds anything up itself - so a wrong figure would
 * have to come from a tested service rather than from a guess.
 */

/** The app's own rule: no amount is rendered by hand. */
function amount(minor: bigint, currency: string, locale: Locale): string {
  return formatMoney(money(minor, currency), intlTag(locale));
}

/**
 * Aligns the label column so the numbers line up in Telegram's proportional
 * font. Not perfect - only a monospace block would be - but padding the label
 * costs nothing and a ragged column of money is genuinely hard to read.
 */
function row(label: string, value: string): string {
  return `${label}  ${value}`;
}

function movements(count: number, locale: Locale): string {
  return `${count} ${t(count === 1 ? 'bot_movements_one' : 'bot_movements_many', locale)}`;
}

export function balanceReport(data: DashboardData, locale: Locale): string {
  const { baseCurrency: c } = data;

  return [
    `${t('bot_balance_title', locale)}`,
    `${amount(data.totalBalanceMinor, c, locale)}`,
    '',
    data.currentMonthLabel,
    row(t('bot_month_expenses', locale), amount(data.monthlyTotals.totalExpenseMinor, c, locale)),
    row(t('bot_month_income', locale), amount(data.monthlyTotals.totalIncomeMinor, c, locale)),
  ].join('\n');
}

export function todayReport(data: DashboardData, locale: Locale): string {
  const { baseCurrency: c } = data;
  // `relative` is computed in the service against the user's timezone. Reading
  // it rather than comparing dates here keeps the one definition of "today".
  const today = data.recentDays.find((day) => day.relative === 'today');
  const count = today?.transactions.length ?? 0;

  const lines = [
    t('bot_today_title', locale),
    `${amount(data.week.todayExpenseMinor, c, locale)}  ·  ${movements(count, locale)}`,
    '',
    t('bot_week_label', locale),
    amount(data.week.weekExpenseMinor, c, locale),
  ];

  return lines.join('\n');
}

/**
 * Five, then everything else as one line.
 *
 * A month with fifteen categories is a wall of text on a phone, and the tail
 * of it is where the amounts stop mattering. Collapsing the rest into a total
 * keeps the message honest - the percentages still add up - without asking
 * anyone to read fifteen rows.
 */
const TOP_CATEGORIES = 5;

function share(totalMinor: bigint, ofMinor: bigint): string {
  if (ofMinor <= 0n) {
    return '';
  }
  // Integer maths on minor units. Converting to float first would be the one
  // place in the app where money touches a double, for a number that is only
  // ever displayed rounded anyway.
  return `  ${Number((totalMinor * 100n) / ofMinor)}%`;
}

function categoryLine(
  entry: CategorySpendingBreakdown,
  totalExpenseMinor: bigint,
  currency: string,
  locale: Locale,
): string {
  const label = entry.categoryName
    ? categoryLabel(entry.categoryName, entry.categoryIcon)
    : `• ${t('bot_month_uncategorized', locale)}`;

  return `${label}  ${amount(entry.totalMinor, currency, locale)}${share(entry.totalMinor, totalExpenseMinor)}`;
}

export function monthReport(data: MonthViewData, locale: Locale): string {
  const { baseCurrency: c, monthlyTotals: totals } = data;

  if (totals.transactionCount === 0) {
    return `📊 ${data.monthLabel}\n\n${t('bot_no_movements', locale)}`;
  }

  const balanceMinor = totals.totalIncomeMinor - totals.totalExpenseMinor;
  // The sign is the point of this line, and Intl drops a leading '+'.
  const balanceText =
    (balanceMinor > 0n ? '+' : '') + amount(balanceMinor, c, locale);

  const lines = [
    `📊 ${data.monthLabel}`,
    '',
    row(t('bot_month_expenses', locale), amount(totals.totalExpenseMinor, c, locale)),
    row(t('bot_month_income', locale), amount(totals.totalIncomeMinor, c, locale)),
    row(t('bot_month_balance', locale), balanceText),
  ];

  const ranked = [...data.categoryBreakdown].sort((a, b) =>
    a.totalMinor === b.totalMinor ? 0 : a.totalMinor > b.totalMinor ? -1 : 1,
  );
  const top = ranked.slice(0, TOP_CATEGORIES);
  const rest = ranked.slice(TOP_CATEGORIES);

  if (top.length > 0) {
    lines.push('');
    for (const entry of top) {
      lines.push(categoryLine(entry, totals.totalExpenseMinor, c, locale));
    }
  }

  if (rest.length > 0) {
    const restMinor = rest.reduce((sum, entry) => sum + entry.totalMinor, 0n);
    lines.push(
      `${t('bot_month_other_categories', locale)} (${rest.length})  ` +
        `${amount(restMinor, c, locale)}${share(restMinor, totals.totalExpenseMinor)}`,
    );
  }

  return lines.join('\n');
}

/**
 * A day the user named, as a title ("Ayer", "Martes 28 de octubre") or
 * inside a receipt ("ayer", "28 oct").
 *
 * The key is already the local day, so it is formatted at noon UTC in UTC:
 * no zone can move it, and the user's own zone has already been applied.
 */
export function dayLabel(day: ChatDay, locale: Locale, style: 'title' | 'inline'): string {
  if (day.relative === 'yesterday') {
    const word = t('bot_day_yesterday', locale);
    return style === 'title' ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  }
  const text = formatDate(
    `${day.key}T12:00:00Z`,
    'UTC',
    locale,
    style === 'title'
      ? { weekday: 'long', day: 'numeric', month: 'long' }
      : { day: 'numeric', month: 'short' },
  );
  return style === 'title' ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

/** "¿Cuánto gasté ayer?" - the shape of /hoy, for any day. */
export function dayReport(
  answer: {
    readonly day: ChatDay;
    readonly totalExpenseMinor: bigint;
    readonly count: number;
    readonly currency: string;
  },
  locale: Locale,
): string {
  return [
    `📅 ${dayLabel(answer.day, locale, 'title')}`,
    `${amount(answer.totalExpenseMinor, answer.currency, locale)}  ·  ${movements(answer.count, locale)}`,
  ].join('\n');
}

/**
 * "¿Cuánto llevo en transporte?" - one category of the month.
 *
 * A category the user does not have is said plainly, with the whole month
 * under it: the question was about this month's spending, and the full view
 * shows which names they DO have, which is the way to ask again.
 */
export function categoryMonthReport(
  data: MonthViewData,
  category: MonthCategory,
  locale: Locale,
): string {
  if (!category.found) {
    return `${t('bot_category_missing', locale)} «${category.word}».\n\n${monthReport(data, locale)}`;
  }

  const { baseCurrency: c, monthlyTotals: totals } = data;
  const title = `${categoryLabel(category.name, category.icon)} · ${data.monthLabel}`;
  const spent = amount(category.totalMinor, c, locale);

  // WHY SENTENCES AND NOT THE MONTH REPORT'S COLUMNS
  // ------------------------------------------------
  // This used to reuse the /mes layout: "Transporte  $150.000  15%" over
  // "Gastos  $1.000.000". In a list of categories the columns explain each
  // other; alone, a bare "15%" and a second total gave no hint of what was a
  // part of what. Users asked one question, so the answer leads with the
  // figure they asked for and says the share in words.
  if (category.transactionCount === 0) {
    return [title, `${spent} · ${t('bot_category_empty', locale)}`].join('\n');
  }

  const lines = [title, `${spent} ${t('bot_category_in', locale)} ${movements(category.transactionCount, locale)}`];

  // Integer division on minor units, like share(). A 0% would read as "none of
  // it", which is false for a category that does have spends, so it is left out.
  const percent =
    totals.totalExpenseMinor > 0n ? (category.totalMinor * 100n) / totals.totalExpenseMinor : 0n;
  if (percent > 0n) {
    lines.push(
      '',
      `${t('bot_category_share_lead', locale)} ${percent}% ${t('bot_category_share_of', locale)} ` +
        `(${amount(totals.totalExpenseMinor, c, locale)}).`,
    );
  }

  return lines.join('\n');
}
