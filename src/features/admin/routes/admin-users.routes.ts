/**
 * admin-users.routes.ts
 *
 * Admin user management routes.
 *
 * Routes:
 *   GET  /api/admin/users                   — paginated + filterable user list
 *   PATCH /api/admin/users/:id/plan         — change a user's plan
 *   POST  /api/admin/users/:id/compensate   — record a compensation
 *   GET  /api/admin/compensations           — list all compensations
 */

import { Hono } from 'hono';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';
import type {
  AdminUserOverview,
  InsertCompensation,
} from '../../../database/types/database.types.js';

async function requireAdmin(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  userId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', userId)
    .single();
  if (error || !data) throw new AppError('Forbidden', 403);
}

export function adminUsersRoutes() {
  const app = new Hono<HonoEnv>();

  // ─── GET /users ───────────────────────────────────────────────────────────────

  app.get('/users', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const page  = Math.max(1, parseInt(c.req.query('page')  ?? '1',  10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') ?? '20', 10) || 20));
    const search = c.req.query('search') || '';
    const plan   = c.req.query('plan')   || '';
    const offset = (page - 1) * limit;

    let query = supabase
      .from('admin_users_overview')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (search) {
      // Escape PostgREST special characters to prevent filter injection.
      // Order matters: escape backslashes first, then wildcards.
      const sanitised = search
        .replace(/\\/g, '\\\\')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_')
        .replace(/[,().]/g, '');
      if (sanitised.length > 0) {
        query = query.or(`email.ilike.%${sanitised}%,display_name.ilike.%${sanitised}%`);
      }
    }

    if (plan) {
      query = query.eq('plan', plan);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new AppError(`Failed to fetch users: ${error.message}`, 500);
    }

    const users = (data ?? []) as AdminUserOverview[];

    return c.json({
      users: users.map((u) => ({
        userId: u.user_id,
        email: u.email,
        plan: u.plan,
        mfeUsedThisMonth: u.mfe_used_this_month,
        mfeMonthlyLimit: u.mfe_monthly_limit,
        billingCycleStart: u.billing_cycle_start,
        createdAt: u.created_at,
        displayName: u.display_name,
        company: u.company,
      })),
      total: count ?? 0,
      page,
      limit,
    });
  });

  // ─── PATCH /users/:id/plan ────────────────────────────────────────────────────

  app.patch('/users/:id/plan', async (c) => {
    const adminId = c.get('userId');
    const targetUserId = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, adminId);

    const body = await c.req.json<{ plan: string }>();
    if (!body.plan || typeof body.plan !== 'string') throw new AppError('plan is required', 400);

    // Validate plan against known slugs to prevent arbitrary values
    const VALID_PLANS = ['free', 'pro', 'team', 'enterprise'];
    if (!VALID_PLANS.includes(body.plan)) {
      throw new AppError(`Invalid plan. Must be one of: ${VALID_PLANS.join(', ')}`, 400);
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .update({ plan: body.plan, updated_at: new Date().toISOString() })
      .eq('user_id', targetUserId)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to update plan: ${error.message}`, 500);
    }

    return c.json({ message: 'Plan updated successfully', subscription: data });
  });

  // ─── POST /users/:id/compensate ───────────────────────────────────────────────

  app.post('/users/:id/compensate', async (c) => {
    const adminId = c.get('userId');
    const targetUserId = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, adminId);

    const body = await c.req.json<{ type: string; value: string; reason?: string }>();
    if (!body.type || typeof body.type !== 'string') throw new AppError('type is required', 400);
    if (!body.value || typeof body.value !== 'string') throw new AppError('value is required', 400);

    // Validate compensation type against allowlist
    const VALID_COMP_TYPES = ['free_month', 'plan_upgrade'];
    if (!VALID_COMP_TYPES.includes(body.type)) {
      throw new AppError(`Invalid compensation type. Must be one of: ${VALID_COMP_TYPES.join(', ')}`, 400);
    }

    // Cap value length to prevent abuse
    if (body.value.length > 100) {
      throw new AppError('value must be 100 characters or less', 400);
    }
    if (body.reason && body.reason.length > 500) {
      throw new AppError('reason must be 500 characters or less', 400);
    }

    const insert: InsertCompensation = {
      user_id: targetUserId,
      admin_id: adminId,
      type: body.type as InsertCompensation['type'],
      value: body.value,
      reason: body.reason ?? null,
    };

    const { data, error } = await supabase
      .from('compensations')
      .insert(insert)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to record compensation: ${error.message}`, 500);
    }

    return c.json({ compensation: data }, 201);
  });

  // ─── GET /compensations ───────────────────────────────────────────────────────

  app.get('/compensations', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const { data, error } = await supabase
      .from('compensations')
      .select('*')
      .order('applied_at', { ascending: false })
      .limit(200);

    if (error) {
      throw new AppError(`Failed to fetch compensations: ${error.message}`, 500);
    }

    return c.json({ compensations: data ?? [] });
  });

  return app;
}
