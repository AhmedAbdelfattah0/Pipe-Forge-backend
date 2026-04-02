/**
 * PipeForge backend — Hono application entry point for Cloudflare Workers.
 *
 * Import order:
 *  1. Hono core and middleware
 *  2. Auth middleware
 *  3. Feature route modules
 *  4. Global error handler
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { HTTPException } from 'hono/http-exception';
import type { Env } from './config/env.js';
import { authMiddleware } from './shared/middleware/auth.js';
import { AppError } from './shared/utils/app-error.js';
import { rateLimiter } from './shared/middleware/rate-limiter.js';

// Import route modules
import { healthRoutes } from './features/health/routes/health.routes.js';
import { authRoutes } from './features/auth/routes/auth.routes.js';
import { pipelineRoutes } from './features/pipelines/routes/pipeline.routes.js';
import { historyRoutes } from './features/history/routes/history.routes.js';
import { billingRoutes } from './features/billing/routes/billing.routes.js';
import { plansRoutes } from './features/billing/routes/plans.routes.js';
import { feedbackRoutes } from './features/feedback/routes/feedback.routes.js';
import { profileRoutes } from './features/profile/routes/profile.routes.js';
import { adminRoutes } from './features/admin/routes/admin.routes.js';
import { validatorRoutes } from './features/validator/routes/validator.routes.js';
import { diagnoseRoutes } from './features/diagnose/routes/diagnose.routes.js';

type HonoEnv = {
  Bindings: Env;
  Variables: { userId: string; userEmail: string; userRole: string };
};

const app = new Hono<HonoEnv>();

// ── Global middleware ──────────────────────────────────────────────────────────
app.use('*', logger());

// Security headers (Helmet-equivalent for Hono/Workers)
app.use('*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '0');
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header(
    'Content-Security-Policy',
    "default-src 'none'; frame-ancestors 'none'",
  );
  c.header(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()',
  );
});

// Request body size limit — 50 KB (reject oversized payloads early)
app.use('*', async (c, next) => {
  const contentLength = c.req.header('content-length');
  if (contentLength && parseInt(contentLength, 10) > 51_200) {
    return c.json({ status: 'error', message: 'Request body too large' }, 413);
  }
  await next();
});

app.use('*', async (c, next) => {
  const origin = c.env.FRONTEND_URL || 'http://localhost:4200';
  const corsMiddleware = cors({
    origin,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  });
  return corsMiddleware(c, next);
});

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Global: 100 requests per minute per user/IP.
// Tighter limits on generation and diagnose endpoints.
app.use('/api/*', rateLimiter({ windowMs: 60_000, max: 100 }));
app.use('/api/pipelines/generate', rateLimiter({ windowMs: 60_000, max: 10 }));
app.use('/api/pipelines/generate/*', rateLimiter({ windowMs: 60_000, max: 10 }));
app.use('/api/diagnose/*', rateLimiter({ windowMs: 60_000, max: 10 }));
app.use('/api/diagnose', rateLimiter({ windowMs: 60_000, max: 10 }));
app.use('/api/validator/*', rateLimiter({ windowMs: 60_000, max: 20 }));
app.use('/api/validator', rateLimiter({ windowMs: 60_000, max: 20 }));

// ── Routes ────────────────────────────────────────────────────────────────────

// Public routes
app.route('/api/health', healthRoutes());
app.route('/api/plans', plansRoutes());

// Protected routes — auth middleware applied before route mounting
app.use('/api/auth/*', authMiddleware);
app.route('/api/auth', authRoutes());

app.use('/api/pipelines/*', authMiddleware);
app.route('/api/pipelines', pipelineRoutes());

app.use('/api/history/*', authMiddleware);
app.route('/api/history', historyRoutes());

app.use('/api/billing/*', authMiddleware);
app.route('/api/billing', billingRoutes());

app.use('/api/profile/*', authMiddleware);
app.use('/api/profile', authMiddleware);
app.route('/api/profile', profileRoutes());

// Feedback — mixed: testimonials are public, POST requires auth (handled inline)
app.route('/api/feedback', feedbackRoutes());

// Admin routes — protected by auth + admin_users check (enforced inside route handlers)
app.use('/api/admin/*', authMiddleware);
app.route('/api/admin', adminRoutes());

// V2 features — Pipeline Validator + AI Error Diagnosis (JWT-protected)
app.use('/api/validator/*', authMiddleware);
app.use('/api/validator', authMiddleware);
app.route('/api/validator', validatorRoutes());

app.use('/api/diagnose/*', authMiddleware);
app.use('/api/diagnose', authMiddleware);
app.route('/api/diagnose', diagnoseRoutes());

// ── Global error handler ──────────────────────────────────────────────────────
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ status: 'error', message: err.message }, err.status);
  }

  if (err instanceof AppError) {
    return c.json(
      { status: 'error', message: err.message },
      err.statusCode as 400 | 401 | 403 | 404 | 422 | 500,
    );
  }

  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  console.error('Unhandled error:', message, stack);
  return c.json({ status: 'error', message: `Internal server error: ${message}` }, 500);
});

export default app;
