'use client';

// Update state/label/detail when playtest status changes.
const STATUS_CONFIG = {
  state: 'FROZEN' as const,
  label: 'Playtest Paused',
  detail: 'Active testers only',
  color: '#d4903c',
  pulse: false,
};

export function PlaytestStatusWidget() {
  const { label, detail, color, pulse } = STATUS_CONFIG;

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-none select-none">
      <div
        className="
          bg-sr-bg/85 backdrop-blur-sm
          border border-sr-border/50
          px-3 py-2
          shadow-[0_0_16px_rgba(232,164,74,0.06)]
        "
      >
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pulse ? 'animate-pulse' : ''}`}
            style={{ backgroundColor: color }}
          />
          <span
            className="text-[9px] font-mono uppercase tracking-[0.2em]"
            style={{ color }}
          >
            {label}
          </span>
        </div>
        <p className="mt-0.5 text-[9px] font-mono text-sr-muted/60 tracking-[0.05em]">
          {detail}
        </p>
      </div>
    </div>
  );
}
