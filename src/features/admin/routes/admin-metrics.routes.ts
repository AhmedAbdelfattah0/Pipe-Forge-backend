/**
 * admin-metrics.routes.ts
 *
 * Admin metrics endpoint.
 *
 * Routes:
 *   GET /api/admin/metrics  — aggregated product metrics
 */

import { Hono } from 'hono';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';
import type { AdminMetrics } from '../../../database/types/database.types.js';

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

export function adminMetricsRoutes() {
  const app = new Hono<HonoEnv>();

  app.get('/metrics', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const { data, error } = await supabase
      .from('admin_metrics')
      .select('*')
      .single();

    if (error) {
      throw new AppError(`Failed to fetch metrics: ${error.message}`, 500);
    }

    const metrics = data as AdminMetrics;

    return c.json({
      totalUsers: Number(metrics.total_users),
      activeSubscriptions: Number(metrics.active_subscriptions),
      totalGenerations: Number(metrics.total_generations),
      pendingFeedback: Number(metrics.pending_feedback),
    });
  });

  return app;
}
