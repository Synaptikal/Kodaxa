/**
 * floating-cta.tsx
 * T2-03 — Floating persistent CTA pill.
 * One concern: scroll-triggered floating action button directing to corp application.
 *
 * Uses accent (teal) border + text = Kodaxa corporate chrome.
 * Background uses sr-surface token for consistency with other panels.
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
          bg-sr-surface/90 backdrop-blur-sm
          border border-accent/40
          font-mono text-xs tracking-[0.2em] uppercase text-accent
          hover:bg-accent/10 transition-colors duration-200
          before:absolute before:top-0 before:left-0 before:w-2.5 before:h-2.5
          before:border-t-2 before:border-l-2 before:border-accent
          after:absolute after:bottom-0 after:right-0 after:w-2.5 after:h-2.5
          after:border-b-2 after:border-r-2 after:border-accent
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-state-available
        "
        tabIndex={visible ? 0 : -1}
      >
        Apply to Kodaxa →
      </a>
    </div>
  );
}
