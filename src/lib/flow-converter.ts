/**
 * flow-converter.ts
 * Converts Profession data into @xyflow/react Node[] and Edge[] arrays.
 * One concern: data transformation from game types to React Flow types.
 *
 * This is a pure function module — no React, no side effects.
 */

import type { Profession, SkillNode, SkillEdge } from '@/types/skill-tree';
import type { SkillFlowNode, SkillFlowEdge, SkillNodeData } from '@/types/flow-nodes';
import type { Build } from '@/types/build';

/** Determine the visual state of a node based on the current build */
function resolveNodeState(
  node: SkillNode,
  build: Build,
  allNodes: Map<string, SkillNode>,
): SkillNodeData['state'] {
  // WIP nodes are always shown as WIP regardless of build
  if (!node.implemented) return 'wip';

  // Check if this node is actively selected
  if (build.activeSkills.includes(node.id)) return 'in_practice';

  // Check if atrophied
  if (build.atrophiedSkills.includes(node.id)) return 'out_of_practice';

  // Check prerequisites — all must be in_practice or out_of_practice
  const prereqsMet = node.prerequisites.every((prereqId) => {
    return (
      build.activeSkills.includes(prereqId) ||
      build.atrophiedSkills.includes(prereqId)
    );
  });

  // Root nodes (no prerequisites) are always available
  if (node.prerequisites.length === 0) return 'available';

  return prereqsMet ? 'available' : 'locked';
}

/**
 * Convert a single profession's nodes into React Flow nodes.
 * Applies an optional offset so multiple trees can be placed side-by-side.
 */
export function professionToFlowNodes(
  profession: Profession,
  build: Build,
  allNodes: Map<string, SkillNode>,
  offset: { x: number; y: number } = { x: 0, y: 0 },
): SkillFlowNode[] {
  return profession.nodes.map((node) => ({
    id: node.id,
    type: 'skill' as const,
    position: {
      x: node.position.x + offset.x,
      y: node.position.y + offset.y,
    },
    data: {
      label: node.name,
      description: node.description,
      professionId: node.professionId,
      state: resolveNodeState(node, build, allNodes),
      tier: node.tier,
      special: node.special,
      unlocksTree: node.unlocksTree,
      implemented: node.implemented,
    },
  }));
}

/** Convert a profession's edges into React Flow edges with styling */
export function professionToFlowEdges(
  profession: Profession,
): SkillFlowEdge[] {
  return profession.edges.map((edge) => ({
    id: `${edge.source}->${edge.target}`,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    animated: edge.crossTree,
    style: {
      stroke: edge.crossTree ? '#22d3ee' : '#64748b',
      strokeWidth: edge.crossTree ? 2 : 1.5,
    },
    data: {
      crossTree: edge.crossTree,
    },
  }));
}

/**
 * Convert multiple professions into a combined flow graph.
 * Each profession is offset horizontally so trees don't overlap.
 */
export function professionsToFlowGraph(
  professions: Profession[],
  build: Build,
  allNodes: Map<string, SkillNode>,
): { nodes: SkillFlowNode[]; edges: SkillFlowEdge[] } {
  const nodes: SkillFlowNode[] = [];
  const edges: SkillFlowEdge[] = [];

  // Horizontal spacing between profession trees
  const TREE_SPACING = 900;

  professions.forEach((prof, index) => {
    const offset = { x: index * TREE_SPACING, y: 0 };
    nodes.push(...professionToFlowNodes(prof, build, allNodes, offset));
    edges.push(...professionToFlowEdges(prof));
  });

  // Add cross-tree edges between professions
  // (e.g., ranger.unlock_camping -> camping.base)
  for (const prof of professions) {
    for (const node of prof.nodes) {
      if (node.unlocksTree) {
        const targetBaseId = `${node.unlocksTree}.base`;
        // Only add if target exists in our node set
        if (nodes.some((n) => n.id === targetBaseId)) {
          edges.push({
            id: `cross:${node.id}->${targetBaseId}`,
            source: node.id,
            target: targetBaseId,
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: '#22d3ee',
              strokeWidth: 2,
              strokeDasharray: '5 5',
            },
            data: { crossTree: true },
          });
        }
      }
    }
  }

  return { nodes, edges };
}
