-- ============================================================
-- 017_fix_trigger_search_paths.sql
-- NOTE: Verified via Supabase MCP (2026-04-24) that both
-- functions already have search_path = '' — applied by
-- 010_fix_function_search_paths. This migration is a safe no-op
-- kept for documentation and idempotency.
--
-- Affected functions (audited):
--   • market_reports_normalize  (created in 008)
--   • corp_applications_touch   (created in 013)
-- ============================================================

-- ── market_reports_normalize ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.market_reports_normalize()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.planet_key = lower(trim(NEW.planet));
  IF NEW.quantity IS NULL OR NEW.quantity = 0 THEN
    NEW.quantity = 1;
  END IF;
  NEW.unit_price = (NEW.total_price::NUMERIC / NEW.quantity::NUMERIC);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── corp_applications_touch ───────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.corp_applications_touch()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
