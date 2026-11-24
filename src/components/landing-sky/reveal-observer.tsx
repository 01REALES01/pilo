'use client';

import { useEffect } from 'react';

/**
 * Marks every `.aparece` block as seen when it enters the viewport.
 *
 * One observer for the page instead of a hook per block: the blocks stay plain
 * markup, and the page ships one small effect rather than an animation library
 * (P7; DESIGN_SYSTEM.md 5.5).
 */
export function RevealObserver(): null {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>('.sky .aparece');
    if (!('IntersectionObserver' in window)) {
      blocks.forEach((el) => el.classList.add('visto'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visto');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -60px 0px' },
    );
    blocks.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
