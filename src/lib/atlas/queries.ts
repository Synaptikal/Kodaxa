/**
 * queries.ts
 * Supabase read helpers for the Resource Atlas.
 * One concern: fetch aggregated resource stats and raw readings.
 *
 * Invoked from server components. No mutations here — see actions.ts.
 */

import { createClient } from '@/lib/supabase/server';
import type { ResourceReading, ResourceStat } from '@/types/atlas';

export interface AtlasFilters {
  /** Match resource_name or resource_category substring */
  query?: string;
  /** Match planet_key substring */
  planet?: string;
  /** Filter by resource category */
  category?: string;
  /** Filter by biome_id */
  biome?: string;
  /** Maximum rows to return */
  limit?: number;
}

/**
 * Load aggregated resource stats from the `resource_stats` view.
 * Returns an empty array if the view is unavailable (e.g. migration
 * not yet applied) so the page can still render.
 */
export async function getResourceStats(
  filters: AtlasFilters = {},
): Promise<ResourceStat[]> {
  const supabase = await createClient();

  let q = supabase
    .from('resource_stats')
    .select('*')
    .order('sample_count', { ascending: false })
    .order('resource_name', { ascending: true })
    .limit(filters.limit ?? 200);

  if (filters.query) {
    q = q.ilike('resource_name', `%${filters.query}%`);
  }
  if (filters.planet) {
    q = q.ilike('planet_key', `%${filters.planet.toLowerCase()}%`);
  }
  if (filters.category) {
    q = q.eq('resource_category', filters.category);
  }

  const { data, error } = await q;
  if (error) {
    // Migration not applied, permission missing, etc. — don't break the page.
    console.warn('[atlas] getResourceStats failed:', error.message);
    return [];
  }
  return (data ?? []) as ResourceStat[];
}

/**
 * Load raw readings for a single (resource, planet) tuple — used on the
 * detail drawer / expansion in the atlas browser.
 */
export async function getResourceReadings(
  resourceName: string,
  planetKey: string,
): Promise<ResourceReading[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('resource_readings')
    .select('*')
    .eq('resource_name', resourceName)
    .eq('planet_key', planetKey.toLowerCase())
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.warn('[atlas] getResourceReadings failed:', error.message);
    return [];
  }
  return (data ?? []) as ResourceReading[];
}

/**
 * Load recent readings submitted by the current user. Used on the
 * /terminal dashboard to show "My scouting reports".
 */
export async function getMyRecentReadings(
  userId: string,
  limit = 10,
): Promise<ResourceReading[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('resource_readings')
    .select('*')
    .eq('submitter_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[atlas] getMyRecentReadings failed:', error.message);
    return [];
  }
  return (data ?? []) as ResourceReading[];
}

/** Count of total readings and unique (resource, planet) pairs. */
export async function getAtlasStats(): Promise<{
  totalReadings: number;
  uniquePairs: number;
  uniquePlanets: number;
}> {
  const supabase = await createClient();

  const [readings, stats] = await Promise.all([
    supabase.from('resource_readings').select('*', { count: 'exact', head: true }),
    supabase.from('resource_stats').select('planet_key, resource_name'),
  ]);

  const totalReadings = readings.count ?? 0;
  const rows = (stats.data ?? []) as { planet_key: string; resource_name: string }[];
  const uniquePairs = rows.length;
  const uniquePlanets = new Set(rows.map((r) => r.planet_key)).size;

  return { totalReadings, uniquePairs, uniquePlanets };
}
