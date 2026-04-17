/**
 * patch-notes/page.tsx
 * Patch Notes Tracker — curated alpha update changelog.
 * One concern: static chronological list of Stars Reach alpha updates.
 *
 * Server component. Data lives in src/data/patch-notes/index.ts.
 */

import type { Metadata } from 'next';
import { NavHeader } from '@/components/ui/nav-header';
import { PATCH_NOTES } from '@/data/patch-notes/index';

export const metadata: Metadata = {
  title: 'Patch Notes — Kodaxa Studios',
  description: 'Curated changelog of Stars Reach alpha updates. Sourced from dev blogs and patch notes.',
};

export default function PatchNotesPage() {
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <NavHeader />
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100">Patch Notes</h1>
          <p className="text-sm text-slate-500 mt-1">
            Curated from official Stars Reach dev blogs and patch notes. Not affiliated with Playable Worlds.
          </p>
        </div>

        <div className="space-y-6">
          {PATCH_NOTES.map((note) => (
            <article key={note.id} className="rounded-xl border border-slate-700 bg-slate-800/30 overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-700/50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                        note.type === 'major'
                          ? 'bg-cyan-800/60 text-cyan-300'
                          : note.type === 'balance'
                            ? 'bg-amber-800/60 text-amber-300'
                            : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {note.type}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{note.version}</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-100">{note.title}</h2>
                </div>
                <time className="text-xs text-slate-500 shrink-0 mt-1">{note.date}</time>
              </div>

              {/* Body */}
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
