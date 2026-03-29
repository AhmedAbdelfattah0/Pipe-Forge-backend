-- =============================================================================
-- Migration 007: feedback table
-- =============================================================================
-- Stores user feedback on pipeline generations.
-- Supports star rating, pipeline-worked status, and optional testimonial data.
-- Public + approved feedback is surfaced on the landing page.
-- =============================================================================

CREATE TABLE IF NOT EXISTS feedback (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generation_id    UUID        REFERENCES generations(id) ON DELETE SET NULL,
  rating           INTEGER     NOT NULL CHECK (rating >= 1 AND rating <= 5),
  pipelines_worked TEXT        CHECK (pipelines_worked IN ('yes', 'no', 'partial')),
  what_went_wrong  TEXT,
  feature_request  TEXT,
  display_name     TEXT,
  company          TEXT,
  is_public        BOOLEAN     DEFAULT false,
  is_approved      BOOLEAN     DEFAULT false,
  source           TEXT        DEFAULT 'in-app',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_user_id
  ON feedback (user_id);

CREATE INDEX IF NOT EXISTS idx_feedback_public_approved
  ON feedback (is_public, is_approved) WHERE is_public = true AND is_approved = true;

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read public approved feedback"
  ON feedback FOR SELECT
  USING (is_public = true AND is_approved = true);
