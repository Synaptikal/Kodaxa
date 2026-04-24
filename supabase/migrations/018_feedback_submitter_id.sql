-- ============================================================
-- 018_feedback_submitter_id_and_rls_fix
-- 1. Add submitter_id column (feedback API now requires auth)
-- 2. Replace open INSERT policy (WITH CHECK true) with auth-required
-- 3. Drop stale 'director' role from admin policies, replace with
--    correct ceo/officer set
-- Applied to DB as: 018_feedback_submitter_id_and_rls_fix
-- ============================================================

ALTER TABLE public.feedback
  ADD COLUMN IF NOT EXISTS submitter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_feedback_submitter ON public.feedback(submitter_id);

DROP POLICY IF EXISTS "Allow inserts" ON public.feedback;

CREATE POLICY "feedback_insert_authenticated"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin selects" ON public.feedback;
DROP POLICY IF EXISTS "Admin inserts" ON public.feedback;
DROP POLICY IF EXISTS "Admin updates" ON public.feedback;
DROP POLICY IF EXISTS "Admin deletes" ON public.feedback;

CREATE POLICY "feedback_admin_select"
  ON public.feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.crafter_profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('ceo', 'officer')
    )
  );

CREATE POLICY "feedback_admin_update"
  ON public.feedback FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.crafter_profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('ceo', 'officer')
    )
  );

CREATE POLICY "feedback_admin_delete"
  ON public.feedback FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.crafter_profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('ceo', 'officer')
    )
  );
