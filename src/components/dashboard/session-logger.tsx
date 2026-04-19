/**
 * session-logger.tsx
 * Quick-log form for recording play sessions.
 * One concern: capture duration, activities, Klaatu earned/spent, and XP per profession.
 *
 * Provides autocomplete for activities and professions from existing game data.
 */

'use client';

import { useState, useCallback } from 'react';
import type { ActivityType, ActivityEntry } from '@/types/dashboard';
import { ACTIVITY_LABELS, ACTIVITY_COLORS } from '@/types/dashboard';
import { getProfessionSummaries } from '@/data/professions/index';

const ALL_PROFESSIONS = getProfessionSummaries();
const ACTIVITY_TYPES = Object.keys(ACTIVITY_LABELS) as ActivityType[];

interface Props {
  onSubmit: (session: {
    date: string;
    duration_minutes: number;
    activities: ActivityEntry[];
    klaatu_earned: number;
    klaatu_spent: number;
    xp_gained: Record<string, number>;
    notes?: string;
  }) => void;
}

export function SessionLogger({ onSubmit }: Props) {
  const [duration, setDuration] = useState('');
  const [klaatuEarned, setKlaatuEarned] = useState('');
  const [klaatuSpent, setKlaatuSpent] = useState('');
  const [notes, setNotes] = useState('');
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [xpEntries, setXpEntries] = useState<{ profId: string; xp: string }[]>([]);

  // Activity add
  const [actType, setActType] = useState<ActivityType>('mining');
  const [actDetail, setActDetail] = useState('');
  const [actPlanet, setActPlanet] = useState('');

  // XP add
  const [xpProf, setXpProf] = useState('');
  const [xpAmount, setXpAmount] = useState('');

  const addActivity = useCallback(() => {
    if (!actDetail.trim()) return;
    setActivities((prev) => [
      ...prev,
      { type: actType, detail: actDetail.trim(), planet: actPlanet.trim() || undefined },
    ]);
    setActDetail('');
    setActPlanet('');
  }, [actType, actDetail, actPlanet]);

  const removeActivity = useCallback((idx: number) => {
    setActivities((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const addXp = useCallback(() => {
    if (!xpProf || !xpAmount) return;
    setXpEntries((prev) => [...prev.filter((e) => e.profId !== xpProf), { profId: xpProf, xp: xpAmount }]);
    setXpProf('');
    setXpAmount('');
  }, [xpProf, xpAmount]);

  const removeXp = useCallback((profId: string) => {
    setXpEntries((prev) => prev.filter((e) => e.profId !== profId));
  }, []);

  const handleSubmit = useCallback(() => {
    const dur = parseInt(duration, 10) || 0;
    if (dur <= 0) return;

    const xpRecord: Record<string, number> = {};
    for (const e of xpEntries) {
      xpRecord[e.profId] = parseInt(e.xp, 10) || 0;
    }

    onSubmit({
      date: new Date().toISOString(),
      duration_minutes: dur,
      activities,
      klaatu_earned: parseInt(klaatuEarned, 10) || 0,
      klaatu_spent: parseInt(klaatuSpent, 10) || 0,
      xp_gained: xpRecord,
      notes: notes.trim() || undefined,
    });

    // Reset
    setDuration('');
    setKlaatuEarned('');
    setKlaatuSpent('');
    setNotes('');
    setActivities([]);
    setXpEntries([]);
  }, [duration, activities, klaatuEarned, klaatuSpent, xpEntries, notes, onSubmit]);

  const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-600 transition-colors';
  const btnCls = 'px-3 py-1.5 rounded-md text-xs font-medium transition-colors';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Log Session</h3>
      </div>

      {/* Duration + Klaatu row */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Duration (min)</label>
          <input
            type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)}
            placeholder="60" className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Klaatu Earned</label>
          <input
            type="number" min="0" value={klaatuEarned} onChange={(e) => setKlaatuEarned(e.target.value)}
            placeholder="0" className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Klaatu Spent</label>
          <input
            type="number" min="0" value={klaatuSpent} onChange={(e) => setKlaatuSpent(e.target.value)}
            placeholder="0" className={inputCls}
          />
        </div>
      </div>

      {/* Activities */}
      <div>
        <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Activities</label>
        <div className="flex items-center gap-2 mb-2">
          <select value={actType} onChange={(e) => setActType(e.target.value as ActivityType)} className={`${inputCls} w-28`}>
            {ACTIVITY_TYPES.map((t) => (
              <option key={t} value={t}>{ACTIVITY_LABELS[t]}</option>
            ))}
          </select>
          <input
            type="text" value={actDetail} onChange={(e) => setActDetail(e.target.value)}
            placeholder="What did you do?" className={`${inputCls} flex-1`}
            onKeyDown={(e) => e.key === 'Enter' && addActivity()}
          />
          <input
            type="text" value={actPlanet} onChange={(e) => setActPlanet(e.target.value)}
            placeholder="Planet" className={`${inputCls} w-24`}
          />
          <button onClick={addActivity} className={`${btnCls} bg-teal-800/40 text-teal-300 hover:bg-teal-800/60`}>+</button>
        </div>
        {activities.length > 0 && (
          <div className="space-y-1 mb-2">
            {activities.map((act, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${ACTIVITY_COLORS[act.type]}`}>
                  {ACTIVITY_LABELS[act.type]}
                </span>
                <span className="text-xs text-slate-300 flex-1 truncate">{act.detail}</span>
                {act.planet && <span className="text-[10px] text-slate-500">{act.planet}</span>}
                <button onClick={() => removeActivity(i)} className="text-xs text-slate-600 hover:text-red-400">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* XP Gains */}
      <div>
        <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">XP Gained</label>
        <div className="flex items-center gap-2 mb-2">
          <select value={xpProf} onChange={(e) => setXpProf(e.target.value)} className={`${inputCls} flex-1`}>
            <option value="">— Profession —</option>
            {ALL_PROFESSIONS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="number" min="1" value={xpAmount} onChange={(e) => setXpAmount(e.target.value)}
            placeholder="XP" className={`${inputCls} w-20`}
            onKeyDown={(e) => e.key === 'Enter' && addXp()}
          />
          <button onClick={addXp} className={`${btnCls} bg-violet-800/40 text-violet-300 hover:bg-violet-800/60`}>+</button>
        </div>
        {xpEntries.length > 0 && (
          <div className="space-y-1 mb-2">
            {xpEntries.map((entry) => {
              const prof = ALL_PROFESSIONS.find((p) => p.id === entry.profId);
              return (
                <div key={entry.profId} className="flex items-center gap-2">
                  <span className="text-xs text-slate-300">{prof?.name ?? entry.profId}</span>
                  <span className="text-xs text-violet-400 font-mono">+{entry.xp} XP</span>
                  <button onClick={() => removeXp(entry.profId)} className="text-xs text-slate-600 hover:text-red-400 ml-auto">×</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Notes</label>
        <textarea
          value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional session notes..." rows={2}
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!duration || parseInt(duration, 10) <= 0}
        className={`${btnCls} w-full bg-cyan-800/50 text-cyan-200 hover:bg-cyan-800/70 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        Log Session
      </button>
    </div>
  );
}
