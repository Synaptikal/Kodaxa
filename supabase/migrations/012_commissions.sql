-- ============================================================
-- 012_commissions.sql
-- Client-to-crafter commission request system
-- ============================================================

CREATE TYPE commission_pipeline AS ENUM (
  'pending', 'accepted', 'completed', 'declined', 'cancelled'
);

CREATE TABLE public.commissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assignee_id     UUID NOT NULL REFERENCES public.crafter_profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  item_type       TEXT,
  quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  budget_hint     TEXT,
  planet          TEXT,
  delivery_hint   TEXT,
  deadline_hint   TEXT,
  client_notes    TEXT,
  assignee_notes  TEXT,
  status          commission_pipeline NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_commissions_client   ON public.commissions(client_id);
CREATE INDEX idx_commissions_assignee ON public.commissions(assignee_id);
CREATE INDEX idx_commissions_status   ON public.commissions(status);
CREATE INDEX idx_commissions_created  ON public.commissions(created_at DESC);

CREATE OR REPLACE FUNCTION public.commissions_touch()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_commissions_touch
  BEFORE UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.commissions_touch();

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "commissions_select" ON public.commissions FOR SELECT
  USING (client_id = auth.uid() OR assignee_id = auth.uid() OR public.get_user_role() IN ('ceo','officer'));

CREATE POLICY "commissions_insert" ON public.commissions FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "commissions_update" ON public.commissions FOR UPDATE
  USING (assignee_id = auth.uid() OR public.get_user_role() IN ('ceo','officer'));

CREATE POLICY "commissions_cancel" ON public.commissions FOR UPDATE
  USING (client_id = auth.uid() AND status = 'pending');
