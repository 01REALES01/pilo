'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { LandingBanksSection } from '@/components/landing/landing-banks-section';
import { LandingDayJourney } from '@/components/landing/landing-day-journey';
import { LandingPrivacyBento } from '@/components/landing/landing-privacy-bento';
import { PiloPose } from '@/components/landing/pilo-pose';
import { CategoryIcon } from '@/components/ui/category-icon';
import { Money } from '@/components/ui/money';
import { tl } from '@/lib/i18n-landing';

interface SimulationItem {
  readonly store: string;
  readonly amountMinor: bigint;
  readonly categoryName: string;
  readonly categoryIcon: string;
  readonly time: string;
}

/** An illustrative average, not a measurement: the mockup needs a figure. */
const DEMO_DAILY_PACE_MINOR = 12500000n;

const SIMULATION_POOL: readonly SimulationItem[] = [
  {
    store: 'Starbucks Reserva · Chicó',
    amountMinor: 1850000n,
    categoryName: tl('landing_phone_sim_cat_cafe'),
    categoryIcon: 'Coffee',
    time: tl('landing_phone_sim_time_now'),
  },
  {
    store: 'Éxito Express · Cra 11',
    amountMinor: 8630000n,
    categoryName: tl('landing_phone_sim_cat_grocery'),
    categoryIcon: 'ShoppingCart',
    time: tl('landing_phone_sim_time_now'),
  },
  {
    store: 'Uber Trip · Carrera 7',
    amountMinor: 2480000n,
    categoryName: tl('landing_phone_sim_cat_transport'),
    categoryIcon: 'Car',
    time: tl('landing_phone_sim_time_now'),
  },
  {
    store: 'Rappi · Farmacia',
    amountMinor: 3450000n,
    categoryName: tl('landing_phone_sim_cat_health'),
    categoryIcon: 'HeartPulse',
    time: tl('landing_phone_sim_time_now'),
  },
];


/**
 * El contraste vive en datos y no en JSX porque las dos columnas tienen que
 * mantener el mismo número de filas: si se desincronizan, la comparación
 * deja de leerse como comparación.
 */
/* La franja de cifras.
 *
 * La versión anterior contaba INVENTARIO — «2 bancos», «3 formas» — y el
 * inventario de un producto joven siempre se lee pequeño. Estas cuatro
 * cuentan lo que el producto le ahorra o le garantiza a la persona, que es
 * lo que no depende de cuánto hayamos construido todavía: el trabajo que
 * desaparece, cuándo funciona, de quién son los datos y qué cuesta.
 *
 * Las cuatro se pueden comprobar: los ocho pasos son los de la comparación
 * de aquí arriba, el Atajo corre con el teléfono bloqueado, el export vive
 * en /api/v1/export con las once columnas de csv-export.service.ts, y no
 * hay pasarela de pago en ninguna parte del repositorio.
 */
const HEADLINE_FACTS = [
  { value: tl('landing_facts_steps_value'), label: tl('landing_facts_steps_label'), note: tl('landing_facts_steps_note') },
  { value: tl('landing_facts_always_value'), label: tl('landing_facts_always_label'), note: tl('landing_facts_always_note') },
  { value: tl('landing_facts_export_value'), label: tl('landing_facts_export_label'), note: tl('landing_facts_export_note') },
  { value: tl('landing_facts_free_value'), label: tl('landing_facts_free_label'), note: tl('landing_facts_free_note') },
];

/* Las FAQ del final.
 *
 * No son relleno de SEO: son las objeciones que frenan el registro, puestas
 * donde se decide. Baymard mide que las señales de confianza convierten
 * cerca del botón y casi nada desde el pie, y la mitad de estas preguntas
 * son exactamente eso — la clave del banco, el precio, quién ve los datos.
 *
 * Las respuestas dicen que no cuando la respuesta es que no. Una FAQ que
 * solo confirma lo que el producto quiere oír no la lee nadie dos veces.
 */
interface Faq {
  readonly q: string;
  readonly a: string;
}

const FAQS: readonly Faq[] = [
  { q: tl('landing_faq_iphone_q'), a: tl('landing_faq_iphone_a') },
  { q: tl('landing_faq_bank_key_q'), a: tl('landing_faq_bank_key_a') },
  { q: tl('landing_faq_trap_q'), a: tl('landing_faq_trap_a') },
  { q: tl('landing_faq_cash_q'), a: tl('landing_faq_cash_a') },
  { q: tl('landing_faq_export_q'), a: tl('landing_faq_export_a') },
  { q: tl('landing_faq_invest_q'), a: tl('landing_faq_invest_a') },
];

const MANUAL_STEPS: readonly string[] = [
  tl('landing_shift_manual_step_1'),
  tl('landing_shift_manual_step_2'),
  tl('landing_shift_manual_step_3'),
  tl('landing_shift_manual_step_4'),
  tl('landing_shift_manual_step_5'),
  tl('landing_shift_manual_step_6'),
  tl('landing_shift_manual_step_7'),
  tl('landing_shift_manual_step_8'),
];

const PILO_STEPS: readonly string[] = [
  tl('landing_shift_pilo_step_1'),
  tl('landing_shift_pilo_step_2'),
  tl('landing_shift_pilo_step_3'),
  tl('landing_shift_pilo_step_4'),
  tl('landing_shift_pilo_step_5'),
  tl('landing_shift_pilo_step_6'),
  tl('landing_shift_pilo_step_7'),
  tl('landing_shift_pilo_step_8'),
];

interface InsightExample {
  readonly quote: string;
  readonly desc: string;
}

const INSIGHT_EXAMPLES: readonly InsightExample[] = [
  { quote: tl('landing_insight_habit_quote'), desc: tl('landing_insight_habit_desc') },
  { quote: tl('landing_insight_recurring_quote'), desc: tl('landing_insight_recurring_desc') },
  { quote: tl('landing_insight_projection_quote'), desc: tl('landing_insight_projection_desc') },
];

export function LandingProductShowcase(): React.ReactElement {
  const [simulatedBalanceMinor, setSimulatedBalanceMinor] = useState<bigint>(348000000n);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [phoneToast, setPhoneToast] = useState<string>(tl('landing_phone_toast_idle'));

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  function handleTriggerSimulation(): void {
    const nextStep = (simulationStep + 1) % SIMULATION_POOL.length;
    const currentTx = SIMULATION_POOL[nextStep]!;
    setSimulationStep(nextStep);
    setSimulatedBalanceMinor((prev) => (prev > currentTx.amountMinor ? prev - currentTx.amountMinor : 348000000n));
    setPhoneToast(`${tl('landing_phone_toast_detected')} ${currentTx.store}`);
  }

  const activeSimulation = SIMULATION_POOL[simulationStep]!;

  return (
    <section
      id="product-showcase"
      className="landing-showcase-section--app"
      aria-label={tl('landing_showcase_section_label')}
    >
      {/* ── 1. Hero de Sección (El Problema Real vs. Pilo) ────────────── */}
      <div className="landing-app-hero reveal-on-scroll">
        <h2 className="landing-app-headline">
          {tl('landing_showcase_title_lead')} <br />
          <span className="landing-headline-gold">{tl('landing_showcase_title_accent')}</span>
        </h2>
        <p className="landing-app-subhead">
          {tl('landing_showcase_subtitle_lead')} <strong className="landing-headline-gold">{tl('landing_showcase_subtitle_strong')}</strong>{tl('landing_showcase_subtitle_tail')}
        </p>
      </div>

      {/* ── 1b. El contraste ──────────────────────────────────────────────
          Las dos columnas se generan de dos arreglos del mismo largo: una
          comparación con distinto número de filas se lee como trampa.        */}
      <div className="landing-shift-grid reveal-on-scroll">
        <div className="landing-shift-card landing-shift-card--old">
          <div className="landing-shift-head">
            <h3 className="landing-shift-title">{tl('landing_shift_manual_title')}</h3>
          </div>
          <ol className="landing-shift-steps">
            {MANUAL_STEPS.map((step, i) => (
              <li key={step} className="landing-shift-step">
                <span className="landing-shift-num landing-shift-num--old" aria-hidden="true">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="landing-shift-card landing-shift-card--new">
          <div className="landing-shift-head">
            <h3 className="landing-shift-title">{tl('landing_shift_pilo_title')}</h3>
          </div>
          <ol className="landing-shift-steps">
            {PILO_STEPS.map((step, i) => (
              <li key={step} className="landing-shift-step">
                <span className="landing-shift-num landing-shift-num--new" aria-hidden="true">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── 2. Las cifras y un día ─────────────────────────────────────
          Primero las cuatro cifras que se pueden comprobar; después un
          solo martes recorriendo el sistema, en vez de cuatro mockups de
          pantallas falsas. */}
      <div className="landing-facts-strip reveal-on-scroll">
        {HEADLINE_FACTS.map((f) => (
          <div key={f.label} className="landing-fact">
            <span className="landing-fact-value">{f.value}</span>
            <span className="landing-fact-label">{f.label}</span>
            <span className="landing-fact-note">{f.note}</span>
          </div>
        ))}
      </div>

      <LandingDayJourney />

      {/* ── 3. Los bancos ────────────────────────────────────────────── */}
      <LandingBanksSection />

      {/* ── 4. Banner con Mockup de la App Real (Velvet & Imperial Wine) ─────── */}
      <div className="landing-app-phone-banner reveal-on-scroll">
        <div className="landing-app-phone-copy-col">

          <h3 className="landing-app-phone-headline">
            {tl('landing_phone_title')}
          </h3>

          <p className="landing-app-phone-subhead">
            {tl('landing_phone_subtitle')}
          </p>

          <div className="landing-app-phone-stats-row">
            <div className="landing-app-phone-stat-item">
              <span className="landing-app-phone-stat-val">0</span>
              <span className="landing-app-phone-stat-label">{tl('landing_phone_stat_screens')}</span>
            </div>
            <div className="landing-app-phone-stat-item">
              <span className="landing-app-phone-stat-val">0</span>
              <span className="landing-app-phone-stat-label">{tl('landing_phone_stat_forms')}</span>
            </div>
            <div className="landing-app-phone-stat-item">
              <span className="landing-app-phone-stat-val">{tl('landing_phone_stat_encrypted_value')}</span>
              <span className="landing-app-phone-stat-label">{tl('landing_phone_stat_encrypted_label')}</span>
            </div>
          </div>

          <Link href="/sign-in" className="landing-luxury-cta-btn">
            <span>{tl('landing_cta_sign_up_email')}</span>
            <span className="landing-luxury-cta-arrow" aria-hidden="true">
              <CategoryIcon name="ChevronRight" size={15} />
            </span>
          </Link>
        </div>

        {/* Mockup del Teléfono Mostrando el Dashboard Real */}
        <div className="landing-phone-stage-wrapper">
          <div className="landing-phone-device--app">
            <div className="landing-phone-screen-inner--app">
              <div className="landing-phone-island" aria-hidden="true" />

              {/* Balance Hero Card Real de la App */}
              <div className="landing-phone-app-hero">
                <div className="landing-phone-app-greeting">
                  <span>{tl('landing_phone_greeting')}</span>
                  <div className="landing-phone-app-avatar">C</div>
                </div>
                <div className="landing-phone-app-balance">
                  <Money amountMinor={simulatedBalanceMinor} currency="COP" />
                </div>
                <div className="landing-phone-app-pacing">
                  {/* The label and the per-day average the real balance card
                      shows (balance-hero.tsx): no rating, no projection. */}
                  {tl('landing_phone_pace_label')} <Money amountMinor={DEMO_DAILY_PACE_MINOR} currency="COP" /> {tl('landing_phone_pace_unit')}
                </div>
              </div>

              {/* Mini Ledger de Transacciones */}
              <div className="landing-phone-mini-ledger">
                <div className="landing-phone-mini-row">
                  <div className="landing-phone-mini-left">
                    <div className="landing-phone-mini-icon">
                      <CategoryIcon name={activeSimulation.categoryIcon} size={13} />
                    </div>
                    <div className="landing-phone-mini-info">
                      <span className="landing-phone-mini-name">{activeSimulation.store}</span>
                      <span className="landing-phone-mini-meta">
                        <span>{activeSimulation.time}</span>
                        <span className="landing-phone-auto-badge">{tl('landing_phone_auto_badge')}</span>
                      </span>
                    </div>
                  </div>
                  <span className="landing-phone-mini-amt">
                    -<Money amountMinor={activeSimulation.amountMinor} currency="COP" />
                  </span>
                </div>

                <div className="landing-phone-mini-row">
                  <div className="landing-phone-mini-left">
                    <div className="landing-phone-mini-icon">
                      <CategoryIcon name="ShoppingCart" size={13} />
                    </div>
                    <div className="landing-phone-mini-info">
                      <span className="landing-phone-mini-name">Carulla Express</span>
                      <span className="landing-phone-mini-meta">
                        <span>{tl('landing_phone_ledger_time_ago')}</span>
                        <span className="landing-phone-auto-badge">{tl('landing_phone_auto_badge')}</span>
                      </span>
                    </div>
                  </div>
                  <span className="landing-phone-mini-amt">
                    -<Money amountMinor={4820000n} currency="COP" />
                  </span>
                </div>
              </div>

              {/* Botón de Simulación Táctil */}
              <button
                type="button"
                onClick={handleTriggerSimulation}
                className="landing-phone-sim-btn--app"
              >
                <CategoryIcon name="Zap" size={14} />
                <span>{tl('landing_phone_sim_button')}</span>
              </button>

              <div className="landing-phone-toast">
                {phoneToast}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. La privacidad, en bento ─────────────────────────────── */}
      <LandingPrivacyBento />

      <div id="features-faq" className="landing-faq reveal-on-scroll">
        <div className="landing-faq-intro">
          <PiloPose pose="feliz" width={112} className="landing-pilo--faq" />
          <h3 className="landing-faq-headline">
            {tl('landing_faq_title_lead')} <span className="landing-headline-gold">{tl('landing_faq_title_accent')}</span>
          </h3>
          {/* The answers are the author's, signed: one person making it is one
              of the five differences (docs/PILO_COPY.md §2.2, §3.2). */}
          <p className="landing-faq-byline">{tl('landing_faq_byline')}</p>
        </div>

        <div className="landing-faq-list">
          {FAQS.map((f) => (
            <details key={f.q} className="landing-faq-item">
              <summary className="landing-faq-q">
                <span>{f.q}</span>
                <span className="landing-faq-sign" aria-hidden="true" />
              </summary>
              <p className="landing-faq-a">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* ── 6. Qué ve el sistema una vez el gasto ya está dentro ──────────
          Va con descargo explícito: son ejemplos de la FORMA de la
          observación, no cifras medidas (P3 y P6).                        */}
      <div className="landing-insight-block reveal-on-scroll">
        <div className="landing-insight-header">
          <h3 className="landing-insight-headline">
            {tl('landing_insight_title_lead')} <span className="landing-headline-gold">{tl('landing_insight_title_accent')}</span>
          </h3>
          <p className="landing-insight-subhead">
            {tl('landing_insight_subtitle')}
          </p>
        </div>

        <div className="landing-insight-grid">
          {INSIGHT_EXAMPLES.map((item, i) => (
            <div key={item.quote} className="landing-insight-card">
              <span className="landing-insight-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <p className="landing-insight-quote">{item.quote}</p>
              <p className="landing-insight-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
