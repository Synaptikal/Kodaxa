/**
 * tooltip.tsx
 * Reusable hover tooltip wrapping any element.
 * One concern: positioning a styled tooltip above/below its trigger.
 */

'use client';

import { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'right';
  className?: string;
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Hide on scroll so the tooltip doesn't float away from its trigger
  useEffect(() => {
    if (!visible) return;
    const hide = () => setVisible(false);
    window.addEventListener('scroll', hide, { capture: true, passive: true });
    return () => window.removeEventListener('scroll', hide, { capture: true });
  }, [visible]);

  const positionClass =
    side === 'bottom'
      ? 'top-full mt-1.5'
      : side === 'right'
        ? 'left-full ml-1.5 top-0'
        : 'bottom-full mb-1.5';

  return (
    <span
      ref={ref}
      className={`relative inline-flex items-center ${className ?? ''}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={`
            pointer-events-none absolute z-50 ${positionClass}
            left-0 w-max max-w-[220px]
            rounded-md bg-slate-900 border border-slate-600
            px-2.5 py-1.5 text-[11px] leading-snug text-slate-200
            shadow-lg shadow-black/40
          `}
        >
          {content}
        </span>
      )}
    </span>
  );
}
