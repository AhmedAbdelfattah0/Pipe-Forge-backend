/**
 * plan-limiter.middleware.ts
 *
 * Enforces subscription-tier limits before a pipeline generation is allowed.
 *
 * Applied as middleware on `POST /api/pipelines/generate` after auth and
 * config validation. Reads the user's subscription from Supabase and checks:
 *   1. Monthly MFE generation count (mfe_used_this_month >= mfe_monthly_limit)
 *   2. Market count in the request config (enabled markets > market_limit)
 *
 * A limit value of `-1` means unlimited — the check is skipped in that case.
 */

import type { Request, Response, NextFunction } from 'express';
import { SubscriptionRepository } from '../repositories/subscription.repository.js';
import { AppError } from '../../../shared/utils/app-error.js';
import { asyncHandler } from '../../../shared/utils/async-handler.js';
import type { ValidatedGeneratorConfig } from '../../pipelines/middleware/validate-config.middleware.js';

const subscriptionRepository = new SubscriptionRepository();

/**
 * Express middleware that checks whether the authenticated user is within
 * their plan's generation and market limits.
 *
 * Preconditions:
 * - `req.user` is populated by `authMiddleware`.
 * - `req.body` has been validated by `validateConfigMiddleware` (typed as
 *   `ValidatedGeneratorConfig`).
 *
 * @throws {AppError} 403 — if the monthly generation limit is reached.
 * @throws {AppError} 403 — if the number of enabled markets exceeds the plan limit.
 * @throws {AppError} 404 — if no subscription record exists for the user.
 */
export const planLimiterMiddleware = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const config = req.body as ValidatedGeneratorConfig;

    const subscription = await subscriptionRepository.findByUserId(userId);

    if (!subscription) {
      throw new AppError('No active subscription found. Please contact support.', 404);
    }

    // ── Check monthly MFE generation limit ──────────────────────────────────
    const { mfe_monthly_limit, mfe_used_this_month, market_limit } = subscription;

    if (mfe_monthly_limit !== -1 && mfe_used_this_month >= mfe_monthly_limit) {
      throw new AppError(
        `Monthly generation limit reached (${mfe_used_this_month}/${mfe_monthly_limit}). ` +
          'Please upgrade your plan to continue generating pipelines.',
        403,
      );
    }

    // ── Check market count limit ─────────────────────────────────────────────
    const enabledMarketCount = config.markets.filter((m) => m.enabled).length;

    if (market_limit !== -1 && enabledMarketCount > market_limit) {
      throw new AppError(
        `Market limit exceeded. Your plan allows ${market_limit} market(s) per generation ` +
          `but ${enabledMarketCount} were selected. Please upgrade your plan.`,
        403,
      );
    }

    next();
  },
);
