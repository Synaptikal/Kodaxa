/**
 * skill-node.tsx
 * Custom React Flow node for displaying a single skill in the tree.
 * One concern: rendering a skill node with its visual state, badges, and handles.
 *
 * Visual states (mapped from SkillNodeState):
 *   locked          → dimmed, grey border, no interaction
 *   available       → bright border, pulsing glow, clickable
 *   in_practice     → solid fill (teal), active indicator
 *   out_of_practice → faded fill, dashed border
 *   wip             → striped/hatched, "WIP" badge
 *
 * Source: @xyflow/react v12 custom nodes
 *   https://reactflow.dev/learn/customization/custom-nodes
 */

'use client';

import { memo, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { SkillFlowNode } from '@/types/flow-nodes';
import type { SkillNodeState } from '@/types/skill-tree';

/** CSS class map for each visual state */
const STATE_STYLES: Record<SkillNodeState, string> = {
  locked:
    'border-slate-600 bg-slate-800/60 text-slate-500 cursor-not-allowed opacity-50',
  available:
    'border-cyan-400 bg-slate-900 text-cyan-100 cursor-pointer hover:shadow-cyan-500/30 hover:shadow-lg ring-1 ring-cyan-400/20',
  in_practice:
    'border-teal-400 bg-teal-900/80 text-teal-50 cursor-pointer shadow-teal-500/25 shadow-md',
  out_of_practice:
    'border-amber-500/60 bg-amber-950/40 text-amber-200/80 cursor-pointer border-dashed',
  wip:
    'border-purple-500/50 bg-purple-950/30 text-purple-300/70 cursor-help',
};

/** Small colored dot indicating state at a glance */
const STATE_INDICATOR: Record<SkillNodeState, string> = {
  locked: 'bg-slate-600',
  available: 'bg-cyan-400 animate-pulse',
  in_practice: 'bg-teal-400',
  out_of_practice: 'bg-amber-500',
  wip: 'bg-purple-500',
};

/** Tier label colors */
const TIER_COLORS: Record<number, string> = {
  0: 'text-slate-400',
  1: 'text-blue-400',
  2: 'text-indigo-400',
  3: 'text-violet-400',
};

function SkillNodeComponent({ data }: NodeProps<SkillFlowNode>) {
  const {
    label,
    description,
    state,
    tier,
    special,
    unlocksTree,
    implemented,
    costs,
  } = data;

  const stateClass = STATE_STYLES[state];
  const indicatorClass = STATE_INDICATOR[state];
  const tierColor = TIER_COLORS[tier] ?? 'text-fuchsia-400';

  const handleClick = useCallback(() => {
    if (state === 'locked' || state === 'wip') return;
    // Dispatch is handled by the parent via onNodeClick — this is just for
    // stopping propagation on non-interactive states
  }, [state]);

  return (
    <div
      className={`
        relative rounded-lg border-2 px-3 py-2
        min-w-[140px] max-w-[180px]
        transition-all duration-200 ease-out
        ${stateClass}
      `}
      onClick={handleClick}
      title={description}
    >
      {/* Target handle (incoming edges from prerequisites) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-slate-500 !border-slate-400"
      />

      {/* State indicator dot */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`inline-block w-2 h-2 rounded-full ${indicatorClass}`} />
        <span className={`text-xs font-mono uppercase ${tierColor}`}>
          T{tier}
        </span>
      </div>

      {/* Node name */}
      <p className="text-xs font-semibold leading-tight truncate">{label}</p>

      {/* Cost row */}
      {costs && (
        <p className="text-xs font-mono text-slate-500 mt-0.5 tabular-nums">
          {costs.exp.toLocaleString()} EXP · {costs.klaatu.toLocaleString()} KL
        </p>
      )}

      {/* Badges row */}
      <div className="flex gap-1 mt-1.5 flex-wrap">
        {/* Special badge */}
        {special && (
          <span
            className="inline-flex items-center gap-0.5 rounded-full bg-amber-800/60 px-1.5 py-0.5 text-xs font-medium text-amber-200"
            title={`Special: ${special.name} — ${special.description}`}
          >
            S
          </span>
        )}

        {/* Tree unlock badge */}
        {unlocksTree && (
          <span
            className="inline-flex items-center gap-0.5 rounded-full bg-cyan-800/60 px-1.5 py-0.5 text-xs font-medium text-cyan-200"
            title={`Unlocks: ${unlocksTree}`}
          >
            &rarr;
          </span>
        )}

        {/* WIP badge */}
        {!implemented && (
          <span className="inline-flex items-center rounded-full bg-purple-800/60 px-1.5 py-0.5 text-xs font-medium text-purple-200">
            WIP
          </span>
        )}
      </div>

      {/* Source handle (outgoing edges to dependents) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-slate-500 !border-slate-400"
      />
    </div>
  );
}

/**
 * Memoized export — React Flow re-renders nodes on every pan/zoom,
 * so memo prevents unnecessary re-renders when data hasn't changed.
 */
export const SkillNode = memo(SkillNodeComponent);

/**
 * Node type registry object — pass this to <ReactFlow nodeTypes={...} />.
 * MUST be defined outside the component to avoid re-creating on every render.
 * Source: https://reactflow.dev/learn/customization/custom-nodes#adding-the-node-type
 */
export const skillNodeTypes = {
  skill: SkillNode,
} as const;
