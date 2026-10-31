'use client';

import React, { useEffect, useRef, useState } from 'react';

import { PiloPose } from '@/components/landing/pilo-pose';
import { tl } from '@/lib/i18n-landing';

// One key for the whole sentence, split here: word order and word count
// change between languages, so a key per word could not be translated.
const STATEMENT_WORDS = tl('landing_understand_statement').split(' ');

/**
 * Chapter 03 — "Understand".
 *
 * The word-by-word reveal stays (it is the one immersive beat worth keeping),
 * but it no longer runs a per-frame rAF loop that setState'd the scroll
 * progress 60 times a second. An IntersectionObserver fires it ONCE when the
 * block enters, then disconnects. The words are fully legible with no JS and
 * under prefers-reduced-motion — the effect only animates their entrance, it
 * never gates the content behind scroll position (DESIGN_SYSTEM.md §5.4).
 */
export function LandingSectionUnderstand(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  // `armed` is only true once JS has run: without it the words render at full
  // opacity (no-JS readers get the content, not a dim placeholder).
  const [armed, setArmed] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    setArmed(true);

    if (!('IntersectionObserver' in window)) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="chapter-understand"
      ref={sectionRef}
      className={`landing-chapter landing-chapter--understand ${armed ? 'is-armed' : ''} ${revealed ? 'is-revealed' : ''}`}
      aria-label={tl('landing_understand_section_label')}
    >
      <div className="landing-reveal-stage">
        <PiloPose pose="pensando" width={128} className="landing-pilo--understand" />

        <p className="landing-reveal-statement">
          {STATEMENT_WORDS.map((word, i) => (
            <React.Fragment key={`${word}-${i}`}>
              {i > 0 ? ' ' : null}
              <span className="landing-reveal-word" style={{ transitionDelay: `${i * 55}ms` }}>
                {word}
              </span>
            </React.Fragment>
          ))}
        </p>

        <p className="landing-reveal-subhead">
          {tl('landing_understand_subtitle')}
        </p>
      </div>
    </section>
  );
}
