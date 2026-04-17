/**
 * filter-pill.tsx
 * Toggleable pill button for filter selections.
 * One concern: active/inactive filter toggle with consistent styling.
 *
 * Used for station filters, profession filters, biome filters, etc.
 */

'use client';

export interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  /** Optional count shown in pill */
  count?: number;
  /** Color accent for active state */
  accent?: 'cyan' | 'teal' | 'amber' | 'violet' | 'orange' | 'sky' | 'emerald';
}

const ACCENT_ACTIVE: Record<NonNullable<FilterPillProps['accent']>, string> = {
  cyan: 'bg-cyan-800/50 text-cyan-200 border-cyan-700',
  teal: 'bg-teal-800/50 text-teal-200 border-teal-700',
  amber: 'bg-amber-800/50 text-amber-200 border-amber-700',
  violet: 'bg-violet-800/50 text-violet-200 border-violet-700',
  orange: 'bg-orange-800/50 text-orange-200 border-orange-700',
  sky: 'bg-sky-800/50 text-sky-200 border-sky-700',
  emerald: 'bg-emerald-800/50 text-emerald-200 border-emerald-700',
};

export function FilterPill({
  label,
  active,
  onClick,
  count,
  accent = 'cyan',
}: FilterPillProps) {
  const activeClass = ACCENT_ACTIVE[accent];

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        border text-xs font-medium transition-colors
        ${
          active
            ? activeClass
            : 'bg-slate-800/30 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-300'
        }
      `}
    >
      {label}
      {count !== undefined && (
        <span
          className={`
            text-[10px] font-mono tabular-nums
            ${active ? 'opacity-70' : 'text-slate-600'}
          `}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/** A row of filter pills with an optional "All" reset pill */
export interface FilterPillGroupProps {
  options: { id: string; label: string; count?: number }[];
  selected: string[];
  onToggle: (id: string) => void;
  onClear?: () => void;
  accent?: FilterPillProps['accent'];
  showAll?: boolean;
}

export function FilterPillGroup({
  options,
  selected,
  onToggle,
  onClear,
  accent = 'cyan',
  showAll = true,
}: FilterPillGroupProps) {
  const allActive = selected.length === 0;

  return (
    <div className="flex flex-wrap gap-1.5">
      {showAll && onClear && (
        <FilterPill
          label="All"
          active={allActive}
          onClick={onClear}
          accent={accent}
        />
      )}
      {options.map((opt) => (
        <FilterPill
          key={opt.id}
          label={opt.label}
          active={selected.includes(opt.id)}
          onClick={() => onToggle(opt.id)}
          count={opt.count}
          accent={accent}
        />
      ))}
    </div>
  );
}
