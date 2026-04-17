/**
 * flow-nodes.ts
 * Type definitions for React Flow node/edge data used in the skill tree canvas.
 * One concern: bridging our SkillNode/SkillEdge types with @xyflow/react's Node/Edge types.
 *
 * @xyflow/react v12 uses generics:
 *   Node<DataType, TypeString>
 *   Edge<DataType>
 * Source: https://reactflow.dev/api-reference/types/node-props
 */

import type { Node, Edge } from '@xyflow/react';
import type { SkillNodeState, SkillSpecial, SkillCosts } from '@/types/skill-tree';

/** Data payload carried by each skill node in the React Flow graph */
export interface SkillNodeData extends Record<string, unknown> {
  /** Display name */
  label: string;

  /** Full description for tooltip/popover */
  description: string;

  /** Which profession this node belongs to */
  professionId: string;

  /** Visual state driven by the build engine */
  state: SkillNodeState;

  /** Tier/depth in the tree */
  tier: number;

  /** If this node grants a Special ability */
  special?: SkillSpecial;

  /** If this node unlocks another profession tree */
  unlocksTree?: string;

  /** Whether the skill is implemented in-game */
  implemented: boolean;

  /** Whether this node is currently selected (for click feedback) */
  selected?: boolean;

  /** EXP and Klaatu costs — absent if not yet captured from OCR */
  costs?: SkillCosts;
}

/** Typed React Flow node for skill trees */
export type SkillFlowNode = Node<SkillNodeData, 'skill'>;

/** Data payload for edges */
export interface SkillEdgeData extends Record<string, unknown> {
  /** Whether this edge crosses between profession trees */
  crossTree: boolean;
}

/** Typed React Flow edge for skill trees */
export type SkillFlowEdge = Edge<SkillEdgeData>;

/** The set of custom node type keys we register with React Flow */
export const FLOW_NODE_TYPES = ['skill'] as const;
export type FlowNodeType = (typeof FLOW_NODE_TYPES)[number];
