/**
 * admin/patch-notes/page.tsx
 * Patch notes import queue — review drafts and publish to public page.
 * One concern: director-gated list of scraped Stars Reach build notes.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { canManageRoster } from '@/types/corp';
import {
  publishPatchNote,
  unpublishPatchNote,
  deletePatchNote,
  triggerImport,
} from '@/lib/patch-notes/actions';
import { NavHeader } from '@/components/ui/nav-header';

export const metadata = { title: 'Patch Notes Queue — Kodaxa Admin' };

const CATEGORY_COLORS: Record<string, string> = {
  major:   'text-cyan-300   border-cyan-900/50',
  minor:   'text-slate-400  border-slate-700',
  hotfix:  'text-amber-300  border-amber-900/50',
  balance: 'text-violet-300 border-violet-900/50',
  alpha:   'text-teal-300   border-teal-900/50',
};

interface PageProps {
  searchParams: Promise<{ imported?: string; error?: string }>;
}

export default async function AdminPatchNotesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/sign-in?next=/admin/patch-notes');

  const { data: profile } = await supabase
    .from('crafter_profiles').select('role').eq('id', user.id).single();

  if (!canManageRoster(profile?.role ?? 'client')) redirect('/');

  const service = createServiceClient();
  const { data: rows } = await service
    .from('patch_notes_imports')
    .select('id, title, version_label, category, release_date, status, import_hash, source_url, summary, updated_at')
    .order('release_date', { ascending: false });

  const params = await searchParams;
  const importedCount = params.imported ? parseInt(params.imported, 10) : null;
  const importError   = params.error;

  const drafts    = (rows ?? []).filter((r) => r.status === 'draft');
  const published = (rows ?? []).filter((r) => r.status === 'published');

  // Most recent upsert timestamp — proxy for last cron/manual import run
  const lastImportAt = (rows ?? []).reduce<string | null>((latest, r) => {
    if (!r.updated_at) return latest;
    return !latest || r.updated_at > latest ? r.updated_at : latest;
  }, null);
  const lastImportLabel = lastImportAt
    ? new Date(lastImportAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'No imports yet';

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <NavHeader />
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">

        {/* Header */}
        <div className="border border-sr-border bg-sr-surface/30 px-5 py-4 mb-6">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-violet-600 mb-1">
            Admin // Patch Notes Queue
          </p>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-xl font-bold text-slate-100">Import Queue</h1>
            <form action={triggerImport}>
              <button
                type="submit"
                className="text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-cyan-700/60 text-cyan-300 bg-cyan-600/10 hover:bg-cyan-600/20 transition-colors"
              >
                Import Latest →
              </button>
            </form>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {drafts.length} draft{drafts.length !== 1 ? 's' : ''} ·{' '}
            {published.length} published ·{' '}
            <span className="text-slate-600">last import: {lastImportLabel}</span>
          </p>
        </div>

        {/* Status banners */}
        {importedCount !== null && (
          <div className="mb-4 px-4 py-2 border border-teal-800/50 bg-teal-950/30 text-teal-300 text-xs font-mono">
            Import complete — {importedCount} post{importedCount !== 1 ? 's' : ''} upserted as drafts.
          </div>
        )}
        {importError && (
          <div className="mb-4 px-4 py-2 border border-red-800/50 bg-red-950/30 text-red-400 text-xs font-mono">
            {importError === 'forbidden' ? 'Insufficient clearance.' : 'Import failed — check server logs.'}
          </div>
        )}

        {/* Drafts */}
        {drafts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-600 mb-3">Drafts</h2>
            <div className="space-y-3">
              {drafts.map((row) => (
                <PatchRow key={row.id} row={row} />
              ))}
            </div>
          </section>
        )}

        {/* Published */}
        {published.length > 0 && (
          <section>
            <h2 className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-600 mb-3">Published</h2>
            <div className="space-y-3">
              {published.map((row) => (
                <PatchRow key={row.id} row={row} />
              ))}
            </div>
          </section>
        )}

        {(rows ?? []).length === 0 && (
          <p className="text-sm text-slate-600 text-center py-16">
            No imports yet — click Import Latest to pull from Stars Reach.
          </p>
        )}
      </main>
    </div>
  );

  function PatchRow({ row }: { row: typeof rows extends (infer T)[] | null ? T : never }) {
    const isDraft = row.status === 'draft';
    const catColor = CATEGORY_COLORS[row.category] ?? 'text-slate-400 border-slate-700';

    return (
      <article className="border border-slate-700 bg-slate-800/20 px-4 py-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className={`text-[9px] font-mono uppercase border px-1.5 py-0.5 ${catColor}`}>
                {row.category}
              </span>
              {row.version_label && (
                <span className="text-[10px] font-mono text-slate-500">{row.version_label}</span>
              )}
              <span className={`text-[9px] font-mono uppercase ${isDraft ? 'text-amber-500' : 'text-teal-400'}`}>
                {row.status}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-200 truncate">{row.title}</p>
            {row.release_date && (
              <p className="text-[10px] text-slate-600 mt-0.5">{row.release_date}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {isDraft ? (
              <form action={publishPatchNote.bind(null, row.id)}>
                <button type="submit"
                  className="text-[9px] font-mono uppercase px-2 py-1 border border-teal-800/60 text-teal-300 hover:bg-teal-950/40 transition-colors">
                  Publish
                </button>
              </form>
            ) : (
              <form action={unpublishPatchNote.bind(null, row.id)}>
                <button type="submit"
                  className="text-[9px] font-mono uppercase px-2 py-1 border border-slate-700 text-slate-500 hover:text-amber-400 hover:border-amber-900/50 transition-colors">
                  Retract
                </button>
              </form>
            )}
            <form action={deletePatchNote.bind(null, row.id)}>
              <button type="submit"
                className="text-[9px] font-mono uppercase px-2 py-1 border border-slate-800 text-slate-700 hover:text-red-400 hover:border-red-900/40 transition-colors">
                Delete
              </button>
            </form>
          </div>
        </div>
      </article>
    );
  }
}
