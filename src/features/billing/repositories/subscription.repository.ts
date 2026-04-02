/**
 * subscription.repository.ts
 *
 * Supabase repository for the `subscriptions` table.
 *
 * Accepts a SupabaseClient in the constructor so that env bindings
 * (service-role key) are provided per-request in Cloudflare Workers.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { Subscription } from '../../../database/types/database.types.js';

export class SubscriptionRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findByUserId(userId: string): Promise<Subscription | null> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new AppError(`Failed to fetch subscription: ${error.message}`, 500);
    }

    return (data as Subscription | null) ?? null;
  }

  async incrementUsage(userId: string): Promise<void> {
    const subscription = await this.findByUserId(userId);

    if (!subscription) {
      throw new AppError('Subscription not found for user', 404);
    }

    const { error } = await this.supabase
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
