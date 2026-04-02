/**
 * auth.routes.ts
 *
 * Auth feature routes — all protected by `authMiddleware` applied
 * at the router level in `src/index.ts`.
 *
 * Mounted at: `GET /api/auth/me`
 */

import { Hono } from 'hono';
import type { HonoEnv } from '../../../shared/middleware/auth.js';

export function authRoutes() {
  const app = new Hono<HonoEnv>();

  app.get('/me', (c) => {
    return c.json({
      user: {
        id: c.get('userId'),
        email: c.get('userEmail'),
        role: c.get('userRole'),
      },
    });
  });

  return app;
}
