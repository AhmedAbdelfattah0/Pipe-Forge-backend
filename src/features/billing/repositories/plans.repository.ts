/**
 * plans.repository.ts
 *
 * Supabase repository for the `plans` and `plan_features` tables.
 *
 * Accepts a SupabaseClient in the constructor so that env bindings
 * (service-role key) are provided per-request in Cloudflare Workers.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../../../shared/utils/app-error.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlanFeature {
  id: string;
  plan_id: string;
  feature_text: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Plan {
  id: string;
  slug: string;
  display_name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  is_highlighted: boolean;
  badge_text: string | null;
  cta_text: string;
  cta_url: string | null;
  price_monthly: number;
  price_annual: number;
  max_projects_per_month: number | null;
  max_team_members: number | null;
  max_ai_diagnoses_per_day: number | null;
  max_validator_files_per_month: number | null;
  max_history_items: number | null;
  stripe_price_id_monthly: string | null;
  stripe_price_id_annual: string | null;
  created_at: string;
  updated_at: string;
  features?: PlanFeature[];
}

export interface PlanWithFeatures extends Plan {
  features: PlanFeature[];
  annual_monthly_equivalent: number;
}

export interface CreatePlanInput {
  slug: string;
  display_name: string;
  description?: string;
  display_order: number;
  is_active?: boolean;
  is_highlighted?: boolean;
  badge_text?: string;
  cta_text?: string;
  cta_url?: string;
  price_monthly?: number;
  price_annual?: number;
  max_projects_per_month?: number | null;
  max_team_members?: number | null;
  max_ai_diagnoses_per_day?: number | null;
  max_validator_files_per_month?: number | null;
  max_history_items?: number | null;
  stripe_price_id_monthly?: string;
  stripe_price_id_annual?: string;
}

export interface UpdatePlanInput extends Partial<CreatePlanInput> {}

export interface CreateFeatureInput {
  feature_text: string;
  display_order: number;
  is_active?: boolean;
}

export interface UpdateFeatureInput extends Partial<CreateFeatureInput> {}

// ─── Repository ───────────────────────────────────────────────────────────────

export class PlansRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  /** Returns all active plans with their active features, ordered by display_order. */
  async findActivePlansWithFeatures(): Promise<PlanWithFeatures[]> {
    const { data: plans, error: plansError } = await this.supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (plansError) {
      throw new AppError(`Failed to fetch plans: ${plansError.message}`, 500);
    }

    const { data: features, error: featuresError } = await this.supabase
      .from('plan_features')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (featuresError) {
      throw new AppError(`Failed to fetch plan features: ${featuresError.message}`, 500);
    }

    return (plans ?? []).map((plan: Plan) => ({
      ...plan,
      features: (features ?? []).filter((f: PlanFeature) => f.plan_id === plan.id),
      annual_monthly_equivalent: plan.price_annual > 0
        ? Math.round((plan.price_annual / 12) * 100) / 100
        : 0,
    }));
  }

  /** Returns all plans (including inactive) with features — for admin use. */
  async findAllPlansWithFeatures(): Promise<PlanWithFeatures[]> {
    const { data: plans, error: plansError } = await this.supabase
      .from('plans')
      .select('*')
      .order('display_order', { ascending: true });

    if (plansError) {
      throw new AppError(`Failed to fetch plans: ${plansError.message}`, 500);
    }

    const { data: features, error: featuresError } = await this.supabase
      .from('plan_features')
      .select('*')
      .order('display_order', { ascending: true });

    if (featuresError) {
      throw new AppError(`Failed to fetch plan features: ${featuresError.message}`, 500);
    }

    return (plans ?? []).map((plan: Plan) => ({
      ...plan,
      features: (features ?? []).filter((f: PlanFeature) => f.plan_id === plan.id),
      annual_monthly_equivalent: plan.price_annual > 0
        ? Math.round((plan.price_annual / 12) * 100) / 100
        : 0,
    }));
  }

  /** Finds a single plan by slug. */
  async findBySlug(slug: string): Promise<Plan | null> {
    const { data, error } = await this.supabase
      .from('plans')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new AppError(`Failed to fetch plan: ${error.message}`, 500);
    }

    return data as Plan;
  }

  /** Returns the max_projects_per_month limit for a given plan slug. null = unlimited. */
  async getMonthlyLimit(slug: string): Promise<number | null> {
    const plan = await this.findBySlug(slug);
    return plan?.max_projects_per_month ?? null;
  }

  /** Creates a new plan. */
  async create(input: CreatePlanInput): Promise<Plan> {
    const { data, error } = await this.supabase
      .from('plans')
      .insert(input)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to create plan: ${error.message}`, 500);
    }

    return data as Plan;
  }

  /** Updates a plan by ID. */
  async update(id: string, input: UpdatePlanInput): Promise<Plan> {
    const { data, error } = await this.supabase
      .from('plans')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to update plan: ${error.message}`, 500);
    }

    return data as Plan;
  }

  /** Soft-deletes a plan by setting is_active = false. */
  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('plans')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new AppError(`Failed to delete plan: ${error.message}`, 500);
    }
  }

  /** Adds a feature to a plan. */
  async addFeature(planId: string, input: CreateFeatureInput): Promise<PlanFeature> {
    const { data, error } = await this.supabase
      .from('plan_features')
      .insert({ plan_id: planId, ...input })
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to add feature: ${error.message}`, 500);
    }

    return data as PlanFeature;
  }

  /** Updates a plan feature by ID. */
  async updateFeature(featureId: string, input: UpdateFeatureInput): Promise<PlanFeature> {
    const { data, error } = await this.supabase
      .from('plan_features')
      .update(input)
      .eq('id', featureId)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to update feature: ${error.message}`, 500);
    }

    return data as PlanFeature;
  }

  /** Soft-deletes a plan feature. */
  async softDeleteFeature(featureId: string): Promise<void> {
    const { error } = await this.supabase
      .from('plan_features')
      .update({ is_active: false })
      .eq('id', featureId);

    if (error) {
      throw new AppError(`Failed to delete feature: ${error.message}`, 500);
    }
  }

  /** Bulk updates display_order for multiple plans. */
  async reorderPlans(orders: Array<{ id: string; display_order: number }>): Promise<void> {
    for (const { id, display_order } of orders) {
      const { error } = await this.supabase
        .from('plans')
        .update({ display_order, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new AppError(`Failed to reorder plan ${id}: ${error.message}`, 500);
      }
    }
  }
}
