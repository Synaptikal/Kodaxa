/**
 * stat-block.tsx
 * T2-06 — Animated stat block with IntersectionObserver reveal.
 * One concern: teal number stat display that animates in on scroll entry.
 *
 * Color: accent (teal) = Kodaxa corporate data display.
 * Label uses sr-muted (WCAG AA compliant).
 */

'use client';

import { useEffect, useState, useRef } from 'react';

interface StatBlockProps {
  value: string;
  label: string;
  icon?: string;
  sublabel?: string;
  className?: string;
}

export function StatBlock({ value, label, icon, sublabel, className = '' }: StatBlockProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`flex flex-col items-center gap-1 text-center ${className}`}>
      {icon && (
        <span className="text-accent/50 text-lg font-mono" aria-hidden="true">
          {icon}
        </span>
      )}
      <span
        className={`
          font-mono font-bold text-3xl text-accent tracking-[0.05em]
          transition-all duration-700
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
      >
        {value}
      </span>
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-sr-muted">
        {label}
      </span>
      {sublabel && (
        <span className="font-mono text-[10px] text-sr-muted/60">{sublabel}</span>
      )}
    </div>
  );
}
