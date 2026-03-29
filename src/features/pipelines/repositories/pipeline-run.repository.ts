/**
 * pipeline-run.repository.ts
 *
 * Supabase repository for the `pipeline_runs` table.
 *
 * All writes use `supabaseAdmin` (service-role key) because RLS on
 * `pipeline_runs` is SELECT-only for authenticated users — inserts and
 * updates are performed server-side and must bypass RLS.
 */

import { supabaseAdmin } from '../../../config/supabase.js';
import { AppError } from '../../../shared/utils/app-error.js';
import type {
  PipelineRun,
  InsertPipelineRun,
  PipelineRunStatus,
} from '../../../database/types/database.types.js';

// ─── Repository ───────────────────────────────────────────────────────────────

/**
 * Data-access layer for the `pipeline_runs` table.
 *
 * Methods throw `AppError` on unexpected Supabase errors so that
 * `asyncHandler` can forward them to the global error middleware.
 */
export class PipelineRunRepository {
  /**
   * Inserts a new `pipeline_runs` row and returns the created record.
   *
   * @param run - DTO containing `user_id`, `project_id`, and optional
   *   initial `status` (defaults to `'pending'` in the DB).
   * @returns The newly created `PipelineRun` row.
   * @throws {AppError} 500 — if the Supabase insert fails.
   */
  async create(run: InsertPipelineRun): Promise<PipelineRun> {
    const { data, error } = await supabaseAdmin
      .from('pipeline_runs')
      .insert(run)
      .select()
      .single();

    if (error || !data) {
      throw new AppError(`Failed to create pipeline run: ${error?.message ?? 'unknown error'}`, 500);
    }

    return data as PipelineRun;
  }

  /**
   * Retrieves all pipeline runs belonging to a specific user,
   * ordered from most recent to oldest.
   *
   * @param userId - The authenticated user's UUID.
   * @returns An array of `PipelineRun` rows (may be empty).
   * @throws {AppError} 500 — if the Supabase query fails.
   */
  async findByUserId(userId: string): Promise<PipelineRun[]> {
    const { data, error } = await supabaseAdmin
      .from('pipeline_runs')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch pipeline runs: ${error.message}`, 500);
    }

    return (data ?? []) as PipelineRun[];
  }

  /**
   * Retrieves a single pipeline run by its primary key.
   *
   * @param id - The pipeline run UUID.
   * @returns The `PipelineRun` row, or `null` if not found.
   * @throws {AppError} 500 — if the Supabase query fails with an unexpected error.
   */
  async findById(id: string): Promise<PipelineRun | null> {
    const { data, error } = await supabaseAdmin
      .from('pipeline_runs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new AppError(`Failed to fetch pipeline run: ${error.message}`, 500);
    }

    return (data as PipelineRun | null) ?? null;
  }

  /**
   * Updates the `status`, optionally `file_count`, and optionally
   * `error_message` of a pipeline run. Also sets `completed_at` to
   * the current timestamp when transitioning to a terminal status
   * (`'success'` or `'error'`).
   *
   * @param id - The pipeline run UUID to update.
   * @param status - The new lifecycle status.
   * @param fileCount - Optional file count (set on success).
   * @param errorMessage - Optional human-readable error detail (set on error).
   * @returns The updated `PipelineRun` row.
   * @throws {AppError} 500 — if the Supabase update fails.
   */
  async updateStatus(
    id: string,
    status: PipelineRunStatus,
    fileCount?: number,
    errorMessage?: string,
  ): Promise<PipelineRun> {
    const isTerminal = status === 'success' || status === 'error';

    const patch: Partial<PipelineRun> & { status: PipelineRunStatus } = {
      status,
      ...(fileCount !== undefined && { file_count: fileCount }),
      ...(errorMessage !== undefined && { error_message: errorMessage }),
      ...(isTerminal && { completed_at: new Date().toISOString() }),
    };

    const { data, error } = await supabaseAdmin
      .from('pipeline_runs')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError(`Failed to update pipeline run: ${error?.message ?? 'unknown error'}`, 500);
    }

    return data as PipelineRun;
  }
}
