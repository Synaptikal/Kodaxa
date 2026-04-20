/**
 * building-toolbar.tsx
 * Floating mode toolbar with tile cap counter and hotkey hints.
 * One concern: providing mode switching, undo/redo, and cap status at a glance.
 */

'use client';

import {
  PlusIcon,
  MinusIcon,
  HandIcon,
  Undo2Icon,
  Redo2Icon,
  RotateCcwIcon,
  PaintBucketIcon,
  MousePointer2Icon,
  PipetteIcon,
  RulerIcon,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { BuildingMode } from '@/types/building';
import { TILE_CAP, TILE_CAP_WARNING } from '@/data/building';

type LucideIcon = React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;

interface BuildingToolbarProps {
  mode: BuildingMode;
  onSetMode: (mode: BuildingMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onRotate?: () => void;
  /** Total tiles placed (for cap counter) */
  tileCount?: number;
}

const MODES: {
  id: BuildingMode;
  icon: LucideIcon;
  label: string;
  key: string;
}[] = [
  { id: 'place',       icon: PlusIcon,           label: 'Place',    key: 'Q' },
  { id: 'erase',       icon: MinusIcon,           label: 'Erase',    key: 'E' },
  { id: 'fill',        icon: PaintBucketIcon,     label: 'Fill',     key: 'F' },
  { id: 'select',      icon: MousePointer2Icon,   label: 'Select',   key: 'S' },
  { id: 'eyedropper',  icon: PipetteIcon,         label: 'Pick',     key: 'I' },
  { id: 'pan',         icon: HandIcon,            label: 'Pan',      key: 'V' },
  { id: 'measure',     icon: RulerIcon,           label: 'Measure',  key: 'M' },
];

export function BuildingToolbar({
  mode,
  onSetMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onRotate,
  tileCount = 0,
}: BuildingToolbarProps) {
  const atWarning  = tileCount >= TILE_CAP_WARNING;
  const atCap      = tileCount >= TILE_CAP;

  const capColor = atCap
    ? 'text-red-400 border-red-700/60 bg-red-900/20'
    : atWarning
    ? 'text-amber-400 border-amber-700/60 bg-amber-900/20'
    : 'text-slate-500 border-sr-border bg-sr-surface';

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-0 bg-sr-bg border border-sr-border shadow-2xl z-10">

      {/* Mode buttons */}
      <div className="flex items-center gap-0 border-r border-sr-border">
        {MODES.map(({ id, icon: Icon, label, key }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSetMode(id)}
            title={`${label} (${key})`}
            className={`relative flex flex-col items-center justify-center w-11 h-11 transition-colors border-r border-sr-border/50 last:border-r-0 ${
              mode === id
                ? 'bg-cyan-600/20 text-cyan-300'
                : 'text-slate-500 hover:text-slate-300 hover:bg-sr-surface'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[7px] font-mono uppercase tracking-widest mt-0.5 leading-none">
              {label}
            </span>
            {/* Hotkey hint */}
            <span className={`absolute top-0.5 right-1 text-[6px] font-mono leading-none ${
              mode === id ? 'text-cyan-600' : 'text-slate-700'
            }`}>
              {key}
            </span>
          </button>
        ))}
      </div>

      {/* Rotate */}
      {onRotate && (
        <button
          onClick={onRotate}
          title="Rotate Tile (R)"
          className="flex flex-col items-center justify-center w-11 h-11 text-cyan-500 hover:text-cyan-300 hover:bg-sr-surface border-r border-sr-border transition-colors"
        >
          <RotateCcwIcon className="w-4 h-4" />
          <span className="text-[7px] font-mono uppercase tracking-widest mt-0.5">Rot</span>
          <span className="absolute top-0.5 right-1 text-[6px] font-mono text-slate-700">R</span>
        </button>
      )}

      {/* Undo / Redo */}
      <div className="flex items-center border-r border-sr-border">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="flex flex-col items-center justify-center w-11 h-11 text-slate-500 hover:text-slate-300 hover:bg-sr-surface disabled:opacity-25 disabled:cursor-not-allowed transition-colors border-r border-sr-border/50"
        >
          <Undo2Icon className="w-4 h-4" />
          <span className="text-[7px] font-mono uppercase tracking-widest mt-0.5">Undo</span>
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="flex flex-col items-center justify-center w-11 h-11 text-slate-500 hover:text-slate-300 hover:bg-sr-surface disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <Redo2Icon className="w-4 h-4" />
          <span className="text-[7px] font-mono uppercase tracking-widest mt-0.5">Redo</span>
        </button>
      </div>

      {/* Tile cap counter */}
      <div className={`flex flex-col items-center justify-center px-3 h-11 border-l border-sr-border font-mono text-center ${capColor}`}>
        <span className="text-[11px] font-bold tabular-nums leading-none">
          {tileCount}
          <span className="text-[9px] font-normal opacity-60">/{TILE_CAP}</span>
        </span>
        <span className="text-[7px] uppercase tracking-widest mt-0.5 leading-none">
          {atCap ? 'CAP HIT' : atWarning ? 'NEAR CAP' : 'Tiles'}
        </span>
      </div>

    </div>
  );
}
