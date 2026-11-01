'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import { tl } from '@/lib/i18n-landing';

const NAV_LINKS = [
  { label: tl('landing_nav_how_it_works'), href: '#features-zero-touch' },
  { label: tl('landing_nav_banks'), href: '#features-card' },
  { label: tl('landing_nav_privacy'), href: '#features-security' },
  { label: tl('landing_nav_faq'), href: '#features-faq' },
];

/**
 * Adaptive Navigation for Pilo Landing:
 *
 *  - Desktop (> 768px): Centered luxury glass capsule pinned at the top.
 *  - Mobile (<= 768px): Clean minimal logo at the top, and a floating glass
 *    capsule dock at the bottom with quick menu trigger and thumb-friendly CTA.
 */
export function LandingTopBar(): React.ReactElement {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isOverDay, setIsOverDay] = useState<boolean>(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setIsScrolled(!entry.isIntersecting);
      },
      { rootMargin: '-40px 0px 0px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Over the light "day" band the capsule takes its light skin. The sentinel
  // (.landing-day-zone) leaves out the dark dawn and dusk joints, so the
  // switch happens where the background actually turns light. The root is a
  // 1px line at the capsule's height (it sits 16-68px from the top); it is
  // rebuilt on resize because rootMargin cannot take a percentage minus px.
  useEffect(() => {
    const zone = document.querySelector('.landing-day-zone');
    if (!zone || !('IntersectionObserver' in window)) return;
    let observer: IntersectionObserver | undefined;
    const observe = (): void => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry) setIsOverDay(entry.isIntersecting);
        },
        { rootMargin: `-42px 0px -${Math.max(0, window.innerHeight - 43)}px 0px` },
      );
      observer.observe(zone);
    };
    observe();
    window.addEventListener('resize', observe);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', observe);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" style={{ position: 'absolute', top: 0, height: 1, width: 1 }} />

      {/* Top Header: Full capsule on Desktop, ultra-minimal brand-only on Mobile */}
      <header
        className={`landing-top-bar ${isOverDay ? 'landing-top-bar--light' : 'landing-top-bar--dark'} ${isScrolled ? 'landing-top-bar--scrolled' : ''}`}
      >
        <div className="landing-top-bar-inner">
          <Link href="/" className="landing-brand" aria-label="Pilo">
            {/* The app icon itself, not a separate logo: one mark everywhere
                until the vector redraw (docs/PILO.md §8.2). */}
            <Image
              className="landing-brand-mark"
              src="/icons/icon-192.png"
              alt=""
              width={28}
              height={28}
            />
            <span className="landing-brand-text">Pilo</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="landing-desktop-nav" aria-label={tl('landing_nav_main_label')}>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="landing-nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Top CTA */}
          <div className="landing-top-actions">
            <Link href="/sign-in" className="landing-top-cta">
              <span>{tl('landing_cta_sign_up')}</span>
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Floating Bottom Dock (Phone-friendly, avoids notch and puts CTA at thumb height) */}
      <aside className="landing-mobile-bottom-dock" aria-label={tl('landing_nav_mobile_dock_label')}>
        <button
          type="button"
          className="landing-mobile-dock-btn landing-mobile-dock-menu"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label={isMobileOpen ? tl('landing_nav_menu_close_label') : tl('landing_nav_menu_open_label')}
          aria-expanded={isMobileOpen}
        >
          <svg
            className="landing-dock-menu-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {isMobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </>
            )}
          </svg>
          <span>{isMobileOpen ? tl('landing_nav_menu_close') : tl('landing_nav_menu_open')}</span>
        </button>

        <Link href="/sign-in" className="landing-mobile-dock-cta">
          <span>{tl('landing_cta_sign_up')}</span>
          <span aria-hidden="true"> →</span>
        </Link>
      </aside>

      {/* Mobile Drawer */}
      <div
        className={`landing-mobile-drawer ${isMobileOpen ? 'landing-mobile-drawer--open' : ''}`}
        aria-hidden={!isMobileOpen}
      >
        <div className="landing-mobile-drawer-content">
          <div className="landing-mobile-drawer-header">
            <span className="landing-drawer-title">{tl('landing_nav_drawer_title')}</span>
            <button
              type="button"
              className="landing-drawer-close-btn"
              onClick={() => setIsMobileOpen(false)}
              aria-label={tl('landing_nav_drawer_close_label')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="landing-mobile-nav" aria-label={tl('landing_nav_mobile_label')}>
            {NAV_LINKS.map((link, idx) => (
              <a
                key={link.href}
                href={link.href}
                className="landing-mobile-nav-link"
                style={{ transitionDelay: isMobileOpen ? `${40 + idx * 30}ms` : '0ms' }}
                onClick={() => setIsMobileOpen(false)}
              >
                <span>{link.label}</span>
                <span className="landing-mobile-nav-arrow">→</span>
              </a>
            ))}
          </nav>

          <div className="landing-mobile-drawer-footer">
            <Link
              href="/sign-in"
              className="landing-mobile-cta-btn"
              onClick={() => setIsMobileOpen(false)}
            >
              {tl('landing_cta_sign_up_email')} →
            </Link>
            <div className="landing-mobile-trust-note">
              <span>{tl('landing_nav_trust_no_bank_key')}</span>
              <span>·</span>
              <span>{tl('landing_nav_trust_no_ads')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
