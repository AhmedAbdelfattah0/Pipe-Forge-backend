/**
 * history.repository.ts
 *
 * Supabase repository for the `projects` table (generation history).
 *
 * Read operations use `supabaseAdmin` for simplicity (the user_id filter
 * enforces ownership at the application layer). Insert/delete operations
 * also use `supabaseAdmin` since the service role bypasses RLS for writes.
 */

import { supabaseAdmin } from '../../../config/supabase.js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { Project, InsertProject } from '../../../database/types/database.types.js';

// ─── Query options ────────────────────────────────────────────────────────────

/** Optional parameters for `findByUserId` pagination and search. */
export interface FindProjectsOptions {
  /** Substring to search for in `mfe_name` or `repository_name`. */
  search?: string;
  /** Maximum number of rows to return (default: 20). */
  limit?: number;
  /** Number of rows to skip for pagination (default: 0). */
  offset?: number;
}

// ─── Repository ───────────────────────────────────────────────────────────────

/**
 * Data-access layer for the `projects` (history) table.
 *
 * Methods throw `AppError` on unexpected Supabase errors so that
 * `asyncHandler` can forward them to the global error middleware.
 */
export class HistoryRepository {
  /**
   * Retrieves a paginated, optionally filtered list of projects for a user.
   *
   * Projects are ordered by `generated_at` descending (most recent first).
   *
   * @param userId - The authenticated user's UUID.
   * @param options - Optional pagination and search parameters.
   * @returns An array of matching `Project` rows.
   * @throws {AppError} 500 — if the Supabase query fails.
   */
  async findByUserId(
    userId: string,
    options: FindProjectsOptions = {},
  ): Promise<Project[]> {
    const { search, limit = 20, offset = 0 } = options;

    let query = supabaseAdmin
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search && search.trim().length > 0) {
      const term = search.trim();
      query = query.or(`mfe_name.ilike.%${term}%,repository_name.ilike.%${term}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new AppError(`Failed to fetch projects: ${error.message}`, 500);
    }

    return (data ?? []) as Project[];
  }

  /**
   * Retrieves a single project by its primary key.
   *
   * @param id - The project UUID.
   * @returns The `Project` row (including `config_snapshot`), or `null` if not found.
   * @throws {AppError} 500 — if the Supabase query fails with an unexpected error.
   */
  async findById(id: string): Promise<Project | null> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new AppError(`Failed to fetch project: ${error.message}`, 500);
    }

    return (data as Project | null) ?? null;
  }

  /**
   * Inserts a new project row and returns the created record.
   *
   * @param project - DTO with all required project fields.
   * @returns The newly created `Project` row.
   * @throws {AppError} 500 — if the Supabase insert fails.
   */
  async create(project: InsertProject): Promise<Project> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error || !data) {
      throw new AppError(`Failed to create project: ${error?.message ?? 'unknown error'}`, 500);
    }

    return data as Project;
  }

  /**
   * Deletes a project after verifying the requesting user is the owner.
   *
   * Performs an ownership check by filtering on both `id` and `user_id`.
   * If no row is deleted (wrong user or non-existent id), throws 404.
   *
   * @param id - The project UUID to delete.
   * @param userId - The authenticated user's UUID (ownership assertion).
   * @throws {AppError} 404 — if the project does not exist or belongs to another user.
   * @throws {AppError} 500 — if the Supabase delete fails with an unexpected error.
   */
  async deleteById(id: string, userId: string): Promise<void> {
    const { error, count } = await supabaseAdmin
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
