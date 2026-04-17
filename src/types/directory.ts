/**
 * directory.ts
 * TypeScript types for the Crafter Directory.
 * One concern: defining the shape of crafter profiles, specializations, reviews.
 *
 * These mirror the Supabase schema in supabase/migrations/002_crafter_directory_tables.sql.
 * Kept in sync manually until an API is available to generate types automatically.
 */

// ── Enums (mirror SQL enums) ────────────────────────────────────────

export type CommissionStatus = 'open' | 'limited' | 'closed' | 'unknown';

export type DirectoryProfessionCategory =
  | 'scouting'
  | 'combat'
  | 'crafting'
  | 'harvesting'
  | 'social'
  | 'science'
  | 'infrastructure';

export type CraftingBranch =
  | 'architect'
  | 'civil_engineering'
  | 'refining'
  | 'toolmaking'
  | 'weaponsmithing'
  | 'cooking'
  | 'general';

export type SkillLevel = 'beginner' | 'intermediate' | 'expert';

// ── Database row types ──────────────────────────────────────────────

/** crafter_profiles row */
export interface CrafterProfile {
  id: string;
  display_name: string;
  in_game_name: string;
  bio: string | null;
  maker_mark: string | null;
  home_planet: string | null;
  home_sector: string | null;
  homestead_coords: string | null;
  commission_status: CommissionStatus;
  contact_method: string | null;
  average_rating: number;
  total_reviews: number;
  is_visible: boolean;
  is_kodaxa_member: boolean;
  created_at: string;
  updated_at: string;
}

/** crafter_specializations row */
export interface CrafterSpecialization {
  id: string;
  crafter_id: string;
  profession_id: string;
  profession_name: string;
  category: DirectoryProfessionCategory;
  crafting_branch: CraftingBranch | null;
  skill_level: SkillLevel | null;
  notes: string | null;
  created_at: string;
}

/** crafter_reviews row */
export interface CrafterReview {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  profession_id: string | null;
  verified: boolean;
  created_at: string;
}

// ── Composite / view types ──────────────────────────────────────────

/** Full crafter profile with specializations and reviews joined */
export interface CrafterProfileFull extends CrafterProfile {
  specializations: CrafterSpecialization[];
  reviews: CrafterReviewWithReviewer[];
}

/** Review with the reviewer's display info joined */
export interface CrafterReviewWithReviewer extends CrafterReview {
  reviewer: Pick<CrafterProfile, 'id' | 'display_name' | 'in_game_name'>;
}

/** Lightweight summary for the directory listing */
export interface CrafterSummary {
  id: string;
  display_name: string;
  in_game_name: string;
  bio: string | null;
  home_planet: string | null;
  commission_status: CommissionStatus;
  average_rating: number;
  total_reviews: number;
  is_kodaxa_member: boolean;
  specializations: Pick<CrafterSpecialization, 'profession_id' | 'profession_name' | 'category' | 'skill_level'>[];
}

// ── Form / mutation types ───────────────────────────────────────────

/** Fields for creating/updating a profile */
export interface UpsertProfileInput {
  display_name: string;
  in_game_name: string;
  bio?: string;
  maker_mark?: string;
  home_planet?: string;
  home_sector?: string;
  homestead_coords?: string;
  commission_status: CommissionStatus;
  contact_method?: string;
}

/** Fields for adding a specialization */
export interface AddSpecializationInput {
  profession_id: string;
  profession_name: string;
  category: DirectoryProfessionCategory;
  crafting_branch?: CraftingBranch;
  skill_level?: SkillLevel;
  notes?: string;
}

/** Fields for submitting a review */
export interface SubmitReviewInput {
  reviewee_id: string;
  rating: number;
  comment?: string;
  profession_id?: string;
}

// ── Filter / search types ───────────────────────────────────────────

/** Query params for the directory listing */
export interface DirectoryFilters {
  planet?: string;
  category?: DirectoryProfessionCategory;
  professionId?: string;
  commissionStatus?: CommissionStatus;
  searchQuery?: string;
  sortBy?: 'rating' | 'newest' | 'name';
}

// ── UI constants ────────────────────────────────────────────────────

export const COMMISSION_LABELS: Record<CommissionStatus, string> = {
  open: 'Open',
  limited: 'Limited',
  closed: 'Closed',
  unknown: 'Not set',
};

export const COMMISSION_COLORS: Record<CommissionStatus, string> = {
  open: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/40',
  limited: 'text-amber-400 bg-amber-900/30 border-amber-700/40',
  closed: 'text-red-400 bg-red-900/30 border-red-700/40',
  unknown: 'text-slate-400 bg-slate-800/30 border-slate-700/40',
};

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  expert: 'Expert',
};
