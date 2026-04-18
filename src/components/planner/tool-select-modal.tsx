/**
 * tool-select-modal.tsx
 * Modal dialog for equipping a tool into a slot.
 * One concern: letting the player pick/swap one of 5 tool slots.
 *
 * Stars Reach limits players to 5 tools simultaneously.
 * Each profession requires its own tool — skills without a matching
 * equipped tool generate a validation warning.
 *
 * Shows all professions' tools grouped by category, highlights
 * which tools are already in other slots, and lets user pick one.
 */

'use client';

import { useEffect, useCallback, useMemo } from 'react';
import type { Profession, ProfessionCategory } from '@/types/skill-tree';
import type { ToolSlot } from '@/types/build';

const CATEGORY_LABELS: Record<ProfessionCategory, string> = {
  scouting:       'Scouting',
  combat:         'Combat',
  crafting:       'Crafting',
  harvesting:     'Harvesting',
  social:         'Social',
  science:        'Science',
  infrastructure: 'Infrastructure',
};

const CATEGORY_ORDER: ProfessionCategory[] = [
  'combat', 'crafting', 'harvesting', 'scouting', 'science', 'social', 'infrastructure',
];

const CATEGORY_COLORS: Record<ProfessionCategory, string> = {
  scouting:       'text-emerald-400',
  combat:         'text-red-400',
  crafting:       'text-orange-400',
  harvesting:     'text-lime-400',
  social:         'text-sky-400',
  science:        'text-violet-400',
  infrastructure: 'text-amber-400',
};

export interface ToolSelectModalProps {
  /** Which slot index we're editing (0–4) */
  slotIndex: number;
  /** Current tool slots for showing conflicts */
  toolSlots: ToolSlot[];
  /** All professions to show as tool options */
  professions: Profession[];
  /** Called when user picks a tool */
  onEquip: (slotIndex: number, profession: Profession) => void;
  /** Called to clear the slot */
  onClear: (slotIndex: number) => void;
  /** Called to close without saving */
  onClose: () => void;
}

export function ToolSelectModal({
  slotIndex,
  toolSlots,
  professions,
  onEquip,
  onClear,
  onClose,
}: ToolSelectModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  const currentSlot = toolSlots[slotIndex];
  const otherSlotProfIds = new Set(
    toolSlots
      .filter((_, i) => i !== slotIndex && !!_.professionId)
      .map((s) => s.professionId),
  );

  // Group professions by category, only implemented ones first
  const grouped = useMemo(() => {
    const map = new Map<ProfessionCategory, Profession[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const prof of professions) {
      map.get(prof.category)?.push(prof);
    }
    return map;
  }, [professions]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md max-h-[80vh] flex flex-col border border-slate-600 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700">
          <div>
            <h2 className="text-sm font-bold text-slate-100">Tool Loadout — Slot {slotIndex + 1}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Pick a profession tool to equip</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tool list */}
        <div className="overflow-y-auto flex-1 p-3 space-y-3">
          {CATEGORY_ORDER.map((cat) => {
            const profs = grouped.get(cat);
            if (!profs || profs.length === 0) return null;
            return (
              <div key={cat}>
                <h3 className={`text-[10px] font-medium uppercase tracking-wider mb-1 px-1 ${CATEGORY_COLORS[cat]}`}>
                  {CATEGORY_LABELS[cat]}
                </h3>
                <ul className="space-y-1">
                  {profs.map((prof) => {
                    const isCurrent = currentSlot?.professionId === prof.id;
                    const inOtherSlot = otherSlotProfIds.has(prof.id);
                    return (
                      <li key={prof.id}>
                        <button
                          onClick={() => !inOtherSlot && onEquip(slotIndex, prof)}
                          disabled={inOtherSlot}
                          className={`
                            w-full text-left px-3 py-2 text-xs
                            flex items-center justify-between gap-2
                            transition-colors duration-150
                            ${isCurrent
                              ? 'border border-teal-500/60 bg-teal-900/40 text-teal-200'
                              : inOtherSlot
                                ? 'border border-transparent bg-slate-800/30 text-slate-600 cursor-not-allowed'
                                : 'border border-transparent bg-slate-800/50 text-slate-300 hover:bg-slate-700/60 hover:text-slate-100'}
                          `}
                        >
                          <div className="min-w-0">
                            <span className="font-medium block truncate">{prof.name}</span>
                            <span className="text-[10px] opacity-60 block truncate">{prof.tool.name}</span>
                          </div>
                          <div className="shrink-0 flex items-center gap-1.5">
                            {!prof.implemented && (
                              <span className="text-[9px] text-purple-400">WIP</span>
                            )}
                            {isCurrent && (
                              <span className="text-[9px] text-teal-400 font-mono">✓ Equipped</span>
                            )}
                            {inOtherSlot && (
                              <span className="text-[9px] text-slate-500">In slot {toolSlots.findIndex(s => s.professionId === prof.id) + 1}</span>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-slate-700">
          {currentSlot?.professionId ? (
            <button
              onClick={() => onClear(slotIndex)}
              className="text-xs px-3 py-1.5 rounded bg-red-900/30 text-red-400 border border-red-800/40 hover:bg-red-900/50 transition-colors"
            >
              Clear Slot
            </button>
          ) : (
            <span className="text-xs text-slate-600">No tool equipped</span>
          )}
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
