-- ============================================================
-- Migration 015: Feature Gating Limit Columns
--
-- Adds three new per-plan limit columns to the `plans` table
-- and seeds all four existing plan rows with their correct values.
--
-- Run manually via Supabase dashboard SQL editor.
-- Safe to re-run (ADD COLUMN IF NOT EXISTS).
-- ============================================================

-- ── Part 1: Add new limit columns ────────────────────────────────────────────

ALTER TABLE plans ADD COLUMN IF NOT EXISTS
  max_ai_diagnoses_per_day INTEGER;

ALTER TABLE plans ADD COLUMN IF NOT EXISTS
  max_validator_files_per_month INTEGER;

ALTER TABLE plans ADD COLUMN IF NOT EXISTS
  max_history_items INTEGER;

-- ── Part 2: Seed limit values per plan ───────────────────────────────────────
-- Rows already exist from migration 010 — use UPDATE, not INSERT.
-- NULL = unlimited.  0 = feature blocked entirely.

-- Free plan: tightly limited across all axes
UPDATE plans SET
  max_projects_per_month        = 3,
  max_ai_diagnoses_per_day      = 0,
  max_validator_files_per_month = 3,
  max_history_items             = 1,
  max_team_members              = 1
WHERE slug = 'free';

-- Pro plan: unlimited generations + history, 10 AI diagnoses/day
UPDATE plans SET
  max_projects_per_month        = NULL,
  max_ai_diagnoses_per_day      = 10,
  max_validator_files_per_month = NULL,
  max_history_items             = NULL,
  max_team_members              = 1
WHERE slug = 'pro';

-- Team plan: everything unlimited, up to 5 members
UPDATE plans SET
  max_projects_per_month        = NULL,
  max_ai_diagnoses_per_day      = NULL,
  max_validator_files_per_month = NULL,
  max_history_items             = NULL,
  max_team_members              = 5
WHERE slug = 'team';

-- Enterprise plan: fully unlimited
UPDATE plans SET
  max_projects_per_month        = NULL,
  max_ai_diagnoses_per_day      = NULL,
  max_validator_files_per_month = NULL,
  max_history_items             = NULL,
  max_team_members              = NULL
WHERE slug = 'enterprise';
