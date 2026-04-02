-- ============================================================
-- Migration 013: Admin Tables
-- Creates admin_users, compensations, and coupons tables.
-- Also creates admin_metrics and admin_users_overview views.
-- ============================================================

-- ── Table: admin_users ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_users (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Table: compensations ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS compensations (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id    uuid        NOT NULL REFERENCES auth.users(id),
  type        text        NOT NULL,  -- 'free_month' | 'plan_upgrade'
  value       text        NOT NULL,  -- e.g. '30days' or 'pro:30days'
  reason      text,                  -- internal note
  applied_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS compensations_user_idx  ON compensations (user_id);
CREATE INDEX IF NOT EXISTS compensations_admin_idx ON compensations (admin_id);

-- ── Table: coupons ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS coupons (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code             text        NOT NULL UNIQUE,
  type             text        NOT NULL,               -- 'percent' | 'fixed'
  value            numeric     NOT NULL,
  applies_to       text        NOT NULL DEFAULT 'all', -- 'all' | 'pro' | 'team' | 'enterprise'
  billing_cycle    text        NOT NULL DEFAULT 'both',-- 'monthly' | 'annual' | 'both'
  max_uses         integer,                            -- null = unlimited
  uses_count       integer     NOT NULL DEFAULT 0,
  expires_at       timestamptz,
  description      text,
  is_active        boolean     NOT NULL DEFAULT true,
  stripe_coupon_id text,                               -- populated when Stripe is integrated
  created_at       timestamptz NOT NULL DEFAULT now(),
  created_by       uuid        REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS coupons_code_idx      ON coupons (code);
CREATE INDEX IF NOT EXISTS coupons_active_idx    ON coupons (is_active, created_at DESC);

-- ── Row-Level Security ────────────────────────────────────────────────────────

ALTER TABLE admin_users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE compensations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons        ENABLE ROW LEVEL SECURITY;

-- Helper: check whether the requesting auth.uid() is an admin.
-- Using SECURITY DEFINER so the function can query admin_users without
-- triggering a recursive RLS loop.
CREATE OR REPLACE FUNCTION is_admin()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
$$;

-- admin_users: admins can read; only service-role can insert (done manually)
CREATE POLICY "Admins can read admin_users"
  ON admin_users
  FOR SELECT
  USING (is_admin());

-- compensations: admins can read and write
CREATE POLICY "Admins can read compensations"
  ON compensations
  FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert compensations"
  ON compensations
  FOR INSERT
  WITH CHECK (is_admin());

-- coupons: admins can read and write
CREATE POLICY "Admins can read coupons"
  ON coupons
  FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert coupons"
  ON coupons
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update coupons"
  ON coupons
  FOR UPDATE
  USING (is_admin());

-- ── View: admin_metrics ───────────────────────────────────────────────────────

CREATE OR REPLACE VIEW admin_metrics AS
SELECT
  (SELECT COUNT(*) FROM profiles)                                               AS total_users,
  (SELECT COUNT(*) FROM subscriptions WHERE plan != 'free')                     AS active_subscriptions,
  (SELECT COUNT(*) FROM projects)                                               AS total_generations,
  (SELECT COUNT(*) FROM feedback WHERE is_public = true AND is_approved = false) AS pending_feedback;

-- ── View: admin_users_overview ────────────────────────────────────────────────

CREATE OR REPLACE VIEW admin_users_overview AS
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
JOIN auth.users u     ON u.id = s.user_id
LEFT JOIN profiles p  ON p.id = s.user_id;

-- ── Note on admin bootstrapping ───────────────────────────────────────────────
-- After deploying this migration, add yourself as admin manually:
--   INSERT INTO admin_users (id) VALUES ('your-supabase-auth-user-uuid');
