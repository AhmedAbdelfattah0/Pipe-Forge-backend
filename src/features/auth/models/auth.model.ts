/**
 * auth.model.ts
 *
 * Shared authentication types used by auth middleware and route handlers.
 */

/**
 * The authenticated user payload attached to `req.user` after
 * successful JWT verification by `auth.middleware.ts`.
 */
export interface AuthenticatedUser {
  /** Supabase UUID — maps to `auth.uid()` in RLS policies. */
  id: string;
  /** User's email address extracted from the Supabase JWT claims. */
  email: string;
  /** Supabase role — typically `'authenticated'` for logged-in users. */
  role: string;
}
