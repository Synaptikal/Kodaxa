-- ============================================================
-- 016_corp_supply_board.sql
-- Corp Supply & Demand Board for internal logistics
-- ============================================================

CREATE TYPE supply_request_status AS ENUM ('open', 'fulfilled', 'cancelled');
CREATE TYPE supply_pledge_status AS ENUM ('pending', 'delivered', 'cancelled');

-- ── 1. Requests (Created by Officers) ─────────────────────────

CREATE TABLE public.corp_supply_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id       UUID NOT NULL REFERENCES public.crafter_profiles(id) ON DELETE CASCADE,
  
  item_name       TEXT NOT NULL,
  quantity_needed INTEGER NOT NULL CHECK (quantity_needed > 0),
  planet_pref     TEXT,
  notes           TEXT,
  deadline        TIMESTAMPTZ,
  
  status          supply_request_status NOT NULL DEFAULT 'open',
  
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_supply_req_status ON public.corp_supply_requests(status);
CREATE INDEX idx_supply_req_poster ON public.corp_supply_requests(poster_id);

CREATE OR REPLACE FUNCTION public.supply_requests_touch()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_supply_requests_touch
  BEFORE UPDATE ON public.corp_supply_requests
  FOR EACH ROW EXECUTE FUNCTION public.supply_requests_touch();

ALTER TABLE public.corp_supply_requests ENABLE ROW LEVEL SECURITY;

-- Select is open to all logged-in users 
CREATE POLICY "supply_requests_select" ON public.corp_supply_requests FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Insert/Update restricted to CEO/Officer
CREATE POLICY "supply_requests_insert" ON public.corp_supply_requests FOR INSERT
  WITH CHECK (auth.uid() = poster_id AND public.get_user_role() IN ('ceo', 'officer'));

CREATE POLICY "supply_requests_update" ON public.corp_supply_requests FOR UPDATE
  USING (public.get_user_role() IN ('ceo', 'officer'));


-- ── 2. Pledges (Claimed by Members) ────────────────

CREATE TABLE public.corp_supply_pledges (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id      UUID NOT NULL REFERENCES public.corp_supply_requests(id) ON DELETE CASCADE,
  claimer_id      UUID NOT NULL REFERENCES public.crafter_profiles(id) ON DELETE CASCADE,
  
  quantity_pledged INTEGER NOT NULL CHECK (quantity_pledged > 0),
  status          supply_pledge_status NOT NULL DEFAULT 'pending',
  notes           TEXT,
  
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_supply_pledge_req ON public.corp_supply_pledges(request_id);
CREATE INDEX idx_supply_pledge_claimer ON public.corp_supply_pledges(claimer_id);

CREATE OR REPLACE FUNCTION public.supply_pledges_touch()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_supply_pledges_touch
  BEFORE UPDATE ON public.corp_supply_pledges
  FOR EACH ROW EXECUTE FUNCTION public.supply_pledges_touch();

ALTER TABLE public.corp_supply_pledges ENABLE ROW LEVEL SECURITY;

-- Select is open to all
CREATE POLICY "supply_pledges_select" ON public.corp_supply_pledges FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Members can insert pledges for themselves
CREATE POLICY "supply_pledges_insert" ON public.corp_supply_pledges FOR INSERT
  WITH CHECK (auth.uid() = claimer_id AND public.get_user_role() IN ('ceo', 'officer', 'associate', 'contractor'));

-- Members can update their own pledges, or officers can update any pledge
CREATE POLICY "supply_pledges_update" ON public.corp_supply_pledges FOR UPDATE
  USING (auth.uid() = claimer_id OR public.get_user_role() IN ('ceo', 'officer'));
