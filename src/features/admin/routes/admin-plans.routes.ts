/**
 * admin-plans.routes.ts
 *
 * Admin plan management routes — protected by authMiddleware + admin check.
 *
 * Mounted at: /api/admin (via adminRoutes)
 *
 * Routes:
 *   GET    /api/admin/plans                       — all plans including inactive
 *   POST   /api/admin/plans                       — create new plan
 *   PATCH  /api/admin/plans/:id                   — update any plan field
 *   DELETE /api/admin/plans/:id                   — soft-delete (set is_active = false)
 *   POST   /api/admin/plans/:id/features          — add feature to plan
 *   PATCH  /api/admin/plans/:id/features/:fid     — update feature text or order
 *   DELETE /api/admin/plans/:id/features/:fid     — soft-delete feature
 *   PATCH  /api/admin/plans/reorder               — bulk update display_order
 */

import { Hono } from 'hono';
import { AppError } from '../../../shared/utils/app-error.js';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import { PlansRepository } from '../../billing/repositories/plans.repository.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';

/** Verifies the requesting user is in the admin_users table. */
async function requireAdmin(supabase: ReturnType<typeof createSupabaseAdmin>, userId: string): Promise<void> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new AppError('Forbidden', 403);
  }
}

export function adminPlansRoutes() {
  const app = new Hono<HonoEnv>();

  // ─── GET /plans ───────────────────────────────────────────────────────────────

  app.get('/plans', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const plansRepo = new PlansRepository(supabase);
    const plans = await plansRepo.findAllPlansWithFeatures();

    return c.json({ plans });
  });

  // ─── POST /plans ──────────────────────────────────────────────────────────────

  app.post('/plans', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const body = await c.req.json();

    if (!body.slug || typeof body.slug !== 'string') {
      throw new AppError('slug is required and must be a string', 400);
    }
    if (!body.display_name || typeof body.display_name !== 'string') {
      throw new AppError('display_name is required and must be a string', 400);
    }
    if (body.display_order === undefined || typeof body.display_order !== 'number') {
      throw new AppError('display_order is required and must be a number', 400);
    }

    // Validate slug format — alphanumeric + hyphens only, max 30 chars
    if (!/^[a-z0-9-]{1,30}$/.test(body.slug)) {
      throw new AppError('slug must be 1-30 lowercase alphanumeric characters or hyphens', 400);
    }
    if (body.display_name.length > 50) {
      throw new AppError('display_name must be 50 characters or less', 400);
    }

    // Only allow known fields through to the repository
    const safeInput = {
      slug: body.slug,
      display_name: body.display_name,
      display_order: body.display_order,
      ...(body.description && typeof body.description === 'string' ? { description: body.description.slice(0, 200) } : {}),
      ...(typeof body.is_active === 'boolean' ? { is_active: body.is_active } : {}),
      ...(typeof body.is_highlighted === 'boolean' ? { is_highlighted: body.is_highlighted } : {}),
      ...(typeof body.badge_text === 'string' ? { badge_text: body.badge_text.slice(0, 30) } : {}),
      ...(typeof body.cta_text === 'string' ? { cta_text: body.cta_text.slice(0, 50) } : {}),
      ...(typeof body.cta_url === 'string' ? { cta_url: body.cta_url.slice(0, 200) } : {}),
      ...(typeof body.price_monthly === 'number' ? { price_monthly: body.price_monthly } : {}),
      ...(typeof body.price_annual === 'number' ? { price_annual: body.price_annual } : {}),
      ...(body.max_projects_per_month === null || typeof body.max_projects_per_month === 'number'
        ? { max_projects_per_month: body.max_projects_per_month } : {}),
      ...(body.max_team_members === null || typeof body.max_team_members === 'number'
        ? { max_team_members: body.max_team_members } : {}),
    };

    const plansRepo = new PlansRepository(supabase);
    const plan = await plansRepo.create(safeInput);

    return c.json({ plan }, 201);
  });

  // ─── PATCH /plans/reorder ─────────────────────────────────────────────────────
  // Must be registered before /plans/:id to avoid matching conflict.

  app.patch('/plans/reorder', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const body = await c.req.json();

    if (!Array.isArray(body.orders)) {
      throw new AppError('orders array is required', 400);
    }

    const plansRepo = new PlansRepository(supabase);
    await plansRepo.reorderPlans(body.orders);

    return c.json({ message: 'Plans reordered successfully' });
  });

  // ─── PATCH /plans/:id ─────────────────────────────────────────────────────────

  app.patch('/plans/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const body = await c.req.json();
    const plansRepo = new PlansRepository(supabase);
    const plan = await plansRepo.update(id, body);

    return c.json({ plan });
  });

  // ─── DELETE /plans/:id ────────────────────────────────────────────────────────

  app.delete('/plans/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const plansRepo = new PlansRepository(supabase);
    await plansRepo.softDelete(id);

    return c.json({ message: 'Plan deactivated successfully' });
  });

  // ─── POST /plans/:id/features ─────────────────────────────────────────────────

  app.post('/plans/:id/features', async (c) => {
    const userId = c.get('userId');
    const planId = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const body = await c.req.json();

    if (!body.feature_text || body.display_order === undefined) {
      throw new AppError('feature_text and display_order are required', 400);
    }

    const plansRepo = new PlansRepository(supabase);
    const feature = await plansRepo.addFeature(planId, body);

    return c.json({ feature }, 201);
  });

  // ─── PATCH /plans/:id/features/:fid ──────────────────────────────────────────

  app.patch('/plans/:id/features/:fid', async (c) => {
    const userId = c.get('userId');
    const featureId = c.req.param('fid');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const body = await c.req.json();
    const plansRepo = new PlansRepository(supabase);
    const feature = await plansRepo.updateFeature(featureId, body);

    return c.json({ feature });
  });

  // ─── DELETE /plans/:id/features/:fid ─────────────────────────────────────────

  app.delete('/plans/:id/features/:fid', async (c) => {
    const userId = c.get('userId');
    const featureId = c.req.param('fid');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const plansRepo = new PlansRepository(supabase);
    await plansRepo.softDeleteFeature(featureId);

    return c.json({ message: 'Feature deactivated successfully' });
  });

  return app;
}
