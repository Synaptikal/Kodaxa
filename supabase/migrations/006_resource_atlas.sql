-- ============================================================
-- 006_resource_atlas.sql
-- Resource Atlas — crowdsourced resource P/Q/R/V readings
-- Stars Reach Community Tools
--
-- Design notes:
--   • Stars Reach planets are procedurally generated — no fixed planet list.
--     Planet names are free-text, normalized lower-case for grouping.
--   • PQRV stats are integers (Potential/Quality/Resilience/Versatility).
--     Source: April 2026 Twilight Update patch notes.
--   • Each row is ONE reading from ONE scout. Aggregation happens in the
--     resource_stats view — min/max/avg across all readings for a
--     (resource, planet) tuple.
--   • Biome FK is free-text matching the canonical slugs in
--     src/data/biomes/index.ts (e.g. 'temperate_humid').
-- ============================================================

-- ── 1. READINGS ───────────────────────────────────────────────────
CREATE TABLE resource_readings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  submitter_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Resource identity (free-text — game has no canonical resource list yet)
  resource_name     TEXT NOT NULL,
  -- Optional coarse category: ore / wood / fiber / gas / creature_drop / flora
  resource_category TEXT,

  -- Location
  planet            TEXT NOT NULL,
  -- Normalized lowercase planet key for grouping (trigger-filled)
  planet_key        TEXT NOT NULL,
  biome_id          TEXT,
  coords_hint       TEXT,

  -- PQRV stats — integers, typical range 1-1000
  potential         SMALLINT NOT NULL CHECK (potential  BETWEEN 0 AND 1000),
  quality           SMALLINT NOT NULL CHECK (quality    BETWEEN 0 AND 1000),
  resilience        SMALLINT NOT NULL CHECK (resilience BETWEEN 0 AND 1000),
  versatility       SMALLINT NOT NULL CHECK (versatility BETWEEN 0 AND 1000),

  -- Scout notes
  notes             TEXT,

  -- Community confirmation count (future: allow other scouts to endorse)
  confirmations     INTEGER NOT NULL DEFAULT 0,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: keep planet_key normalized
CREATE OR REPLACE FUNCTION resource_readings_normalize_planet()
RETURNS TRIGGER AS $$
BEGIN
  NEW.planet_key = lower(trim(NEW.planet));
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resource_readings_normalize
  BEFORE INSERT OR UPDATE ON resource_readings
  FOR EACH ROW EXECUTE FUNCTION resource_readings_normalize_planet();

-- Indexes for common filters
CREATE INDEX idx_readings_resource   ON resource_readings(resource_name);
CREATE INDEX idx_readings_category   ON resource_readings(resource_category);
CREATE INDEX idx_readings_planet_key ON resource_readings(planet_key);
CREATE INDEX idx_readings_biome      ON resource_readings(biome_id);
CREATE INDEX idx_readings_submitter  ON resource_readings(submitter_id);
CREATE INDEX idx_readings_created_at ON resource_readings(created_at DESC);


-- ── 2. AGGREGATE VIEW ─────────────────────────────────────────────
-- Per (resource, planet) tuple: sample count + min/max/avg PQRV.
-- Used by the Atlas browser for fast summary rendering.
CREATE VIEW resource_stats AS
SELECT
  resource_name,
  resource_category,
  planet_key,
  -- Keep the most-used capitalization of the planet name
  mode() WITHIN GROUP (ORDER BY planet) AS planet,
  COUNT(*)::INT                          AS sample_count,

  MAX(potential)::INT    AS max_potential,
  MAX(quality)::INT      AS max_quality,
  MAX(resilience)::INT   AS max_resilience,
  MAX(versatility)::INT  AS max_versatility,

  ROUND(AVG(potential))::INT   AS avg_potential,
  ROUND(AVG(quality))::INT     AS avg_quality,
  ROUND(AVG(resilience))::INT  AS avg_resilience,
  ROUND(AVG(versatility))::INT AS avg_versatility,

  MAX(created_at)        AS last_reported_at
FROM resource_readings
GROUP BY resource_name, resource_category, planet_key;


-- ── 3. ROW LEVEL SECURITY ─────────────────────────────────────────
-- Readings are public (the whole point is crowdsourced data).
-- Writes require auth. Submitters can only edit/delete their own rows.
ALTER TABLE resource_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "readings_select_public"
  ON resource_readings FOR SELECT
  USING (true);

CREATE POLICY "readings_insert_own"
  ON resource_readings FOR INSERT
  WITH CHECK (auth.uid() = submitter_id);

CREATE POLICY "readings_update_own"
  ON resource_readings FOR UPDATE
  USING (auth.uid() = submitter_id)
  WITH CHECK (auth.uid() = submitter_id);

CREATE POLICY "readings_delete_own"
  ON resource_readings FOR DELETE
  USING (auth.uid() = submitter_id);
