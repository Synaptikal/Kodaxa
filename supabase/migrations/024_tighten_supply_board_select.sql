-- ============================================================
-- 024_tighten_supply_board_select.sql
-- Restrict corp supply board SELECT to actual corp members.
--
-- Problem: supply_requests_select and supply_pledges_select used
-- auth.uid() IS NOT NULL — any authenticated account (including
-- client role / public accounts) could read internal corp supply data.
--
-- Fix: require get_user_role() to be a corp member role.
-- Clients (public account holders with no corp affiliation) cannot
-- read the supply board.
-- ============================================================

-- Supply requests
DROP POLICY IF EXISTS "supply_requests_select" ON public.corp_supply_requests;
CREATE POLICY "supply_requests_select" ON public.corp_supply_requests
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND public.get_user_role() IN ('ceo', 'officer', 'associate', 'contractor')
  );

-- Supply pledges
DROP POLICY IF EXISTS "supply_pledges_select" ON public.corp_supply_pledges;
CREATE POLICY "supply_pledges_select" ON public.corp_supply_pledges
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND public.get_user_role() IN ('ceo', 'officer', 'associate', 'contractor')
  );
