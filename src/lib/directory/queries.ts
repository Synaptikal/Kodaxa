/**
 * queries.ts
 * Supabase query functions for the Crafter Directory.
 * One concern: reading crafter profiles, specializations, and reviews.
 *
 * All reads use the server client for SSR (no auth needed for public data).
 * Mutations live in actions.ts.
 */

import { createClient } from '@/lib/supabase/server';
import type {
  CrafterSummary,
  CrafterProfileFull,
  DirectoryFilters,
} from '@/types/directory';

/**
 * Get a paginated, filtered list of crafter summaries for the directory.
 */
export async function getCrafterDirectory(
  filters: DirectoryFilters = {},
  page = 0,
  pageSize = 24,
): Promise<{ crafters: CrafterSummary[]; total: number }> {
  const supabase = await createClient();

  let query = supabase
    .from('crafter_profiles')
    .select(
      `
      id, display_name, in_game_name, bio, home_planet,
      commission_status, average_rating, total_reviews,
      is_kodaxa_member,
      crafter_specializations (
        profession_id, profession_name, category, skill_level
      )
    `,
      { count: 'exact' },
    )
    .eq('is_visible', true)
    .range(page * pageSize, (page + 1) * pageSize - 1);

  // Apply filters
  if (filters.planet) {
    query = query.eq('home_planet', filters.planet);
  }
  if (filters.commissionStatus) {
    query = query.eq('commission_status', filters.commissionStatus);
  }
  if (filters.searchQuery) {
    query = query.textSearch('display_name', filters.searchQuery, {
      type: 'websearch',
    });
  }

  // Sorting
  switch (filters.sortBy) {
    case 'rating':
      query = query.order('average_rating', { ascending: false });
      break;
    case 'name':
      query = query.order('display_name', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('[directory/queries] getCrafterDirectory error:', error.message);
    return { crafters: [], total: 0 };
  }

  // Post-filter by category/profession if specified (can't do in Supabase
  // filter when the field is on a joined table without a view)
  let crafters = (data ?? []) as unknown as CrafterSummary[];

  if (filters.category) {
    crafters = crafters.filter((c) =>
      c.specializations.some((s) => s.category === filters.category),
    );
  }
  if (filters.professionId) {
    crafters = crafters.filter((c) =>
      c.specializations.some((s) => s.profession_id === filters.professionId),
    );
  }

  return { crafters, total: count ?? crafters.length };
}

/**
 * Get a single crafter's full profile with reviews.
 */
export async function getCrafterProfile(
  inGameName: string,
): Promise<CrafterProfileFull | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('crafter_profiles')
    .select(
      `
      *,
      specializations:crafter_specializations (*),
      reviews:crafter_reviews!reviewee_id (
        *,
        reviewer:reviewer_id (id, display_name, in_game_name)
      )
    `,
    )
    .eq('in_game_name', inGameName)
    .eq('is_visible', true)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[directory/queries] getCrafterProfile error:', error.message);
    }
    return null;
  }

  return data as unknown as CrafterProfileFull;
}

/**
 * Get the current user's own profile (auth-required).
 */
export async function getOwnProfile(): Promise<CrafterProfileFull | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('crafter_profiles')
    .select(
      `
      *,
      specializations:crafter_specializations (*),
      reviews:crafter_reviews!reviewee_id (
        *,
        reviewer:reviewer_id (id, display_name, in_game_name)
      )
    `,
    )
    .eq('id', user.id)
    .single();

  if (error) return null;
  return data as unknown as CrafterProfileFull;
}

/**
 * Get the distinct list of planets in the directory for the filter dropdown.
 */
export async function getDirectoryPlanets(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('crafter_profiles')
    .select('home_planet')
    .eq('is_visible', true)
    .not('home_planet', 'is', null);

  if (error) return [];

  const planets = [...new Set(data.map((r) => r.home_planet as string))].sort();
  return planets;
}
