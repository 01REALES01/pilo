'use client';

import React, { useEffect, useRef } from 'react';

/**
 * The statement lights up word by word as it crosses the screen.
 *
 * The scroll position becomes one CSS variable on the heading; each word works
 * out its own opacity from it in CSS. One style write per frame, no re-render,
 * no library.
 */
export function ManifestoWords({ text }: { text: string }): React.ReactElement {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1');
      return;
    }

    let frame = 0;
    const update = (): void => {
      frame = 0;
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight;
      // From the heading's top at 90% of the screen to its top at 25%.
      const progress = (vh * 0.9 - top) / (vh * 0.65);
      el.style.setProperty('--p', String(Math.min(1, Math.max(0, progress))));
    };
    const onScroll = (): void => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <h2 ref={ref} className="palabras" style={{ '--n': words.length } as React.CSSProperties}>
      {words.map((word, index) => (
        <span key={index} style={{ '--i': index } as React.CSSProperties}>
          {word}{' '}
        </span>
      ))}
    </h2>
  );
}
