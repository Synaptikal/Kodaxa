-- ============================================================
-- 022_patch_notes_imports.sql
-- Patch notes importer — stores scraped Stars Reach build notes.
--
-- Flow: scraper fetches WP API → inserts as draft → director
-- reviews in /admin/patch-notes → publishes → public page renders.
-- ============================================================

CREATE TABLE patch_notes_imports (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source of truth (WP post slug used as dedupe key)
  source_url     TEXT NOT NULL UNIQUE,
  source_slug    TEXT NOT NULL UNIQUE,

  title          TEXT NOT NULL,
  version_label  TEXT,

  -- Matches PatchNoteType in src/data/patch-notes/types.ts
  category       TEXT NOT NULL DEFAULT 'minor'
    CHECK (category IN ('major', 'minor', 'hotfix', 'balance', 'alpha')),

  release_date   DATE,
  summary        TEXT NOT NULL DEFAULT '',

  -- Array of { type: 'added'|'changed'|'fixed'|'removed', text: string }
  bullet_points  JSONB NOT NULL DEFAULT '[]',

  -- Full HTML body kept for re-parsing
  raw_content    TEXT,

  -- CRC32-style hash of title+content — detect upstream edits
  import_hash    TEXT,

  -- draft → reviewed by director → published → visible on public page
  status         TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),

  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pni_status       ON patch_notes_imports(status);
CREATE INDEX idx_pni_release_date ON patch_notes_imports(release_date DESC);


-- ── updated_at trigger ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION patch_notes_imports_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_patch_notes_imports_updated_at
  BEFORE UPDATE ON patch_notes_imports
  FOR EACH ROW EXECUTE FUNCTION patch_notes_imports_set_updated_at();


-- ── Row Level Security ─────────────────────────────────────────────────

ALTER TABLE patch_notes_imports ENABLE ROW LEVEL SECURITY;

-- Published rows are readable by anyone
CREATE POLICY "pni_select_public"
  ON patch_notes_imports FOR SELECT
  USING (status = 'published');

-- Directors (ceo/officer) can read all rows including drafts
CREATE POLICY "pni_select_director"
  ON patch_notes_imports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM crafter_profiles
      WHERE id = auth.uid()
      AND role IN ('ceo', 'officer')
    )
  );

-- All writes go through service_role only (import routes + server actions)
CREATE POLICY "pni_all_service"
  ON patch_notes_imports FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
