/**
 * profile.repository.ts
 *
 * Supabase repository for the `profiles` table.
 * Uses the admin client (service-role key) since all access
 * is already scoped to the authenticated user in route handlers.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { Profile } from '../../../database/types/database.types.js';

/** Fields that can be updated via PATCH /api/profile. */
export interface UpdateProfileData {
  full_name?: string;
  display_name?: string;
  job_title?: string;
  company?: string;
  linkedin_url?: string;
  avatar_url?: string;
  ado_organization?: string;
  ado_project?: string;
  default_platform?: string;
  github_username?: string;
}

export class ProfileRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new AppError(`Failed to fetch profile: ${error.message}`, 500);
    }

    return (data as Profile | null) ?? null;
  }

  async upsert(id: string, data: UpdateProfileData): Promise<Profile> {
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .upsert({ id, ...data }, { onConflict: 'id' })
      .select()
      .single();

    if (error || !profile) {
      throw new AppError(`Failed to update profile: ${error?.message ?? 'unknown error'}`, 500);
    }

    return profile as Profile;
  }
}
