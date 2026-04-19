/**
 * dispatch/[slug]/page.tsx
 * Single Dispatch post renderer.
 * One concern: load a post by slug, render header + blocks + prev/next nav.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { NavHeader } from '@/components/ui/nav-header';
import { PostRenderer } from '@/components/dispatch/post-renderer';
import { getAllPosts } from '@/data/dispatch';
import {
  getPostBySlugMerged,
  getAdjacentPostsMerged,
} from '@/data/dispatch/merged';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/types/dispatch';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Static params for flat-file posts; DB posts resolve dynamically
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugMerged(slug);
  if (!post) return { title: 'Dispatch — Kodaxa Studios' };
  return {
    title: `${post.title} — Dispatch — Kodaxa Studios`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function DispatchPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlugMerged(slug);
  if (!post) notFound();

  const { prev, next } = await getAdjacentPostsMerged(slug);

  return (
    <div className="flex flex-col min-h-dvh">
      <NavHeader />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link href="/dispatch" className="hover:text-cyan-400 transition-colors">
            Dispatch
          </Link>
          <span>/</span>
          <span className="text-slate-400">{post.slug}</span>
        </div>

        {/* Hero */}
        <header className="relative overflow-hidden border border-slate-800 bg-slate-900/30 px-4 pt-4 pb-5 space-y-3">
          <Image
            src="https://i0.wp.com/starsreach.com/wp-content/uploads/2025/01/SR_Surveying-Space_V2.jpg"
            alt="" fill className="object-cover opacity-[0.1] pointer-events-none" aria-hidden="true"
          />
          <div className="relative z-10 space-y-3">
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

          {post.eyebrow && (
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
              {post.eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            {post.title}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">{post.summary}</p>
          </div>
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
                className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
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
              className="flex-1 border border-slate-800 bg-slate-900/40 p-3 hover:border-cyan-800/50 transition-colors"
            >
              <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
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
              className="flex-1 border border-slate-800 bg-slate-900/40 p-3 hover:border-cyan-800/50 transition-colors text-right"
            >
              <p className="text-xs font-mono uppercase tracking-wider text-slate-500">
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
