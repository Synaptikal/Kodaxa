-- ============================================================
-- 005_crafter_kodaxa_affiliation.sql
-- Adds Kodaxa Studios membership flag to crafter_profiles
-- Stars Reach Community Tools
--
-- Why:
--   Kodaxa Studios operates as an in-universe corporation inside
--   Stars Reach. Crafters who are Kodaxa associates get a visible
--   badge in the Commerce Registry (Crafter Directory) to distinguish
--   them from independent crafters.
--
-- Design notes:
--   • Boolean flag on crafter_profiles, default false.
--   • NOT NULL so queries never have to handle NULL branch.
--   • No separate organizations table yet — single-org flag is fine
--     until/unless we need multi-guild support.
--   • Badge enforcement (who can set this to true) is handled in
--     application code (server action) rather than RLS, since the
--     rule is "admin approves membership" not a row-level rule.
-- ============================================================

ALTER TABLE crafter_profiles
  ADD COLUMN is_kodaxa_member BOOLEAN NOT NULL DEFAULT false;

-- Index for filtering the directory to Kodaxa members only
CREATE INDEX idx_crafter_profiles_kodaxa
  ON crafter_profiles(is_kodaxa_member)
  WHERE is_kodaxa_member = true;

COMMENT ON COLUMN crafter_profiles.is_kodaxa_member IS
  'True if this crafter is a verified Kodaxa Studios associate. Managed by admins.';
