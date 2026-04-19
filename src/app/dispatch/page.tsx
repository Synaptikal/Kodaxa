/**
 * dispatch/page.tsx
 * Dispatch index — Kodaxa Studios newsroom.
 * One concern: list all posts with category chips, newest first.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { NavHeader } from '@/components/ui/nav-header';
import { getAllPostsMerged, getMergedDispatchStats } from '@/data/dispatch/merged';
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from '@/types/dispatch';

export const metadata: Metadata = {
  title: 'Dispatch — Kodaxa Studios',
  description:
    'The Kodaxa Studios newsroom. Field reports, patch recaps, charter announcements, and recruitment dispatches across the Stars Reach corporation.',
};

export const revalidate = 60;

export default async function DispatchIndexPage() {
  const [posts, stats] = await Promise.all([
    getAllPostsMerged(),
    getMergedDispatchStats(),
  ]);

  return (
    <div className="flex flex-col min-h-dvh">
      <NavHeader />

      <header className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-1">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-500">
            Dispatch Division // Newsroom
          </p>
          <h1 className="text-2xl font-bold text-slate-100">Dispatch</h1>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            {stats.total} posts on record · last filed {stats.latest ?? '—'}.
            All posts are open-data; if you spot a factual error, file a note
            with Intelligence and we&apos;ll update the entry.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-4">
        {posts.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-12">
            No dispatches filed yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/dispatch/${post.slug}`}
                  className="block border border-slate-800 bg-slate-900/40 p-5 hover:border-cyan-800/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[post.category]}`}
                      >
                        {CATEGORY_LABELS[post.category]}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {post.published_at}
                      </span>
                      <span className="text-xs font-mono text-sr-muted">
                        · {post.author}
                      </span>
                    </div>
                  </div>

                  {post.eyebrow && (
                    <p className="text-xs font-mono uppercase tracking-[0.18em] text-slate-500 mb-1">
                      {post.eyebrow}
                    </p>
                  )}

                  <h2 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-sm text-slate-400 leading-relaxed mt-1">
                    {post.summary}
                  </p>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
