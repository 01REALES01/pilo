import type { Metadata } from 'next';
import React from 'react';

import './landing.css';
import { CinematicVideoCanvas } from '@/components/landing/cinematic-video-canvas';
import { LandingGrandFinaleFooter } from '@/components/landing/landing-grand-finale-footer';
import { LandingProductShowcase } from '@/components/landing/landing-product-showcase';
import { LandingSectionEnter } from '@/components/landing/landing-section-enter';
import { LandingSectionObserve } from '@/components/landing/landing-section-observe';
import { LandingSectionTrust } from '@/components/landing/landing-section-trust';
import { LandingSectionUnderstand } from '@/components/landing/landing-section-understand';
import { LandingTopBar } from '@/components/landing/landing-top-bar';
import { tl } from '@/lib/i18n-landing';

const DESCRIPTION = tl('landing_meta_description');
const TITLE = tl('landing_meta_title');

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/',
    languages: { 'es-CO': '/', 'x-default': '/' },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    siteName: 'Pilo',
    locale: 'es_CO',
    type: 'website',
    images: [{ url: '/images/og.jpg', width: 1200, height: 630, alt: tl('landing_meta_og_image_alt') }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/images/og.jpg'],
  },
};

/**
 * JSON-LD for the public landing (CLAUDE.md → "Descubrimiento").
 * `offers.price: 0` states the current reality (free while it is one person's
 * project); update it when pricing exists rather than inventing a number now.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Pilo',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web, iOS, Android',
  description: DESCRIPTION,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP' },
};

export default function LandingPage(): React.ReactElement {
  return (
    <div className="landing-experience">
      <script
        type="application/ld+json"
        // Static, no user input — safe to inline.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CinematicVideoCanvas />
      <LandingTopBar />

      <div id="cinematic-track" className="landing-cinematic-track">
        <LandingSectionEnter />
        <LandingSectionObserve />
        <LandingSectionUnderstand />
        <LandingSectionTrust />
      </div>

      <LandingProductShowcase />
      <LandingGrandFinaleFooter />
    </div>
  );
}
