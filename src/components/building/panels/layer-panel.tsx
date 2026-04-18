/**
 * layer-panel.tsx
 * Layer list with rename, visibility toggle, and active layer selection.
 * One concern: managing which floor layer is active and visible.
 */

'use client';

import { useState } from 'react';
import { Edit2Icon, CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import type { ClaimLayer, PlacedCell } from '@/types/building';

interface LayerPanelProps {
  layers: ClaimLayer[];
  activeLayer: number;
  hiddenLayers: number[];
  cells: PlacedCell[];
  onSetActiveLayer: (layerIndex: number) => void;
  onRenameLayer: (layerIndex: number, label: string) => void;
  onToggleLayerVisibility: (layerIndex: number) => void;
}

export function LayerPanel({
  layers,
  activeLayer,
  hiddenLayers,
  cells,
  onSetActiveLayer,
  onRenameLayer,
  onToggleLayerVisibility,
}: LayerPanelProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (index: number, currentLabel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditValue(currentLabel);
  };

  const handleSaveEdit = (index: number, e?: React.MouseEvent | React.FormEvent) => {
    e?.stopPropagation();
    if (editValue.trim()) onRenameLayer(index, editValue.trim());
    setEditingIndex(null);
  };

  // Reverse so top floor sits at the top of the list
  const displayLayers = [...layers].reverse();

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="px-3 py-2 border-b border-sr-border">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-sr-muted mb-0.5">
          Layers
        </p>
        <p className="text-xs font-mono text-slate-500">
          {cells.length} cells placed
        </p>
      </div>

      <div className="flex flex-col gap-0">
        {displayLayers.map((layer) => {
          const isActive  = activeLayer === layer.index;
          const isHidden  = hiddenLayers.includes(layer.index);
          const cellCount = cells.filter((c) => c.y === layer.index).length;
          const isEditing = editingIndex === layer.index;

          return (
            <div
              key={layer.index}
              onClick={() => onSetActiveLayer(layer.index)}
              className={`group flex items-center gap-2 px-3 py-2 border-b border-sr-border/50 cursor-pointer transition-colors ${
                isActive
                  ? 'bg-cyan-950/30 border-l-2 border-l-cyan-500'
                  : 'hover:bg-sr-surface border-l-2 border-l-transparent'
              }`}
            >
              {/* Color swatch */}
              <div className={`w-3 h-3 shrink-0 border border-black/30 ${layer.color}`} />

              {/* Index */}
              <span className={`text-xs font-mono w-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-sr-muted'}`}>
                {layer.index >= 0 ? `+${layer.index}` : layer.index}
              </span>

              {/* Label / edit input */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSaveEdit(layer.index); }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1"
                  >
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleSaveEdit(layer.index)}
                      className="flex-1 min-w-0 bg-sr-bg border border-sr-border px-1.5 py-0.5 text-xs font-mono text-slate-200 focus:border-cyan-700 focus:outline-none"
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => handleSaveEdit(layer.index, e)}
                      className="text-cyan-500 hover:text-cyan-300 shrink-0"
                    >
                      <CheckIcon className="w-3 h-3" />
                    </button>
                  </form>
                ) : (
                  <span className={`text-xs font-mono truncate block ${
                    isActive ? 'text-slate-200 font-semibold' : isHidden ? 'text-sr-muted' : 'text-slate-400'
                  }`}>
                    {layer.label}
                  </span>
                )}
              </div>

              {/* Cell count */}
              {cellCount > 0 && (
                <span className="text-xs font-mono text-slate-700 shrink-0 tabular-nums">
                  {cellCount}
                </span>
              )}

              {/* Controls (visibility + rename) */}
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleLayerVisibility(layer.index); }}
                  title={isHidden ? 'Show layer' : 'Hide layer'}
                  className={`p-0.5 transition-colors ${isHidden ? 'text-slate-600 hover:text-slate-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {isHidden
                    ? <EyeOffIcon className="w-3 h-3" />
                    : <EyeIcon className="w-3 h-3" />
                  }
                </button>
                {!isEditing && (
                  <button
                    onClick={(e) => handleStartEdit(layer.index, layer.label, e)}
                    className="p-0.5 text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    <Edit2Icon className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
