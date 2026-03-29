-- =============================================================================
-- Migration 003: subscriptions table
-- =============================================================================
-- Tracks the billing plan and usage quota for each user.
-- One row per user (enforced by UNIQUE constraint on user_id).
-- A free-tier row is automatically created when a profile is inserted.
--
-- Plan defaults:
--   free    → market_limit = 1,  mfe_monthly_limit = 3
--   starter → market_limit = 3,  mfe_monthly_limit = -1  (unlimited)
--   growth  → market_limit = -1, mfe_monthly_limit = -1  (unlimited)
--
-- -1 in limit columns means "no limit" — enforced at the application layer.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Table definition
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Every subscription belongs to exactly one auth user.
  user_id     UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Billing plan tier.
  plan        TEXT        NOT NULL DEFAULT 'free'
                          CHECK (plan IN ('free', 'starter', 'growth')),

  -- Subscription lifecycle status.
  status      TEXT        NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'cancelled', 'past_due')),

  -- Maximum number of distinct markets the user may select in a single generation.
  -- -1 = unlimited.
  market_limit        INTEGER NOT NULL DEFAULT 1,

  -- Maximum number of MFE generations allowed per billing cycle.
  -- -1 = unlimited.
  mfe_monthly_limit   INTEGER NOT NULL DEFAULT 3,

  -- Counter reset to 0 at the start of each billing cycle.
  mfe_used_this_month INTEGER NOT NULL DEFAULT 0,

  -- Anchor date for the current billing cycle; resets usage counter.
  billing_cycle_start TIMESTAMPTZ NOT NULL DEFAULT now(),

  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users may only read their own subscription record.
CREATE POLICY "Users can read own subscription"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Trigger: keep updated_at current on every UPDATE
-- ---------------------------------------------------------------------------
CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- ---------------------------------------------------------------------------
-- Trigger: auto-create a free subscription when a profile row is inserted
-- ---------------------------------------------------------------------------
-- Hooking on profiles (rather than auth.users) avoids the need for a second
-- trigger on the auth schema and keeps the cascade consistent: profile → subscription.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (
    user_id,
    plan,
    status,
    market_limit,
    mfe_monthly_limit,
    mfe_used_this_month,
    billing_cycle_start
  )
  VALUES (
    NEW.id,   -- profile.id equals auth.users.id
    'free',
    'active',
    1,        -- free tier: 1 market
    3,        -- free tier: 3 MFEs per month
    0,
    now()
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_profile();
