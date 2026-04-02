/**
 * admin-health.routes.ts
 *
 * Admin system health endpoint.
 *
 * Routes:
 *   GET /api/admin/health  — health check including Supabase connectivity
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

export function adminHealthRoutes() {
  const app = new Hono<HonoEnv>();

  app.get('/health', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    // Lightweight Supabase connectivity test
    let supabaseStatus = 'connected';
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      if (error) supabaseStatus = 'error';
    } catch {
      supabaseStatus = 'unreachable';
    }

    return c.json({
      status: 'ok',
      supabase: supabaseStatus,
      timestamp: new Date().toISOString(),
      environment: 'production',
    });
  });

  return app;
}
