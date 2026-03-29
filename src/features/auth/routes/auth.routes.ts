/**
 * auth.routes.ts
 *
 * Auth feature routes.
 *
 * All routes are protected by `authMiddleware` which is applied at
 * the router level in `src/index.ts` — every handler here can safely
 * assume `req.user` is populated.
 *
 * Mounted at: `GET /api/auth/me`
 */

import { Router } from 'express';
import { asyncHandler } from '../../../shared/utils/async-handler.js';

const router = Router();

/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user's identity payload as
 * extracted and verified by `authMiddleware`.
 *
 * Response shape: `{ id: string; email: string; role: string }`
 */
router.get(
  '/me',
  asyncHandler(async (req, res) => {
    res.status(200).json({ user: req.user });
  }),
);

export default router;
