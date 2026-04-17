/**
 * dispatch/[slug]/page.tsx
 * Single Dispatch post renderer.
 * One concern: load a post by slug, render header + blocks + prev/next nav.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NavHeader } from '@/components/ui/nav-header';
import { PostRenderer } from '@/components/dispatch/post-renderer';
import {
  getPostBySlug,
  getAllPosts,
  getAdjacentPosts,
} from '@/data/dispatch';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/types/dispatch';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Enable static rendering for all known posts
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Dispatch — Kodaxa Studios' };
  return {
    title: `${post.title} — Dispatch — Kodaxa Studios`,
    description: post.summary,
  };
}

export default async function DispatchPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <div className="flex flex-col min-h-dvh">
      <NavHeader />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
          <Link href="/dispatch" className="hover:text-cyan-400 transition-colors">
            Dispatch
          </Link>
          <span>/</span>
          <span className="text-slate-400">{post.slug}</span>
        </div>

        {/* Hero */}
        <header className="space-y-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[post.category]}`}
            >
              {CATEGORY_LABELS[post.category]}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {post.published_at}
            </span>
            <span className="text-[10px] font-mono text-slate-600">
              · {post.author}
            </span>
          </div>

          {post.eyebrow && (
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
              {post.eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            {post.title}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">{post.summary}</p>
        </header>

        {/* Body */}
        <article>
          <PostRenderer blocks={post.content} />
        </article>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-4 border-t border-slate-800">
            {post.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Prev / next */}
        <nav className="flex items-stretch justify-between gap-3 pt-4">
          {prev ? (
            <Link
              href={`/dispatch/${prev.slug}`}
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900/40 p-3 hover:border-cyan-800/50 transition-colors"
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                ← Previous
              </p>
              <p className="text-xs text-slate-200 mt-0.5">{prev.title}</p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/dispatch/${next.slug}`}
              className="flex-1 rounded-lg border border-slate-800 bg-slate-900/40 p-3 hover:border-cyan-800/50 transition-colors text-right"
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Next →
              </p>
              <p className="text-xs text-slate-200 mt-0.5">{next.title}</p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </main>
    </div>
  );
}
