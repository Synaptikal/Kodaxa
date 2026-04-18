/**
 * queries.ts
 * Supabase reads for Maker's Mark — portfolio registry.
 * One concern: list makers with portfolios and fetch individual maker pages.
 *
 * All reads tolerate missing migration: return [] / null on error so the
 * pages can still render with an appropriate empty state.
 */

import { createClient } from '@/lib/supabase/server';
import type {
  MakerPortfolioItem,
  MakerProfileFull,
  MakerWithPortfolio,
} from '@/types/makers';

/**
 * Fetch all visible crafters who've set a maker_mark, joined to up to
 * 3 featured portfolio items each. Used by the /makers listing.
 */
export async function getMakersDirectory(): Promise<MakerWithPortfolio[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('crafter_profiles')
    .select(
      `
      id, display_name, in_game_name, bio, home_planet, maker_mark,
      commission_status, average_rating, total_reviews,
      is_kodaxa_member, species, role,
      crafter_specializations (
        profession_id, profession_name, category, skill_level
      ),
      maker_portfolio_items (
        id, crafter_id, title, description, profession_id, item_type,
        image_url, is_featured, is_visible, commission_hint,
        created_at, updated_at
      )
    `,
    )
    .eq('is_visible', true)
    .not('maker_mark', 'is', null)
    .order('average_rating', { ascending: false });

  if (error) {
    console.warn('[makers] getMakersDirectory failed:', error.message);
    return [];
  }

  return (data ?? [])
    .filter((row) => row.maker_mark)
    .map((row): MakerWithPortfolio => {
      const items = (row.maker_portfolio_items ?? []) as MakerPortfolioItem[];
      const visibleItems = items.filter((i) => i.is_visible);
      const featured = visibleItems
        .filter((i) => i.is_featured)
        .slice(0, 3);
      // If no featured, surface the 3 most recent visible items
      const showcase =
        featured.length > 0
          ? featured
          : [...visibleItems]
              .sort((a, b) => b.created_at.localeCompare(a.created_at))
              .slice(0, 3);

      return {
        id: row.id,
        display_name: row.display_name,
        in_game_name: row.in_game_name,
        bio: row.bio,
        home_planet: row.home_planet,
        commission_status: row.commission_status,
        average_rating: row.average_rating,
        total_reviews: row.total_reviews,
        is_kodaxa_member: row.is_kodaxa_member,
        species: row.species ?? null,
        role: row.role ?? 'client',
        specializations: row.crafter_specializations ?? [],
        maker_mark: row.maker_mark as string,
        featured_items: showcase,
        item_count: visibleItems.length,
      };
    });
}

/**
 * Fetch a single maker's profile + full portfolio by maker_mark slug.
 */
export async function getMakerByMark(
  markSlug: string,
): Promise<MakerProfileFull | null> {
  const supabase = await createClient();

  // maker_mark in DB is free-text; match case-insensitively
  const { data, error } = await supabase
    .from('crafter_profiles')
    .select(
      `
      *,
      maker_portfolio_items (*)
    `,
    )
    .ilike('maker_mark', markSlug)
    .eq('is_visible', true)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.warn('[makers] getMakerByMark failed:', error.message);
    }
    return null;
  }

  const portfolio = ((data.maker_portfolio_items ?? []) as MakerPortfolioItem[])
    .filter((i) => i.is_visible)
    .sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return b.created_at.localeCompare(a.created_at);
    });

  const { maker_portfolio_items: _discard, ...profile } = data as {
    maker_portfolio_items?: unknown;
  } & MakerProfileFull;
  void _discard;

  return { ...profile, portfolio } as MakerProfileFull;
}

/**
 * Fetch the current user's own portfolio for editing.
 */
export async function getOwnPortfolio(): Promise<MakerPortfolioItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('maker_portfolio_items')
    .select('*')
    .eq('crafter_id', user.id)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[makers] getOwnPortfolio failed:', error.message);
    return [];
  }
  return data as MakerPortfolioItem[];
}
