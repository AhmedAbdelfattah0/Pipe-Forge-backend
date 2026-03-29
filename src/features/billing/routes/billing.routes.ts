/**
 * billing.routes.ts
 *
 * Billing feature routes — all protected by `authMiddleware` applied
 * in `src/index.ts` at the router mount level.
 *
 * Mounted at: `/api/billing`
 *
 * Routes:
 *   GET /api/billing/subscription  — full subscription record
 *   GET /api/billing/usage         — current month usage vs limit
 */

import { Router } from 'express';
import { asyncHandler } from '../../../shared/utils/async-handler.js';
import { SubscriptionRepository } from '../repositories/subscription.repository.js';
import { AppError } from '../../../shared/utils/app-error.js';

const router = Router();
const subscriptionRepository = new SubscriptionRepository();

// ─── GET /subscription ────────────────────────────────────────────────────────

/**
 * GET /api/billing/subscription
 *
 * Returns the authenticated user's full subscription record including
 * plan tier, status, and all limit/usage fields.
 *
 * Response shape: `{ subscription: Subscription }`
 */
router.get(
  '/subscription',
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const subscription = await subscriptionRepository.findByUserId(userId);

    if (!subscription) {
      throw new AppError('No subscription found for this user', 404);
    }

    res.status(200).json({ subscription });
  }),
);

// ─── GET /usage ───────────────────────────────────────────────────────────────

/**
 * GET /api/billing/usage
 *
 * Returns a concise usage summary for the current billing cycle.
 *
 * Response shape:
 * ```json
 * {
 *   "usage": {
 *     "mfe_used_this_month": 2,
 *     "mfe_monthly_limit": 3,
 *     "market_limit": 1,
 *     "plan": "free",
 *     "billing_cycle_start": "2026-03-01T00:00:00.000Z"
 *   }
 * }
 * ```
 */
router.get(
  '/usage',
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const subscription = await subscriptionRepository.findByUserId(userId);

    if (!subscription) {
      throw new AppError('No subscription found for this user', 404);
    }

    res.status(200).json({
      usage: {
        mfe_used_this_month: subscription.mfe_used_this_month,
        mfe_monthly_limit: subscription.mfe_monthly_limit,
        market_limit: subscription.market_limit,
        plan: subscription.plan,
        billing_cycle_start: subscription.billing_cycle_start,
      },
    });
  }),
);

export default router;
