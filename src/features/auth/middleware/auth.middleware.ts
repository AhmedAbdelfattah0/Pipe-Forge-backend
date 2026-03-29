/**
 * auth.middleware.ts
 *
 * JWT verification middleware for all protected routes.
 *
 * Flow:
 *  1. Extract the Bearer token from the `Authorization` header.
 *  2. Verify it against Supabase using the admin client (`supabaseAdmin.auth.getUser`).
 *  3. On success, attach `{ id, email, role }` to `req.user` and call `next()`.
 *  4. On any failure, throw `AppError(401, 'Unauthorized')` which the global
 *     error handler converts to a 401 JSON response.
 */

import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../../config/supabase.js';
import { AppError } from '../../../shared/utils/app-error.js';
import { asyncHandler } from '../../../shared/utils/async-handler.js';

/**
 * Express middleware that validates a Supabase JWT from the
 * `Authorization: Bearer <token>` header and populates `req.user`.
 *
 * Mount this middleware before any route handler that requires authentication.
 *
 * @throws {AppError} 401 — if the header is missing, the token is invalid,
 *   or the Supabase lookup fails.
 */
export const authMiddleware = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 401);
    }

    const token = authHeader.slice(7); // Strip "Bearer " prefix

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { user } = data;

    req.user = {
      id: user.id,
      email: user.email ?? '',
      role: user.role ?? 'authenticated',
    };

    next();
  },
);
