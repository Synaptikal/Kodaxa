'use client';

/**
 * relay-ticker.tsx
 * Ambient scrolling status bar — signals "live system" to the viewer.
 * One concern: CSS-animated marquee of in-world relay messages.
 *
 * Pure presentational. No state, no data fetching.
 * Animation defined in globals.css (.relay-ticker-track / @keyframes ticker-scroll).
 */

type RelayTickerProps = {
  messages: string[];
  className?: string;
};

export function RelayTicker({ messages, className = '' }: RelayTickerProps) {
  // Duplicate the message list so the loop is seamless (first half visible → second half picks up exactly)
  const doubled = [...messages, ...messages];
  const line = doubled.map((m) => `> ${m}`).join('  ·  ');

  return (
    <div
      className={`overflow-hidden border-t border-sr-border/30 bg-sr-bg/60 ${className}`}
      aria-hidden="true"
    >
      <div className="relay-ticker-track py-1.5">
        <span className="text-[9px] font-mono text-slate-600 tracking-[0.12em] uppercase px-8">
          {line}
        </span>
      </div>
    </div>
  );
}
