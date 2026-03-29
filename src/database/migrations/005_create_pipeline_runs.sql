-- =============================================================================
-- Migration 005: pipeline_runs table
-- =============================================================================
-- Tracks the execution status of each individual pipeline generation request.
-- One project can have multiple runs (e.g., original + regenerations).
--
-- Lifecycle: pending → generating → success | error
--
-- RLS: users may only SELECT their own run records.
-- INSERT is performed by the backend service role (bypasses RLS), which ensures
-- that a run record is always created even before the user's JWT is re-checked.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Table definition
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Denormalised user_id makes RLS policy evaluation straightforward without a join.
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- The project this run belongs to. Deleting a project cascades to its runs.
  project_id    UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Current lifecycle state of the generation job.
  status        TEXT        NOT NULL DEFAULT 'pending'
                            CHECK (status IN (
                              'pending',
                              'generating',
                              'success',
                              'error'
                            )),

  -- Number of pipeline files written into the ZIP on a successful run.
  -- NULL while the run is still in progress.
  file_count    INTEGER,

  -- Human-readable error detail, populated only when status = 'error'.
  error_message TEXT,

  -- Timestamps (no updated_at — status transitions are recorded via started/completed).
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- Index: speed up lookups of all runs for a given project
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_project_id
  ON pipeline_runs (project_id);

-- Index to support per-user run history without a join to projects.
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_user_id
  ON pipeline_runs (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;

-- SELECT: users can inspect the status of their own generation runs.
CREATE POLICY "Users can read own pipeline runs"
  ON pipeline_runs
  FOR SELECT
  USING (auth.uid() = user_id);
