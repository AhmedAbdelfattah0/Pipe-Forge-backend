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

import { adminPlansRoutes }       from './admin-plans.routes.js';
import { adminMetricsRoutes }     from './admin-metrics.routes.js';
import { adminUsersRoutes }       from './admin-users.routes.js';
import { adminCouponsRoutes }     from './admin-coupons.routes.js';
import { adminFeedbackRoutes }    from './admin-feedback.routes.js';
import { adminGenerationsRoutes } from './admin-generations.routes.js';
import { adminHealthRoutes }      from './admin-health.routes.js';

export function adminRoutes() {
  const app = new Hono<HonoEnv>();

  // Centralised admin check — applied to ALL admin sub-routes.
  // Individual route handlers no longer need their own requireAdmin() calls,
  // but they are kept as defence-in-depth.
  app.use('*', requireAdminMiddleware);

  // Lightweight admin identity check — used by the frontend guard ONLY.
  // requireAdminMiddleware above already verified admin_users membership,
  // so this handler has nothing left to do except confirm access.
  app.get('/me', (c) => c.json({ isAdmin: true }));

  app.route('/', adminMetricsRoutes());
  app.route('/', adminUsersRoutes());
  app.route('/', adminPlansRoutes());
  app.route('/', adminCouponsRoutes());
  app.route('/', adminFeedbackRoutes());
  app.route('/', adminGenerationsRoutes());
  app.route('/', adminHealthRoutes());

  return app;
}
