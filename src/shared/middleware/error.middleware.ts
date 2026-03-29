import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.js';
import { config } from '../../config/env.js';

interface ErrorResponseBody {
  status: 'error' | 'fail';
  message: string;
  stack?: string;
}

/**
 * Global Express error-handling middleware.
 *
 * Must be registered AFTER all routes with exactly 4 parameters so that Express
 * recognises it as an error handler.
 *
 * - `AppError` instances (operational errors) are serialised with their own `statusCode`.
 * - Unknown errors get a generic 500 response; the real message is only included in
 *   development to avoid leaking internals.
 */
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    // Operational error — safe to surface details to the client.
    console.error(`[AppError] ${err.statusCode} — ${err.message}`);

    const body: ErrorResponseBody = {
      status: err.statusCode >= 500 ? 'error' : 'fail',
      message: err.message,
    };

    if (config.NODE_ENV === 'development' && err.stack) {
      body.stack = err.stack;
    }

    res.status(err.statusCode).json(body);
    return;
  }

  // Unknown / programmer error — log everything, send minimal info to client.
  console.error('[UnhandledError]', err);

  const body: ErrorResponseBody = {
    status: 'error',
    message:
      config.NODE_ENV === 'development' && err instanceof Error
        ? err.message
        : 'An unexpected error occurred. Please try again later.',
  };

  if (config.NODE_ENV === 'development' && err instanceof Error && err.stack) {
    body.stack = err.stack;
  }

  res.status(500).json(body);
}
