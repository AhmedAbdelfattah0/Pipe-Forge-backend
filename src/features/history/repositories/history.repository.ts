/**
 * history.repository.ts
 *
 * Supabase repository for the `projects` table (generation history).
 *
 * Accepts a SupabaseClient in the constructor so that env bindings
 * (service-role key) are provided per-request in Cloudflare Workers.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { Project, InsertProject } from '../../../database/types/database.types.js';

/** Optional parameters for `findByUserId` pagination and search. */
export interface FindProjectsOptions {
  /** Substring to search for in `mfe_name` or `repository_name`. */
  search?: string;
  /** Maximum number of rows to return (default: 20). */
  limit?: number;
  /** Number of rows to skip for pagination (default: 0). */
  offset?: number;
}

export class HistoryRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findByUserId(
    userId: string,
    options: FindProjectsOptions = {},
  ): Promise<Project[]> {
    const { search, limit = 20, offset = 0 } = options;

    let query = this.supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search && search.trim().length > 0) {
      // Escape PostgREST special characters to prevent filter injection
      const term = search.trim()
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_')
        .replace(/\\/g, '\\\\');
      query = query.or(`mfe_name.ilike.%${term}%,repository_name.ilike.%${term}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new AppError(`Failed to fetch projects: ${error.message}`, 500);
    }

    return (data ?? []) as Project[];
  }

  async findById(id: string): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new AppError(`Failed to fetch project: ${error.message}`, 500);
    }

    return (data as Project | null) ?? null;
  }

  async create(project: InsertProject): Promise<Project> {
    const { data, error } = await this.supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error || !data) {
      throw new AppError(`Failed to create project: ${error?.message ?? 'unknown error'}`, 500);
    }

    return data as Project;
  }

  async updateById(
    id: string,
    userId: string,
    updates: Partial<Omit<InsertProject, 'user_id'>>,
  ): Promise<Project> {
    const { data, error } = await this.supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new AppError(`Failed to update project: ${error?.message ?? 'unknown error'}`, 500);
    }

    return data as Project;
  }

  async deleteById(id: string, userId: string): Promise<void> {
    const { error, count } = await this.supabase
      .from('projects')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new AppError(`Failed to delete project: ${error.message}`, 500);
    }

    if (count === 0) {
      throw new AppError('Project not found', 404);
    }
  }
}
