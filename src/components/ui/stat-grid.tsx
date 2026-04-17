/**
 * stat-grid.tsx
 * Grid of key-value stat pairs for displaying entity properties.
 * One concern: compact visual layout for multiple labeled statistics.
 *
 * Used in skill detail panel, item cards, creature cards, recipe cards, etc.
 */

export interface StatEntry {
  label: string;
  value: string | number;
  /** Optional accent color class for the value */
  valueColor?: string;
  /** Show a dimmed "N/A" for missing values */
  hideIfEmpty?: boolean;
}

export interface StatGridProps {
  stats: StatEntry[];
  /** Number of columns (defaults to 2) */
  cols?: 2 | 3 | 4;
  /** Overall size variant */
  size?: 'xs' | 'sm';
}

const COL_CLASSES: Record<NonNullable<StatGridProps['cols']>, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

export function StatGrid({ stats, cols = 2, size = 'xs' }: StatGridProps) {
  const filtered = stats.filter((s) => {
    if (!s.hideIfEmpty) return true;
    const v = s.value;
    return v !== undefined && v !== null && v !== '' && v !== 0;
  });

  if (filtered.length === 0) return null;

  const labelClass = size === 'xs' ? 'text-[9px]' : 'text-[10px]';
  const valueClass = size === 'xs' ? 'text-xs' : 'text-sm';

  return (
    <div className={`grid ${COL_CLASSES[cols]} gap-x-3 gap-y-2`}>
      {filtered.map((stat, i) => (
        <div key={`${stat.label}-${i}`} className="flex flex-col gap-0.5">
          <span className={`${labelClass} text-slate-500 uppercase tracking-wider leading-none`}>
            {stat.label}
          </span>
          <span
            className={`${valueClass} font-mono font-medium leading-tight ${
              stat.valueColor ?? 'text-slate-200'
            }`}
          >
            {stat.value === '' || stat.value === null || stat.value === undefined
              ? '—'
              : stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
