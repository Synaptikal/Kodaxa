-- ============================================================
-- 023_prevent_role_escalation.sql
-- Block direct role self-escalation via RLS UPDATE path.
--
-- Problem: crafter_profiles_update_own allows any authenticated user
-- to UPDATE their own row including the role column, bypassing the
-- CEO-only setMemberRole server action check.
--
-- Fix: BEFORE UPDATE trigger that raises an exception if the role
-- column is being changed and the caller is not already CEO.
-- Service-role calls (auth.uid() IS NULL) are always permitted —
-- they bypass RLS entirely anyway and are used by admin server actions.
-- ============================================================

CREATE OR REPLACE FUNCTION public.guard_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  caller_role TEXT;
BEGIN
  -- No role change — allow unconditionally
  IF NEW.role = OLD.role THEN
    RETURN NEW;
  END IF;

  -- Service-role / internal calls have no auth context (uid = NULL).
  -- RLS is bypassed for service_role so anon callers can't reach here anyway.
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Fetch the calling user's own role to verify CEO clearance
  SELECT role INTO caller_role
  FROM public.crafter_profiles
  WHERE id = auth.uid();

  IF caller_role IS DISTINCT FROM 'ceo' THEN
    RAISE EXCEPTION 'role_change_forbidden: only ceo may change corp roles';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER guard_role_change
  BEFORE UPDATE ON public.crafter_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_role_change();
