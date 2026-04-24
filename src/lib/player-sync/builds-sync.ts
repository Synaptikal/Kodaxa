/**
 * builds-sync.ts
 * Supabase persistence for saved skill builds.
 * One concern: push/pull/merge SavedBuild arrays against crafter_profiles.builds_data.
 *
 * Requires this column to exist (run once in Supabase SQL editor):
 *   ALTER TABLE crafter_profiles
 *   ADD COLUMN IF NOT EXISTS builds_data jsonb DEFAULT '[]'::jsonb;
 *
 * Design: localStorage is the primary store (instant, offline-safe).
 * Supabase is the backup/sync layer — written async on every mutation,
 * read once on login and merged into localStorage.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { SavedBuild } from '@/hooks/use-saved-builds';

const MAX_SAVES = 20;

/** Push the current build list to Supabase for the authenticated user. */
export async function pushBuilds(
  supabase: SupabaseClient,
  userId: string,
  builds: SavedBuild[],
): Promise<void> {
  await supabase
    .from('crafter_profiles')
    .update({ builds_data: builds })
    .eq('id', userId);
}

/** Pull the stored build list from Supabase. Returns [] on any error. */
export async function pullBuilds(
  supabase: SupabaseClient,
  userId: string,
): Promise<SavedBuild[]> {
  const { data } = await supabase
    .from('crafter_profiles')
    .select('builds_data')
    .eq('id', userId)
    .single();

  if (!Array.isArray(data?.builds_data)) return [];
  return data.builds_data as SavedBuild[];
}

/**
 * Merge remote and local build arrays.
 * Remote wins on name collision (Supabase is source of truth after first sync).
 * Result is sorted newest-first and capped at MAX_SAVES.
 */
export function mergeBuilds(
  remote: SavedBuild[],
  local: SavedBuild[],
): SavedBuild[] {
  const merged = new Map<string, SavedBuild>();
  for (const b of local)  merged.set(b.name.toLowerCase(), b);
  for (const b of remote) merged.set(b.name.toLowerCase(), b);
  return Array.from(merged.values())
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
    .slice(0, MAX_SAVES);
}
