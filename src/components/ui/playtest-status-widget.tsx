/**
 * playtest-status-widget.tsx
 * T2-02 — Pinned playtest status corner widget.
 * One concern: persistent bottom-left status indicator for Stars Reach playtest state.
 *
 * Corner brackets use accent/50 = Kodaxa corporate chrome framing.
 * Background uses sr-surface token. Muted text uses sr-muted (WCAG AA).
 * Status dot color is set dynamically per STATUS_CONFIG — not tied to accent.
 *
 * States:
 *   LIVE      → color: accent (#00d4c8), pulse: true
 *   FROZEN    → color: brand-amber (#f59e0b), pulse: false
 *   WAVE_OPEN → color: accent (#00d4c8), pulse: true
 *   OFFLINE   → color: #f87171 (red), pulse: false
 */

'use client';

// ── Update this config when playtest status changes ───────────────────
const STATUS_CONFIG = {
  state: 'FROZEN' as const,
  label: 'Invites Paused',
  detail: 'Active testers only',
  // amber for FROZEN = status-only use of brand-amber, per the token contract
  color: '#f59e0b',
  pulse: false,
};

export function PlaytestStatusWidget() {
  const { state, detail, color, pulse } = STATUS_CONFIG;

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-none select-none">
      <div
        className="
          relative bg-sr-surface/90 backdrop-blur-sm
          border border-sr-border p-3
          font-mono text-xs
          before:absolute before:top-0 before:left-0 before:w-2 before:h-2
          before:border-t before:border-l before:border-accent/50
          after:absolute after:bottom-0 after:right-0 after:w-2 after:h-2
          after:border-b after:border-r after:border-accent/50
        "
      >
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${pulse ? 'animate-pulse' : ''}`}
            style={{ backgroundColor: color }}
          />
          <span className="tracking-[0.15em] text-sr-muted">PLAYTEST</span>
        </div>
        <div className="tracking-[0.1em] font-bold" style={{ color }}>
          {state}
        </div>
        <div className="text-sr-muted tracking-[0.08em] text-[10px] mt-0.5">
          {detail}
        </div>
      </div>
    </div>
  );
}
