import React from 'react';

import { tl } from '@/lib/i18n-landing';

/**
 * Chapter 02 — "Observe".
 *
 * Was a client component running an infinite requestAnimationFrame loop that
 * called getBoundingClientRect() and setState() on every frame to nudge the
 * headline a few pixels (a 60/s React re-render for a decorative parallax).
 * The parallax added nothing a reader notices and cost a frame budget on
 * exactly the surface — scroll — where it hurts. It is now a static section.
 */
export function LandingSectionObserve(): React.ReactElement {
  return (
    <section id="chapter-observe" className="landing-chapter landing-chapter--observe" aria-label={tl('landing_observe_section_label')}>
      <div className="landing-kinetic-stage">
        <div className="landing-kinetic-hero-row">
          <h2 className="landing-kinetic-headline">
            {tl('landing_observe_title_lead')} <span className="landing-thesis-gold-highlight">{tl('landing_observe_title_accent')}</span>
          </h2>
        </div>

        <div className="landing-kinetic-caption">
          <p>
            {tl('landing_observe_caption')}
          </p>
        </div>
      </div>
    </section>
  );
}
