/**
 * profile-edit-form.tsx
 * Form for creating or updating a crafter's profile fields.
 * One concern: collecting and submitting profile data via upsertCrafterProfile.
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { CrafterProfile, CommissionStatus, Species } from '@/types/directory';
import { COMMISSION_LABELS, SPECIES_LABELS } from '@/types/directory';
import { upsertCrafterProfile } from '@/lib/directory/actions';

export interface ProfileEditFormProps {
  existing?: CrafterProfile | null;
}

const COMMISSION_OPTIONS: CommissionStatus[] = ['open', 'limited', 'closed', 'unknown'];
const SPECIES_OPTIONS: Species[] = ['terran', 'elioni', 'skwatchi', 'gertan', 'hansian', 'hyugon', 'fae', 'stokadi'];

const inputClass =
  'w-full bg-sr-bg border border-sr-border px-3 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-700 focus:border-cyan-700 focus:outline-none transition-colors';

const labelClass = 'block text-[8px] font-mono text-slate-600 uppercase tracking-[0.25em] mb-1';

export function ProfileEditForm({ existing }: ProfileEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fields, setFields] = useState({
    display_name: existing?.display_name ?? '',
    in_game_name: existing?.in_game_name ?? '',
    bio: existing?.bio ?? '',
    maker_mark: existing?.maker_mark ?? '',
    home_planet: existing?.home_planet ?? '',
    home_sector: existing?.home_sector ?? '',
    homestead_coords: existing?.homestead_coords ?? '',
    commission_status: existing?.commission_status ?? 'unknown' as CommissionStatus,
    contact_method: existing?.contact_method ?? '',
    species: existing?.species ?? '' as Species | '',
  });

  const set = (key: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = () => {
    if (!fields.display_name.trim() || !fields.in_game_name.trim()) {
      setError('Display name and in-game name are required.');
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = await upsertCrafterProfile({
        ...fields,
        display_name: fields.display_name.trim(),
        in_game_name: fields.in_game_name.trim(),
        bio: fields.bio.trim() || undefined,
        maker_mark: fields.maker_mark.trim() || undefined,
        home_planet: fields.home_planet.trim() || undefined,
        home_sector: fields.home_sector.trim() || undefined,
        homestead_coords: fields.homestead_coords.trim() || undefined,
        contact_method: fields.contact_method.trim() || undefined,
        species: (fields.species as Species) || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/directory/${encodeURIComponent(fields.in_game_name.trim())}`);
        }, 1200);
      } else {
        setError(result.error ?? 'System fault — personnel file transmission failed.');
      }
    });
  };

  if (success) {
    return (
      <div className="border border-teal-700/40 bg-teal-950/20 p-4 text-center">
        <p className="text-xs font-mono text-teal-300 uppercase tracking-wider">✓ Personnel File Committed — Routing…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Operative Handle *</label>
          <input value={fields.display_name} onChange={set('display_name')} placeholder="Your display name" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>In-Game Designator *</label>
          <input value={fields.in_game_name} onChange={set('in_game_name')} placeholder="Exact IGN (unique)" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Commission Status</label>
          <select value={fields.commission_status} onChange={set('commission_status')} className={inputClass}>
            {COMMISSION_OPTIONS.map((s) => (
              <option key={s} value={s}>{COMMISSION_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Species</label>
          <select value={fields.species} onChange={set('species')} className={inputClass}>
            <option value="">— Not specified —</option>
            {SPECIES_OPTIONS.map((s) => (
              <option key={s} value={s}>{SPECIES_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Maker&apos;s Mark</label>
          <input value={fields.maker_mark} onChange={set('maker_mark')} placeholder="e.g. ✦ or initials" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Home Sector</label>
          <input value={fields.home_planet} onChange={set('home_planet')} placeholder="Planet / sector name" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Operational Region</label>
          <input value={fields.home_sector} onChange={set('home_sector')} placeholder="Region or frontier zone" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Homestead Coords</label>
          <input value={fields.homestead_coords} onChange={set('homestead_coords')} placeholder="e.g. 1234, 5678" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Relay Contact</label>
          <input value={fields.contact_method} onChange={set('contact_method')} placeholder="Discord handle, forum tag, etc." className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Operative Brief <span className="normal-case text-slate-700">({fields.bio.length}/500)</span></label>
        <textarea
          value={fields.bio}
          onChange={set('bio')}
          maxLength={500}
          rows={4}
          placeholder="Describe your specializations, experience, and what sets you apart from other operatives…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full py-2.5 bg-cyan-600/20 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wide hover:bg-cyan-600/30 hover:border-cyan-600 disabled:opacity-50 transition-all"
      >
        {isPending ? 'Transmitting…' : existing ? 'Commit Amendments' : 'Issue Personnel File'}
      </button>
    </div>
  );
}
