import { Router } from 'express';
import { asyncHandler } from '../../../shared/utils/async-handler.js';
import { config } from '../../../config/env.js';

const router = Router();

/**
 * GET /api/health
 *
 * Health-check endpoint for deployment monitoring and load-balancer probes.
 * Returns a 200 response with the current server timestamp and environment.
 */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
    });
  }),
);

export default router;
