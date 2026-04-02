/**
 * feature-gate.middleware.ts
 *
 * Enforces per-plan feature locks before a request proceeds.
 *
 * Usage:
 *   await checkFeatureLock(supabase, userId, 'ai_diagnosis');
 *
 * Throws HTTPException 403 with the standardised FEATURE_LOCKED payload
 * when the user's plan does not permit the requested feature.
 */

import { HTTPException } from 'hono/http-exception';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SubscriptionRepository } from '../repositories/subscription.repository.js';
import { PlansRepository } from '../repositories/plans.repository.js';

/** Features that can be gated. */
export type GatedFeature = 'ai_diagnosis' | 'validator' | 'generate';

/**
 * Maps each gated feature to the cheapest plan slug that unlocks it.
 * Used to populate the `requiredPlan` field in FEATURE_LOCKED responses.
 */
const REQUIRED_PLAN: Record<GatedFeature, string> = {
  ai_diagnosis: 'pro',
  validator: 'pro',
  generate: 'pro',
};

/**
 * Throws a 403 HTTPException with the standardised FEATURE_LOCKED payload.
 *
 * Response body:
 * ```json
 * {
 *   "error": "FEATURE_LOCKED",
 *   "feature": "<feature>",
 *   "requiredPlan": "<slug>",
 *   "upgradeUrl": "/pricing"
 * }
 * ```
 */
function throwFeatureLocked(feature: GatedFeature): never {
  throw new HTTPException(403, {
    message: JSON.stringify({
      error: 'FEATURE_LOCKED',
      feature,
      requiredPlan: REQUIRED_PLAN[feature],
      upgradeUrl: '/pricing',
    }),
  });
}

/**
 * Checks whether the authenticated user is allowed to use the requested feature
 * under their current subscription plan.
 *
 * @param supabase - Supabase admin client (service-role, bypasses RLS).
 * @param userId   - Authenticated user's UUID.
 * @param feature  - The feature being requested.
 *
 * @throws {HTTPException} 404 — if no subscription record exists for the user.
 * @throws {HTTPException} 403 — with FEATURE_LOCKED if the plan blocks the feature.
 */
export async function checkFeatureLock(
  supabase: SupabaseClient,
  userId: string,
  feature: GatedFeature,
): Promise<void> {
  const subscriptionRepo = new SubscriptionRepository(supabase);
  const plansRepo = new PlansRepository(supabase);

  // ── 1. Load subscription ──────────────────────────────────────────────────
  const subscription = await subscriptionRepo.findByUserId(userId);
  if (!subscription) {
    throw new HTTPException(404, {
      message: 'No active subscription found. Please contact support.',
    });
  }

  // ── 2. Load plan limits ───────────────────────────────────────────────────
  const plan = await plansRepo.findBySlug(subscription.plan).catch(() => null);

  // If we cannot resolve the plan, treat as unlimited — fail open.
  if (!plan) {
    return;
  }

  // ── 3. Enforce per-feature limits ─────────────────────────────────────────

  if (feature === 'ai_diagnosis') {
    const limit = plan.max_ai_diagnoses_per_day;

    // Hard block: limit is explicitly 0.
    if (limit !== null && limit <= 0) {
      throwFeatureLocked(feature);
    }

    // Soft cap: limit is a positive integer — check today's usage.
    if (limit !== null && limit > 0) {
      const { count } = await supabase
        .from('diagnosis_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 86_400_000).toISOString());

      if ((count ?? 0) >= limit) {
        throwFeatureLocked(feature);
      }
    }

    // limit === null → unlimited; no action needed.
    return;
  }

  if (feature === 'validator') {
    const limit = plan.max_validator_files_per_month;

    // Hard block: limit is explicitly 0.
    if (limit !== null && limit <= 0) {
      throwFeatureLocked(feature);
    }

    // Soft monthly cap: count this user's validations since the start of the month.
    if (limit !== null && limit > 0) {
      const startOfMonth = new Date();
      startOfMonth.setUTCDate(1);
      startOfMonth.setUTCHours(0, 0, 0, 0);

      const { count } = await supabase
        .from('validator_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString());

      if ((count ?? 0) >= limit) {
        throwFeatureLocked(feature);
      }
    }

    // limit === null → unlimited; no action needed.
    return;
  }

  if (feature === 'generate') {
    const limit = plan.max_projects_per_month;

    if (limit !== null && subscription.mfe_used_this_month >= limit) {
      throwFeatureLocked(feature);
    }

    return;
  }
}
