/**
 * profession-list.tsx
 * Sidebar panel listing all professions grouped by category.
 * One concern: browsing and selecting professions to view in the tree canvas.
 *
 * Receives profession summaries and the currently active profession(s).
 * Dispatches selection events upward to the planner page.
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Tooltip } from '@/components/ui/tooltip';
import type { ProfessionSummary, ProfessionCategory } from '@/types/skill-tree';

/** Human-readable labels for each category */
const CATEGORY_LABELS: Record<ProfessionCategory, string> = {
  scouting: 'Scouting',
  combat: 'Combat',
  crafting: 'Crafting',
  harvesting: 'Harvesting',
  social: 'Social',
  science: 'Science',
  infrastructure: 'Infrastructure',
};

/** Category display order */
const CATEGORY_ORDER: ProfessionCategory[] = [
  'scouting',
  'combat',
  'crafting',
  'harvesting',
  'social',
  'science',
  'infrastructure',
];

/** Color accents per category */
const CATEGORY_COLORS: Record<ProfessionCategory, string> = {
  scouting: 'text-emerald-400 border-emerald-500/30',
  combat: 'text-red-400 border-red-500/30',
  crafting: 'text-orange-400 border-orange-500/30',
  harvesting: 'text-lime-400 border-lime-500/30',
  social: 'text-sky-400 border-sky-500/30',
  science: 'text-violet-400 border-violet-500/30',
  infrastructure: 'text-amber-400 border-amber-500/30',
};

export interface ProfessionListProps {
  professions: ProfessionSummary[];
  /** Currently selected profession IDs shown in the canvas */
  selectedIds: string[];
  /** Called when user clicks a profession to toggle its visibility */
  onToggle: (professionId: string) => void;
}

export function ProfessionList({
  professions,
  selectedIds,
  onToggle,
}: ProfessionListProps) {
  /** Group professions by category */
  const grouped = useMemo(() => {
    const map = new Map<ProfessionCategory, ProfessionSummary[]>();
    for (const cat of CATEGORY_ORDER) {
      map.set(cat, []);
    }
    for (const prof of professions) {
      const list = map.get(prof.category);
      if (list) list.push(prof);
    }
    return map;
  }, [professions]);

  return (
    <div className="flex flex-col gap-3 overflow-y-auto">
      <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider px-1 flex items-center gap-1">
        Professions
        <Tooltip content="Click a profession to load its skill tree on the canvas. Multiple professions can be open at once. The number on the right shows how many skills it has." side="right">
          <span className="text-slate-500 hover:text-slate-300 cursor-help text-[10px]">?</span>
        </Tooltip>
      </h2>

      {CATEGORY_ORDER.map((cat) => {
        const items = grouped.get(cat);
        if (!items || items.length === 0) return null;
        const colorClass = CATEGORY_COLORS[cat];

        return (
          <div key={cat}>
            <h3
              className={`text-xs font-medium uppercase tracking-wide mb-1 px-1 ${colorClass.split(' ')[0]}`}
            >
              {CATEGORY_LABELS[cat]}
            </h3>
            <ul className="space-y-0.5">
              {items.map((prof) => (
                <ProfessionItem
                  key={prof.id}
                  profession={prof}
                  isSelected={selectedIds.includes(prof.id)}
                  categoryColor={colorClass}
                  onToggle={onToggle}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/** Individual profession row */
function ProfessionItem({
  profession,
  isSelected,
  categoryColor,
  onToggle,
}: {
  profession: ProfessionSummary;
  isSelected: boolean;
  categoryColor: string;
  onToggle: (id: string) => void;
}) {
  const handleClick = useCallback(() => {
    onToggle(profession.id);
  }, [onToggle, profession.id]);

  return (
    <li>
      <button
        onClick={handleClick}
        className={`
          w-full text-left px-2 py-1.5 rounded-md text-xs
          transition-colors duration-150
          flex items-center justify-between gap-2
          ${
            isSelected
              ? `bg-slate-700/80 border border-l-2 ${categoryColor}`
              : 'hover:bg-slate-800 border border-transparent'
          }
        `}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <span className={`truncate ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>
            {profession.name}
          </span>
          {!profession.implemented && (
            <span className="shrink-0 text-[9px] text-purple-400 font-medium">
              WIP
            </span>
          )}
        </span>
        <span className="text-[10px] text-slate-500 tabular-nums shrink-0">
          {profession.nodeCount}
        </span>
      </button>
    </li>
  );
}
