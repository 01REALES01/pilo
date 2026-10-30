import Link from 'next/link';
import React from 'react';

import { tl } from '@/lib/i18n-landing';

/**
 * El héroe.
 *
 * NN/g (eyetracking): la gente abandona entre los 10 y los 20 segundos salvo
 * que la propuesta de valor quede clara en esos primeros 10, y el 74% del
 * tiempo de atención se gasta en los dos primeros scrolls. Lo que había aquí
 * —«Your money, made clear»— está en inglés en una página en español y podría
 * ser cualquier app de finanzas desde 2010: gastaba el momento de más
 * atención de toda la página sin decir qué hace el producto.
 *
 * Y NN/g otra vez, sobre los CTA vagos: «un enlace es una promesa». El botón
 * dice exactamente lo que pasa al pulsarlo, y debajo va lo que el usuario
 * necesita saber ANTES de decidir — qué cuesta, qué hace falta y qué NO le
 * vamos a pedir. Baymard: esas señales convierten junto al botón, no en el
 * pie de página.
 */
export function LandingSectionEnter(): React.ReactElement {
  return (
    <section id="chapter-enter" className="landing-chapter" aria-label={tl('landing_hero_section_label')}>
      <div className="landing-hero-stage">
        {/* Palabras de display flanqueando el teléfono del vídeo. Decorativas:
            el <h1> de abajo lleva la frase real para SEO y lectores. */}
        <div className="landing-hand-flank-row" aria-hidden="true">
          <span className="landing-word-giant landing-word-left">{tl('landing_hero_flank_left')}</span>
          <div className="landing-phone-spacer" />
          <span className="landing-word-giant landing-word-right">{tl('landing_hero_flank_right')}</span>
        </div>

        <div className="landing-hero-bottom">
          <h1 className="landing-word-center">
            {tl('landing_hero_title')}
          </h1>

          <p className="landing-word-subhead">
            {tl('landing_hero_subtitle')}
          </p>

          <Link href="/sign-in" className="landing-gold-cta-btn">
            <span>{tl('landing_cta_sign_up_email')}</span>
            <span aria-hidden="true"> →</span>
          </Link>

          {/* Lo que hace falta saber antes de pulsar, no después. */}
          <ul className="landing-hero-facts">
            <li className="landing-hero-fact">{tl('landing_hero_fact_free')}</li>
            <li className="landing-hero-fact">{tl('landing_hero_fact_code')}</li>
            <li className="landing-hero-fact">{tl('landing_hero_fact_no_bank_key')}</li>
          </ul>

          <p className="landing-hero-caveat">
            {tl('landing_hero_caveat')}
          </p>
        </div>
      </div>
    </section>
  );
}
