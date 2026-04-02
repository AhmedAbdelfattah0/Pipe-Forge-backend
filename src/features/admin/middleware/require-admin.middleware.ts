/**
 * require-admin.middleware.ts
 *
 * Hono middleware that verifies the authenticated user is in the admin_users table.
 * Apply this at the router level so every admin route is covered automatically,
 * eliminating the risk of a developer forgetting to call requireAdmin() in a handler.
 */

import { createMiddleware } from 'hono/factory';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';

export const requireAdminMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  const userId = c.get('userId');
  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const supabase = createSupabaseAdmin(c.env);
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new AppError('Forbidden', 403);
  }

  await next();
});
