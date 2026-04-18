/**
 * lib/dispatch/queries.ts
 * Server-side reads for DB-backed dispatch posts.
 * One concern: fetch posts from Supabase dispatch_posts table.
 *
 * Used by: merged data helpers, HQ admin pages.
 * Public pages read via merged.ts (which combines these with flat files).
 */

import { createClient } from '@/lib/supabase/server';
import type { DispatchPost } from '@/types/dispatch';

/** All published posts — for public dispatch pages */
export async function getPublishedDbPosts(): Promise<DispatchPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dispatch_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[dispatch/queries] getPublishedDbPosts:', error.message);
    return [];
  }
  return (data ?? []) as DispatchPost[];
}

/** Single published post by slug — for public post page */
export async function getPublishedDbPostBySlug(slug: string): Promise<DispatchPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dispatch_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;
  return data as DispatchPost;
}

/** All posts including drafts — for HQ editor */
export async function getAllDbPosts(): Promise<DispatchPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dispatch_posts')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[dispatch/queries] getAllDbPosts:', error.message);
    return [];
  }
  return (data ?? []) as DispatchPost[];
}

/** Any status by slug — for HQ editor */
export async function getDbPostBySlug(slug: string): Promise<DispatchPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dispatch_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as DispatchPost;
}
