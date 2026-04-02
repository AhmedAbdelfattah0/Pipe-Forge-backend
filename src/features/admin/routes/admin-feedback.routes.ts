/**
 * admin-feedback.routes.ts
 *
 * Admin feedback moderation routes.
 *
 * Routes:
 *   GET   /api/admin/feedback       — paginated list by status
 *   PATCH /api/admin/feedback/:id   — approve or reject a feedback item
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

export function adminFeedbackRoutes() {
  const app = new Hono<HonoEnv>();

  // ─── GET /feedback ────────────────────────────────────────────────────────────

  app.get('/feedback', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const status = c.req.query('status') || 'pending';
    const page   = Math.max(1, parseInt(c.req.query('page')  ?? '1',  10) || 1);
    const limit  = Math.min(50, Math.max(1, parseInt(c.req.query('limit') ?? '20', 10) || 20));
    const offset = (page - 1) * limit;

    let query = supabase
      .from('feedback')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (status === 'pending') {
      query = query.eq('is_public', true).eq('is_approved', false);
    } else if (status === 'approved') {
      query = query.eq('is_public', true).eq('is_approved', true);
    } else if (status === 'rejected') {
      query = query.eq('is_public', false).eq('is_approved', false);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new AppError(`Failed to fetch feedback: ${error.message}`, 500);
    }

    return c.json({
      feedback: (data ?? []).map((f) => ({
        id: f.id,
        userId: f.user_id,
        rating: f.rating,
        pipelinesWorked: f.pipelines_worked,
        whatWentWrong: f.what_went_wrong,
        featureRequest: f.feature_request,
        displayName: f.display_name,
        company: f.company,
        isPublic: f.is_public,
        isApproved: f.is_approved,
        createdAt: f.created_at,
      })),
      total: count ?? 0,
      page,
      limit,
    });
  });

  // ─── PATCH /feedback/:id ──────────────────────────────────────────────────────

  app.patch('/feedback/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    const body = await c.req.json<{ action: 'approve' | 'reject' }>();
    if (!body.action || !['approve', 'reject'].includes(body.action)) {
      throw new AppError('action must be "approve" or "reject"', 400);
    }

    const update =
      body.action === 'approve'
        ? { is_approved: true,  is_public: true  }
        : { is_public:  false };

    const { data, error } = await supabase
      .from('feedback')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to update feedback: ${error.message}`, 500);
    }

    return c.json({ feedback: data });
  });

  return app;
}
