/**
 * feedback.routes.ts
 *
 * Feedback feature routes.
 *
 * Mounted at: `/api/feedback`
 *
 * Routes:
 *   POST /api/feedback              — submit feedback (authenticated)
 *   GET  /api/feedback/testimonials  — public testimonials (no auth)
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import { FeedbackRepository } from '../repositories/feedback.repository.js';
import { authMiddleware } from '../../../shared/middleware/auth.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';

const FeedbackSchema = z.object({
  generationId: z.string().uuid().optional().nullable(),
  rating: z.number().int().min(1).max(5),
  pipelinesWorked: z.enum(['yes', 'no', 'partial']).optional().nullable(),
  whatWentWrong: z.string().max(2000).optional().nullable(),
  featureRequest: z.string().max(2000).optional().nullable(),
  displayName: z.string().max(100).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  isPublic: z.boolean().optional().default(false),
});

export function feedbackRoutes() {
  const app = new Hono<HonoEnv>();

  // GET /api/feedback/testimonials — public, no auth required
  app.get('/testimonials', async (c) => {
    const supabase = createSupabaseAdmin(c.env);
    const feedbackRepo = new FeedbackRepository(supabase);
    const testimonials = await feedbackRepo.getPublicTestimonials();
    return c.json({
      status: 'success',
      testimonials: testimonials.map((t) => ({
        id: t.id,
        rating: t.rating,
        displayName: t.display_name,
        company: t.company,
        featureRequest: t.feature_request,
        pipelinesWorked: t.pipelines_worked,
        createdAt: t.created_at,
      })),
    });
  });

  // POST /api/feedback — submit feedback (authenticated)
  app.post('/', authMiddleware, async (c) => {
    const body = await c.req.json();
    const result = FeedbackSchema.safeParse(body);
    if (!result.success) {
      return c.json(
        { status: 'error', message: 'Invalid feedback data', issues: result.error.issues },
        400,
      );
    }

    const userId = c.get('userId');
    const data = result.data;
    const supabase = createSupabaseAdmin(c.env);
    const feedbackRepo = new FeedbackRepository(supabase);

    const feedback = await feedbackRepo.create({
      user_id: userId,
      generation_id: data.generationId ?? null,
      rating: data.rating,
      pipelines_worked: data.pipelinesWorked ?? null,
      what_went_wrong: data.whatWentWrong ?? null,
      feature_request: data.featureRequest ?? null,
      display_name: data.displayName ?? null,
      company: data.company ?? null,
      is_public: data.isPublic ?? false,
      source: 'in-app',
    });

    return c.json({ status: 'success', feedback }, 201);
  });

  return app;
}
