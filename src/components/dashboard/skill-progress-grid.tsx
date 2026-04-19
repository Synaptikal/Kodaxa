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
  let dataToRender = progress;
  let isDemo = false;

  if (progress.length === 0) {
    isDemo = true;
    dataToRender = [
      { profession_id: 'p1', profession_name: 'Laser Cutter', current_xp: 45000, sessions_logged: 12 },
      { profession_id: 'p2', profession_name: 'Plasma Weaver', current_xp: 82000, sessions_logged: 24 },
      { profession_id: 'p3', profession_name: 'Ore Refinery', current_xp: 15000, sessions_logged: 4 },
    ] as unknown as SkillProgress[];
  }

  const maxXp = Math.max(...dataToRender.map((p) => p.current_xp), 1);

  return (
    <div className="space-y-3 relative">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skill Progress</h3>
      <div className={`space-y-2 ${isDemo ? 'opacity-30' : ''}`}>
        {dataToRender.map((entry) => {
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
      
      {isDemo && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-[1px] rounded-lg -m-2">
           <div className="px-3 py-1 bg-slate-800/80 border border-slate-700/50 rounded-full text-[10px] font-mono text-slate-400 uppercase tracking-widest shadow-lg">
             Demo Data
           </div>
        </div>
      )}
    </div>
  );
}
