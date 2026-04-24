/**
 * use-build-state.ts
 * React hook managing the planner's build state and derived data.
 * One concern: build mutations, validation, and profession selection.
 *
 * This centralizes all build logic so the planner page only handles layout.
 * All game constraint checks are delegated to skill-engine.ts.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Build, StatAllocation } from '@/types/build';
import type { Profession, SkillNode, ProfessionSummary } from '@/types/skill-tree';
import type { SkillFlowNode, SkillFlowEdge } from '@/types/flow-nodes';
import { emptyBuild } from '@/lib/build-encoder';
import { validateBuild } from '@/lib/skill-engine';
import { professionsToFlowGraph } from '@/lib/flow-converter';

export interface BuildStateConfig {
  professions: Profession[];
  professionMap: Map<string, Profession>;
  nodeMap: Map<string, SkillNode>;
  summaries: ProfessionSummary[];
  initialBuild?: Build;
}

export interface BuildState {
  build: Build;
  selectedProfessionIds: string[];
  selectedNodeId: string | null;
  validation: ReturnType<typeof validateBuild>;
  flowNodes: SkillFlowNode[];
  flowEdges: SkillFlowEdge[];
  summaries: ProfessionSummary[];
  nodeMap: Map<string, SkillNode>;
  toggleSkill: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  toggleProfession: (professionId: string) => void;
  equipTool: (slotIndex: number, profession: Profession) => void;
  clearTool: (slotIndex: number) => void;
  updateStats: (stats: StatAllocation) => void;
  loadBuild: (build: Build) => void;
  resetBuild: () => void;
  setBuildName: (name: string) => void;
}

export function useBuildState(config: BuildStateConfig): BuildState {
  const { professions, professionMap, nodeMap, summaries } = config;

  const [build, setBuild] = useState<Build>(
    config.initialBuild ?? emptyBuild(),
  );

  // Which professions are visible in the canvas
  const [selectedProfessionIds, setSelectedProfessionIds] = useState<string[]>(
    () => {
      // If restoring a shared/saved build, show its professions
      const initial = config.initialBuild;
      if (initial) {
        const fromSkills = initial.activeSkills.map((id) => id.split('.')[0]);
        const fromTools  = initial.toolSlots.filter((s) => s.professionId).map((s) => s.professionId);
        const ids = Array.from(new Set([...fromSkills, ...fromTools])).filter(Boolean);
        if (ids.length > 0) return ids;
      }
      // Default: show the first detailed profession (ranger)
      const detailed = professions.filter((p) => p.nodes.length > 1);
      return detailed.length > 0 ? [detailed[0].id] : [];
    },
  );

  // Currently selected (focused) skill node for the detail panel
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Validate build whenever it changes
  const validation = useMemo(
    () => validateBuild(build, professionMap, nodeMap),
    [build, professionMap, nodeMap],
  );

  // Compute React Flow graph for selected professions
  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const selected = selectedProfessionIds
      .map((id) => professionMap.get(id))
      .filter((p): p is Profession => p !== undefined);
    return professionsToFlowGraph(selected, build, nodeMap);
  }, [selectedProfessionIds, build, professionMap, nodeMap]);

  /** Toggle a skill between in_practice and available */
  const toggleSkill = useCallback(
    (nodeId: string) => {
      // Also select the node for the detail panel
      setSelectedNodeId(nodeId);
      setBuild((prev) => {
        const node = nodeMap.get(nodeId);
        if (!node) return prev;

        const isActive = prev.activeSkills.includes(nodeId);
        const isAtrophied = prev.atrophiedSkills.includes(nodeId);

        if (isActive) {
          return {
            ...prev,
            activeSkills: prev.activeSkills.filter((id) => id !== nodeId),
            atrophiedSkills: [...prev.atrophiedSkills, nodeId],
            updatedAt: new Date().toISOString(),
          };
        }

        if (isAtrophied) {
          return {
            ...prev,
            activeSkills: [...prev.activeSkills, nodeId],
            atrophiedSkills: prev.atrophiedSkills.filter((id) => id !== nodeId),
            updatedAt: new Date().toISOString(),
          };
        }

        // Block activation if prerequisites are not met (locked node)
        const knownSkills = new Set([...prev.activeSkills, ...prev.atrophiedSkills]);
        const prereqsMet = node.prerequisites.every((id) => knownSkills.has(id));
        if (!prereqsMet) return prev;

        return {
          ...prev,
          activeSkills: [...prev.activeSkills, nodeId],
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [nodeMap],
  );

  /** Select a node for the detail panel without toggling skill state */
  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  /** Toggle profession visibility in the canvas */
  const toggleProfession = useCallback((professionId: string) => {
    setSelectedProfessionIds((prev) =>
      prev.includes(professionId)
        ? prev.filter((id) => id !== professionId)
        : [...prev, professionId],
    );
  }, []);

  /** Equip a profession's tool into a slot */
  const equipTool = useCallback((slotIndex: number, profession: Profession) => {
    setBuild((prev) => {
      const newSlots = [...prev.toolSlots];
      newSlots[slotIndex] = {
        toolName: profession.tool.name,
        professionId: profession.id,
        activeSpecials: [undefined, undefined],
      };
      return { ...prev, toolSlots: newSlots, updatedAt: new Date().toISOString() };
    });
  }, []);

  /** Clear a tool slot */
  const clearTool = useCallback((slotIndex: number) => {
    setBuild((prev) => {
      const newSlots = [...prev.toolSlots];
      newSlots[slotIndex] = { toolName: '', professionId: '', activeSpecials: [undefined, undefined] };
      return { ...prev, toolSlots: newSlots, updatedAt: new Date().toISOString() };
    });
  }, []);

  /** Update stat pool allocation */
  const updateStats = useCallback((stats: StatAllocation) => {
    setBuild((prev) => ({ ...prev, stats, updatedAt: new Date().toISOString() }));
  }, []);

  /** Load a saved build (replaces current build entirely) */
  const loadBuild = useCallback((newBuild: Build) => {
    setBuild(newBuild);
    setSelectedNodeId(null);
    // Show professions from both active skills and equipped tool slots
    const fromSkills = newBuild.activeSkills.map((id) => id.split('.')[0]);
    const fromTools  = newBuild.toolSlots.filter((s) => s.professionId).map((s) => s.professionId);
    const profIds = Array.from(new Set([...fromSkills, ...fromTools])).filter(Boolean);
    if (profIds.length > 0) setSelectedProfessionIds(profIds);
  }, []);

  /** Reset build to empty state */
  const resetBuild = useCallback(() => {
    setBuild(emptyBuild());
    setSelectedNodeId(null);
  }, []);

  /** Update build name */
  const setBuildName = useCallback((name: string) => {
    setBuild((prev) => ({ ...prev, name, updatedAt: new Date().toISOString() }));
  }, []);

  return {
    build,
    selectedProfessionIds,
    selectedNodeId,
    validation,
    flowNodes,
    flowEdges,
    summaries,
    nodeMap,
    toggleSkill,
    selectNode,
    toggleProfession,
    equipTool,
    clearTool,
    updateStats,
    loadBuild,
    resetBuild,
    setBuildName,
  };
}
