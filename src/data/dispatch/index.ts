/**
 * dispatch/index.ts
 * Registry of all Dispatch posts + query helpers.
 * One concern: collect post modules and expose sorted/filtered lookups.
 *
 * Add a new post by creating a file under ./posts/ and importing it here.
 * Keep this file under the 400-line limit.
 */

import type { DispatchPost, DispatchCategory } from '@/types/dispatch';

import { post as charterV1 } from './posts/charter-v1';
import { post as twilightManifest } from './posts/twilight-creature-manifest';
import { post as scoutCall } from './posts/open-horizons-scout-call';
import { post as buildingPlannerDeploy } from './posts/building-planner-deploy';
import { post as crafterDirectoryLaunch } from './posts/crafter-directory-launch';
import { post as ocrPipelineBrief } from './posts/ocr-pipeline-brief';

const POSTS: DispatchPost[] = [
  charterV1,
  twilightManifest,
  scoutCall,
  buildingPlannerDeploy,
  crafterDirectoryLaunch,
  ocrPipelineBrief,
];

// Sort by published_at DESC once, reuse.
const SORTED: DispatchPost[] = [...POSTS].sort((a, b) =>
  b.published_at.localeCompare(a.published_at),
);

// ── Queries ──────────────────────────────────────────────────────────

export function getAllPosts(): DispatchPost[] {
  return SORTED;
}

export function getPostBySlug(slug: string): DispatchPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: DispatchCategory): DispatchPost[] {
  return SORTED.filter((p) => p.category === category);
}

export function getPostsByTag(tag: string): DispatchPost[] {
  const t = tag.toLowerCase();
  return SORTED.filter((p) => p.tags.some((x) => x.toLowerCase() === t));
}

export function getLatestPosts(limit = 3): DispatchPost[] {
  return SORTED.slice(0, limit);
}

export function getAdjacentPosts(slug: string): {
  prev: DispatchPost | null;
  next: DispatchPost | null;
} {
  const index = SORTED.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    next: index > 0 ? SORTED[index - 1] : null,
    prev: index < SORTED.length - 1 ? SORTED[index + 1] : null,
  };
}

export function getDispatchStats() {
  const byCat: Partial<Record<DispatchCategory, number>> = {};
  for (const p of POSTS) {
    byCat[p.category] = (byCat[p.category] ?? 0) + 1;
  }
  return {
    total: POSTS.length,
    byCategory: byCat,
    latest: SORTED[0]?.published_at ?? null,
  };
}
