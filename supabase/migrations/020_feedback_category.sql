-- ============================================================
-- 020_feedback_category
-- Add category column to feedback table so submissions can be
-- triaged by type: bug_report, feature_request, data_issue,
-- tool_feedback, general.
-- ============================================================

ALTER TABLE public.feedback
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general'
  CONSTRAINT feedback_category_valid
  CHECK (category IN ('bug_report', 'feature_request', 'data_issue', 'tool_feedback', 'general'));

CREATE INDEX IF NOT EXISTS idx_feedback_category ON public.feedback(category);
