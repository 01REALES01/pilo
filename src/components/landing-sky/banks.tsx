'use client';

import React, { useEffect, useState } from 'react';

import { tl } from '@/lib/i18n-landing';

import { Cop } from './parts';

const THREADS = [
  'M0 48 C110 48 90 84 200 84',
  'M0 158 C110 158 90 158 200 158',
  'M0 268 C110 268 90 232 200 232',
] as const;

/** Sender names are written out, never logos; the SMS texts are generic. */
function useMessages() {
  return [
    {
      name: 'Bancolombia',
      kind: tl('landing_banks_kind_sms'),
      chip: tl('landing_banks_chip_auto'),
      text: tl('landing_banks_bancolombia_text'),
      title: 'Bancolombia',
      merchant: 'Cafe Generico',
      cat: tl('landing_banks_cat_cafe'),
      amount: 18_500,
      sms: (
        <>
          Compraste <Cop n={18_500} /> en CAFE GENERICO con tu T.Deb *0000, a las 9:41.
        </>
      ),
    },
    {
      name: 'Banco de Bogotá',
      kind: tl('landing_banks_kind_sms'),
      chip: tl('landing_banks_chip_auto'),
      text: tl('landing_banks_bogota_text'),
      title: 'Banco de Bogotá',
      merchant: 'Restaurante Generico',
      cat: tl('landing_banks_cat_restaurant'),
      amount: 42_500,
      sms: (
        <>
          Tu compra por <Cop n={42_500} /> fue aprobada con Tarjeta Débito 0000 en RESTAURANTE
          GENERICO.
        </>
      ),
    },
    {
      name: tl('landing_banks_manual_sender'),
      kind: tl('landing_banks_kind_message'),
      chip: tl('landing_banks_chip_manual'),
      text: tl('landing_banks_manual_text'),
      title: tl('landing_banks_manual_title'),
      merchant: tl('landing_banks_manual_merchant'),
      cat: tl('landing_banks_cat_restaurant'),
      amount: 12_000,
      sms: <>{tl('landing_banks_manual_message')}</>,
    },
  ];
}

/**
 * Messages arrive on the left, a thread of light carries the chosen one, and
 * on the right it is already written down. It rotates on its own until the
 * visitor picks one, and stands still under reduced motion.
 */
export function BanksArrival(): React.ReactElement {
  const messages = useMessages();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setActive((c) => (c + 1) % THREADS.length), 3200);
    return () => clearInterval(id);
  }, [auto]);

  const choose = (index: number): void => {
    setAuto(false);
    setActive(index);
  };
  const current = messages[active]!;

  return (
    <>
      <div className="aparece llegada">
        <ul className="llegan">
          {messages.map((m, index) => (
            <li key={m.name}>
              <button
                type="button"
                className={index === active ? 'activo' : ''}
                aria-pressed={index === active}
                onClick={() => choose(index)}
              >
                <small>
                  {m.name} · {m.kind}
                </small>
                <span>{m.sms}</span>
              </button>
            </li>
          ))}
        </ul>
        <svg className="hilos" viewBox="0 0 200 316" preserveAspectRatio="none" aria-hidden="true">
          {THREADS.map((d) => (
            <path key={d} d={d} className="hilo-base" />
          ))}
          {/* Remounted on every change, so the stroke draws itself again. */}
          <path key={active} d={THREADS[active]} pathLength={1} className="hilo-luz" />
        </svg>
        <ul className="anotados">
          {messages.map((m, index) => (
            <li key={m.name} className={index === active ? 'activo' : ''}>
              <div>
                <span>{m.merchant}</span>
                <small>{m.cat}</small>
              </div>
              <span className="chip">{m.chip}</span>
              <Cop n={m.amount} minus />
            </li>
          ))}
        </ul>
      </div>

      <div className="explica" aria-live="polite">
        <p key={active} className="cambia">
          <strong>{current.title}.</strong> {current.text}
        </p>
      </div>
    </>
  );
}
