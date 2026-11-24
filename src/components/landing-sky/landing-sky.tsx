import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { PiloPose } from '@/components/landing/pilo-pose';
import { tl } from '@/lib/i18n-landing';

import { BanksArrival } from './banks';
import { DemoPhone } from './demo';
import { Faq } from './faq';
import { ManifestoWords } from './manifesto-words';
import { Cop, Heading, Reveal, SignUpButton, TUESDAY, TUESDAY_TOTAL, Tag, tk } from './parts';
import { RevealObserver } from './reveal-observer';
import { Tuesday } from './tuesday';

const SKY = '/images/landing/cielo.png';
const NIGHT = '/images/landing/nubes-noche.png';

function Brand(): React.ReactElement {
  return (
    <a className="marca" href="#">
      <Image src="/icons/icon-192.png" alt="" width={34} height={34} />
      PILO
    </a>
  );
}

/* ── 1. Hero ──────────────────────────────────────────────────────────────── */
function Hero(): React.ReactElement {
  const working: [string, string][] = [
    ['Bancolombia', tl('landing_banks_kind_sms')],
    ['Banco de Bogotá', tl('landing_banks_kind_sms')],
    ['Telegram', tl('landing_banks_chip_manual')],
  ];
  const coming = ['Davivienda', 'Scotiabank Colpatria', 'Falabella'];

  return (
    <header className="hero">
      <nav className="barra" aria-label={tl('landing_nav_main_label')}>
        <Brand />
        <div className="menu">
          <a href="#como-funciona">{tl('landing_nav_how_it_works')}</a>
          <a href="#bancos">{tl('landing_nav_banks')}</a>
          <a href="#privacidad">{tl('landing_nav_privacy')}</a>
          <a href="#preguntas">{tl('landing_nav_faq')}</a>
        </div>
        <SignUpButton label={tl('landing_cta_sign_up')} />
      </nav>

      {/* The entrance is CSS, so the headline is on screen before any script
          runs: it is the largest paint of the page. */}
      <div className="hero-texto">
        <span className="pildora entra">
          <i />
          {tl('landing_hero_title')}
        </span>
        <h1>
          <span className="linea">
            <span className="entra-linea">{tl('landing_hero_flank_left')}.</span>
          </span>
          <span className="linea">
            <span className="entra-linea" style={{ animationDelay: '.12s' }}>
              {tl('landing_hero_flank_right')}.
            </span>
          </span>
        </h1>
        <p className="bajada entra-suave" style={{ animationDelay: '.45s' }}>
          {tl('landing_hero_subtitle')}
        </p>
        <div className="entra" style={{ animationDelay: '.6s' }}>
          <SignUpButton large />
        </div>
        <ul className="hechos entra-suave" style={{ animationDelay: '.75s' }}>
          <li>{tl('landing_hero_fact_free')}</li>
          <li>{tl('landing_hero_fact_code')}</li>
          <li>{tl('landing_hero_fact_no_bank_key')}</li>
        </ul>
        <p className="salvedad entra-suave" style={{ animationDelay: '.85s' }}>
          {tl('landing_hero_caveat')}
        </p>
      </div>

      <div className="escena" aria-hidden="true">
        <div className="trama" style={{ backgroundImage: `url(${SKY})` }} />
        <div className="anotado entra" style={{ animationDelay: '1s' }}>
          <div className="anotado-cabeza">
            <Image src="/icons/icon-192.png" alt="" width={22} height={22} />
            Pilo<b>{tl('landing_phone_sim_time_now')}</b>
          </div>
          <div className="anotado-fila">
            <span>
              {tl('landing_phone_toast_detected')} {TUESDAY[0].merchant}
            </span>
            <Cop n={TUESDAY[0].amount} />
          </div>
          <span className="chip">{tl('landing_journey_coffee_cost')}</span>
        </div>
        <PiloPose pose="anota" width={215} className="pilo pilo-hero" />
      </div>

      {/* Names in text, never logos. */}
      <ul className="fichas" aria-label={tl('landing_nav_banks')}>
        {working.map(([name, how]) => (
          <li key={name}>
            <b>{name}</b>
            <span>{how}</span>
          </li>
        ))}
        {coming.map((name) => (
          <li key={name} className="ficha-futura">
            <b>{name}</b>
            <span>{tl('landing_journey_statement_cost')}</span>
          </li>
        ))}
      </ul>
    </header>
  );
}

/* ── Manifesto ────────────────────────────────────────────────────────────── */
function Manifesto(): React.ReactElement {
  const facts = (['steps', 'always', 'export', 'free'] as const).map((k) => ({
    value: tk(`landing_facts_${k}_value`),
    label: tk(`landing_facts_${k}_label`),
    note: tk(`landing_facts_${k}_note`),
  }));

  return (
    <section className="manifiesto">
      <div className="ancho">
        <div className="manifiesto-frase">
          <PiloPose pose="pensando" width={280} className="pilo pilo-pensando" />
          <ManifestoWords text={tl('landing_understand_statement')} />
          <p>{tl('landing_understand_subtitle')}</p>
        </div>
        <div className="cajas">
          <Reveal className="caja caja-ancha">
            <h3>
              {tl('landing_observe_title_lead')} <span>{tl('landing_observe_title_accent')}</span>
            </h3>
            <p>{tl('landing_observe_caption')}</p>
          </Reveal>
          <Reveal className="caja caja-ancha" delay={0.08}>
            <h3>
              {tl('landing_trust_title_lead')} <span>{tl('landing_trust_title_accent')}</span>
            </h3>
            <p>{tl('landing_trust_subtitle')}</p>
          </Reveal>
          {facts.map((fact, index) => (
            <Reveal key={fact.label} className="caja" delay={index * 0.06}>
              <b>{fact.value}</b>
              <span>{fact.label}</span>
              <p>{fact.note}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How it works: the hand inside a panel ────────────────────────────────── */
function HowItWorks(): React.ReactElement {
  const steps = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <section className="como" id="como-funciona">
      <div className="ancho">
        <Reveal className="cabeza">
          <Tag>{tl('landing_showcase_section_label')}</Tag>
          <Heading
            lead={tl('landing_showcase_title_lead')}
            accent={tl('landing_showcase_title_accent')}
          />
          <p className="parrafo">
            {tl('landing_showcase_subtitle_lead')}{' '}
            <strong>{tl('landing_showcase_subtitle_strong')}</strong>
            {tl('landing_showcase_subtitle_tail')}
          </p>
        </Reveal>

        <Reveal className="panel-mano">
          <PiloPose pose="anota" width={168} className="pilo pilo-panel" />
          <div className="panel-papel" aria-hidden="true" />
          <ul className="libro" aria-label={tl('landing_journey_today_head')}>
            {TUESDAY.map((m) => (
              <li key={m.hour}>
                <span>{m.hour}</span>
                <span>{m.merchant}</span>
                <Cop n={m.amount} />
              </li>
            ))}
            <li className="libro-total">
              <span />
              <span>{tl('landing_journey_today_head')}</span>
              <Cop n={TUESDAY_TOTAL} />
            </li>
          </ul>
          {/* Decorative: the ledger next to it says the same in text. */}
          <Image
            className="mano"
            src="/images/landing/pago.webp"
            alt=""
            width={1200}
            height={900}
            sizes="(max-width: 700px) 90vw, 620px"
          />
        </Reveal>

        <div className="pasos">
          <Reveal className="pasos-col pasos-antes">
            <h3>{tl('landing_shift_manual_title')}</h3>
            <ol>
              {steps.map((n) => (
                <li key={n}>
                  <span>{n}</span>
                  <s>{tk(`landing_shift_manual_step_${n}`)}</s>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="pasos-col pasos-pilo" delay={0.12}>
            <h3>{tl('landing_shift_pilo_title')}</h3>
            <ol>
              {steps.map((n) => (
                <li key={n}>
                  <span>{n}</span>
                  {tk(`landing_shift_pilo_step_${n}`)}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Press and see ────────────────────────────────────────────────────────── */
function Demo(): React.ReactElement {
  return (
    <section className="demo">
      <div className="ancho demo-caja">
        <div className="demo-nubes" style={{ backgroundImage: `url(${SKY})` }} aria-hidden="true" />
        <Reveal className="demo-texto">
          <Heading lead={tl('landing_phone_title')} accent="" />
          <p className="parrafo">{tl('landing_phone_subtitle')}</p>
          <dl className="demo-datos">
            <div>
              <dd>0</dd>
              <dt>{tl('landing_phone_stat_screens')}</dt>
            </div>
            <div>
              <dd>0</dd>
              <dt>{tl('landing_phone_stat_forms')}</dt>
            </div>
            <div>
              <dd>{tl('landing_phone_stat_encrypted_value')}</dd>
              <dt>{tl('landing_phone_stat_encrypted_label')}</dt>
            </div>
          </dl>
          <SignUpButton />
        </Reveal>
        <Reveal className="telefono" delay={0.15}>
          <DemoPhone />
        </Reveal>
      </div>
    </section>
  );
}

/* ── Banks, at night ──────────────────────────────────────────────────────── */
function Banks(): React.ReactElement {
  const stars: [string, boolean][] = [
    ['Bancolombia', true],
    ['Banco de Bogotá', true],
    ['Telegram', true],
    ['Davivienda', false],
    ['Scotiabank Colpatria', false],
    ['Falabella', false],
  ];

  return (
    <section className="bancos-noche" id="bancos">
      <div className="noche-fondo" style={{ backgroundImage: `url(${NIGHT})` }} aria-hidden="true" />
      <span className="luna" aria-hidden="true" />
      <div className="ancho bancos-dentro">
        <Reveal className="bancos-cabeza">
          <div>
            <Tag>{tl('landing_nav_banks')}</Tag>
            <Heading lead={tl('landing_banks_title_lead')} accent={tl('landing_banks_title_accent')} />
            <p className="parrafo">{tl('landing_banks_subtitle')}</p>
          </div>
          <PiloPose pose="sorprendido" width={170} className="pilo pilo-lado" />
        </Reveal>

        <BanksArrival />

        <Reveal className="cielo-bancos">
          <ul className="estrellas" aria-label={tl('landing_banks_pending')}>
            {stars.map(([name, ready]) => (
              <li key={name} className={ready ? 'encendida' : ''}>
                <i />
                <b>{name}</b>
                {!ready && <small>{tl('landing_journey_statement_cost')}</small>}
              </li>
            ))}
          </ul>
          <p className="bancos-nota">{tl('landing_banks_note')}</p>
          <SignUpButton large />
        </Reveal>
      </div>
    </section>
  );
}

/* ── Privacy ──────────────────────────────────────────────────────────────── */
function Privacy(): React.ReactElement {
  const who: [string, boolean][] = [
    [tl('landing_vault_who_you'), true],
    [tl('landing_vault_who_advertisers'), false],
    [tl('landing_vault_who_third_parties'), false],
  ];
  const rows = ['tu', 'x', 'tu', 'x', 'x', 'tu'];

  return (
    <section className="privacidad" id="privacidad">
      <div className="ancho">
        <Reveal className="cabeza">
          <Tag>{tl('landing_nav_privacy')}</Tag>
          <Heading lead={tl('landing_vault_title_lead')} accent={tl('landing_vault_title_accent')} />
          <p className="parrafo">{tl('landing_vault_subtitle')}</p>
        </Reveal>
        <div className="bento">
          <Reveal className="celda celda-cero">
            <b>0</b>
            <h3>{tl('landing_vault_zero_label')}</h3>
            <p>{tl('landing_vault_zero_text')}</p>
          </Reveal>
          <Reveal className="celda" delay={0.06}>
            <h3>{tl('landing_vault_bank_key_title')}</h3>
            <p>{tl('landing_vault_bank_key_text')}</p>
          </Reveal>
          <Reveal className="celda" delay={0.12}>
            <div className="archivo">
              <span>{tl('landing_vault_export_file')}</span>
              <small>{tl('landing_vault_export_meta')}</small>
            </div>
            <h3>{tl('landing_vault_export_title')}</h3>
            <p>{tl('landing_vault_export_text')}</p>
          </Reveal>
          <Reveal className="celda celda-ancha" delay={0.06}>
            <div>
              <h3>{tl('landing_vault_isolation_title')}</h3>
              <p>{tl('landing_vault_isolation_text')}</p>
            </div>
            <ul className="filas" aria-hidden="true">
              {rows.map((row, index) => (
                <li key={index} className={row === 'tu' ? 'tu' : ''}>
                  {row === 'tu' ? tl('landing_vault_isolation_row_you') : '•••'}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="celda" delay={0.12}>
            <h3>{tl('landing_vault_who_title')}</h3>
            <p>{tl('landing_vault_who_text')}</p>
            <ul className="quien" aria-label={tl('landing_vault_who_label')}>
              {who.map(([name, sees]) => (
                <li key={name} className={sees ? 've' : ''}>
                  <span>{name}</span>
                  <small>
                    {sees ? tl('landing_vault_who_sees') : tl('landing_vault_who_not_sees')}
                  </small>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Questions ────────────────────────────────────────────────────────────── */
function Questions(): React.ReactElement {
  return (
    <section className="preguntas" id="preguntas">
      <div className="ancho preguntas-rejilla">
        <Reveal className="preguntas-lado">
          <Heading lead={tl('landing_faq_title_lead')} accent={tl('landing_faq_title_accent')} />
          <div className="contacto">
            <PiloPose pose="feliz" width={84} className="pilo pilo-feliz" />
            <p>{tl('landing_faq_byline')}</p>
          </div>
        </Reveal>
        <Faq />
      </div>
    </section>
  );
}

/* ── What comes next (not built) ──────────────────────────────────────────── */
function Insights(): React.ReactElement {
  const ideas = ['habit', 'recurring', 'projection'] as const;

  return (
    <section className="entender">
      <div className="ancho">
        <Reveal className="cabeza">
          <Heading
            lead={tl('landing_insight_title_lead')}
            accent={tl('landing_insight_title_accent')}
          />
          <p className="parrafo aviso-futuro">{tl('landing_insight_subtitle')}</p>
        </Reveal>
        <div className="ideas">
          {ideas.map((key, index) => (
            <Reveal key={key} className="idea" delay={index * 0.1}>
              <span>0{index + 1}</span>
              <blockquote>{tk(`landing_insight_${key}_quote`)}</blockquote>
              <p>{tk(`landing_insight_${key}_desc`)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Closing and footer ───────────────────────────────────────────────────── */
function Footer(): React.ReactElement {
  return (
    <footer className="pie" aria-label={tl('landing_footer_label')}>
      <div className="pie-gigante" aria-hidden="true">
        PILO
      </div>
      <div className="pie-trama" style={{ backgroundImage: `url(${NIGHT})` }} aria-hidden="true" />
      <div className="ancho pie-dentro">
        <Reveal className="pie-cierre">
          <PiloPose pose="celebra" width={150} className="pilo pilo-celebra" />
          <h2>
            {tl('landing_footer_title_lead')} <span>{tl('landing_footer_title_accent')}</span>
          </h2>
          <p>{tl('landing_footer_subtitle')}</p>
          <SignUpButton large />
        </Reveal>
        <div className="pie-columnas">
          <div className="pie-marca">
            <Brand />
          </div>
          <div>
            <h3>{tl('landing_footer_how_heading')}</h3>
            <a href="#como-funciona">{tl('landing_footer_how_zero_touch')}</a>
            <a href="#martes">{tl('landing_footer_how_telegram')}</a>
            <a href="#preguntas">{tl('landing_footer_how_faq')}</a>
          </div>
          <div>
            <h3>{tl('landing_footer_privacy_heading')}</h3>
            <a href="#privacidad">{tl('landing_footer_privacy_isolation')}</a>
            <a href="#privacidad">{tl('landing_footer_privacy_no_sale')}</a>
            <a href="#privacidad">{tl('landing_footer_privacy_encrypted')}</a>
            <a href="#privacidad">{tl('landing_footer_privacy_no_bank')}</a>
            <Link href="/privacidad">{tl('landing_footer_privacy_policy')}</Link>
          </div>
          <div>
            <h3>{tl('landing_footer_access_heading')}</h3>
            <Link href="/sign-in">{tl('landing_footer_access_sign_in')}</Link>
            <Link href="/sign-in">{tl('landing_footer_access_dashboard')}</Link>
          </div>
        </div>
        <div className="pie-legal">
          <span>
            © 2026 Pilo. {tl('landing_footer_rights')}
          </span>
          <span>{tl('landing_footer_made_by')}</span>
        </div>
      </div>
    </footer>
  );
}

/**
 * The public page, "Cielo despejado".
 *
 * Mostly server components: only the five pieces that respond to the visitor
 * (the word reveal, the Tuesday line, the phone, the banks and the questions)
 * ship JavaScript, and none of them needs an animation library.
 */
export function LandingSky(): React.ReactElement {
  return (
    <>
      <Hero />
      <main>
        <Manifesto />
        <Tuesday />
        <HowItWorks />
        <Demo />
        <Banks />
        <Privacy />
        <Questions />
        <Insights />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
