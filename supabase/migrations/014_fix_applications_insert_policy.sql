-- ============================================================
-- 014_fix_applications_insert_policy.sql
-- Tighten corp_applications INSERT policy.
--
-- Replaces WITH CHECK (true) — anonymous applicants must leave
-- applicant_id as NULL; authenticated applicants must use their
-- own auth.uid(). Prevents impersonation while keeping the
-- public application form accessible without an account.
-- ============================================================

DROP POLICY IF EXISTS "applications_insert" ON public.corp_applications;

CREATE POLICY "applications_insert"
  ON public.corp_applications FOR INSERT
  WITH CHECK (
    applicant_id IS NULL
    OR applicant_id = auth.uid()
  );
