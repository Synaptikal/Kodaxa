-- ============================================================
-- 004_crafter_directory_triggers.sql
-- Crafter Directory — Triggers and functions
-- Stars Reach Community Tools
--
-- Triggers:
--   1. sync_reputation — keeps average_rating + total_reviews
--      on crafter_profiles in sync after any review insert.
--      (No update/delete on reviews, so INSERT-only trigger is sufficient.)
--   2. touch_updated_at — auto-sets updated_at on profile mutations.
-- ============================================================

-- ── 1. REPUTATION SYNC ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION sync_crafter_reputation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE crafter_profiles
  SET
    average_rating = (
      SELECT COALESCE(AVG(rating::NUMERIC), 0)
      FROM crafter_reviews
      WHERE reviewee_id = NEW.reviewee_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM crafter_reviews
      WHERE reviewee_id = NEW.reviewee_id
    ),
    updated_at = now()
  WHERE id = NEW.reviewee_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_sync_reputation
  AFTER INSERT ON crafter_reviews
  FOR EACH ROW
  EXECUTE FUNCTION sync_crafter_reputation();


-- ── 2. UPDATED_AT AUTO-TOUCH ───────────────────────────────────────

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON crafter_profiles
  FOR EACH ROW
  EXECUTE FUNCTION touch_updated_at();


-- ── 3. PROFILE AUTO-CREATE ON AUTH SIGNUP ─────────────────────────
-- When a user signs up via Supabase Auth, insert a minimal profile row.
-- This prevents orphaned auth.users with no matching profile.
-- The user then completes their profile on the /directory/new page.

CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO crafter_profiles (id, display_name, in_game_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'in_game_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_new_auth_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_auth_user();
