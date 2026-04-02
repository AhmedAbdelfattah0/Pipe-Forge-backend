-- Migration: 014_diagnosis_logs.sql
-- Creates the diagnosis_logs table for the AI Error Diagnosis feature (Task 23).
-- Tracks every diagnosis attempt for analytics and free-plan rate limiting.

-- ── Table ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.diagnosis_logs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id  uuid        REFERENCES public.projects(id) ON DELETE SET NULL,
  error_type  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

-- Fast lookup for rate-limiting: find all diagnoses by a user within the last 24 h.
CREATE INDEX IF NOT EXISTS diagnosis_logs_user_created_idx
  ON public.diagnosis_logs (user_id, created_at DESC);

-- ── Row-level security ────────────────────────────────────────────────────────

ALTER TABLE public.diagnosis_logs ENABLE ROW LEVEL SECURITY;

-- Users can read only their own diagnosis records.
CREATE POLICY "Users can read own diagnosis logs"
  ON public.diagnosis_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert diagnosis logs for themselves.
-- The backend uses the service-role key which bypasses RLS, so this policy
-- acts as a safety net if the anon key is ever used by mistake.
CREATE POLICY "Users can insert own diagnosis logs"
  ON public.diagnosis_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
