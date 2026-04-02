/**
 * pipeline-run.repository.ts
 *
 * Supabase repository for the `pipeline_runs` table.
 *
 * Accepts a SupabaseClient in the constructor so that env bindings
 * (service-role key) are provided per-request in Cloudflare Workers.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../../../shared/utils/app-error.js';
import type {
  PipelineRun,
  InsertPipelineRun,
  PipelineRunStatus,
} from '../../../database/types/database.types.js';

export class PipelineRunRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async create(run: InsertPipelineRun): Promise<PipelineRun> {
    const { data, error } = await this.supabase
      .from('pipeline_runs')
      .insert(run)
      .select()
      .single();

    if (error || !data) {
      throw new AppError(`Failed to create pipeline run: ${error?.message ?? 'unknown error'}`, 500);
    }

    return data as PipelineRun;
  }

  async findByUserId(userId: string): Promise<PipelineRun[]> {
    const { data, error } = await this.supabase
      .from('pipeline_runs')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch pipeline runs: ${error.message}`, 500);
    }

    return (data ?? []) as PipelineRun[];
  }

  async findById(id: string): Promise<PipelineRun | null> {
    const { data, error } = await this.supabase
      .from('pipeline_runs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new AppError(`Failed to fetch pipeline run: ${error.message}`, 500);
    }

    return (data as PipelineRun | null) ?? null;
  }

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

    const { data, error } = await this.supabase
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
