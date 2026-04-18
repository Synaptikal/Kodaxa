-- ============================================================
-- 015_dispatch_posts.sql
-- Supabase-backed dispatch posts table.
-- Replaces flat-file authoring for new transmissions.
-- Old flat-file posts remain read-only in the codebase.
-- ============================================================

CREATE TABLE public.dispatch_posts (
  slug         TEXT        PRIMARY KEY,
  title        TEXT        NOT NULL,
  category     TEXT        NOT NULL
                           CHECK (category IN ('charter','field_report','patch_recap','division_brief','recruitment')),
  status       TEXT        NOT NULL DEFAULT 'draft'
                           CHECK (status IN ('draft','published')),
  published_at DATE,
  author       TEXT        NOT NULL DEFAULT 'Kodaxa Command',
  eyebrow      TEXT,
  ref_id       TEXT,
  tag          TEXT,
  summary      TEXT        NOT NULL DEFAULT '',
  tags         TEXT[]      NOT NULL DEFAULT '{}',
  content      JSONB       NOT NULL DEFAULT '[]',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.dispatch_posts IS
  'Supabase-backed Kodaxa Dispatch posts. CEO/officer write, public read for published.';

-- ── Indexes ──────────────────────────────────────────────────────────

CREATE INDEX idx_dispatch_posts_status       ON public.dispatch_posts(status);
CREATE INDEX idx_dispatch_posts_published_at ON public.dispatch_posts(published_at DESC);

-- ── RLS ──────────────────────────────────────────────────────────────

ALTER TABLE public.dispatch_posts ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can read published posts
CREATE POLICY "dispatch_published_public_read"
  ON public.dispatch_posts
  FOR SELECT
  USING (status = 'published');

-- CEO + Officer can read everything (drafts too)
CREATE POLICY "dispatch_editor_read_all"
  ON public.dispatch_posts
  FOR SELECT
  USING (public.get_user_role() IN ('ceo', 'officer'));

-- CEO + Officer can insert
CREATE POLICY "dispatch_editor_insert"
  ON public.dispatch_posts
  FOR INSERT
  WITH CHECK (public.get_user_role() IN ('ceo', 'officer'));

-- CEO + Officer can update
CREATE POLICY "dispatch_editor_update"
  ON public.dispatch_posts
  FOR UPDATE
  USING  (public.get_user_role() IN ('ceo', 'officer'))
  WITH CHECK (public.get_user_role() IN ('ceo', 'officer'));

-- CEO only can delete
CREATE POLICY "dispatch_ceo_delete"
  ON public.dispatch_posts
  FOR DELETE
  USING (public.get_user_role() = 'ceo');

-- ── updated_at trigger ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_dispatch_posts_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER dispatch_posts_updated_at
  BEFORE UPDATE ON public.dispatch_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_dispatch_posts_updated_at();
