/**
 * playtest-status-widget.tsx
 * T2-02 — Pinned playtest status corner widget.
 * One concern: persistent bottom-left status indicator for Stars Reach playtest state.
 *
 * Inspired by Lando Norris "NEXT RACE" bottom-left corner card (Awwwards SOTY 2025).
 * Static config object — update STATUS_CONFIG when playtest status changes.
 *
 * States:
 *   LIVE       → teal color, pulse: true,  label "New Wave Open"
 *   FROZEN     → amber,      pulse: false, label "Invites Paused"
 *   WAVE_OPEN  → teal color, pulse: true,  label "Applications Open"
 *   OFFLINE    → red,        pulse: false, label "Build Offline"
 *
 * Placement: layout.tsx, outside scroll container, alongside <StarField />.
 */

'use client';

// ── Update this config when playtest status changes ───────────────────
const STATUS_CONFIG = {
  state: 'FROZEN' as const,
  label: 'Invites Paused',
  detail: 'Active testers only',
  color: '#f59e0b',
  pulse: false,
};

export function PlaytestStatusWidget() {
  const { state, detail, color, pulse } = STATUS_CONFIG;

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-none select-none">
      <div
        className="
          relative bg-[#0e1320]/90 backdrop-blur-sm
          border border-[#1a2535] p-3
          font-mono text-xs
          before:absolute before:top-0 before:left-0 before:w-2 before:h-2
          before:border-t before:border-l before:border-[#00d4c8]/50
          after:absolute after:bottom-0 after:right-0 after:w-2 after:h-2
          after:border-b after:border-r after:border-[#00d4c8]/50
        "
      >
        {/* Header row */}
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${pulse ? 'animate-pulse' : ''}`}
            style={{ backgroundColor: color }}
          />
          <span className="tracking-[0.15em] text-[#64748b]">PLAYTEST</span>
        </div>

        {/* State label */}
        <div className="tracking-[0.1em] font-bold" style={{ color }}>
          {state}
        </div>

        {/* Detail */}
        <div className="text-[#64748b] tracking-[0.08em] text-[10px] mt-0.5">
          {detail}
        </div>
      </div>
    </div>
  );
}
