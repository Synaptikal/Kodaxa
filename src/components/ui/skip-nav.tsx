'use client';

/**
 * skip-nav.tsx
 * WCAG 2.4.1 — skip-to-content link for keyboard and screen reader users.
 * One concern: render a visually-hidden anchor that reveals on focus.
 *
 * Target: <main id="main-content"> in layout.tsx.
 */

export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        fixed top-2 left-2 z-[9999]
        px-4 py-2
        text-xs font-mono font-semibold tracking-wide uppercase
        bg-state-available text-sr-bg
        rounded-sm
        focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-state-available
        transition-all
      "
    >
      Skip to content
    </a>
  );
}
