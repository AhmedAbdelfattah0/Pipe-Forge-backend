-- Migration: 016_validator_logs.sql
-- Creates the validator_logs table for the Pipeline Validator feature.
-- Tracks every validation attempt for analytics and free-plan monthly cap enforcement.

-- ── Table ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.validator_logs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename    text,
  platform    text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

-- Fast lookup for rate-limiting: find all validations by a user within a month.
CREATE INDEX IF NOT EXISTS validator_logs_user_created_idx
  ON public.validator_logs (user_id, created_at DESC);

-- ── Row-level security ────────────────────────────────────────────────────────

ALTER TABLE public.validator_logs ENABLE ROW LEVEL SECURITY;

-- Users can read only their own validator records.
CREATE POLICY "Users can read own validator logs"
  ON public.validator_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert validator logs for themselves.
-- The backend uses the service-role key which bypasses RLS, so this policy
-- acts as a safety net if the anon key is ever used by mistake.
CREATE POLICY "Users can insert own validator logs"
  ON public.validator_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
