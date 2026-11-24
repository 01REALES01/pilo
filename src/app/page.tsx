import type { Metadata } from 'next';
import React from 'react';

import './landing-sky.css';
import { Instrument_Serif, Inter, JetBrains_Mono } from 'next/font/google';
import ReactDOM from 'react-dom';

import { LandingSky } from '@/components/landing-sky/landing-sky';
import { tl } from '@/lib/i18n-landing';

// The landing's own type, loaded only here: the app keeps its two families and
// does not pay for these three.
const serif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sky-serif',
});
const sans = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sky-sans' });
const mono = JetBrains_Mono({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sky-mono',
});

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
  // The sky behind the headline is a CSS background, which the browser only
  // discovers after the stylesheet: preloading it keeps the first screen from
  // painting as a flat colour and then changing.
  ReactDOM.preload('/images/landing/cielo.png', { as: 'image', fetchPriority: 'high' });

  return (
    <div className={`sky ${serif.variable} ${sans.variable} ${mono.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Without JavaScript nothing marks the blocks as seen, so they are
          simply shown. */}
      <noscript>
        <style>{'.sky .aparece,.sky .panel-mano .libro li{opacity:1;transform:none}.sky .palabras span{opacity:1}'}</style>
      </noscript>
      <LandingSky />
    </div>
  );
}
