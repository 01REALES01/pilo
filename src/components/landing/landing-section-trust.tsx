import Link from 'next/link';
import React from 'react';

import { tl } from '@/lib/i18n-landing';

export function LandingSectionTrust(): React.ReactElement {
  return (
    <section id="chapter-trust" className="landing-chapter landing-chapter--trust" aria-label={tl('landing_trust_section_label')}>
      <div className="landing-horizon-stage" style={{ alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 20 }}>
        <h2 className="landing-horizon-headline" style={{ textAlign: 'center' }}>
          {tl('landing_trust_title_lead')}<br />
          <span className="landing-thesis-gold-highlight" style={{ color: 'var(--landing-champagne-gold)' }}>{tl('landing_trust_title_accent')}</span>
        </h2>

        <p className="landing-word-subhead" style={{ margin: '0 auto 36px auto', maxWidth: '580px' }}>
          {tl('landing_trust_subtitle')}
        </p>

        <Link href="/sign-in" className="landing-gold-cta-btn">
          <span>{tl('landing_cta_sign_up_email')}</span>
          <span aria-hidden="true"> →</span>
        </Link>
      </div>

      {/* Seamless Diffuse Transition Mist into the rest of the page (behind stage) */}
      <div className="landing-diffuse-transition" aria-hidden="true" style={{ zIndex: 1 }} />
    </section>
  );
}
