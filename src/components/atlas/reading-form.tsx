/**
 * reading-form.tsx
 * Client form for submitting a Resource Atlas reading.
 * One concern: collect PQRV + planet + resource and dispatch the server action.
 *
 * Unauthenticated users see a login CTA instead of the form.
 */

'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { submitResourceReading } from '@/lib/atlas/actions';
import {
  RESOURCE_CATEGORIES,
  RESOURCE_CATEGORY_LABELS,
  clampPQRV,
  type ResourceCategory,
} from '@/types/atlas';
import type { Biome } from '@/types/biomes';

export interface ReadingFormProps {
  isAuthenticated: boolean;
  biomes: Biome[];
}

interface FormState {
  resource_name: string;
  category: ResourceCategory | '';
  planet: string;
  biome_id: string;
  coords_hint: string;
  potential: string;
  quality: string;
  resilience: string;
  versatility: string;
  notes: string;
}

const EMPTY: FormState = {
  resource_name: '',
  category: '',
  planet: '',
  biome_id: '',
  coords_hint: '',
  potential: '',
  quality: '',
  resilience: '',
  versatility: '',
  notes: '',
};

export function ReadingForm({ isAuthenticated, biomes }: ReadingFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return (
      <div className="border border-slate-800 bg-slate-900/40 p-6 space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-500">
          Scout Contribution
        </p>
        <h2 className="text-base font-bold font-mono text-slate-100">File Scouting Report</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Anyone can browse the Resource Atlas — but only verified operatives can
          contribute PQRV readings. Establish uplink to file reports.
        </p>
        <Link
          href="/auth/sign-in?next=/atlas"
          className="inline-block text-xs px-3 py-2 bg-amber-900/30 text-amber-300 border border-amber-800/50 font-mono uppercase tracking-wide hover:bg-amber-900/50 transition-colors"
        >
          Establish Uplink →
        </Link>
      </div>
    );
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
    setSuccess(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await submitResourceReading({
        resource_name:     form.resource_name.trim(),
        resource_category: form.category === '' ? null : form.category,
        planet:            form.planet.trim(),
        biome_id:          form.biome_id || null,
        coords_hint:       form.coords_hint.trim() || null,
        potential:         clampPQRV(Number(form.potential)),
        quality:           clampPQRV(Number(form.quality)),
        resilience:        clampPQRV(Number(form.resilience)),
        versatility:       clampPQRV(Number(form.versatility)),
        notes:             form.notes.trim() || null,
      });

      if (!result.success) {
        setError(result.error ?? 'Submission failed.');
        return;
      }
      setSuccess(true);
      setForm(EMPTY);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-slate-800 bg-slate-900/40 p-5 space-y-4"
    >
      <header className="space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-500">
          Scout Contribution
        </p>
        <h2 className="text-base font-bold text-slate-100">File a PQRV reading</h2>
        <p className="text-[11px] text-slate-500">
          All fields sync to the public Atlas — other scouts see your contribution immediately.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Resource name" required>
          <input
            type="text"
            value={form.resource_name}
            onChange={(e) => update('resource_name', e.target.value)}
            placeholder="e.g. Ferrous Iron"
            required
            maxLength={80}
            className={INPUT_CLS}
          />
        </Field>

        <Field label="Category">
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value as ResourceCategory | '')}
            className={INPUT_CLS}
          >
            <option value="">—</option>
            {RESOURCE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {RESOURCE_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Planet" required>
          <input
            type="text"
            value={form.planet}
            onChange={(e) => update('planet', e.target.value)}
            placeholder="e.g. Crucible"
            required
            maxLength={60}
            className={INPUT_CLS}
          />
        </Field>

        <Field label="Biome">
          <select
            value={form.biome_id}
            onChange={(e) => update('biome_id', e.target.value)}
            className={INPUT_CLS}
          >
            <option value="">—</option>
            {biomes.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Coords hint" className="sm:col-span-2">
          <input
            type="text"
            value={form.coords_hint}
            onChange={(e) => update('coords_hint', e.target.value)}
            placeholder='e.g. "NE ridge near the river fork"'
            maxLength={120}
            className={INPUT_CLS}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatInput label="Potential"   value={form.potential}   onChange={(v) => update('potential', v)}   />
        <StatInput label="Quality"     value={form.quality}     onChange={(v) => update('quality', v)}     />
        <StatInput label="Resilience"  value={form.resilience}  onChange={(v) => update('resilience', v)}  />
        <StatInput label="Versatility" value={form.versatility} onChange={(v) => update('versatility', v)} />
      </div>

      <Field label="Notes">
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Anything useful for the next scout. 500 char max."
          maxLength={500}
          rows={2}
          className={INPUT_CLS}
        />
      </Field>

      {error && (
        <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 px-2.5 py-1.5 rounded">
          {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 px-2.5 py-1.5 rounded">
          Reading filed. Thank you, associate.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full text-xs px-4 py-2 rounded-md bg-amber-800/40 text-amber-200 border border-amber-700/50 hover:bg-amber-800/60 disabled:opacity-50 transition-colors font-mono uppercase tracking-wider"
      >
        {isPending ? 'Filing…' : 'File Reading'}
      </button>
    </form>
  );
}

// ── Local UI helpers ─────────────────────────────────────────────────

const INPUT_CLS =
  'w-full px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700 ' +
  'text-xs text-slate-100 placeholder-slate-600 focus:outline-none ' +
  'focus:border-amber-600 focus:ring-1 focus:ring-amber-600/40 transition-colors';

function Field(props: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1 ${props.className ?? ''}`}>
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
        {props.label}
        {props.required && <span className="text-amber-500"> *</span>}
      </span>
      {props.children}
    </label>
  );
}

function StatInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label} required>
      <input
        type="number"
        min={0}
        max={1000}
        step={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0–1000"
        required
        className={INPUT_CLS}
      />
    </Field>
  );
}
