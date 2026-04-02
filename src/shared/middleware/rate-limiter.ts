/**
 * rate-limiter.ts
 *
 * Simple in-memory sliding-window rate limiter for Hono / Cloudflare Workers.
 *
 * NOTE: In Workers, each isolate has its own memory. This provides per-isolate
 * rate limiting which is useful as a baseline defense. For strict global rate
 * limiting across all edge locations, configure Cloudflare's built-in rate
 * limiting rules in the dashboard or use Durable Objects.
 *
 * Usage:
 *   app.use('/api/pipelines/*', rateLimiter({ windowMs: 60_000, max: 10 }));
 */

import { createMiddleware } from 'hono/factory';
import type { Env } from '../../config/env.js';

type HonoEnv = {
  Bindings: Env;
  Variables: { userId: string; userEmail: string; userRole: string };
};

interface RateLimitOptions {
  /** Time window in milliseconds. */
  windowMs: number;
  /** Maximum number of requests allowed within the window. */
  max: number;
  /** Key extractor — defaults to userId from JWT context, falls back to IP. */
  keyFn?: (c: any) => string;
}

/** Map of key → array of request timestamps within the current window. */
const store = new Map<string, number[]>();

/** Periodic cleanup interval (every 5 minutes). */
let cleanupScheduled = false;
function scheduleCleanup(): void {
  if (cleanupScheduled) return;
  cleanupScheduled = true;
  setTimeout(() => {
    const now = Date.now();
    for (const [key, timestamps] of store) {
      const valid = timestamps.filter((t) => now - t < 300_000);
      if (valid.length === 0) {
        store.delete(key);
      } else {
        store.set(key, valid);
      }
    }
    cleanupScheduled = false;
  }, 300_000);
}

export function rateLimiter(options: RateLimitOptions) {
  const { windowMs, max, keyFn } = options;

  return createMiddleware<HonoEnv>(async (c, next) => {
    const key =
      keyFn?.(c) ??
      c.get('userId') ??
      c.req.header('cf-connecting-ip') ??
      c.req.header('x-forwarded-for') ??
      'unknown';

    const now = Date.now();
    const windowStart = now - windowMs;

    let timestamps = store.get(key) ?? [];
    timestamps = timestamps.filter((t) => t > windowStart);

    if (timestamps.length >= max) {
      const retryAfter = Math.ceil((timestamps[0]! + windowMs - now) / 1000);
      c.header('Retry-After', String(retryAfter));
      c.header('X-RateLimit-Limit', String(max));
      c.header('X-RateLimit-Remaining', '0');
      return c.json(
        { status: 'error', message: 'Too many requests. Please try again later.' },
        429,
      );
    }

    timestamps.push(now);
    store.set(key, timestamps);
    scheduleCleanup();

    c.header('X-RateLimit-Limit', String(max));
    c.header('X-RateLimit-Remaining', String(max - timestamps.length));

    await next();
  });
}
