/**
 * stat-block.tsx
 * T2-06 — Animated stat block with IntersectionObserver reveal.
 * One concern: teal number stat display that animates in on scroll entry.
 *
 * Inspired by EVE Online (icon → teal number → small-caps label).
 * Used on homepage hero stat row — replaces the static number display.
 *
 * Usage:
 *   <StatBlock icon="◈" value="266+" label="ITEMS INDEXED" sublabel="across 12 categories" />
 *   <StatBlock icon="▸" value="ALPHA" label="BUILD PHASE" />
 */

'use client';

import { useEffect, useState, useRef } from 'react';

interface StatBlockProps {
  /** Display value — e.g. "266+" or "36" or "ALPHA" */
  value: string;
  /** Small-caps label below the value */
  label: string;
  /** Optional symbol/icon above the value — e.g. "◈" */
  icon?: string;
  /** Optional secondary label below the main label */
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
        <span className="text-[#00d4c8]/50 text-lg font-mono" aria-hidden="true">
          {icon}
        </span>
      )}
      <span
        className={`
          font-mono font-bold text-3xl text-[#00d4c8] tracking-[0.05em]
          transition-all duration-700
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
      >
        {value}
      </span>
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#64748b]">
        {label}
      </span>
      {sublabel && (
        <span className="font-mono text-[10px] text-[#64748b]/60">{sublabel}</span>
      )}
    </div>
  );
}
