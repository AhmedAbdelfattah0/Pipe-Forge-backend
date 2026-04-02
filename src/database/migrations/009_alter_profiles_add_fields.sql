-- =============================================================================
-- Migration 009: Add profile fields for user info + pipeline defaults
-- =============================================================================
-- Extends the existing `profiles` table with job/company info and
-- default pipeline settings that pre-fill the generator wizard.
-- =============================================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS full_name         TEXT,
  ADD COLUMN IF NOT EXISTS job_title         TEXT,
  ADD COLUMN IF NOT EXISTS company           TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url      TEXT,
  ADD COLUMN IF NOT EXISTS ado_organization  TEXT,
  ADD COLUMN IF NOT EXISTS ado_project       TEXT,
  ADD COLUMN IF NOT EXISTS default_platform  TEXT DEFAULT 'azure-devops',
  ADD COLUMN IF NOT EXISTS github_username   TEXT;
