/**
 * patch-notes/page.tsx
 * Patch Notes Tracker — Stars Reach alpha changelog.
 * One concern: render published Supabase rows; fall back to static data when none exist.
 *
 * Server component. Reads patch_notes_imports (published) first.
 * Static PATCH_NOTES used as fallback while the import table is empty.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import { NavHeader } from '@/components/ui/nav-header';
import { createClient } from '@/lib/supabase/server';
import { PATCH_NOTES } from '@/data/patch-notes/index';
import type { PatchNote, PatchChange } from '@/data/patch-notes/types';

const SPACE = 'https://i0.wp.com/starsreach.com/wp-content/uploads/2025/01/SR_Heroic_Space_Steam.jpg';

export const metadata: Metadata = {
  title: 'Patch Notes — Kodaxa Studios',
  description: 'Curated changelog of Stars Reach alpha updates. Sourced from dev blogs and patch notes.',
};

interface DbRow {
  id: string;
  title: string;
  version_label: string | null;
  category: string;
  release_date: string | null;
  summary: string;
  bullet_points: Array<{ type: string; text: string }>;
  source_url: string;
}

function dbRowToPatchNote(row: DbRow): PatchNote {
  return {
    id:        row.id,
    version:   row.version_label ?? '',
    date:      row.release_date
      ? new Date(row.release_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : '',
    title:     row.title,
    type:      (row.category as PatchNote['type']) ?? 'minor',
    summary:   row.summary || undefined,
    changes:   row.bullet_points.map((b) => ({
      type: (b.type as PatchChange['type']) ?? 'changed',
      text: b.text,
    })),
    sourceUrl: row.source_url,
  };
}

export default async function PatchNotesPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from('patch_notes_imports')
    .select('id, title, version_label, category, release_date, summary, bullet_points, source_url')
    .eq('status', 'published')
    .order('release_date', { ascending: false });

  const notes: PatchNote[] =
    rows && rows.length > 0
      ? (rows as DbRow[]).map(dbRowToPatchNote)
      : PATCH_NOTES;

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <NavHeader />
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        <div className="relative overflow-hidden border border-sr-border bg-sr-surface/30 px-5 py-4 mb-6 space-y-1">
          <Image src={SPACE} alt="" fill className="object-cover opacity-[0.12] pointer-events-none" aria-hidden="true" />
          <p className="relative z-10 text-[9px] font-mono uppercase tracking-[0.3em] text-violet-600">
            Dispatch Division // Patch Analysis
          </p>
          <h1 className="relative z-10 text-2xl font-bold text-slate-100">Patch Notes</h1>
          <p className="relative z-10 text-sm text-slate-500">
            Curated from official Stars Reach dev blogs and patch notes. Not affiliated with Playable Worlds.
          </p>
        </div>

        <div className="space-y-6">
          {notes.map((note) => (
            <article key={note.id} className="border border-slate-700 bg-slate-800/30 overflow-hidden">
              <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-700/50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wide ${
                        note.type === 'major'
                          ? 'bg-cyan-800/60 text-cyan-300'
                          : note.type === 'balance'
                            ? 'bg-amber-800/60 text-amber-300'
                            : note.type === 'hotfix'
                              ? 'bg-orange-900/60 text-orange-300'
                              : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {note.type}
                    </span>
                    {note.version && (
                      <span className="text-xs font-mono text-slate-500">{note.version}</span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-slate-100">{note.title}</h2>
                </div>
                <time className="text-xs text-slate-500 shrink-0 mt-1">{note.date}</time>
              </div>

              <div className="px-5 py-4 space-y-3">
                {note.summary && (
                  <p className="text-sm text-slate-300 leading-relaxed">{note.summary}</p>
                )}
                {note.changes.length > 0 && (
                  <ul className="space-y-1.5">
                    {note.changes.map((change, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <span
                          className={`shrink-0 mt-0.5 text-[10px] font-bold uppercase ${
                            change.type === 'added'
                              ? 'text-teal-400'
                              : change.type === 'changed'
                                ? 'text-cyan-400'
                                : change.type === 'fixed'
                                  ? 'text-amber-400'
                                  : 'text-red-400'
                          }`}
                        >
                          {change.type}
                        </span>
                        <span>{change.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {note.sourceUrl && (
                  <a
                    href={note.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-slate-600 hover:text-cyan-400 transition-colors"
                  >
                    Source →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
