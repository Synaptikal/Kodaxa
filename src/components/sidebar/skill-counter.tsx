/**
 * skill-counter.tsx
 * Sidebar widget showing current skill count vs. the 80-skill cap.
 * One concern: displaying the skill budget with visual progress bar.
 *
 * Stars Reach caps active skills at 80. This counter helps players
 * plan their builds within that constraint.
 */

'use client';

import { useMemo } from 'react';
import { SKILL_CAP, SKILL_CAP_WARNING_THRESHOLD } from '@/lib/skill-engine';
import { Tooltip } from '@/components/ui/tooltip';
import type { Build } from '@/types/build';
import type { SkillNode } from '@/types/skill-tree';

export interface SkillCounterProps {
  build: Build;
  allNodes: Map<string, SkillNode>;
}

export function SkillCounter({ build, allNodes }: SkillCounterProps) {
  const activeCount = build.activeSkills.length;
  const atrophiedCount = build.atrophiedSkills.length;
  const remaining = SKILL_CAP - activeCount;
  const percent = Math.min((activeCount / SKILL_CAP) * 100, 100);

  /** Color logic based on budget */
  const barColor = useMemo(() => {
    if (activeCount > SKILL_CAP) return 'bg-red-500';
    if (activeCount >= SKILL_CAP_WARNING_THRESHOLD) return 'bg-amber-500';
    return 'bg-teal-500';
  }, [activeCount]);

  const textColor = useMemo(() => {
    if (activeCount > SKILL_CAP) return 'text-red-400';
    if (activeCount >= SKILL_CAP_WARNING_THRESHOLD) return 'text-amber-400';
    return 'text-teal-400';
  }, [activeCount]);

  /** Breakdown by profession */
  const profBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const skillId of build.activeSkills) {
      const node = allNodes.get(skillId);
      if (node) {
        counts.set(node.professionId, (counts.get(node.professionId) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [build.activeSkills, allNodes]);

  /** Total EXP and Klaatu cost across all active skills with cost data */
  const totalCosts = useMemo(() => {
    let exp = 0;
    let klaatu = 0;
    let covered = 0;
    for (const skillId of build.activeSkills) {
      const node = allNodes.get(skillId);
      if (node?.costs) {
        exp += node.costs.exp;
        klaatu += node.costs.klaatu;
        covered++;
      }
    }
    return { exp, klaatu, covered };
  }, [build.activeSkills, allNodes]);

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
          Skill Budget
          <Tooltip content="You can have up to 80 active skills across all professions. Atrophied skills don't count against the cap.">
            <span className="text-slate-500 hover:text-slate-300 cursor-help text-xs">?</span>
          </Tooltip>
        </h3>
        <span className={`text-sm font-mono font-bold ${textColor}`}>
          {activeCount}
          <span className="text-slate-500">/{SKILL_CAP}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="flex justify-between text-xs text-slate-500">
        <span>{remaining} remaining</span>
        {atrophiedCount > 0 && (
          <span className="text-amber-500/70">
            {atrophiedCount} atrophied
          </span>
        )}
      </div>

      {/* Top professions breakdown */}
      {profBreakdown.length > 0 && (
        <div className="mt-1 space-y-0.5">
          {profBreakdown.map(([profId, count]) => (
            <div
              key={profId}
              className="flex justify-between text-xs text-slate-400"
            >
              <span className="truncate">{profId}</span>
              <span className="tabular-nums">{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Cost totals — only shown when at least one costed skill is active */}
      {totalCosts.covered > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-700/60 space-y-1">
          <p className="text-xs font-mono uppercase tracking-[0.1em] text-sr-muted">
            Build Cost ({totalCosts.covered} costed)
          </p>
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>EXP</span>
            <span className="tabular-nums">{totalCosts.exp.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Klaatu</span>
            <span className="tabular-nums">{totalCosts.klaatu.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
