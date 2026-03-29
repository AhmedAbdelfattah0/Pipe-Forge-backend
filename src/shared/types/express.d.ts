/**
 * Augments the Express `Request` interface to carry the authenticated user
 * after the auth middleware has verified the JWT.
 */
declare namespace Express {
  interface Request {
    /**
     * Populated by `auth.middleware.ts` after successful JWT verification.
     * `undefined` on unauthenticated routes.
     */
    user?: {
      /** Supabase UUID (maps to `auth.uid()` in RLS policies). */
      id: string;
      /** User's email address from the JWT claims. */
      email: string;
      /** Supabase role — typically `'authenticated'`. */
      role: string;
    };
  }
}
