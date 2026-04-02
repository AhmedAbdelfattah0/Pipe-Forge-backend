/**
 * admin.routes.ts
 *
 * Main admin router — aggregates all /api/admin/* sub-routers.
 *
 * Mounted at /api/admin in src/index.ts.
 * authMiddleware is applied upstream in index.ts for /api/admin/*.
 * Each sub-router performs its own requireAdmin() check.
 */

import { Hono } from 'hono';
import type { HonoEnv } from '../../../shared/middleware/auth.js';
import { requireAdminMiddleware } from '../middleware/require-admin.middleware.js';
import { createSupabaseAdmin } from '../../../config/supabase.js';

import { adminPlansRoutes }       from './admin-plans.routes.js';
import { adminMetricsRoutes }     from './admin-metrics.routes.js';
import { adminUsersRoutes }       from './admin-users.routes.js';
import { adminCouponsRoutes }     from './admin-coupons.routes.js';
import { adminFeedbackRoutes }    from './admin-feedback.routes.js';
import { adminGenerationsRoutes } from './admin-generations.routes.js';
import { adminHealthRoutes }      from './admin-health.routes.js';
import { adminErrorsRoutes }      from './admin-errors.routes.js';

export function adminRoutes() {
  const app = new Hono<HonoEnv>();

  // ── GET /me — Admin identity check (NO admin guard) ─────────────────────────
  // This endpoint is intentionally exempt from requireAdminMiddleware.
  // It answers "are you admin?" for ALL authenticated users (never 403).
  // The frontend calls this on startup to determine whether to show admin UI.
  app.get('/me', async (c) => {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ isAdmin: false });
    }
    const supabase = createSupabaseAdmin(c.env);
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single();
    return c.json({ isAdmin: !error && !!data });
  });

  // Centralised admin check — applied to ALL other admin sub-routes.
  // The /me route above is registered first so it is exempt from this middleware.
  app.use('*', requireAdminMiddleware);

  app.route('/', adminMetricsRoutes());
  app.route('/', adminUsersRoutes());
  app.route('/', adminPlansRoutes());
  app.route('/', adminCouponsRoutes());
  app.route('/', adminFeedbackRoutes());
  app.route('/', adminGenerationsRoutes());
  app.route('/', adminHealthRoutes());
  app.route('/', adminErrorsRoutes());

  return app;
}
