'use client';

import React, { useEffect, useRef, useState } from 'react';

import { PiloPose } from '@/components/landing/pilo-pose';
import { tl } from '@/lib/i18n-landing';

import { Cop, Heading, TUESDAY, TUESDAY_TOTAL, tk } from './parts';

/** The day's total after each moment has gone by. */
const RUNNING_TOTAL = [18_500, 61_000, 61_000, 73_000, 73_000, 73_000, 73_000] as const;
const CATEGORIES = ['restaurant', 'cafe', 'market', 'transport'] as const;
const HOURS = ['9:41', '13:05', '13:06', '19:30', '22:10'] as const;
/** Where the "now" mark stands, as a share of the screen's width. */
const NOW_AT = 0.3;

/**
 * An ordinary Tuesday as one line that moves with the scroll.
 *
 * On a wide screen the section pins, and vertical scroll moves the line
 * sideways: the "now" mark stays put and the day's total grows as each spend
 * passes it. The scroll position is written straight to a transform inside
 * requestAnimationFrame - no state, so nothing re-renders while scrolling; the
 * only state that changes is how many moments have gone by.
 *
 * On a phone, under reduced motion or without JavaScript it is the same line,
 * read top to bottom.
 */
export function Tuesday(): React.ReactElement {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('restaurant');
  const [pinned, setPinned] = useState(false);
  const [travel, setTravel] = useState(0);
  const [passed, setPassed] = useState(1);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLElement>(null);
  const nodes = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1000px) and (min-height: 700px)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const measure = (): void => {
      const yes = wide.matches && !still.matches;
      setPinned(yes);
      if (yes && track.current) {
        setTravel(Math.max(0, track.current.scrollWidth - window.innerWidth));
      }
    };
    measure();
    // Fonts and images settle after the first paint and change the width.
    const later = setTimeout(measure, 300);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(later);
      window.removeEventListener('resize', measure);
    };
  }, [pinned]);

  useEffect(() => {
    const el = section.current;
    const line = track.current;
    if (!el || !line) return;
    if (!pinned) {
      line.style.transform = '';
      return;
    }

    let frame = 0;
    const update = (): void => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const progress = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      const x = -Math.round(progress * travel);
      line.style.transform = `translate3d(${x}px, 0, 0)`;

      const now = window.innerWidth * NOW_AT;
      if (fill.current) {
        // scaleX, not width: the filled part of the line grows on the
        // compositor instead of relayouting the track on every frame.
        const total = line.scrollWidth || 1;
        fill.current.style.transform = `scaleX(${Math.min(1, (now - x) / total)})`;
      }
      const count = nodes.current.filter((n) => n && n.offsetLeft + x <= now + 4).length;
      setPassed((prev) => (prev === Math.max(1, count) ? prev : Math.max(1, count)));
    };
    const onScroll = (): void => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pinned, travel]);

  const proofs: React.ReactNode[] = [
    <div className="recibo" key="coffee">
      <div>
        <span>{TUESDAY[0].merchant}</span>
        <Cop n={TUESDAY[0].amount} />
      </div>
      <small>{tl('landing_journey_coffee_receipt_ok')}</small>
    </div>,
    <div className="recibo" key="ask">
      <div>
        <span>
          <Cop n={TUESDAY[1].amount} /> {tl('landing_journey_ask_bubble')}
        </span>
      </div>
      <div className="teclas">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={c === category ? 'activa' : ''}
            aria-pressed={c === category}
            onClick={() => setCategory(c)}
          >
            {tk(`landing_journey_cat_${c}`)}
          </button>
        ))}
      </div>
    </div>,
    <div className="recibo reglas" key="rule">
      <small>{tl('landing_journey_rules_label')}</small>
      <div>
        <span>{TUESDAY[1].merchant}</span>
        <em>{tl('landing_journey_rules_new')}</em>
      </div>
      <div>
        <span>Juan Valdez</span>
      </div>
      <div>
        <span>Uber</span>
      </div>
    </div>,
    <div className="recibo" key="taxi">
      <div className="mensaje">{tl('landing_journey_taxi_message')}</div>
      <div>
        <span>{tl('landing_journey_taxi_saved')}</span>
      </div>
      <small>
        <Cop n={TUESDAY[2].amount} /> {tl('landing_journey_taxi_known')}
      </small>
    </div>,
    <div className="recibo" key="today">
      <small>{tl('landing_journey_today_head')}</small>
      <div className="recibo-grande">
        <Cop n={TUESDAY_TOTAL} />
      </div>
      {/* The staircase of /hoy: the day's running total, with the three spends. */}
      <svg className="escalera" viewBox="0 0 240 56" aria-hidden="true">
        <path d="M0 54H97V41H131V11H195V3H240" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M0 54H240" stroke="currentColor" strokeWidth="1" strokeDasharray="1 5" />
      </svg>
      <div className="escalera-horas">
        <span>0 h</span>
        <span>12 h</span>
        <span>24 h</span>
      </div>
    </div>,
  ];

  const titles: React.ReactNode[] = [
    tl('landing_journey_coffee_title'),
    tl('landing_journey_ask_title'),
    <>
      {tl('landing_journey_rule_title_lead')}
      {tk(`landing_journey_cat_${category}`)}
      {tl('landing_journey_rule_title_tail')}
    </>,
    tl('landing_journey_taxi_title'),
    tl('landing_journey_today_title'),
  ];
  const costs = [
    tl('landing_journey_coffee_cost'),
    tl('landing_journey_ask_cost'),
    tl('landing_journey_rule_cost'),
    tl('landing_journey_taxi_cost'),
    tl('landing_journey_today_cost'),
  ];
  const closing: [number, string][] = [
    [3, tl('landing_journey_end_expenses')],
    [2, tl('landing_journey_end_taps')],
    [1, tl('landing_journey_end_message')],
    [0, tl('landing_journey_end_forms')],
  ];

  const at = Math.min(passed, HOURS.length) - 1;
  const total = RUNNING_TOTAL[at] ?? TUESDAY_TOTAL;
  // The section's sky follows the hour: evening at 19:30, night from 22:10.
  const phase = !pinned ? '' : passed >= 5 ? ' noche' : passed === 4 ? ' tarde' : '';

  return (
    <section
      ref={section}
      id="martes"
      className={`martes${pinned ? ' martes-fijo' : ''}${phase}`}
      style={pinned ? { height: `calc(100vh + ${travel}px)` } : undefined}
    >
      <div className="pista">
        <div
          className="noche-nubes"
          style={{ backgroundImage: 'url(/images/landing/nubes-noche.png)' }}
          aria-hidden="true"
        />
        <div className="ancho pista-cabeza">
          <div>
            <Heading
              lead={tl('landing_journey_intro_title_lead')}
              accent={tl('landing_journey_intro_title_accent')}
            />
            <p className="parrafo">{tl('landing_journey_intro_text')}</p>
          </div>
          <div className="contador" aria-hidden="true">
            <small>{HOURS[at]}</small>
            <b key={total} className="sube">
              <Cop n={total} />
            </b>
          </div>
        </div>
        <div className="carril-marco">
          <span className="ahora" aria-hidden="true" />
          <ol ref={track} className="carril">
            <li className="hilo" aria-hidden="true">
              <i ref={fill} />
            </li>
            {HOURS.map((hour, index) => (
              <li
                key={hour}
                ref={(el) => {
                  nodes.current[index] = el;
                }}
                className={`momento ${index % 2 ? 'abajo' : 'arriba'}${
                  !pinned || index < passed ? ' pasado' : ''
                }`}
              >
                <b className="hora">{hour}</b>
                <div className="tarjeta-momento">
                  <span className="chip">{costs[index]}</span>
                  <h3>{titles[index]}</h3>
                  {proofs[index]}
                </div>
              </li>
            ))}
            <li
              ref={(el) => {
                nodes.current[5] = el;
              }}
              className={`momento abajo momento-futuro${!pinned || passed > 5 ? ' pasado' : ''}`}
            >
              <b className="hora">{tl('landing_journey_statement_hour')}</b>
              <div className="tarjeta-momento">
                <span className="chip chip-hueco">{tl('landing_journey_statement_cost')}</span>
                <h3>{tl('landing_journey_statement_title')}</h3>
                <p>
                  <strong>{tl('landing_journey_statement_not_built')}</strong>
                  {tl('landing_journey_statement_rest')}
                </p>
              </div>
            </li>
            <li
              ref={(el) => {
                nodes.current[6] = el;
              }}
              className="cierre-dia"
            >
              <PiloPose pose="dormido" width={150} className="pilo pilo-dormido" />
              <div>
                <h3>{tl('landing_journey_end_title')}</h3>
                <dl>
                  {closing.map(([n, label]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{n}</dd>
                    </div>
                  ))}
                </dl>
                <p>
                  {tl('landing_journey_end_note_lead')} {TUESDAY.length * 8}{' '}
                  {tl('landing_journey_end_note_mid')} 8 {tl('landing_journey_end_note_tail')}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
