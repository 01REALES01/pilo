import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { t } from '@/lib/i18n';
import { tl } from '@/lib/i18n-landing';

export function LandingGrandFinaleFooter(): React.ReactElement {
  return (
    <footer id="grand-finale" className="landing-grand-finale" aria-label={tl('landing_footer_label')}>
      <div className="landing-finale-top-blend" aria-hidden="true" />

      {/* Panoramic horizon. Art-directed: a portrait crop on phones (from
          footer_mobile_re), the wide shot on larger screens. Each is served
          only at its breakpoint via CSS. */}
      <div className="landing-finale-bg-wrap" aria-hidden="true">
        <Image
          src="/images/footer-mobile.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="landing-finale-bg-img landing-finale-bg-img--mobile"
          priority={false}
        />
        <Image
          src="/images/footer.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="landing-finale-bg-img landing-finale-bg-img--desktop"
          priority={false}
          quality={75}
        />
        <div className="landing-finale-vignette" />
      </div>

      <div className="landing-finale-stage">
        <div className="landing-finale-glass-card">
          <div className="landing-finale-emblem-wrap">
            <Image
              className="landing-finale-emblem"
              src="/icons/icon-192.png"
              alt=""
              width={40}
              height={40}
            />
            <span className="landing-finale-emblem-text">Pilo</span>
          </div>

          <h2 className="landing-finale-title">
            {tl('landing_footer_title_lead')} <br />
            <span className="landing-finale-gold-accent">{tl('landing_footer_title_accent')}</span>
          </h2>

          <p className="landing-finale-subtitle">
            {tl('landing_footer_subtitle')}
          </p>

          <div className="landing-finale-cta-group">
            <Link href="/sign-in" className="landing-gold-cta-btn landing-finale-cta-btn">
              <span>{tl('landing_cta_sign_up_email')}</span>
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>

        <div className="landing-finale-nav-grid">
          <div className="landing-finale-nav-col">
            <h4 className="landing-finale-nav-heading">{tl('landing_footer_how_heading')}</h4>
            <a href="#features-zero-touch" className="landing-finale-nav-item">{tl('landing_footer_how_zero_touch')}</a>
            <a href="#features-telegram" className="landing-finale-nav-item">{tl('landing_footer_how_telegram')}</a>
            <a href="#features-faq" className="landing-finale-nav-item">{tl('landing_footer_how_faq')}</a>
          </div>

          <div className="landing-finale-nav-col">
            <h4 className="landing-finale-nav-heading">{tl('landing_footer_privacy_heading')}</h4>
            <span className="landing-finale-nav-item">{tl('landing_footer_privacy_isolation')}</span>
            <span className="landing-finale-nav-item">{tl('landing_footer_privacy_no_sale')}</span>
            <span className="landing-finale-nav-item">{tl('landing_footer_privacy_encrypted')}</span>
            <span className="landing-finale-nav-item">{tl('landing_footer_privacy_no_bank')}</span>
            <Link href="/privacidad" className="landing-finale-nav-item">
              {t('auth_consent_link')}
            </Link>
          </div>

          <div className="landing-finale-nav-col">
            <h4 className="landing-finale-nav-heading">{tl('landing_footer_access_heading')}</h4>
            <Link href="/sign-in" className="landing-finale-nav-item">{tl('landing_footer_access_sign_in')}</Link>
            <Link href="/sign-in" className="landing-finale-nav-item">{tl('landing_footer_access_dashboard')}</Link>
          </div>
        </div>

        <div className="landing-finale-bottom-bar">
          <div className="landing-finale-copy">
            <span>© {new Date().getFullYear()} Pilo. {tl('landing_footer_rights')}</span>
            <span className="landing-finale-copy-divider">·</span>
            <span>{tl('landing_footer_made_by')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
