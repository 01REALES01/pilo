import Link from 'next/link';
import React from 'react';

import { Money } from '@/components/ui/money';
import { tl, type LandingKey } from '@/lib/i18n-landing';

/** Dynamic keys (`landing_faq_${k}_q`) are built from fixed lists in the
    components, so the cast is a statement about those lists, not a guess. */
export const tk = (key: string): string => tl(key as LandingKey);

/** The three spends of the Tuesday. They add up to $ 73.000, as in the copy. */
export const TUESDAY = [
  { hour: '9:41', merchant: 'Starbucks Reserva', amount: 18_500 },
  { hour: '13:05', merchant: 'La Puerta Falsa', amount: 42_500 },
  { hour: '19:30', merchant: 'Taxi', amount: 12_000 },
] as const;

export const TUESDAY_TOTAL = TUESDAY.reduce((sum, m) => sum + m.amount, 0);

/**
 * Pesos in the page's examples, drawn by the same <Money> as the app
 * (DESIGN_SYSTEM.md 9.2). The examples are written in whole pesos, so the
 * conversion to minor units happens here, once.
 */
export function Cop({ n, minus = false }: { n: number; minus?: boolean }): React.ReactElement {
  return (
    <span className="plata">
      {minus ? '-' : ''}
      <Money amountMinor={BigInt(n) * 100n} currency="COP" showFractionDeEmphasis={false} />
    </span>
  );
}

export function Arrow(): React.ReactElement {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3 9h12M10.5 4.5 15 9l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SignUpButton({
  large = false,
  label = tl('landing_cta_sign_up_email'),
}: {
  large?: boolean;
  label?: string;
}): React.ReactElement {
  return (
    <Link className={`boton${large ? ' boton-grande' : ''}`} href="/sign-in">
      {label} <Arrow />
    </Link>
  );
}

export function Tag({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <span className="etiqueta">
      <i />
      {children}
    </span>
  );
}

export function Heading({ lead, accent }: { lead: string; accent: string }): React.ReactElement {
  return (
    <h2 className="titular">
      {lead} <span>{accent}</span>
    </h2>
  );
}

/**
 * A block that fades up the first time it is seen.
 *
 * Plain markup: the observing is done once for the whole page by
 * <RevealObserver>, so sections that have nothing interactive stay server
 * components. Without JavaScript, or with reduced motion, the block is simply
 * visible (see the noscript rule in page.tsx and the media query in the CSS).
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}): React.ReactElement {
  return (
    <div
      className={`aparece ${className}`}
      style={delay ? ({ '--retraso': `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
