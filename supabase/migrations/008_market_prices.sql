-- ============================================================
-- 008_market_prices.sql
-- Market Prices — crowdsourced buy/sell snapshot reports
-- Stars Reach Community Tools
--
-- Design notes:
--   • Each row is a POINT-IN-TIME price observation, not a live listing.
--     Players report "I saw X for Y credits on planet Z" to build a
--     community price history.
--   • side = 'buy' (someone buying, i.e. player-to-player demand) or
--     'sell' (someone selling, i.e. supply).
--   • quantity lets scouts normalize — a stack of 50 at 1000cr is price
--     20/unit; unit_price is derived.
--   • Aggregated view market_price_stats rolls up last-30-day medians.
-- ============================================================

-- Side enum
CREATE TYPE market_side AS ENUM ('buy', 'sell');

CREATE TABLE market_price_reports (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  item_name        TEXT NOT NULL,
  item_category    TEXT,

  planet           TEXT NOT NULL,
  planet_key       TEXT NOT NULL,
  vendor_hint      TEXT,                    -- e.g. "Kiosk at NE homestead"

  side             market_side NOT NULL,
  quantity         INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
  total_price      BIGINT  NOT NULL CHECK (total_price >= 0),
  unit_price       NUMERIC(20,4) NOT NULL CHECK (unit_price >= 0),

  notes            TEXT,

  -- When the observation was made (defaults to now, but players may
  -- back-date for older observations they remember).
  observed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Normalize planet_key + derive unit_price
CREATE OR REPLACE FUNCTION market_reports_normalize()
RETURNS TRIGGER AS $$
BEGIN
  NEW.planet_key = lower(trim(NEW.planet));
  IF NEW.quantity IS NULL OR NEW.quantity = 0 THEN
    NEW.quantity = 1;
  END IF;
  NEW.unit_price = (NEW.total_price::NUMERIC / NEW.quantity::NUMERIC);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_market_reports_normalize
  BEFORE INSERT OR UPDATE ON market_price_reports
  FOR EACH ROW EXECUTE FUNCTION market_reports_normalize();

CREATE INDEX idx_market_item         ON market_price_reports(item_name);
CREATE INDEX idx_market_category     ON market_price_reports(item_category);
CREATE INDEX idx_market_planet_key   ON market_price_reports(planet_key);
CREATE INDEX idx_market_side         ON market_price_reports(side);
CREATE INDEX idx_market_observed_at  ON market_price_reports(observed_at DESC);
CREATE INDEX idx_market_submitter    ON market_price_reports(submitter_id);


-- ── AGGREGATE VIEW ────────────────────────────────────────────────
-- Last-30-day rollup per (item, planet, side).
CREATE VIEW market_price_stats AS
SELECT
  item_name,
  item_category,
  planet_key,
  mode() WITHIN GROUP (ORDER BY planet) AS planet,
  side,
  COUNT(*)::INT                             AS sample_count,
  MIN(unit_price)::NUMERIC(20,4)            AS min_unit_price,
  MAX(unit_price)::NUMERIC(20,4)            AS max_unit_price,
  AVG(unit_price)::NUMERIC(20,4)            AS avg_unit_price,
  -- Median via percentile_cont
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY unit_price)::NUMERIC(20,4) AS median_unit_price,
  MAX(observed_at)                          AS last_observed_at
FROM market_price_reports
WHERE observed_at > now() - INTERVAL '30 days'
GROUP BY item_name, item_category, planet_key, side;


-- ── ROW LEVEL SECURITY ────────────────────────────────────────────
ALTER TABLE market_price_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "market_reports_select_public"
  ON market_price_reports FOR SELECT
  USING (true);

CREATE POLICY "market_reports_insert_own"
  ON market_price_reports FOR INSERT
  WITH CHECK (auth.uid() = submitter_id);

CREATE POLICY "market_reports_update_own"
  ON market_price_reports FOR UPDATE
  USING (auth.uid() = submitter_id)
  WITH CHECK (auth.uid() = submitter_id);

CREATE POLICY "market_reports_delete_own"
  ON market_price_reports FOR DELETE
  USING (auth.uid() = submitter_id);
