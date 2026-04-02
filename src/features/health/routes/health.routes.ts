/**
 * health.routes.ts
 *
 * Health-check endpoint for deployment monitoring and load-balancer probes.
 *
 * Mounted at: `/api/health`
 */

import { Hono } from 'hono';
import type { Env } from '../../../config/env.js';

type HonoEnv = { Bindings: Env };

export function healthRoutes() {
  const app = new Hono<HonoEnv>();

  app.get('/', (c) =>
    c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    }),
  );

  return app;
}
