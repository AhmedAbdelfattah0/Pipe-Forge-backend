/**
 * admin-coupons.routes.ts
 *
 * Admin coupon management routes.
 * NOTE: POST /coupons returns 501 — Stripe integration is not yet available.
 *
 * Routes:
 *   GET   /api/admin/coupons        — list all coupons
 *   POST  /api/admin/coupons        — STUB: 501 Not Implemented
 *   PATCH /api/admin/coupons/:id    — pause / resume a coupon (no Stripe call)
 */

import { Hono } from 'hono';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';

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

export function adminCouponsRoutes() {
  const app = new Hono<HonoEnv>();

  // ─── GET /coupons ─────────────────────────────────────────────────────────────

  app.get('/coupons', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch coupons: ${error.message}`, 500);
    }

    return c.json({ coupons: data ?? [] });
  });

  // ─── POST /coupons — STUB ─────────────────────────────────────────────────────

  app.post('/coupons', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    return c.json(
      {
        status: 'not_implemented',
        message:
          'Stripe integration not yet available. Coupon creation will be enabled once Stripe is connected.',
      },
      501,
    );
  });

  // ─── PATCH /coupons/:id ───────────────────────────────────────────────────────

  app.patch('/coupons/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const body = await c.req.json<{ is_active: boolean }>();
    if (typeof body.is_active !== 'boolean') {
      throw new AppError('is_active (boolean) is required', 400);
    }

    const { data, error } = await supabase
      .from('coupons')
      .update({ is_active: body.is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to update coupon: ${error.message}`, 500);
    }

    return c.json({ coupon: data });
  });

  return app;
}
