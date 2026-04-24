-- ============================================================
-- 021_material_registry.sql
-- Canonical material/item registry for Stars Reach
--
-- Purpose:
--   Single source of truth for all items referenced across:
--     • resource_readings (resource_name free-text)
--     • market_price_reports (item_name free-text)
--     • Crafting calculator (resourceId in local TS data)
--     • Inventory manager (item_name in localStorage)
--
-- Schema mirrors src/types/items.ts Item interface.
-- OCR pipeline populates confirmed rows; community can suggest.
-- ============================================================

CREATE TABLE material_registry (
  id                    UUID    PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Canonical slug — matches Item.id in src/types/items.ts (e.g. 'iron_ore')
  slug                  TEXT    NOT NULL UNIQUE,

  -- Display name
  name                  TEXT    NOT NULL,

  -- Top-level category matching ItemCategory in src/types/items.ts
  -- metal | alloy | gemstone | rock | soil | gas | animal | flora |
  -- seedling | industrial | tool | consumable
  category              TEXT    NOT NULL,

  -- Sub-grouping matching ItemSubcategory (optional)
  subcategory           TEXT,

  -- Metal tier 1–5 (raw metals only)
  tier                  SMALLINT CHECK (tier BETWEEN 1 AND 5),

  -- Rarity: very_common | common | uncommon | rare | scarce | exotic
  rarity                TEXT,

  -- Human-readable description
  description           TEXT    NOT NULL DEFAULT '',

  -- How this item is obtained (array of ItemSource values)
  -- mining | refining | harvesting | hunting | farming | crafting |
  -- gas_harvest | unknown
  sources               TEXT[]  NOT NULL DEFAULT '{}',

  -- Crafting station if produced by crafting (toolmaker | refinery | lathe | stove)
  station               TEXT,

  -- Cross-reference to local crafting calculator resource ID (matches
  -- resourceId in src/data/crafting/ resources, populated by OCR pipeline)
  crafting_resource_id  TEXT,

  -- Whether this entry is confirmed from official game data vs. speculative
  confirmed             BOOLEAN NOT NULL DEFAULT false,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ── Indexes ────────────────────────────────────────────────────────────

-- Exact slug lookup (primary resolution path for cross-tool linking)
CREATE INDEX idx_material_slug       ON material_registry(slug);

-- Category/subcategory filtering
CREATE INDEX idx_material_category   ON material_registry(category);
CREATE INDEX idx_material_subcategory ON material_registry(subcategory);

-- Tier filtering for metals
CREATE INDEX idx_material_tier       ON material_registry(tier);

-- Full-text search on name — lets market/resource pages do fuzzy lookups
-- against free-text item_name columns in other tables
CREATE INDEX idx_material_name_fts   ON material_registry
  USING gin(to_tsvector('english', name));

-- Confirmed-only filter (most UI queries want confirmed data only)
CREATE INDEX idx_material_confirmed  ON material_registry(confirmed);


-- ── updated_at trigger ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION material_registry_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_material_registry_updated_at
  BEFORE UPDATE ON material_registry
  FOR EACH ROW EXECUTE FUNCTION material_registry_set_updated_at();


-- ── Row Level Security ─────────────────────────────────────────────────

ALTER TABLE material_registry ENABLE ROW LEVEL SECURITY;

-- Public read — item data is reference content, not private
CREATE POLICY "material_registry_select_public"
  ON material_registry FOR SELECT
  USING (true);

-- Authenticated users can suggest new entries
-- (confirmed = false by default; admins review via service_role)
CREATE POLICY "material_registry_insert_auth"
  ON material_registry FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND confirmed = false
  );

-- Only service_role can update or delete
-- (protects confirmed entries from community tampering)
CREATE POLICY "material_registry_update_service"
  ON material_registry FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "material_registry_delete_service"
  ON material_registry FOR DELETE
  USING (auth.role() = 'service_role');
