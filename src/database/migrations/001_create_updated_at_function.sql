-- =============================================================================
-- Migration 001: Reusable updated_at trigger function
-- =============================================================================
-- This function must be created first because it is referenced by trigger
-- definitions in all subsequent migrations.
-- Run this in the Supabase SQL editor before running any other migration.
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
