-- ============================================================
-- 009_fix_view_security_invoker.sql
-- Recreate aggregate views with SECURITY INVOKER
-- so they respect the querying user's RLS context.
-- ============================================================

DROP VIEW IF EXISTS public.resource_stats;
CREATE VIEW public.resource_stats
  WITH (security_invoker = true)
AS
SELECT
  resource_name,
  resource_category,
  planet_key,
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
FROM public.resource_readings
GROUP BY resource_name, resource_category, planet_key;


DROP VIEW IF EXISTS public.market_price_stats;
CREATE VIEW public.market_price_stats
  WITH (security_invoker = true)
AS
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
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY unit_price)::NUMERIC(20,4) AS median_unit_price,
  MAX(observed_at)                          AS last_observed_at
FROM public.market_price_reports
WHERE observed_at > now() - INTERVAL '30 days'
GROUP BY item_name, item_category, planet_key, side;
