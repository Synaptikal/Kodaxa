/**
 * sticky-sub-nav.tsx
 * T2-05 — Sticky in-page sub-navigation with IntersectionObserver active state.
 * One concern: per-page section navigation that tracks scroll position.
 *
 * Active tab uses accent (teal) = Kodaxa corporate UI chrome.
 * Inactive tabs use sr-muted (WCAG AA compliant).
 * Background uses sr-bg / sr-surface tokens for consistency.
 */

'use client';

import { useState, useEffect } from 'react';

export interface SubNavSection {
  id: string;
  label: string;
}

interface StickySubNavProps {
  sections: SubNavSection[];
  className?: string;
}

export function StickySubNav({ sections, className = '' }: StickySubNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div
      className={`sticky top-[48px] z-40 bg-sr-bg/95 backdrop-blur-sm border-b border-sr-border ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex gap-0 overflow-x-auto">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`
              font-mono text-xs tracking-[0.2em] uppercase px-4 py-3 whitespace-nowrap
              border-b-2 transition-all duration-150
              ${
                active === s.id
                  ? 'text-accent border-accent'
                  : 'text-sr-muted border-transparent hover:text-sr-text'
              }
            `}
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
