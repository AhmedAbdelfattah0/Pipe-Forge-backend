-- =============================================================================
-- Migration 004: projects table (generation history)
-- =============================================================================
-- Each row represents one successful pipeline generation session.
-- Stores the full GeneratorConfig as a JSONB snapshot so the user can
-- re-generate from stored settings at any time.
--
-- RLS: users may SELECT, INSERT, and DELETE their own rows.
-- UPDATE is intentionally omitted — project records are immutable after creation.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Table definition
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Owning user. Cascading delete removes history when the account is deleted.
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core generation parameters (denormalised for fast display in the history UI).
  mfe_name         TEXT        NOT NULL,
  repository_name  TEXT        NOT NULL,

  -- Azure DevOps deploy target type.
  deploy_target    TEXT        NOT NULL
                               CHECK (deploy_target IN (
                                 'storage-account',
                                 'static-web-app',
                                 'app-service'
                               )),

  -- Arrays of selected option codes, e.g. ['KSA', 'UAE'], ['QA', 'PROD'], ['AR', 'EN'].
  markets          TEXT[]      NOT NULL,
  environments     TEXT[]      NOT NULL,
  languages        TEXT[]      NOT NULL,

  -- Pipeline output format(s) selected: 'yaml' and/or 'classic-json'.
  output_formats   TEXT[]      NOT NULL,

  -- Total number of pipeline files included in the generated ZIP.
  pipeline_count   INTEGER     NOT NULL,

  -- Snapshot of the complete GeneratorConfig at the time of generation.
  -- Used to reproduce the exact same output via the regenerate endpoint.
  config_snapshot  JSONB       NOT NULL,

  -- Timestamp when the generation occurred (distinct from row insert time).
  generated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Index: speed up history queries filtered/sorted by user
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_user_id
  ON projects (user_id);

-- Optional: support pagination ordered by generation time.
CREATE INDEX IF NOT EXISTS idx_projects_user_id_generated_at
  ON projects (user_id, generated_at DESC);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- SELECT: users can query their own history.
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: users can only insert rows that belong to themselves.
CREATE POLICY "Users can insert own projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- DELETE: users can remove their own history entries.
CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  USING (auth.uid() = user_id);
