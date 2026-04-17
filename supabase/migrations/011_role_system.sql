-- ============================================================
-- 011_role_system.sql
-- Add corp role to crafter_profiles + role helper function
-- ============================================================

ALTER TABLE public.crafter_profiles
  ADD COLUMN role TEXT NOT NULL DEFAULT 'client'
  CHECK (role IN ('ceo','officer','associate','contractor','client'));

CREATE INDEX idx_crafter_profiles_role ON public.crafter_profiles(role);

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE v_role TEXT;
BEGIN
  SELECT role INTO v_role FROM public.crafter_profiles WHERE id = auth.uid();
  RETURN COALESCE(v_role, 'client');
END;
$$;

COMMENT ON COLUMN public.crafter_profiles.role IS
  'Corp role: ceo | officer | associate | contractor | client. CEO-managed.';
