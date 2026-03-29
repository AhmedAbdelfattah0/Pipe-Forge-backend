-- =============================================================================
-- Migration 006: generations table
-- =============================================================================
-- Records each pipeline generation with its configuration snapshot.
-- Used as a foreign key target for the feedback table.
-- =============================================================================

CREATE TABLE IF NOT EXISTS generations (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  config           JSONB       NOT NULL,
  platform         TEXT,
  deploy_target    TEXT,
  markets          TEXT[],
  environments     TEXT[],
  languages        TEXT[],
  is_multi_language BOOLEAN    DEFAULT false,
  pipeline_count   INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generations_user_id
  ON generations (user_id);

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own generations"
  ON generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
  ON generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
