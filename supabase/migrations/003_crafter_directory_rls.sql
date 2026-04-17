-- ============================================================
-- 003_crafter_directory_rls.sql
-- Crafter Directory — Row Level Security policies
-- Stars Reach Community Tools
--
-- Security model:
--   • All profiles/specializations are publicly readable (it's a directory)
--   • Only the authenticated user can create/edit their own profile
--   • Reviews can be read by anyone; only auth users can write them
--   • Reviews are immutable after creation to prevent reputation gaming
-- ============================================================

ALTER TABLE crafter_profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE crafter_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crafter_reviews         ENABLE ROW LEVEL SECURITY;


-- ── CRAFTER_PROFILES ───────────────────────────────────────────────

-- Public directory — anyone can browse crafters
CREATE POLICY "crafter_profiles_select_public"
  ON crafter_profiles FOR SELECT
  USING (is_visible = true);

-- Users can always read their own profile (even if hidden)
CREATE POLICY "crafter_profiles_select_own"
  ON crafter_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can only create their own profile
CREATE POLICY "crafter_profiles_insert_own"
  ON crafter_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "crafter_profiles_update_own"
  ON crafter_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile (cascades to specializations + reviews)
CREATE POLICY "crafter_profiles_delete_own"
  ON crafter_profiles FOR DELETE
  USING (auth.uid() = id);


-- ── CRAFTER_SPECIALIZATIONS ────────────────────────────────────────

-- Public — specializations are part of the directory listing
CREATE POLICY "specializations_select_public"
  ON crafter_specializations FOR SELECT
  USING (true);

-- Only the owning crafter can manage their specializations
CREATE POLICY "specializations_insert_own"
  ON crafter_specializations FOR INSERT
  WITH CHECK (auth.uid() = crafter_id);

CREATE POLICY "specializations_update_own"
  ON crafter_specializations FOR UPDATE
  USING (auth.uid() = crafter_id)
  WITH CHECK (auth.uid() = crafter_id);

CREATE POLICY "specializations_delete_own"
  ON crafter_specializations FOR DELETE
  USING (auth.uid() = crafter_id);


-- ── CRAFTER_REVIEWS ────────────────────────────────────────────────

-- Anyone can read reviews (reputation is public info)
CREATE POLICY "reviews_select_public"
  ON crafter_reviews FOR SELECT
  USING (true);

-- Auth users can post reviews — but only as themselves
CREATE POLICY "reviews_insert_own"
  ON crafter_reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- Reviews are IMMUTABLE after creation.
-- No UPDATE or DELETE policies — this prevents reputation gaming.
-- If a review must be removed (abuse), it requires a service-role action.
