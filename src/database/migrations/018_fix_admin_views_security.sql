-- ============================================================
-- Migration 018: Fix Admin Views Security
-- Resolves Supabase security warnings on admin_metrics and
-- admin_users_overview views by:
--   1. Recreating both views with security_invoker = true so
--      queries run as the calling role, not the view owner.
--   2. Revoking all access from anon and authenticated roles.
--   3. Granting SELECT only to service_role.
--
-- Rollback:
--   DROP VIEW IF EXISTS admin_metrics;
--   DROP VIEW IF EXISTS admin_users_overview;
--   Then re-run the CREATE OR REPLACE VIEW blocks from
--   migration 013 (without the security_invoker option and
--   without the REVOKE/GRANT statements).
-- ============================================================

-- ── Step 1: Drop existing views ───────────────────────────────────────────────

DROP VIEW IF EXISTS admin_users_overview;
DROP VIEW IF EXISTS admin_metrics;

-- ── Step 2: Recreate admin_metrics with security_invoker = true ───────────────
-- Columns preserved from migration 013:
--   total_users, active_subscriptions, total_generations, pending_feedback

CREATE VIEW admin_metrics
  WITH (security_invoker = true)
AS
SELECT
  (SELECT COUNT(*) FROM profiles)                                                AS total_users,
  (SELECT COUNT(*) FROM subscriptions WHERE plan != 'free')                      AS active_subscriptions,
  (SELECT COUNT(*) FROM projects)                                                AS total_generations,
  (SELECT COUNT(*) FROM feedback WHERE is_public = true AND is_approved = false) AS pending_feedback;

-- ── Step 3: Recreate admin_users_overview with security_invoker = true ────────
-- Columns preserved from migration 013:
--   user_id, email, plan, mfe_used_this_month, mfe_monthly_limit,
--   billing_cycle_start, created_at, display_name, company

CREATE VIEW admin_users_overview
  WITH (security_invoker = true)
AS
SELECT
  s.user_id,
  u.email,
  s.plan,
  s.mfe_used_this_month,
  s.mfe_monthly_limit,
  s.billing_cycle_start,
  s.created_at,
  p.display_name,
  p.company
FROM subscriptions s
JOIN auth.users u    ON u.id = s.user_id
LEFT JOIN profiles p ON p.id = s.user_id;

-- ── Step 4: Lock down privileges ──────────────────────────────────────────────
-- Remove all access granted to the default anon and authenticated roles.
-- These views must only be reachable via the service_role key (server-side).

REVOKE ALL ON admin_metrics        FROM anon, authenticated;
REVOKE ALL ON admin_users_overview FROM anon, authenticated;

GRANT SELECT ON admin_metrics        TO service_role;
GRANT SELECT ON admin_users_overview TO service_role;
