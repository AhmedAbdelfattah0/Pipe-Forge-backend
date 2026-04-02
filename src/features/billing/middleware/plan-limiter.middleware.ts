/**
 * plan-limiter.middleware.ts
 *
 * Enforces subscription-tier limits before a pipeline generation is allowed.
 *
 * Converted from Express middleware to a plain async function that accepts
 * a SupabaseClient, userId, and config, and throws HTTPException on violation.
 */

import { HTTPException } from 'hono/http-exception';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SubscriptionRepository } from '../repositories/subscription.repository.js';
import { PlansRepository } from '../repositories/plans.repository.js';
import type { ValidatedGeneratorConfig } from '../../pipelines/middleware/validate-config.middleware.js';

/**
 * Checks whether the authenticated user is within their plan's
 * generation and market limits.
 *
 * @throws {HTTPException} 403 — if the monthly generation limit is reached.
 * @throws {HTTPException} 403 — if the number of enabled markets exceeds the plan limit.
 * @throws {HTTPException} 404 — if no subscription record exists for the user.
 */
export async function checkPlanLimits(
  supabase: SupabaseClient,
  userId: string,
  config: ValidatedGeneratorConfig,
): Promise<void> {
  const repo = new SubscriptionRepository(supabase);
  const subscription = await repo.findByUserId(userId);

  if (!subscription) {
    throw new HTTPException(404, {
      message: 'No active subscription found. Please contact support.',
    });
  }

  // ── Resolve monthly limit — prefer plans table over subscription snapshot ──
  const plansRepo = new PlansRepository(supabase);
  const planLimit = await plansRepo.getMonthlyLimit(subscription.plan).catch(() => null);

  // planLimit null = unlimited. Fallback to subscription.mfe_monthly_limit if plan not found.
  const resolvedLimit = planLimit !== null
    ? planLimit
    : (subscription.mfe_monthly_limit === -1 ? null : subscription.mfe_monthly_limit);

  const { mfe_used_this_month, market_limit } = subscription;

  if (resolvedLimit !== null && mfe_used_this_month >= resolvedLimit) {
    throw new HTTPException(403, {
      message:
        `Monthly generation limit reached (${mfe_used_this_month}/${resolvedLimit}). ` +
        'Please upgrade your plan to continue generating pipelines.',
    });
  }

  // ── Check market count limit ─────────────────────────────────────────────
  const enabledMarketCount = config.markets.filter((m) => m.enabled).length;

  if (market_limit !== -1 && enabledMarketCount > market_limit) {
    throw new HTTPException(403, {
      message:
        `Market limit exceeded. Your plan allows ${market_limit} market(s) per generation ` +
        `but ${enabledMarketCount} were selected. Please upgrade your plan.`,
    });
  }
}
