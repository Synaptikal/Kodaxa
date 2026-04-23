/**
 * floating-cta.tsx
 * T2-03 — Floating persistent CTA pill.
 * One concern: scroll-triggered floating action button directing to corp application.
 *
 * Inspired by Lando Norris "BUSINESS ENQUIRIES →" bottom-center pin.
 * Appears after scrolling 300px — does not show on page load.
 * FUI corner brackets match the ghost button system (T1-03).
 *
 * Placement: layout.tsx alongside <PlaytestStatusWidget />.
 */

'use client';

import { useState, useEffect } from 'react';

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 z-50
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      aria-hidden={!visible}
    >
      <a
        href="/corp/join"
        className="
          relative flex items-center gap-2 px-5 py-2
          bg-[#0e1320]/90 backdrop-blur-sm
          border border-[#00d4c8]/40
          font-mono text-xs tracking-[0.2em] uppercase text-[#00d4c8]
          hover:bg-[#00d4c8]/10 transition-colors duration-200
          before:absolute before:top-0 before:left-0 before:w-2.5 before:h-2.5
          before:border-t-2 before:border-l-2 before:border-[#00d4c8]
          after:absolute after:bottom-0 after:right-0 after:w-2.5 after:h-2.5
          after:border-b-2 after:border-r-2 after:border-[#00d4c8]
        "
        tabIndex={visible ? 0 : -1}
      >
        Apply to Kodaxa →
      </a>
    </div>
  );
}
