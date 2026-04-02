/**
 * admin-errors.routes.ts
 *
 * Admin error log routes.
 *
 * Routes:
 *   GET   /api/admin/errors/stats   — aggregate stats across all error logs
 *   GET   /api/admin/errors         — paginated list with optional filters
 *   PATCH /api/admin/errors/:id     — mark an error as resolved
 *
 * NOTE: /errors/stats must be registered BEFORE /errors/:id to prevent the
 * Hono :id wildcard from matching the literal string "stats".
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

// ── Helper: map DB row to camelCase response ─────────────────────────────────

function mapErrorLog(row: Record<string, unknown>) {
  return {
    id: row['id'],
    userId: row['user_id'],
    userEmail: row['user_email'],
    endpoint: row['endpoint'],
    httpMethod: row['http_method'],
    requestPayload: row['request_payload'],
    errorType: row['error_type'],
    errorMessage: row['error_message'],
    stackTrace: row['stack_trace'],
    httpStatus: row['http_status'],
    userFacingError: row['user_facing_error'],
    platform: row['platform'],
    deployTarget: row['deploy_target'],
    nodeVersion: row['node_version'],
    marketsCount: row['markets_count'],
    resolved: row['resolved'],
    resolvedAt: row['resolved_at'],
    resolvedNote: row['resolved_note'],
    createdAt: row['created_at'],
  };
}

export function adminErrorsRoutes() {
  const app = new Hono<HonoEnv>();

  // ─── GET /errors/stats ───────────────────────────────────────────────────────
  // Registered BEFORE /errors/:id to prevent wildcard matching "stats".

  app.get('/errors/stats', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const { data, error } = await supabase
      .from('error_logs')
      .select('error_type, platform, endpoint, resolved, created_at');

    if (error) {
      throw new AppError(`Failed to fetch error stats: ${error.message}`, 500);
    }

    const rows = (data ?? []) as {
      error_type: string | null;
      platform: string | null;
      endpoint: string;
      resolved: boolean;
      created_at: string;
    }[];

    const cutoff = Date.now() - 86_400_000;

    const byType: Record<string, number> = {};
    const byEndpoint: Record<string, number> = {};
    const byPlatform: Record<string, number> = {};

    for (const row of rows) {
      const type = row.error_type ?? 'UNKNOWN';
      byType[type] = (byType[type] ?? 0) + 1;

      byEndpoint[row.endpoint] = (byEndpoint[row.endpoint] ?? 0) + 1;

      const platform = row.platform ?? 'unknown';
      byPlatform[platform] = (byPlatform[platform] ?? 0) + 1;
    }

    return c.json({
      total: rows.length,
      unresolved: rows.filter((r) => !r.resolved).length,
      last24h: rows.filter((r) => new Date(r.created_at).getTime() > cutoff).length,
      byType,
      byEndpoint,
      byPlatform,
    });
  });

  // ─── GET /errors ─────────────────────────────────────────────────────────────

  app.get('/errors', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const page      = Math.max(1, parseInt(c.req.query('page')  ?? '1',  10) || 1);
    const limit     = Math.min(50, Math.max(1, parseInt(c.req.query('limit') ?? '20', 10) || 20));
    const offset    = (page - 1) * limit;
    const resolved  = c.req.query('resolved');
    const errorType = c.req.query('errorType');
    const platform  = c.req.query('platform');

    let query = supabase
      .from('error_logs')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (resolved === 'true')  query = query.eq('resolved', true);
    if (resolved === 'false') query = query.eq('resolved', false);
    if (errorType)            query = query.eq('error_type', errorType);
    if (platform)             query = query.eq('platform', platform);

    const { data, error, count } = await query;

    if (error) {
      throw new AppError(`Failed to fetch error logs: ${error.message}`, 500);
    }

    return c.json({
      errors: (data ?? []).map((row) => mapErrorLog(row as Record<string, unknown>)),
      total: count ?? 0,
      page,
      limit,
    });
  });

  // ─── PATCH /errors/:id ───────────────────────────────────────────────────────

  app.patch('/errors/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const body = await c.req.json<{ resolved: boolean; resolvedNote?: string }>();

    if (typeof body.resolved !== 'boolean') {
      throw new AppError('"resolved" must be a boolean', 400);
    }

    const { data, error } = await supabase
      .from('error_logs')
      .update({
        resolved: body.resolved,
        resolved_at: new Date().toISOString(),
        resolved_note: body.resolvedNote ?? null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to update error log: ${error.message}`, 500);
    }

    return c.json({ error: mapErrorLog(data as Record<string, unknown>) });
  });

  return app;
}
