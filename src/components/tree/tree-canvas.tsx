/**
 * tree-canvas.tsx
 * Main React Flow canvas for rendering the skill tree.
 * One concern: mounting ReactFlow with our custom nodes, edges, and interaction handlers.
 *
 * This component does NOT manage build state — it receives nodes/edges and
 * dispatches click events upward. State lives in the planner page.
 *
 * Source: @xyflow/react v12
 *   https://reactflow.dev/api-reference/react-flow
 */

'use client';

import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import type { MouseEvent } from 'react';
import '@xyflow/react/dist/style.css';

import { skillNodeTypes } from '@/components/tree/skill-node';
import { TreeControls } from '@/components/tree/tree-controls';
import type { SkillFlowNode, SkillFlowEdge } from '@/types/flow-nodes';

export interface TreeCanvasProps {
  /** Pre-computed React Flow nodes from flow-converter */
  initialNodes: SkillFlowNode[];

  /** Pre-computed React Flow edges from flow-converter */
  initialEdges: SkillFlowEdge[];

  /** Called when user clicks a skill node — parent handles build mutation */
  onSkillClick?: (nodeId: string) => void;

  /** Called when user right-clicks or hovers a node — shows detail panel without toggling */
  onSkillSelect?: (nodeId: string | null) => void;
}

/** MiniMap color helper based on node state */
function miniMapNodeColor(node: SkillFlowNode): string {
  const state = node.data?.state;
  switch (state) {
    case 'in_practice':
      return '#2dd4bf'; // teal-400
    case 'available':
      return '#22d3ee'; // cyan-400
    case 'out_of_practice':
      return '#f59e0b'; // amber-500
    case 'wip':
      return '#a855f7'; // purple-500
    default:
      return '#475569'; // slate-600
  }
}

export function TreeCanvas({
  initialNodes,
  initialEdges,
  onSkillClick,
  onSkillSelect,
}: TreeCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync when parent recomputes the graph (profession toggle, skill click)
  useEffect(() => { setNodes(initialNodes); }, [initialNodes, setNodes]);
  useEffect(() => { setEdges(initialEdges); }, [initialEdges, setEdges]);

  const handleNodeClick = useCallback(
    (_event: MouseEvent, node: SkillFlowNode) => {
      const state = node.data?.state;
      // Select node for detail panel regardless of state
      onSkillSelect?.(node.id);
      // Only toggle build state for interactive nodes
      if (!onSkillClick) return;
      if (state === 'locked' || state === 'wip') return;
      onSkillClick(node.id);
    },
    [onSkillClick, onSkillSelect],
  );

  const handlePaneClick = useCallback(() => {
    onSkillSelect?.(null);
  }, [onSkillSelect]);

  // nodeTypes MUST be stable — defined outside component or memoized
  const nodeTypes = useMemo(() => skillNodeTypes, []);

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
        minZoom={0.1}
        maxZoom={3}
        proOptions={{ hideAttribution: false }}
        colorMode="dark"
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#64748b', strokeWidth: 1.5 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#334155"
        />
        <MiniMap
          nodeColor={(n) => miniMapNodeColor(n as SkillFlowNode)}
          maskColor="rgba(15, 23, 42, 0.7)"
          className="!bg-slate-900 !border-slate-700"
          pannable
          zoomable
        />
        <TreeControls />
      </ReactFlow>
    </div>
  );
}
