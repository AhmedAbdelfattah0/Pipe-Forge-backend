import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../../shared/utils/async-handler.js';
import { authMiddleware } from '../../auth/middleware/auth.middleware.js';
import { FeedbackRepository } from '../repositories/feedback.repository.js';

const router = Router();
const feedbackRepo = new FeedbackRepository();

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

// POST /api/feedback — submit feedback (authenticated)
router.post(
  '/',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const result = FeedbackSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid feedback data',
        issues: result.error.issues,
      });
      return;
    }

    const userId = req.user!.id;
    const data = result.data;

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

    res.status(201).json({ status: 'success', feedback });
  }),
);

// GET /api/feedback/testimonials — public, no auth required
router.get(
  '/testimonials',
  asyncHandler(async (_req, res) => {
    const testimonials = await feedbackRepo.getPublicTestimonials();
    res.json({
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
  }),
);

export default router;
