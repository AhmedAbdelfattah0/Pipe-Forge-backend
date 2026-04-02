-- =============================================================================
-- Migration 008: Add ftp-cpanel to deploy_target CHECK constraint
-- =============================================================================
-- Allows 'ftp-cpanel' as a valid deploy_target value on the projects table.
-- =============================================================================

-- Drop the existing CHECK constraint and recreate with the new value.
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_deploy_target_check;

ALTER TABLE projects ADD CONSTRAINT projects_deploy_target_check
  CHECK (deploy_target IN (
    'storage-account',
    'static-web-app',
    'app-service',
    'ftp-cpanel'
  ));
