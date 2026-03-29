import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

/**
 * Wraps an async Express route handler so that any rejected promise is forwarded
 * to Express's `next(err)` instead of causing an unhandled rejection.
 *
 * @param fn - The async route handler to wrap.
 * @returns A standard Express `RequestHandler`.
 *
 * @example
 * ```ts
 * router.get('/resource', asyncHandler(async (req, res) => {
 *   const data = await someService.fetch();
 *   res.json(data);
 * }));
 * ```
 */
export function asyncHandler(fn: AsyncRequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
