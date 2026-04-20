/**
 * planner-shell.tsx
 * Client-side planner shell — owns useSearchParams and build state.
 * One concern: composing sidebar + canvas with URL param decoding.
 *
 * Extracted from page.tsx so the page can wrap this in <Suspense>,
 * which Next.js 16 requires for useSearchParams().
 * Source: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
 */

'use client';

import { useMemo, useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ReactFlowProvider } from '@xyflow/react';

import { NavHeader } from '@/components/ui/nav-header';
import { TreeCanvas } from '@/components/tree/tree-canvas';
import { ProfessionList } from '@/components/sidebar/profession-list';
import { SkillCounter } from '@/components/sidebar/skill-counter';
import { ToolTracker } from '@/components/sidebar/tool-tracker';
import { BuildValidationPanel } from '@/components/sidebar/build-validation';
import { StatAllocator } from '@/components/sidebar/stat-allocator';
import { SkillDetailPanel } from '@/components/planner/skill-detail-panel';
import { ToolSelectModal } from '@/components/planner/tool-select-modal';
import { SavedBuildsPanel } from '@/components/planner/saved-builds-panel';
import { OnboardingHints } from '@/components/planner/onboarding-hints';
// Tooltip available if needed; currently unused
import { useBuildState } from '@/hooks/use-build-state';
import { useSavedBuilds } from '@/hooks/use-saved-builds';
import { encodeBuild, decodeBuild } from '@/lib/build-encoder';
import {
  getAllProfessions,
  getProfessionMap,
  getNodeMap,
  getProfessionSummaries,
} from '@/data/professions/index';
import type { SkillNodeState } from '@/types/skill-tree';

/** Static data — computed once at module load, not per render */
const ALL_PROFESSIONS = getAllProfessions();
const PROFESSION_MAP = getProfessionMap();
const NODE_MAP = getNodeMap();
const SUMMARIES = getProfessionSummaries();

/** Derive node visual state from build — mirrors flow-converter.ts resolveNodeState */
function resolveNodeState(
  nodeId: string,
  activeSkills: string[],
  atrophiedSkills: string[],
): SkillNodeState {
  const node = NODE_MAP.get(nodeId);
  if (!node) return 'locked';
  if (!node.implemented) return 'wip';
  if (activeSkills.includes(nodeId)) return 'in_practice';
  if (atrophiedSkills.includes(nodeId)) return 'out_of_practice';
  if (node.prerequisites.length === 0) return 'available';
  const prereqsMet = node.prerequisites.every(
    (pid) => activeSkills.includes(pid) || atrophiedSkills.includes(pid),
  );
  return prereqsMet ? 'available' : 'locked';
}

export function PlannerShell() {
  const searchParams = useSearchParams();

  // Decode shared build from URL params if present
  const initialBuild = useMemo(() => {
    if (searchParams.has('s') || searchParams.has('n')) {
      const decoded = decodeBuild(searchParams);
      // Encoder only stores professionId — resolve actual tool names from profession map
      decoded.toolSlots = decoded.toolSlots.map((slot) => {
        if (!slot.professionId) return slot;
        const prof = PROFESSION_MAP.get(slot.professionId);
        return prof ? { ...slot, toolName: prof.tool.name } : slot;
      });
      return decoded;
    }
    return undefined;
  }, []); // Only decode once on mount — intentional empty deps

  const state = useBuildState({
    professions: ALL_PROFESSIONS,
    professionMap: PROFESSION_MAP,
    nodeMap: NODE_MAP,
    summaries: SUMMARIES,
    initialBuild,
  });

  const saves = useSavedBuilds();

  // Tool select modal state
  const [toolModalSlot, setToolModalSlot] = useState<number | null>(null);

  // Share button feedback
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = useCallback(() => {
    const encoded = encodeBuild(state.build);
    const url = `${window.location.origin}/planner?${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  }, [state.build]);

  const handleLoadSave = useCallback(
    (id: string) => {
      const build = saves.loadBuild(id);
      if (build) state.loadBuild(build);
    },
    [saves, state],
  );

  // Compute detail panel data from selectedNodeId
  const detailNode = state.selectedNodeId ? NODE_MAP.get(state.selectedNodeId) ?? null : null;
  const detailState = state.selectedNodeId
    ? resolveNodeState(
        state.selectedNodeId,
        state.build.activeSkills,
        state.build.atrophiedSkills,
      )
    : null;
  const detailProfName = detailNode
    ? (PROFESSION_MAP.get(detailNode.professionId)?.name ?? detailNode.professionId)
    : '';

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <NavHeader />
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar ─────────────────────────────────── */}
        <aside className="w-72 shrink-0 flex flex-col gap-3 p-3 bg-sr-surface border-r border-sr-border overflow-y-auto">

          {/* First-use guidance */}
          <OnboardingHints />

          {/* Build name + share */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={state.build.name}
              onChange={(e) => state.setBuildName(e.target.value)}
              className="flex-1 bg-transparent border-b border-sr-border text-sm text-sr-text px-1 py-0.5 focus:border-cyan-400 focus:outline-none transition-colors"
              placeholder="Build name..."
            />
            <button
              onClick={handleShare}
              className={`shrink-0 text-xs px-2 py-1 rounded transition-colors ${
                shareCopied
                  ? 'bg-teal-700/50 text-teal-300'
                  : 'bg-cyan-800/40 text-cyan-300 hover:bg-cyan-800/60'
              }`}
              title="Copy share URL to clipboard"
            >
              {shareCopied ? '✓ Copied' : 'Share'}
            </button>
          </div>

          {/* Skill budget */}
          <SkillCounter build={state.build} allNodes={state.nodeMap} />

          {/* Tool loadout */}
          <ToolTracker
            build={state.build}
            onSlotClick={(idx) => setToolModalSlot(idx)}
          />

          {/* Stat pools */}
          <StatAllocator
            stats={state.build.stats}
            onStatsChange={state.updateStats}
          />

          {/* Validation feedback */}
          <BuildValidationPanel validation={state.validation} />

          {/* Saved builds */}
          <SavedBuildsPanel
            currentBuild={state.build}
            savedBuilds={saves.savedBuilds}
            onSave={saves.saveBuild}
            onLoad={handleLoadSave}
            onDelete={saves.deleteBuild}
          />

          {/* Profession browser */}
          <ProfessionList
            professions={state.summaries}
            selectedIds={state.selectedProfessionIds}
            onToggle={state.toggleProfession}
          />

          {/* Reset button */}
          <button
            onClick={state.resetBuild}
            className="mt-auto text-xs px-3 py-1.5 rounded bg-red-900/30 text-red-400 border border-red-800/40 hover:bg-red-900/50 transition-colors"
          >
            Reset Build
          </button>
        </aside>

        {/* ── Main canvas area ─────────────────────────────── */}
        <main className="flex-1 relative overflow-hidden">
          <ReactFlowProvider>
            <TreeCanvas
              initialNodes={state.flowNodes}
              initialEdges={state.flowEdges}
              onSkillClick={state.toggleSkill}
              onSkillSelect={state.selectNode}
            />
          </ReactFlowProvider>

          {/* Skill detail panel — floats over bottom-right of canvas */}
          <SkillDetailPanel
            node={detailNode}
            nodeState={detailState}
            build={state.build}
            professionName={detailProfName}
            onClose={() => state.selectNode(null)}
          />
        </main>
      </div>

      {/* Tool selection modal */}
      {toolModalSlot !== null && (
        <ToolSelectModal
          slotIndex={toolModalSlot}
          toolSlots={state.build.toolSlots}
          professions={ALL_PROFESSIONS}
          onEquip={(idx, prof) => {
            state.equipTool(idx, prof);
            // Auto-show this profession's tree on the canvas
            if (!state.selectedProfessionIds.includes(prof.id)) {
              state.toggleProfession(prof.id);
            }
            setToolModalSlot(null);
          }}
          onClear={(idx) => {
            state.clearTool(idx);
            setToolModalSlot(null);
          }}
          onClose={() => setToolModalSlot(null)}
        />
      )}
    </div>
  );
}
