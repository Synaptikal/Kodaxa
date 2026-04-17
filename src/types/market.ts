/**
 * market.ts
 * Types for Market Prices — crowdsourced buy/sell observation reports.
 * One concern: shapes for reports, stats view rows, and action inputs.
 *
 * Mirrors supabase/migrations/008_market_prices.sql.
 */

// ── Enums ────────────────────────────────────────────────────────────

export type MarketSide = 'buy' | 'sell';

export const MARKET_SIDE_LABELS: Record<MarketSide, string> = {
  buy:  'Buy Orders',
  sell: 'Sell Listings',
};

export const MARKET_SIDE_COLORS: Record<MarketSide, string> = {
  buy:  'text-emerald-400 bg-emerald-900/30 border-emerald-800/40',
  sell: 'text-amber-400   bg-amber-900/30   border-amber-800/40',
};

// Share with the atlas category taxonomy — markets sell the same kinds
// of things atlas readings catalogue. Plus crafted-good categories.
export const MARKET_CATEGORIES = [
  'resource',
  'component',
  'weapon',
  'tool',
  'armor',
  'consumable',
  'structure',
  'decor',
  'other',
] as const;
export type MarketCategory = typeof MARKET_CATEGORIES[number];

export const MARKET_CATEGORY_LABELS: Record<MarketCategory, string> = {
  resource:   'Resource',
  component:  'Component',
  weapon:     'Weapon',
  tool:       'Tool',
  armor:      'Armor',
  consumable: 'Consumable',
  structure:  'Structure',
  decor:      'Decor',
  other:      'Other',
};

// ── DB row ───────────────────────────────────────────────────────────

export interface MarketPriceReport {
  id: string;
  submitter_id: string;
  item_name: string;
  item_category: MarketCategory | null;
  planet: string;
  planet_key: string;
  vendor_hint: string | null;
  side: MarketSide;
  quantity: number;
  total_price: number;
  unit_price: number;
  notes: string | null;
  observed_at: string;
  created_at: string;
  updated_at: string;
}

/** Row from market_price_stats view (30-day rollup) */
export interface MarketPriceStat {
  item_name: string;
  item_category: MarketCategory | null;
  planet_key: string;
  planet: string;
  side: MarketSide;
  sample_count: number;
  min_unit_price: number;
  max_unit_price: number;
  avg_unit_price: number;
  median_unit_price: number;
  last_observed_at: string;
}

// ── Action inputs ────────────────────────────────────────────────────

export interface SubmitPriceReportInput {
  item_name: string;
  item_category: MarketCategory | null;
  planet: string;
  vendor_hint: string | null;
  side: MarketSide;
  quantity: number;
  total_price: number;
  notes: string | null;
  observed_at?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Format credit value with thousands separators, e.g. 12,345 cr */
export function formatCredits(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const fixed = Math.round(n * 100) / 100;
  return `${fixed.toLocaleString(undefined, { maximumFractionDigits: 2 })} cr`;
}

/** Aggregate min→median→max line */
export function priceSpread(stat: MarketPriceStat): string {
  return `${formatCredits(stat.min_unit_price)} · ${formatCredits(stat.median_unit_price)} · ${formatCredits(stat.max_unit_price)}`;
}
