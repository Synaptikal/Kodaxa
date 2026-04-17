-- ============================================================
-- 010_fix_function_search_paths.sql
-- Pin search_path = '' on all public trigger functions.
-- Prevents search_path hijacking; all table refs are schema-qualified.
-- ============================================================

CREATE OR REPLACE FUNCTION public.sync_crafter_reputation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.crafter_profiles
  SET
    average_rating = (
      SELECT COALESCE(AVG(rating::NUMERIC), 0)
      FROM public.crafter_reviews
      WHERE reviewee_id = NEW.reviewee_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.crafter_reviews
      WHERE reviewee_id = NEW.reviewee_id
    ),
    updated_at = now()
  WHERE id = NEW.reviewee_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.crafter_profiles (id, display_name, in_game_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'in_game_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.resource_readings_normalize_planet()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.planet_key = lower(trim(NEW.planet));
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.maker_portfolio_items_touch()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

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
