/**
 * tool-tracker.tsx
 * Sidebar widget showing the 5 equipped tool slots and their Specials.
 * One concern: displaying and managing the player's tool loadout.
 *
 * Stars Reach limits players to 5 tools, each with up to 2 Specials.
 * This tracker shows what's equipped and highlights empty slots.
 */

'use client';

import { useCallback } from 'react';
import { TOOL_CAP, SPECIALS_PER_TOOL } from '@/lib/skill-engine';
import { Tooltip } from '@/components/ui/tooltip';
import type { Build, ToolSlot } from '@/types/build';

export interface ToolTrackerProps {
  build: Build;
  /** Called when user wants to change a tool slot */
  onSlotClick?: (slotIndex: number) => void;
}

export function ToolTracker({ build, onSlotClick }: ToolTrackerProps) {
  const filledCount = build.toolSlots.filter((s) => s.professionId).length;

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
          Tool Loadout
          <Tooltip content="Equip up to 5 profession tools. Each tool grants access to 2 Specials — powerful passive abilities from that profession's tree.">
            <span className="text-slate-500 hover:text-slate-300 cursor-help text-[10px]">?</span>
          </Tooltip>
        </h3>
        <span className="text-sm font-mono text-slate-400">
          {filledCount}
          <span className="text-slate-600">/{TOOL_CAP}</span>
        </span>
      </div>

      <div className="space-y-1.5">
        {build.toolSlots.map((slot, index) => (
          <ToolSlotRow
            key={index}
            slot={slot}
            index={index}
            onSlotClick={onSlotClick}
          />
        ))}
      </div>
    </div>
  );
}

/** Individual tool slot row */
function ToolSlotRow({
  slot,
  index,
  onSlotClick,
}: {
  slot: ToolSlot;
  index: number;
  onSlotClick?: (index: number) => void;
}) {
  const handleClick = useCallback(() => {
    onSlotClick?.(index);
  }, [onSlotClick, index]);

  const isEmpty = !slot.professionId;
  const specials = slot.activeSpecials.filter(Boolean);
  const emptySpecials = SPECIALS_PER_TOOL - specials.length;

  return (
    <button
      onClick={handleClick}
      className={`
        w-full text-left px-2 py-1.5 rounded-md text-xs
        transition-colors duration-150 flex flex-col gap-0.5
        ${
          isEmpty
            ? 'border border-dashed border-slate-600 text-slate-600 hover:border-slate-500'
            : 'border border-slate-600 bg-slate-700/50 hover:bg-slate-700'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <span className={isEmpty ? 'text-slate-600' : 'text-slate-200'}>
          {isEmpty ? `Slot ${index + 1} — Empty` : slot.toolName}
        </span>
        <span className="text-[9px] text-slate-500 font-mono">
          {index + 1}/{TOOL_CAP}
        </span>
      </div>

      {!isEmpty && (
        <div className="flex gap-1 mt-0.5">
          {specials.map((s, i) => (
            <span
              key={i}
              className="inline-block rounded bg-amber-800/40 px-1 py-0.5 text-[9px] text-amber-300"
            >
              {s}
            </span>
          ))}
          {Array.from({ length: emptySpecials }).map((_, i) => (
            <span
              key={`empty-${i}`}
              className="inline-block rounded border border-dashed border-slate-600 px-1 py-0.5 text-[9px] text-slate-600"
            >
              Special
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
