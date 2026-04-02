-- ============================================================
-- Migration 010: Dynamic Subscription Plans
-- Replaces hardcoded plan configuration with a fully dynamic
-- plans + plan_features table structure.
-- ============================================================

-- ── Table: plans ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS plans (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                     text        NOT NULL UNIQUE,
  display_name             text        NOT NULL,
  description              text,
  display_order            integer     NOT NULL,
  is_active                boolean     NOT NULL DEFAULT true,
  is_highlighted           boolean     NOT NULL DEFAULT false,
  badge_text               text,
  cta_text                 text        NOT NULL DEFAULT 'Get started',
  cta_url                  text,
  price_monthly            numeric     NOT NULL DEFAULT 0,
  price_annual             numeric     NOT NULL DEFAULT 0,
  max_projects_per_month   integer,
  max_team_members         integer,
  stripe_price_id_monthly  text,
  stripe_price_id_annual   text,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

-- ── Table: plan_features ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS plan_features (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id        uuid        NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  feature_text   text        NOT NULL,
  display_order  integer     NOT NULL,
  is_active      boolean     NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS plans_slug_idx       ON plans (slug);
CREATE INDEX IF NOT EXISTS plans_active_idx     ON plans (is_active, display_order);
CREATE INDEX IF NOT EXISTS plan_features_plan_idx ON plan_features (plan_id, display_order);

-- ── Updated-at trigger ────────────────────────────────────────────────────────

CREATE TRIGGER set_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- ── Row-Level Security ────────────────────────────────────────────────────────

ALTER TABLE plans          ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features  ENABLE ROW LEVEL SECURITY;

-- Public read access for active plans
CREATE POLICY "Public can read active plans"
  ON plans
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read active plan features"
  ON plan_features
  FOR SELECT
  USING (is_active = true);

-- Admin full access (admin_users is created in migration 013, so we use a
-- service-role bypass for admin writes in the backend)

-- ── Seed: Initial Plans ───────────────────────────────────────────────────────

INSERT INTO plans (slug, display_name, description, display_order, is_active, is_highlighted, badge_text, cta_text, cta_url, price_monthly, price_annual, max_projects_per_month, max_team_members)
VALUES
  (
    'free',
    'Free',
    'Perfect for trying out PipeForge',
    1,
    true,
    false,
    NULL,
    'Get started',
    '/auth/signup',
    0,
    0,
    3,
    1
  ),
  (
    'pro',
    'Pro',
    'For individual developers shipping frequently',
    2,
    true,
    true,
    'Most Popular',
    'Get Pro',
    NULL,
    9,
    84,
    NULL,
    1
  ),
  (
    'team',
    'Team',
    'For small teams collaborating on multiple projects',
    3,
    true,
    false,
    NULL,
    'Get Team',
    NULL,
    19,
    180,
    NULL,
    5
  ),
  (
    'enterprise',
    'Enterprise',
    'For organisations that need unlimited scale and support',
    4,
    true,
    false,
    NULL,
    'Contact us',
    'mailto:hello@pipeforge.dev',
    49,
    468,
    NULL,
    NULL
  )
ON CONFLICT (slug) DO NOTHING;

-- ── Seed: Free Plan Features ──────────────────────────────────────────────────

INSERT INTO plan_features (plan_id, feature_text, display_order)
SELECT plans.id, f.feature_text, f.display_order FROM (
  VALUES
    ('3 pipeline generations per month', 1),
    ('Azure DevOps + GitHub Actions', 2),
    ('All deploy targets', 3),
    ('ZIP download', 4)
) AS f(feature_text, display_order)
CROSS JOIN plans WHERE plans.slug = 'free'
ON CONFLICT DO NOTHING;

-- ── Seed: Pro Plan Features ───────────────────────────────────────────────────

INSERT INTO plan_features (plan_id, feature_text, display_order)
SELECT plans.id, f.feature_text, f.display_order FROM (
  VALUES
    ('Unlimited pipeline generations', 1),
    ('Azure DevOps + GitHub Actions', 2),
    ('All deploy targets', 3),
    ('ZIP download', 4),
    ('Pipeline history', 5),
    ('Priority support', 6)
) AS f(feature_text, display_order)
CROSS JOIN plans WHERE plans.slug = 'pro'
ON CONFLICT DO NOTHING;

-- ── Seed: Team Plan Features ──────────────────────────────────────────────────

INSERT INTO plan_features (plan_id, feature_text, display_order)
SELECT plans.id, f.feature_text, f.display_order FROM (
  VALUES
    ('Unlimited pipeline generations', 1),
    ('Azure DevOps + GitHub Actions', 2),
    ('All deploy targets', 3),
    ('ZIP download', 4),
    ('Pipeline history', 5),
    ('Up to 5 team members', 6),
    ('Shared pipeline templates', 7),
    ('Priority support', 8)
) AS f(feature_text, display_order)
CROSS JOIN plans WHERE plans.slug = 'team'
ON CONFLICT DO NOTHING;

-- ── Seed: Enterprise Plan Features ───────────────────────────────────────────

INSERT INTO plan_features (plan_id, feature_text, display_order)
SELECT plans.id, f.feature_text, f.display_order FROM (
  VALUES
    ('Unlimited pipeline generations', 1),
    ('Azure DevOps + GitHub Actions', 2),
    ('All deploy targets', 3),
    ('ZIP download', 4),
    ('Pipeline history', 5),
    ('Unlimited team members', 6),
    ('Shared pipeline templates', 7),
    ('Dedicated support', 8),
    ('Custom integrations', 9),
    ('SLA guarantee', 10)
) AS f(feature_text, display_order)
CROSS JOIN plans WHERE plans.slug = 'enterprise'
ON CONFLICT DO NOTHING;
