/**
 * skill-detail-panel.tsx
 * Floating detail panel that appears when a skill node is selected.
 * One concern: displaying full skill info (name, description, cost, state).
 *
 * Appears as an overlay in the bottom-right of the canvas area.
 * Dismissed by clicking elsewhere or pressing Escape.
 */

'use client';

import { useEffect } from 'react';
import type { SkillNode } from '@/types/skill-tree';
import type { SkillNodeState } from '@/types/skill-tree';
import type { Build } from '@/types/build';

const STATE_LABEL: Record<SkillNodeState, string> = {
  locked:           'Locked',
  available:        'Available',
  in_practice:      'In Practice',
  out_of_practice:  'Out of Practice',
  wip:              'Under Development',
};

const STATE_COLOR: Record<SkillNodeState, string> = {
  locked:           'text-slate-400 bg-slate-800/60 border-slate-600',
  available:        'text-cyan-300 bg-cyan-900/30 border-cyan-500/40',
  in_practice:      'text-teal-300 bg-teal-900/40 border-teal-500/40',
  out_of_practice:  'text-amber-300 bg-amber-900/30 border-amber-500/40',
  wip:              'text-purple-300 bg-purple-900/30 border-purple-500/40',
};

const ACTION_LABEL: Record<SkillNodeState, string | null> = {
  locked:           null,
  available:        'Click node to add to build',
  in_practice:      'Click node to set out of practice',
  out_of_practice:  'Click node to reactivate',
  wip:              null,
};

export interface SkillDetailPanelProps {
  node: SkillNode | null;
  nodeState: SkillNodeState | null;
  build: Build;
  /** Profession name for display */
  professionName: string;
  onClose: () => void;
}

export function SkillDetailPanel({
  node,
  nodeState,
  build,
  professionName,
  onClose,
}: SkillDetailPanelProps) {
  // Close on Escape
  useEffect(() => {
    if (!node) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [node, onClose]);

  if (!node || !nodeState) return null;

  const stateColor  = STATE_COLOR[nodeState];
  const stateLabel  = STATE_LABEL[nodeState];
  const actionLabel = ACTION_LABEL[nodeState];

  const xpCost = node.costs?.exp    ?? 0;
  const klaatu = node.costs?.klaatu ?? 0;

  return (
    <div
      className={`
        absolute bottom-4 right-4 z-10
        w-72 border bg-slate-900/95 backdrop-blur-sm shadow-2xl
        ${stateColor}
        transition-all duration-200 ease-out
        animate-in fade-in slide-in-from-bottom-2
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-2 border-b border-slate-700/60">
        <div className="min-w-0">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-0.5">
            {professionName}
          </p>
          <h3 className="text-sm font-bold text-slate-100 leading-tight">
            {node.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 mt-0.5 text-slate-500 hover:text-slate-300 transition-colors text-base leading-none"
          title="Close (Esc)"
        >
          ×
        </button>
      </div>

      {/* State badge */}
      <div className="px-4 pt-2.5 pb-1">
        <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-medium ${stateColor}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
          {stateLabel}
        </span>
      </div>

      {/* Description */}
      {node.description && (
        <div className="px-4 py-2">
          <p className="text-xs text-slate-300 leading-relaxed">{node.description}</p>
        </div>
      )}

      {/* Costs */}
      {(xpCost > 0 || klaatu > 0) && (
        <div className="px-4 py-2 flex gap-4 border-t border-slate-700/40">
          {xpCost > 0 && (
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-slate-500">XP Cost</span>
              <span className="text-sm font-mono text-cyan-300">{xpCost.toLocaleString()}</span>
            </div>
          )}
          {klaatu > 0 && (
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-slate-500">Klaatu</span>
              <span className="text-sm font-mono text-amber-300">{klaatu.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {/* Special */}
      {node.special && (
        <div className="px-4 py-2 border-t border-slate-700/40">
          <p className="text-xs uppercase tracking-wider text-amber-500 mb-1">Special Ability</p>
          <p className="text-xs font-semibold text-amber-200">{node.special.name}</p>
          <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{node.special.description}</p>
          <p className="text-xs text-slate-500 mt-1">Tool: {node.special.toolType}</p>
        </div>
      )}

      {/* Prerequisites */}
      {node.prerequisites.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-700/40">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Requires</p>
          <ul className="space-y-0.5">
            {node.prerequisites.map((prereqId) => {
              const met =
                build.activeSkills.includes(prereqId) ||
                build.atrophiedSkills.includes(prereqId);
              return (
                <li key={prereqId} className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${met ? 'bg-teal-400' : 'bg-slate-600'}`} />
                  <span className={`text-xs font-mono ${met ? 'text-teal-300' : 'text-slate-500'}`}>
                    {prereqId.split('.').slice(1).join('.').replace(/_/g, ' ')}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Action hint */}
      {actionLabel && (
        <div className="px-4 pb-3 pt-1">
          <p className="text-xs text-slate-500 italic">{actionLabel}</p>
        </div>
      )}
    </div>
  );
}
