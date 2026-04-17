/**
 * makers.ts
 * Types for Maker's Mark — portfolio registry on top of crafter profiles.
 * One concern: shape of portfolio items and maker-summary rows.
 *
 * Mirrors supabase/migrations/007_maker_portfolios.sql.
 */

import type { CrafterProfile, CrafterSummary } from './directory';

// ── DB row ───────────────────────────────────────────────────────────

export interface MakerPortfolioItem {
  id: string;
  crafter_id: string;
  title: string;
  description: string | null;
  profession_id: string | null;
  item_type: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_visible: boolean;
  commission_hint: string | null;
  created_at: string;
  updated_at: string;
}

// ── Composite / UI types ─────────────────────────────────────────────

/** A crafter + maker_mark + their portfolio items, for /makers listing. */
export interface MakerWithPortfolio extends CrafterSummary {
  maker_mark: string;
  featured_items: MakerPortfolioItem[];
  item_count: number;
}

/** Full profile view with portfolio joined, for /makers/[mark]. */
export interface MakerProfileFull extends CrafterProfile {
  portfolio: MakerPortfolioItem[];
}

// ── Action input types ───────────────────────────────────────────────

export interface UpsertPortfolioItemInput {
  id?: string;
  title: string;
  description?: string | null;
  profession_id?: string | null;
  item_type?: string | null;
  image_url?: string | null;
  is_featured?: boolean;
  is_visible?: boolean;
  commission_hint?: string | null;
}
