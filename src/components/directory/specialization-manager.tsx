/**
 * specialization-manager.tsx
 * Add and remove crafter specializations on the profile edit page.
 * One concern: managing the list of professions a crafter offers.
 */

'use client';

import { useState, useTransition } from 'react';
import type {
  CrafterSpecialization,
  DirectoryProfessionCategory,
  SkillLevel,
} from '@/types/directory';
import { SKILL_LEVEL_LABELS } from '@/types/directory';
import { addSpecialization, removeSpecialization } from '@/lib/directory/actions';

export interface SpecializationManagerProps {
  specializations: CrafterSpecialization[];
  /** All professions available to pick from */
  professionOptions: { id: string; name: string; category: DirectoryProfessionCategory }[];
}

const CATEGORY_CHIP: Record<string, string> = {
  crafting:       'bg-orange-900/40 text-orange-300 border-orange-800/40',
  harvesting:     'bg-lime-900/40 text-lime-300 border-lime-800/40',
  scouting:       'bg-emerald-900/40 text-emerald-300 border-emerald-800/40',
  combat:         'bg-red-900/40 text-red-300 border-red-800/40',
  social:         'bg-sky-900/40 text-sky-300 border-sky-800/40',
  science:        'bg-violet-900/40 text-violet-300 border-violet-800/40',
  infrastructure: 'bg-amber-900/40 text-amber-300 border-amber-800/40',
};

const selectClass =
  'bg-slate-900 border border-slate-600 rounded-md px-2 py-1.5 text-xs text-slate-300 focus:border-cyan-400 focus:outline-none';

const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'expert'];

export function SpecializationManager({
  specializations,
  professionOptions,
}: SpecializationManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel | ''>('');
  const [notes, setNotes] = useState('');

  const existingIds = new Set(specializations.map((s) => s.profession_id));
  const available = professionOptions.filter((p) => !existingIds.has(p.id));

  const handleAdd = () => {
    const prof = professionOptions.find((p) => p.id === selectedId);
    if (!prof) {
      setError('Please select a profession.');
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = await addSpecialization({
        profession_id: prof.id,
        profession_name: prof.name,
        category: prof.category,
        skill_level: skillLevel || undefined,
        notes: notes.trim() || undefined,
      });
      if (result.success) {
        setSelectedId('');
        setSkillLevel('');
        setNotes('');
      } else {
        setError(result.error ?? 'Failed to add specialization.');
      }
    });
  };

  const handleRemove = (id: string) => {
    startTransition(async () => {
      await removeSpecialization(id);
    });
  };

  return (
    <div className="space-y-4">
      {/* Current specializations */}
      {specializations.length === 0 ? (
        <p className="text-xs text-slate-500">No specializations added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {specializations.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                CATEGORY_CHIP[s.category] ?? 'bg-slate-700 text-slate-300 border-slate-600'
              }`}
            >
              <span className="font-medium">{s.profession_name}</span>
              {s.skill_level && (
                <span className="opacity-70">· {SKILL_LEVEL_LABELS[s.skill_level]}</span>
              )}
              <button
                onClick={() => handleRemove(s.id)}
                disabled={isPending}
                className="opacity-60 hover:opacity-100 transition-opacity leading-none"
                aria-label={`Remove ${s.profession_name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {available.length > 0 && (
        <div className="flex flex-wrap gap-2 items-end pt-1">
          <div>
            <p className="text-[10px] text-slate-500 mb-1">Profession</p>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className={selectClass}
            >
              <option value="">Select profession…</option>
              {available.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 mb-1">Skill Level</p>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as SkillLevel | '')}
              className={selectClass}
            >
              <option value="">Any</option>
              {SKILL_LEVELS.map((l) => (
                <option key={l} value={l}>{SKILL_LEVEL_LABELS[l]}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-32">
            <p className="text-[10px] text-slate-500 mb-1">Notes (optional)</p>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. specializes in T3 only"
              maxLength={120}
              className="w-full bg-slate-900 border border-slate-600 rounded-md px-2 py-1.5 text-xs text-slate-300 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={isPending || !selectedId}
            className="px-3 py-1.5 rounded-md bg-slate-700 text-slate-200 text-xs font-medium hover:bg-slate-600 disabled:opacity-40 transition-colors"
          >
            + Add
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
