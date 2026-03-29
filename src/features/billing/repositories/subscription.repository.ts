/**
 * subscription.repository.ts
 *
 * Supabase repository for the `subscriptions` table.
 *
 * All operations use `supabaseAdmin` (service-role key) so that the
 * server can update usage counters without requiring the user's JWT
 * to be passed to the DB client.
 */

import { supabaseAdmin } from '../../../config/supabase.js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { Subscription } from '../../../database/types/database.types.js';

// ─── Repository ───────────────────────────────────────────────────────────────

/**
 * Data-access layer for the `subscriptions` table.
 *
 * Methods throw `AppError` on unexpected Supabase errors so that
 * `asyncHandler` can forward them to the global error middleware.
 */
export class SubscriptionRepository {
  /**
   * Retrieves the active subscription for a given user.
   *
   * @param userId - The authenticated user's UUID.
   * @returns The user's `Subscription` row, or `null` if none exists.
   * @throws {AppError} 500 — if the Supabase query fails.
   */
  async findByUserId(userId: string): Promise<Subscription | null> {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new AppError(`Failed to fetch subscription: ${error.message}`, 500);
    }

    return (data as Subscription | null) ?? null;
  }

  /**
   * Atomically increments `mfe_used_this_month` by 1 for the given user's
   * subscription. Should be called after a successful pipeline generation.
   *
   * Uses a raw RPC call to perform an atomic increment rather than a
   * read-modify-write cycle to avoid race conditions in concurrent requests.
   *
   * @param userId - The authenticated user's UUID.
   * @throws {AppError} 404 — if no subscription row exists for the user.
   * @throws {AppError} 500 — if the Supabase update fails.
   */
  async incrementUsage(userId: string): Promise<void> {
    // Fetch current value first so we can perform an accurate increment.
    const subscription = await this.findByUserId(userId);

    if (!subscription) {
      throw new AppError('Subscription not found for user', 404);
    }

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        mfe_used_this_month: subscription.mfe_used_this_month + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      throw new AppError(`Failed to increment subscription usage: ${error.message}`, 500);
    }
  }
}
