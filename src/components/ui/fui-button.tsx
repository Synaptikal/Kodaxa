/**
 * fui-button.tsx
 * T1-03 — FUI corner bracket ghost button.
 * One concern: EVE Online-style ghost buttons with ⌐ ¬ corner bracket marks.
 *
 * Replaces all secondary/ghost button styles site-wide.
 * The amber "OPEN COMMS" primary nav button is exempt.
 *
 * Usage:
 *   <FUIButton href="/items">View All →</FUIButton>
 *   <FUIButton onClick={handleClick}>Execute</FUIButton>
 */

import type { ReactNode } from 'react';

interface FUIButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  /** 'ghost' (default) — teal outline + bracket corners */
  variant?: 'ghost';
  className?: string;
  /** Forward aria-label for icon-only usage */
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const BASE =
  'relative inline-flex items-center gap-2 ' +
  'px-5 py-2 font-mono text-xs tracking-[0.2em] uppercase ' +
  'text-[#00d4c8] transition-all duration-200 cursor-pointer ' +
  'shadow-[inset_0_0_0_1px_rgba(0,212,200,0.35)] ' +
  'hover:bg-[#00d4c8]/10 hover:shadow-[inset_0_0_0_1px_rgba(0,212,200,0.7),0_0_16px_rgba(0,212,200,0.15)] ' +
  // top-left bracket
  'before:absolute before:top-0 before:left-0 before:w-2.5 before:h-2.5 ' +
  'before:border-t-2 before:border-l-2 before:border-[#00d4c8] ' +
  // bottom-right bracket
  'after:absolute after:bottom-0 after:right-0 after:w-2.5 after:h-2.5 ' +
  'after:border-b-2 after:border-r-2 after:border-[#00d4c8] ' +
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent';

export function FUIButton({
  children,
  href,
  onClick,
  className = '',
  'aria-label': ariaLabel,
  type = 'button',
  disabled,
}: FUIButtonProps) {
  const cls = `${BASE} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cls}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
