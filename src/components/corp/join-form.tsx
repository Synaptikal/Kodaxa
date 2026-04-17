'use client';

import { useState, useTransition } from 'react';
import { submitApplication } from '@/lib/corp/actions';
import type { ApplicationTrack, Availability } from '@/types/corp';
import { TRACK_LABELS, AVAILABILITY_LABELS } from '@/types/corp';

const TRACKS: ApplicationTrack[] = ['crafter', 'data_contributor', 'builder', 'other'];
const AVAILABILITIES: Availability[] = ['casual', 'semi_active', 'active'];

export function JoinForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    inGameName:    '',
    discordHandle: '',
    track:         'crafter' as ApplicationTrack,
    motivation:    '',
    availability:  'semi_active' as Availability,
    professions:   '',
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.inGameName.trim() || !form.motivation.trim()) {
      setError('In-game name and motivation statement are required.');
      return;
    }
    startTransition(async () => {
      const profs = form.professions.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await submitApplication({
        inGameName:    form.inGameName.trim(),
        discordHandle: form.discordHandle.trim() || undefined,
        track:         form.track,
        motivation:    form.motivation.trim(),
        professions:   profs.length > 0 ? profs : undefined,
        availability:  form.availability,
      });
      if (res.success) setSubmitted(true);
      else setError(res.error ?? 'Submission failed. Please try again.');
    });
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4 py-10">
        <p className="text-2xl font-mono text-teal-400">◎ APPLICATION FILED</p>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Your application is under review. A Division Head will respond via Discord or in-game within 48 hours.
        </p>
        <p className="text-xs text-slate-600 font-mono">Kodaxa Studios — Personnel Division</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-[10px] font-mono text-red-400 border border-red-800/40 bg-red-900/10 px-3 py-2">{error}</p>
      )}

      {/* Identity */}
      <Section label="Identity">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="In-Game Character Name *">
            <input
              value={form.inGameName}
              onChange={(e) => set('inGameName', e.target.value)}
              placeholder="Your Stars Reach character name"
              className={INPUT_CLS}
              required
            />
          </Field>
          <Field label="Discord Handle">
            <input
              value={form.discordHandle}
              onChange={(e) => set('discordHandle', e.target.value)}
              placeholder="username (optional)"
              className={INPUT_CLS}
            />
          </Field>
        </div>
      </Section>

      {/* Division track */}
      <Section label="Division Track">
        <p className="text-[10px] text-slate-500 mb-3">Which division are you applying to join?</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {TRACKS.map((t) => (
            <label key={t} className={`flex items-start gap-2.5 p-3 border cursor-pointer transition-colors ${
              form.track === t ? 'border-cyan-600/50 bg-cyan-900/15 text-cyan-300' : 'border-sr-border hover:border-slate-600 text-slate-400'
            }`}>
              <input
                type="radio"
                name="track"
                value={t}
                checked={form.track === t}
                onChange={() => set('track', t)}
                className="mt-0.5 accent-cyan-500"
              />
              <div>
                <p className="text-xs font-mono font-semibold">{TRACK_LABELS[t]}</p>
              </div>
            </label>
          ))}
        </div>
      </Section>

      {/* Professions + availability */}
      <Section label="Background">
        <div className="space-y-4">
          <Field label="Professions / Skills" hint="Comma-separated, e.g. Weaponsmithing, Metallurgy">
            <input
              value={form.professions}
              onChange={(e) => set('professions', e.target.value)}
              placeholder="e.g. Architect, Woodworking, Cooking"
              className={INPUT_CLS}
            />
          </Field>
          <Field label="Play Availability">
            <div className="flex gap-2 flex-wrap">
              {AVAILABILITIES.map((a) => (
                <label key={a} className={`px-3 py-1.5 text-[9px] font-mono font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                  form.availability === a
                    ? 'border-teal-600/50 bg-teal-900/15 text-teal-300'
                    : 'border-sr-border text-slate-500 hover:border-slate-600'
                }`}>
                  <input type="radio" name="availability" value={a} checked={form.availability === a} onChange={() => set('availability', a)} className="sr-only" />
                  {AVAILABILITY_LABELS[a]}
                </label>
              ))}
            </div>
          </Field>
        </div>
      </Section>

      {/* Motivation */}
      <Section label="Motivation Statement">
        <Field label="Why do you want to join Kodaxa Studios? *" hint="Be specific — what will you contribute?">
          <textarea
            value={form.motivation}
            onChange={(e) => set('motivation', e.target.value)}
            placeholder="Tell us what you bring to the corporation and what you want to build here..."
            className={`${INPUT_CLS} h-28 resize-none`}
            required
          />
        </Field>
      </Section>

      <div className="flex items-center justify-between pt-2">
        <p className="text-[9px] font-mono text-slate-600">
          Applications reviewed within 48 hours
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-cyan-900/30 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900/50 transition-colors disabled:opacity-40"
        >
          {isPending ? 'Filing...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}

const INPUT_CLS = 'w-full bg-sr-bg border border-sr-border px-2 py-1.5 text-xs font-mono text-slate-300 focus:border-cyan-700 focus:outline-none';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-600 shrink-0">{label}</p>
        <div className="h-px flex-1 bg-sr-border" />
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[8px] font-mono uppercase tracking-widest text-slate-500">
        {label}{hint && <span className="text-slate-700 normal-case tracking-normal ml-1">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
