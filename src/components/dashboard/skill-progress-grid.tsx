/**
 * skill-progress-grid.tsx
 * Grid of tracked professions with XP progress bars.
 * One concern: render skill progress entries with visual bars.
 */

'use client';

import type { SkillProgress } from '@/types/dashboard';

interface Props {
  progress: SkillProgress[];
  onReset: (professionId: string) => void;
}

export function SkillProgressGrid({ progress, onReset }: Props) {
  if (progress.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-24 gap-1 text-center">
        <p className="text-slate-500 text-xs">No skill progress tracked yet.</p>
        <p className="text-slate-600 text-[10px]">Log XP in session entries to see progress here.</p>
      </div>
    );
  }

  const maxXp = Math.max(...progress.map((p) => p.current_xp), 1);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skill Progress</h3>
      <div className="space-y-2">
        {progress.map((entry) => {
          const pct = Math.min((entry.current_xp / maxXp) * 100, 100);
          return (
            <div key={entry.profession_id} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-200">{entry.profession_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-violet-400">{entry.current_xp.toLocaleString()} XP</span>
                  <span className="text-[10px] text-slate-600">{entry.sessions_logged} sessions</span>
                  <button
                    onClick={() => onReset(entry.profession_id)}
                    className="text-[10px] text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Reset progress"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
