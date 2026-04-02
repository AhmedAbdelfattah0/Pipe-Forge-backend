/**
 * database.types.ts
 *
 * TypeScript interfaces that mirror the PipeForge Supabase database schema.
 *
 * Type mapping rules (PostgreSQL → TypeScript):
 *   uuid        → string
 *   text        → string
 *   text[]      → string[]
 *   integer     → number
 *   boolean     → boolean
 *   timestamptz → string  (ISO 8601 format, e.g. "2026-03-27T10:00:00.000Z")
 *   jsonb       → Record<string, unknown>
 *
 * Row types represent a complete row as returned by a SELECT query.
 * Insert types are the minimal DTO needed for an INSERT — auto-generated
 * columns (id, created_at, generated_at, started_at, completed_at) are
 * omitted because the database supplies default values for them.
 */

// =============================================================================
// profiles
// =============================================================================

/**
 * A full row from the `profiles` table.
 * `id` is the same UUID as the corresponding `auth.users.id`.
 */
export interface Profile {
  /** UUID — mirrors auth.users.id (no separate user_id column). */
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  full_name: string | null;
  job_title: string | null;
  company: string | null;
  linkedin_url: string | null;
  ado_organization: string | null;
  ado_project: string | null;
  default_platform: string | null;
  github_username: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// subscriptions
// =============================================================================

/** Valid billing plan tiers. */
export type PlanTier = 'free' | 'starter' | 'growth';

/** Valid subscription lifecycle statuses. */
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due';

/**
 * A full row from the `subscriptions` table.
 * Limit columns use -1 to represent "unlimited".
 */
export interface Subscription {
  id: string;
  user_id: string;
  plan: PlanTier;
  status: SubscriptionStatus;
  /** Maximum number of markets per generation. -1 = unlimited. */
  market_limit: number;
  /** Maximum MFE generations per billing cycle. -1 = unlimited. */
  mfe_monthly_limit: number;
  /** Counter of generations used in the current billing cycle. */
  mfe_used_this_month: number;
  /** ISO 8601 timestamp of the start of the current billing cycle. */
  billing_cycle_start: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// projects
// =============================================================================

/** Valid deploy target types. */
export type DeployTarget =
  | 'storage-account'
  | 'static-web-app'
  | 'app-service'
  | 'ftp-cpanel'
  | 'vercel'
  | 'netlify'
  | 'firebase'
  | 'github-pages'
  | 'cloudflare-pages';

/**
 * A full row from the `projects` table.
 * Represents one pipeline generation session and its stored configuration.
 */
export interface Project {
  id: string;
  user_id: string;
  mfe_name: string;
  repository_name: string;
  deploy_target: DeployTarget;
  /** Array of market codes selected for this generation, e.g. ["KSA", "UAE"]. */
  markets: string[];
  /** Array of environment names selected, e.g. ["QA", "PROD"]. */
  environments: string[];
  /** Array of language codes selected, e.g. ["AR", "EN"]. */
  languages: string[];
  /** Array of output format identifiers, e.g. ["yaml", "classic-json"]. */
  output_formats: string[];
  /** Total number of pipeline files included in the generated ZIP. */
  pipeline_count: number;
  /** Full GeneratorConfig snapshot stored for future regeneration. */
  config_snapshot: Record<string, unknown>;
  /** ISO 8601 timestamp of when the generation was performed. */
  generated_at: string;
  created_at: string;
}

/**
 * DTO for inserting a new project row.
 * Omits auto-generated columns: id, generated_at, created_at.
 */
export interface InsertProject {
  user_id: string;
  mfe_name: string;
  repository_name: string;
  deploy_target: DeployTarget;
  markets: string[];
  environments: string[];
  languages: string[];
  output_formats: string[];
  pipeline_count: number;
  config_snapshot: Record<string, unknown>;
}

// =============================================================================
// pipeline_runs
// =============================================================================

/** Valid lifecycle states for a pipeline generation run. */
export type PipelineRunStatus = 'pending' | 'generating' | 'success' | 'error';

/**
 * A full row from the `pipeline_runs` table.
 * Tracks the execution status of a single generation request.
 */
export interface PipelineRun {
  id: string;
  user_id: string;
  project_id: string;
  status: PipelineRunStatus;
  /** Number of files written into the ZIP. NULL while the run is in progress. */
  file_count: number | null;
  /** Human-readable error detail. NULL unless status is "error". */
  error_message: string | null;
  /** ISO 8601 timestamp of when the run was initiated. */
  started_at: string;
  /** ISO 8601 timestamp of when the run completed (success or error). NULL if still running. */
  completed_at: string | null;
}

/**
 * DTO for inserting a new pipeline_runs row.
 * Omits auto-generated columns: id, started_at, completed_at.
 * `status` defaults to "pending" in the database but may be supplied explicitly.
 */
export interface InsertPipelineRun {
  user_id: string;
  project_id: string;
  status?: PipelineRunStatus;
  file_count?: number | null;
  error_message?: string | null;
}

// =============================================================================
// generations
// =============================================================================

/**
 * A full row from the `generations` table.
 * Records each pipeline generation with its configuration snapshot.
 */
export interface Generation {
  id: string;
  user_id: string;
  config: Record<string, unknown>;
  platform: string | null;
  deploy_target: string | null;
  markets: string[];
  environments: string[];
  languages: string[];
  is_multi_language: boolean;
  pipeline_count: number | null;
  created_at: string;
}

/**
 * DTO for inserting a new generation row.
 * Omits auto-generated columns: id, created_at.
 */
export interface InsertGeneration {
  user_id: string;
  config: Record<string, unknown>;
  platform?: string | null;
  deploy_target?: string | null;
  markets?: string[];
  environments?: string[];
  languages?: string[];
  is_multi_language?: boolean;
  pipeline_count?: number | null;
}

// =============================================================================
// feedback
// =============================================================================

/** Valid pipeline-worked status values. */
export type PipelinesWorkedStatus = 'yes' | 'no' | 'partial';

/**
 * A full row from the `feedback` table.
 * Stores user feedback on pipeline generations.
 */
export interface Feedback {
  id: string;
  user_id: string;
  generation_id: string | null;
  rating: number;
  pipelines_worked: PipelinesWorkedStatus | null;
  what_went_wrong: string | null;
  feature_request: string | null;
  display_name: string | null;
  company: string | null;
  is_public: boolean;
  is_approved: boolean;
  source: string;
  created_at: string;
}

/**
 * DTO for inserting a new feedback row.
 * Omits auto-generated columns: id, is_approved, created_at.
 */
export interface InsertFeedback {
  user_id: string;
  generation_id?: string | null;
  rating: number;
  pipelines_worked?: PipelinesWorkedStatus | null;
  what_went_wrong?: string | null;
  feature_request?: string | null;
  display_name?: string | null;
  company?: string | null;
  is_public?: boolean;
  source?: string;
}

// =============================================================================
// admin_users
// =============================================================================

export interface AdminUser {
  id: string;
  created_at: string;
}

// =============================================================================
// compensations
// =============================================================================

/** Valid compensation types. */
export type CompensationType = 'free_month' | 'plan_upgrade';

export interface Compensation {
  id: string;
  user_id: string;
  admin_id: string;
  type: CompensationType;
  value: string;
  reason: string | null;
  applied_at: string;
}

export interface InsertCompensation {
  user_id: string;
  admin_id: string;
  type: CompensationType;
  value: string;
  reason?: string | null;
}

// =============================================================================
// coupons
// =============================================================================

/** Valid coupon discount types. */
export type CouponType = 'percent' | 'fixed';

/** Valid coupon billing cycle targets. */
export type CouponBillingCycle = 'monthly' | 'annual' | 'both';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  applies_to: string;
  billing_cycle: CouponBillingCycle;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  description: string | null;
  is_active: boolean;
  stripe_coupon_id: string | null;
  created_at: string;
  created_by: string | null;
}

export interface InsertCoupon {
  code: string;
  type: CouponType;
  value: number;
  applies_to?: string;
  billing_cycle?: CouponBillingCycle;
  max_uses?: number | null;
  expires_at?: string | null;
  description?: string | null;
  is_active?: boolean;
  created_by?: string | null;
}

// =============================================================================
// admin views
// =============================================================================

export interface AdminMetrics {
  total_users: number;
  active_subscriptions: number;
  total_generations: number;
  pending_feedback: number;
}

export interface AdminUserOverview {
  user_id: string;
  email: string;
  plan: string;
  mfe_used_this_month: number;
  mfe_monthly_limit: number;
  billing_cycle_start: string;
  created_at: string;
  display_name: string | null;
  company: string | null;
}

// =============================================================================
// diagnosis_logs
// =============================================================================

/**
 * A full row from the `diagnosis_logs` table.
 * Records each AI error diagnosis attempt for analytics and rate limiting.
 */
export interface DiagnosisLog {
  id: string;
  user_id: string;
  project_id: string | null;
  error_type: string | null;
  created_at: string;
}

/** DTO for inserting a new diagnosis_logs row. */
export interface InsertDiagnosisLog {
  user_id: string;
  project_id?: string | null;
  error_type?: string | null;
}
