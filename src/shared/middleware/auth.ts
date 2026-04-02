/**
 * auth.ts
 *
 * Hono middleware that verifies a Supabase JWT from the
 * `Authorization: Bearer <token>` header and populates context variables.
 */

import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { createSupabaseAdmin } from '../../config/supabase.js';
import type { Env } from '../../config/env.js';

export type HonoEnv = {
  Bindings: Env;
  Variables: { userId: string; userEmail: string; userRole: string };
};

export const authMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  const token = authHeader.slice(7);
  const supabase = createSupabaseAdmin(c.env);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  c.set('userId', data.user.id);
  c.set('userEmail', data.user.email ?? '');
  c.set('userRole', data.user.role ?? 'authenticated');
  await next();
});
