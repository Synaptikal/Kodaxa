/**
 * data/dispatch/merged.ts
 * Async query helpers that merge flat-file posts (build-time) with
 * DB-backed posts (runtime). DB posts take precedence on slug collision.
 *
 * One concern: unified read layer for all public dispatch pages.
 * Authoring (admin) reads from lib/dispatch/queries.ts directly.
 */

import type { DispatchPost } from '@/types/dispatch';
import { getAllPosts as getStaticPosts, getPostBySlug as getStaticPostBySlug } from './index';
import { getPublishedDbPosts, getPublishedDbPostBySlug } from '@/lib/dispatch/queries';

/** All published posts from both sources, sorted newest first */
export async function getAllPostsMerged(): Promise<DispatchPost[]> {
  const [staticPosts, dbPosts] = await Promise.all([
    Promise.resolve(getStaticPosts()),
    getPublishedDbPosts(),
  ]);

  // DB slugs take precedence — exclude static posts that have been superseded
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const filtered = staticPosts.filter((p) => !dbSlugs.has(p.slug));

  return [...filtered, ...dbPosts].sort((a, b) =>
    (b.published_at ?? '').localeCompare(a.published_at ?? ''),
  );
}

/** Single post by slug — DB-first, falls back to flat file */
export async function getPostBySlugMerged(slug: string): Promise<DispatchPost | null> {
  const [dbPost, staticPost] = await Promise.all([
    getPublishedDbPostBySlug(slug),
    Promise.resolve(getStaticPostBySlug(slug) ?? null),
  ]);
  return dbPost ?? staticPost;
}

/** Adjacent posts across merged set */
export async function getAdjacentPostsMerged(slug: string): Promise<{
  prev: DispatchPost | null;
  next: DispatchPost | null;
}> {
  const all = await getAllPostsMerged();
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    next: index > 0 ? all[index - 1] : null,
    prev: index < all.length - 1 ? all[index + 1] : null,
  };
}

/** Stats for the dispatch index header */
export async function getMergedDispatchStats(): Promise<{ total: number; latest: string | null }> {
  const posts = await getAllPostsMerged();
  return {
    total: posts.length,
    latest: posts[0]?.published_at ?? null,
  };
}
