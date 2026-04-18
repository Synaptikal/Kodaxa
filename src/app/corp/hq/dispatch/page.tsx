/**
 * corp/hq/dispatch/page.tsx
 * Dispatch post manager — lists all DB posts (drafts + published).
 * One concern: overview of all authored transmissions with status + actions.
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllDbPosts } from '@/lib/dispatch/queries';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/dispatch';

export const metadata: Metadata = { title: 'Dispatch Manager — Kodaxa HQ' };

export default async function HQDispatchPage() {
  const posts = await getAllDbPosts();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-sr-border bg-sr-surface/40 px-5 py-4 flex items-center justify-between gap-4 shrink-0">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-sr-muted">Dispatch Division</p>
          <h1 className="text-sm font-bold font-mono text-slate-100 mt-0.5">Transmission Manager</h1>
        </div>
        <Link
          href="/corp/hq/dispatch/new"
          className="px-4 py-2 text-[10px] font-mono uppercase tracking-wider border border-cyan-700/60 text-cyan-300 bg-cyan-900/20 hover:bg-cyan-900/40 transition-colors"
        >
          + New Transmission
        </Link>
      </div>

      {/* Post list */}
      <div className="flex-1 overflow-y-auto p-5">
        {posts.length === 0 ? (
          <div className="border border-sr-border bg-sr-surface/20 p-8 text-center">
            <p className="text-xs font-mono text-sr-muted">No transmissions authored yet.</p>
            <p className="text-[10px] font-mono text-sr-subtle mt-1">
              Create your first post to seed the Dispatch.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/corp/hq/dispatch/${post.slug}/edit`}
                className="block border border-sr-border bg-sr-surface/20 p-4 hover:bg-sr-surface/40 hover:border-slate-600 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className={`shrink-0 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 border ${CATEGORY_COLORS[post.category]}`}>
                      {CATEGORY_LABELS[post.category]}
                    </span>
                    <span className={`shrink-0 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 border ${
                      post.status === 'published'
                        ? 'text-teal-400 border-teal-700/40 bg-teal-950/30'
                        : 'text-amber-400 border-amber-700/40 bg-amber-950/30'
                    }`}>
                      ● {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    {post.ref_id && (
                      <span className="text-[9px] font-mono text-sr-subtle">{post.ref_id}</span>
                    )}
                  </div>
                  <span className="shrink-0 text-[10px] font-mono text-sr-subtle">
                    {post.published_at ?? post.updated_at?.slice(0, 10) ?? '—'}
                  </span>
                </div>

                <p className="text-sm font-mono text-slate-200 mt-2 group-hover:text-cyan-300 transition-colors truncate">
                  {post.title}
                </p>
                {post.summary && (
                  <p className="text-xs font-mono text-sr-muted mt-1 line-clamp-1">{post.summary}</p>
                )}

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-sr-subtle">{post.author}</span>
                  <span className="text-[9px] font-mono text-cyan-700 group-hover:text-cyan-500 transition-colors">
                    Edit →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
