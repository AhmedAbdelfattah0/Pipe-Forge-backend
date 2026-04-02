/**
 * plans.routes.ts
 *
 * Public plan catalogue routes.
 *
 * Mounted at: /api/plans
 *
 * Routes:
 *   GET /api/plans  — returns all active plans with features (public, no auth required)
 */

import { Hono } from 'hono';
import { createSupabaseAnon } from '../../../config/supabase.js';
import { PlansRepository } from '../repositories/plans.repository.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';

export function plansRoutes() {
  const app = new Hono<HonoEnv>();

  // ─── GET / ────────────────────────────────────────────────────────────────────
  // Public endpoint — no auth required. Returns active plans + features + computed
  // annual monthly-equivalent price so the frontend can display both billing cycles.

  app.get('/', async (c) => {
    // Use anon client — this is a public endpoint and should only see
    // rows that pass the RLS "Public can read active plans" policy.
    const supabase = createSupabaseAnon(c.env);
    const plansRepo = new PlansRepository(supabase);

    const plans = await plansRepo.findActivePlansWithFeatures();

    return c.json({ plans });
  });

  return app;
}
