/**
 * queries.ts
 * Supabase reads for Market Prices.
 * One concern: fetch aggregated 30-day stats and recent raw reports.
 */

import { createClient } from '@/lib/supabase/server';
import type { MarketPriceReport, MarketPriceStat, MarketSide } from '@/types/market';

export interface MarketFilters {
  query?: string;
  planet?: string;
  category?: string;
  side?: MarketSide;
  limit?: number;
}

export async function getMarketStats(
  filters: MarketFilters = {},
): Promise<MarketPriceStat[]> {
  const supabase = await createClient();

  let q = supabase
    .from('market_price_stats')
    .select('*')
    .order('sample_count', { ascending: false })
    .order('item_name', { ascending: true })
    .limit(filters.limit ?? 200);

  if (filters.query) q = q.ilike('item_name', `%${filters.query}%`);
  if (filters.planet) q = q.ilike('planet_key', `%${filters.planet.toLowerCase()}%`);
  if (filters.category) q = q.eq('item_category', filters.category);
  if (filters.side) q = q.eq('side', filters.side);

  const { data, error } = await q;
  if (error) {
    console.warn('[market] getMarketStats failed:', error.message);
    return [];
  }
  return (data ?? []) as MarketPriceStat[];
}

export async function getRecentReports(
  itemName: string,
  planetKey: string,
  limit = 30,
): Promise<MarketPriceReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('market_price_reports')
    .select('*')
    .eq('item_name', itemName)
    .eq('planet_key', planetKey.toLowerCase())
    .order('observed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[market] getRecentReports failed:', error.message);
    return [];
  }
  return (data ?? []) as MarketPriceReport[];
}

export async function getMyRecentReports(
  userId: string,
  limit = 10,
): Promise<MarketPriceReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('market_price_reports')
    .select('*')
    .eq('submitter_id', userId)
    .order('observed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[market] getMyRecentReports failed:', error.message);
    return [];
  }
  return (data ?? []) as MarketPriceReport[];
}

export async function getMarketOverview(): Promise<{
  totalReports: number;
  uniqueItems: number;
  uniquePlanets: number;
}> {
  const supabase = await createClient();

  const [reports, stats] = await Promise.all([
    supabase.from('market_price_reports').select('*', { count: 'exact', head: true }),
    supabase.from('market_price_stats').select('item_name, planet_key'),
  ]);

  const totalReports = reports.count ?? 0;
  const rows = (stats.data ?? []) as { item_name: string; planet_key: string }[];
  const uniqueItems = new Set(rows.map((r) => r.item_name)).size;
  const uniquePlanets = new Set(rows.map((r) => r.planet_key)).size;

  return { totalReports, uniqueItems, uniquePlanets };
}
