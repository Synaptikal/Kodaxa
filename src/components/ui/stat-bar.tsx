/**
 * stat-bar.tsx
 * Horizontal labeled progress bar for displaying game stats (P/Q/R/V, etc.).
 * One concern: visual representation of a single numeric stat with label.
 *
 * Used in Crafting Calc (resource stats), Item Database, Creature Database.
 */

export interface StatBarProps {
  label: string;
  /** Short 1-2 letter symbol shown before the label */
  symbol?: string;
  value: number;
  /** Max value for the progress bar (defaults to 100) */
  max?: number;
  /** Tailwind color class for the bar fill */
  color?: string;
  /** Show numeric value text */
  showValue?: boolean;
  /** Display value as percentage */
  asPercent?: boolean;
}

export function StatBar({
  label,
  symbol,
  value,
  max = 100,
  color = 'bg-cyan-500',
  showValue = true,
  asPercent = false,
}: StatBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const displayValue = asPercent ? `${Math.round(pct)}%` : String(value);

  return (
    <div className="flex items-center gap-2 min-w-0">
      {/* Label */}
      <div className="flex items-center gap-1 w-16 shrink-0">
        {symbol && (
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
            {symbol}
          </span>
        )}
        <span className="text-[10px] text-slate-400 truncate">{label}</span>
      </div>

      {/* Bar */}
      <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Value */}
      {showValue && (
        <span className="text-[10px] font-mono text-slate-400 w-8 text-right shrink-0">
          {displayValue}
        </span>
      )}
    </div>
  );
}

/** A group of stat bars for displaying P/Q/R/V resource stats */
export interface ResourceStatsProps {
  productivity: number;
  quality: number;
  randomness: number;
  versatility: number;
  max?: number;
}

const PQRV_DEFS = [
  { key: 'productivity', symbol: 'P', label: 'Productivity', color: 'bg-teal-500' },
  { key: 'quality',      symbol: 'Q', label: 'Quality',      color: 'bg-cyan-500' },
  { key: 'randomness',   symbol: 'R', label: 'Randomness',   color: 'bg-violet-500' },
  { key: 'versatility',  symbol: 'V', label: 'Versatility',  color: 'bg-amber-500' },
] as const;

export function ResourceStatBars({ productivity, quality, randomness, versatility, max = 100 }: ResourceStatsProps) {
  const vals: Record<string, number> = { productivity, quality, randomness, versatility };
  return (
    <div className="space-y-1">
      {PQRV_DEFS.map((d) => (
        <StatBar
          key={d.key}
          label={d.label}
          symbol={d.symbol}
          value={vals[d.key]}
          max={max}
          color={d.color}
        />
      ))}
    </div>
  );
}
