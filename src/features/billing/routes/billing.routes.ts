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

import { Hono } from 'hono';
import { AppError } from '../../../shared/utils/app-error.js';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import { SubscriptionRepository } from '../repositories/subscription.repository.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';

export function billingRoutes() {
  const app = new Hono<HonoEnv>();

  // ─── GET /subscription ──────────────────────────────────────────────────────

  app.get('/subscription', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    const subscriptionRepository = new SubscriptionRepository(supabase);

    const subscription = await subscriptionRepository.findByUserId(userId);

    if (!subscription) {
      throw new AppError('No subscription found for this user', 404);
    }

    return c.json({ subscription });
  });

  // ─── GET /usage ─────────────────────────────────────────────────────────────

  app.get('/usage', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    const subscriptionRepository = new SubscriptionRepository(supabase);

    const subscription = await subscriptionRepository.findByUserId(userId);

    if (!subscription) {
      throw new AppError('No subscription found for this user', 404);
    }

    return c.json({
      usage: {
        mfe_used_this_month: subscription.mfe_used_this_month,
        mfe_monthly_limit: subscription.mfe_monthly_limit,
        market_limit: subscription.market_limit,
        plan: subscription.plan,
        billing_cycle_start: subscription.billing_cycle_start,
      },
    });
  });

  return app;
}
