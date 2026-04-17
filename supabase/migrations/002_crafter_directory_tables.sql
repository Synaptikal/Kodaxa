-- ============================================================
-- 002_crafter_directory_tables.sql
-- Crafter Directory — Core table definitions
-- Stars Reach Community Tools
--
-- Design notes:
--   • Ported and adapted from contract-board-v1 profiles/reviews.
--     Contracts table dropped — no longer relevant.
--   • Specializations are a separate table (1 crafter : many specializations)
--     so they can be filtered/indexed independently.
--   • Reviews are profile-to-profile (no contract FK required).
--   • reputation (average_rating, total_reviews) denormalized on profiles
--     to avoid N+1 on the directory listing. Trigger-synced.
--   • home_planet is first-class — Stars Reach spans multiple worlds
--     and vendor kiosks are physically located on Homesteads, so
--     planet-aware search is genuinely useful.
--   • contact_method is free-text — Discord handle, in-game name,
--     or any other out-of-band coordination players use.
-- ============================================================

-- ── 1. PROFILES ────────────────────────────────────────────────────
-- One row per registered player. Linked to Supabase Auth.
CREATE TABLE crafter_profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identity
  display_name        TEXT NOT NULL,
  in_game_name        TEXT NOT NULL UNIQUE,       -- Their in-game character name

  -- Bio / presence
  bio                 TEXT,                        -- Short blurb (max 500 chars enforced in app)
  maker_mark          TEXT,                        -- Their in-game brand/maker's mark name

  -- Location — planet-aware for finding nearby crafters
  home_planet         TEXT,
  home_sector         TEXT,
  homestead_coords    TEXT,                        -- Optional free-text coords/description

  -- Commission availability
  commission_status   commission_status NOT NULL DEFAULT 'unknown',

  -- Preferred out-of-band contact (Discord, in-game, forum, etc.)
  contact_method      TEXT,

  -- Denormalized reputation — trigger-synced from crafter_reviews.
  -- Stored here to make directory listing queries fast.
  average_rating      NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  total_reviews       INTEGER NOT NULL DEFAULT 0,

  -- Profile visibility — allows soft-hiding without deletion
  is_visible          BOOLEAN NOT NULL DEFAULT true,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Directory query indexes
CREATE INDEX idx_crafter_profiles_planet     ON crafter_profiles(home_planet);
CREATE INDEX idx_crafter_profiles_commission ON crafter_profiles(commission_status);
CREATE INDEX idx_crafter_profiles_rating     ON crafter_profiles(average_rating DESC);
CREATE INDEX idx_crafter_profiles_visible    ON crafter_profiles(is_visible);
-- Full-text search on name + bio
CREATE INDEX idx_crafter_profiles_fts ON crafter_profiles
  USING GIN(to_tsvector('english', display_name || ' ' || coalesce(bio, '') || ' ' || coalesce(maker_mark, '')));


-- ── 2. SPECIALIZATIONS ─────────────────────────────────────────────
-- What professions/branches a crafter focuses on.
-- Separate table so directory can filter by profession without
-- scanning a JSON array on the profiles table.
CREATE TABLE crafter_specializations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crafter_id      UUID NOT NULL REFERENCES crafter_profiles(id) ON DELETE CASCADE,

  -- The profession tree they specialize in (e.g., "ranger", "artisan_weaponsmith")
  profession_id   TEXT NOT NULL,

  -- Human-readable name (denormalized from our profession data for display)
  profession_name TEXT NOT NULL,

  -- Broad category for top-level directory filtering
  category        profession_category NOT NULL,

  -- Specific crafting branch, if applicable
  crafting_branch crafting_branch,

  -- Self-assessed skill level (no enforcement — honor system)
  skill_level     TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'expert')),

  -- Free-text notes (e.g., "Specializing in Tier 3 alloys", "Takes bulk orders")
  notes           TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- A crafter can only list each profession once
  UNIQUE(crafter_id, profession_id)
);

CREATE INDEX idx_specializations_crafter  ON crafter_specializations(crafter_id);
CREATE INDEX idx_specializations_prof     ON crafter_specializations(profession_id);
CREATE INDEX idx_specializations_category ON crafter_specializations(category);


-- ── 3. REVIEWS ─────────────────────────────────────────────────────
-- Profile-to-profile reviews. No contract FK required.
-- Adapted from contract-board-v1 reviews table.
CREATE TABLE crafter_reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  reviewer_id     UUID NOT NULL REFERENCES crafter_profiles(id) ON DELETE CASCADE,
  reviewee_id     UUID NOT NULL REFERENCES crafter_profiles(id) ON DELETE CASCADE,

  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,

  -- Optional: what profession/service this review is for
  profession_id   TEXT,

  -- Flag for potentially verified interactions (future: cross-ref with
  -- in-game API data when available). Currently honor system.
  verified        BOOLEAN NOT NULL DEFAULT false,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One review per reviewer per reviewee (prevent duplicate reviews)
  UNIQUE(reviewer_id, reviewee_id),

  -- Cannot review yourself
  CONSTRAINT no_self_review CHECK (reviewer_id != reviewee_id)
);

CREATE INDEX idx_reviews_reviewee ON crafter_reviews(reviewee_id);
CREATE INDEX idx_reviews_reviewer ON crafter_reviews(reviewer_id);
