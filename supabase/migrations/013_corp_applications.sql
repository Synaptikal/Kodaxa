-- ============================================================
-- 013_corp_applications.sql
-- Recruitment applications for Kodaxa Studios membership
-- ============================================================

CREATE TABLE public.corp_applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  in_game_name    TEXT NOT NULL,
  discord_handle  TEXT,
  track           TEXT NOT NULL CHECK (track IN ('crafter','data_contributor','builder','other')),
  motivation      TEXT NOT NULL,
  professions     TEXT[],
  availability    TEXT CHECK (availability IN ('casual','semi_active','active')),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_applications_status    ON public.corp_applications(status);
CREATE INDEX idx_applications_applicant ON public.corp_applications(applicant_id);
CREATE INDEX idx_applications_created   ON public.corp_applications(created_at DESC);

CREATE OR REPLACE FUNCTION public.corp_applications_touch()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_applications_touch
  BEFORE UPDATE ON public.corp_applications
  FOR EACH ROW EXECUTE FUNCTION public.corp_applications_touch();

ALTER TABLE public.corp_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "applications_select" ON public.corp_applications FOR SELECT
  USING (applicant_id = auth.uid() OR public.get_user_role() IN ('ceo','officer'));

CREATE POLICY "applications_insert" ON public.corp_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "applications_update" ON public.corp_applications FOR UPDATE
  USING (public.get_user_role() IN ('ceo','officer'));
