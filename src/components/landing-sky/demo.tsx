'use client';

import React, { useState } from 'react';

import { tl } from '@/lib/i18n-landing';

import { Cop, tk } from './parts';

const SIMULATION = [
  { merchant: 'Starbucks Reserva · Chicó', amount: 18_500, cat: 'cafe' },
  { merchant: 'Éxito Express · Cra 11', amount: 86_300, cat: 'grocery' },
  { merchant: 'Uber Trip · Carrera 7', amount: 24_800, cat: 'transport' },
  { merchant: 'Rappi · Farmacia', amount: 34_500, cat: 'health' },
] as const;

const START_BALANCE = 3_480_000;

/** The phone that answers when you press it. Sample data, nothing is sent. */
export function DemoPhone(): React.ReactElement {
  const [step, setStep] = useState(-1);
  const [balance, setBalance] = useState(START_BALANCE);
  const current = step >= 0 ? SIMULATION[step % SIMULATION.length] : null;

  const simulate = (): void => {
    const next = SIMULATION[(step + 1) % SIMULATION.length]!;
    setStep(step + 1);
    setBalance((b) => (b > next.amount ? b - next.amount : START_BALANCE));
  };

  return (
    <>
      <div className="telefono-cabeza">
        <span>{tl('landing_phone_greeting')}</span>
        <i>C</i>
      </div>
      <div className="telefono-saldo">
        {/* The key remounts the figure, which replays its entrance. */}
        <span key={balance} className="sube">
          <Cop n={balance} />
        </span>
        <small>
          {tl('landing_phone_pace_label')} <Cop n={125_000} /> {tl('landing_phone_pace_unit')}
        </small>
      </div>
      <ul className="telefono-lista">
        {current && (
          <li key={step} className="llega">
            <div>
              <span>{current.merchant}</span>
              <small>
                {tl('landing_phone_sim_time_now')} · {tk(`landing_phone_sim_cat_${current.cat}`)}
              </small>
            </div>
            <em>{tl('landing_phone_auto_badge')}</em>
            <Cop n={current.amount} minus />
          </li>
        )}
        <li>
          <div>
            <span>Carulla Express</span>
            <small>{tl('landing_phone_ledger_time_ago')}</small>
          </div>
          <em>{tl('landing_phone_auto_badge')}</em>
          <Cop n={48_200} minus />
        </li>
      </ul>
      <button type="button" className="telefono-boton" onClick={simulate}>
        {tl('landing_phone_sim_button')}
      </button>
      <p className="telefono-aviso" aria-live="polite">
        {current
          ? `${tl('landing_phone_toast_detected')} ${current.merchant}`
          : tl('landing_phone_toast_idle')}
      </p>
    </>
  );
}
