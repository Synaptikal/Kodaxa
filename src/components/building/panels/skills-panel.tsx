'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLinkIcon, CheckCircleIcon, CircleIcon } from 'lucide-react';
import type { PlacedCell, RequiredSkillEntry, RequiredTree } from '@/types/building';
import { ALL_TILES } from '@/data/building';
import { getLatestSave } from '@/hooks/use-saved-builds';

interface SkillsPanelProps {
  cells: PlacedCell[];
}

export function SkillsPanel({ cells }: SkillsPanelProps) {
  const [activeSkills, setActiveSkills] = useState<Set<string>>(new Set());
  const [buildName, setBuildName] = useState<string | null>(null);

  useEffect(() => {
    const save = getLatestSave();
    if (save) {
      setActiveSkills(new Set(save.build.activeSkills));
      setBuildName(save.name);
    }
  }, []);

  const reqs = useMemo(() => {
    const skillMap = new Map<string, RequiredSkillEntry>();

    for (const cell of cells) {
      const def = ALL_TILES.find(t => t.id === cell.tileId);
      if (!def || !def.requiredSkillId) continue;

      const existing = skillMap.get(def.requiredSkillId) ?? {
        skillId: def.requiredSkillId,
        skillLabel: def.requiredSkillId.split('.').pop()?.replace(/_/g, ' ') || def.requiredSkillId,
        tree: def.requiredTree as RequiredTree,
        tileCount: 0
      };

      existing.tileCount++;
      skillMap.set(def.requiredSkillId, existing);
    }

    // Group by tree
    const grouped = new Map<RequiredTree, RequiredSkillEntry[]>();
    for (const entry of skillMap.values()) {
      if (!grouped.has(entry.tree)) grouped.set(entry.tree, []);
      grouped.get(entry.tree)!.push(entry);
    }

    return grouped;
  }, [cells]);

  if (cells.length === 0 || reqs.size === 0) {
    return (
    <div className="p-4 border-b border-white/5 bg-black/20 backdrop-blur-md relative overflow-hidden">
        <h3 className="text-xs uppercase tracking-widest font-bold text-stone-500 mb-1 drop-shadow-sm">Skill Requirements</h3>
        <p className="text-[9px] font-mono text-stone-600 leading-relaxed">
          Know what to unlock before construction begins.
        </p>
        <p className="text-[9px] font-mono text-stone-700 leading-relaxed">
          Place skill-gated pieces to see required Architect or Civil Eng. nodes.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4 border-b border-white/5 bg-black/20 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-transparent pointer-events-none" />
      <h3 className="text-xs uppercase tracking-widest font-bold text-stone-300 mb-1 drop-shadow-sm flex items-center gap-2">
        Skill Requirements
      </h3>
      
      {Array.from(reqs.entries()).map(([tree, skills]) => {
        const treeLabel = tree.replace(/_/g, ' ');
        return (
          <div key={tree} className="flex flex-col gap-2 relative z-10">
            <h4 className="text-[11px] font-bold text-stone-300 uppercase tracking-widest border-b border-white/10 pb-1 capitalize drop-shadow-sm">
              {treeLabel}
            </h4>
            <ul className="flex flex-col gap-1">
              {skills.map(skill => {
                const hasBuild = activeSkills.size > 0;
                const unlocked = activeSkills.has(skill.skillId);
                return (
                  <li key={skill.skillId} className="text-xs flex items-center gap-2 group">
                    {hasBuild ? (
                      unlocked
                        ? <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        : <CircleIcon className="w-3.5 h-3.5 text-red-500/70 shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:scale-125 transition-transform shrink-0" />
                    )}
                    <span className={`capitalize transition-colors ${hasBuild ? (unlocked ? 'text-emerald-300 group-hover:text-emerald-200' : 'text-red-400/80 group-hover:text-red-300') : 'text-stone-300 group-hover:text-white'}`}>
                      {skill.skillLabel}
                    </span>
                  </li>
                );
              })}
            </ul>

            <Link
              href={`/planner?tree=${tree}`}
              className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-white/10 text-cyan-200 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border border-cyan-500/20 hover:border-cyan-400/50 shadow-sm group overflow-hidden relative"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10">Open Skill Planner</span>
              <ExternalLinkIcon className="w-3 h-3 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        );
      })}

      {buildName && (
        <p className="text-[9px] text-stone-700 relative z-10">
          Checking vs. saved build: <span className="text-stone-500">{buildName}</span>
        </p>
      )}
    </div>
  );
}
