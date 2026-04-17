-- ============================================================
-- 007_maker_portfolios.sql
-- Maker's Mark — portfolio registry built on top of crafter_profiles
-- Stars Reach Community Tools
--
-- Design notes:
--   • Each crafter can showcase a list of signature works under their
--     existing maker_mark brand. Portfolio items are concrete deliverables
--     (a weapon, a building, a dish) rather than generic offerings.
--   • image_url is free-text for now — when Supabase Storage is wired up
--     we'll move to storage-path references.
--   • is_featured surfaces a crafter's proudest work on the /makers list
--     and on their profile header.
-- ============================================================

CREATE TABLE maker_portfolio_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crafter_id      UUID NOT NULL REFERENCES crafter_profiles(id) ON DELETE CASCADE,

  title           TEXT NOT NULL,
  description     TEXT,

  -- What the item IS — category mirrors the profession tree
  profession_id   TEXT,
  -- Free-text type label (e.g. "Tier 3 Plasma Rifle", "Garrison Tower")
  item_type       TEXT,

  -- Optional showcase image. URL for now; storage path in a future pass.
  image_url       TEXT,

  -- Public attribution controls
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  is_visible      BOOLEAN NOT NULL DEFAULT true,

  -- Optional price hint / commission range (free-text, e.g. "ask in Discord")
  commission_hint TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_portfolio_crafter  ON maker_portfolio_items(crafter_id);
CREATE INDEX idx_portfolio_featured ON maker_portfolio_items(is_featured) WHERE is_featured = true;
CREATE INDEX idx_portfolio_visible  ON maker_portfolio_items(is_visible);
CREATE INDEX idx_portfolio_prof     ON maker_portfolio_items(profession_id);

-- updated_at auto-maintenance
CREATE OR REPLACE FUNCTION maker_portfolio_items_touch()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_portfolio_touch
  BEFORE UPDATE ON maker_portfolio_items
  FOR EACH ROW EXECUTE FUNCTION maker_portfolio_items_touch();


-- ── ROW LEVEL SECURITY ────────────────────────────────────────────
ALTER TABLE maker_portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public — visible portfolio items readable to all
CREATE POLICY "portfolio_select_public"
  ON maker_portfolio_items FOR SELECT
  USING (is_visible = true);

-- Owner can always read their own items (even hidden ones)
CREATE POLICY "portfolio_select_own"
  ON maker_portfolio_items FOR SELECT
  USING (auth.uid() = crafter_id);

-- Owner-only writes
CREATE POLICY "portfolio_insert_own"
  ON maker_portfolio_items FOR INSERT
  WITH CHECK (auth.uid() = crafter_id);

CREATE POLICY "portfolio_update_own"
  ON maker_portfolio_items FOR UPDATE
  USING (auth.uid() = crafter_id)
  WITH CHECK (auth.uid() = crafter_id);

CREATE POLICY "portfolio_delete_own"
  ON maker_portfolio_items FOR DELETE
  USING (auth.uid() = crafter_id);
