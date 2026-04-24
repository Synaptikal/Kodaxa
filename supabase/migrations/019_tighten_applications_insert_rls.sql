-- ============================================================
-- 019_tighten_applications_insert_rls
-- submitApplication now requires auth at the app layer.
-- Align the RLS INSERT policy to enforce the same — remove the
-- applicant_id IS NULL escape hatch so anon callers can't insert
-- directly via the Supabase client.
-- ============================================================

DROP POLICY IF EXISTS "applications_insert" ON public.corp_applications;

CREATE POLICY "applications_insert"
  ON public.corp_applications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND applicant_id = auth.uid());
