/**
 * error-log.service.ts
 *
 * Logs failed API requests to the error_logs table.
 * Uses the Supabase admin (service role) client to bypass RLS.
 * NEVER throws — all errors are swallowed silently so logging never disrupts
 * the primary request flow.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface ErrorLogParams {
  userId?: string;
  userEmail?: string;
  endpoint: string;
  httpMethod: string;
  requestPayload?: object;
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  httpStatus: number;
  userFacingError: string;
  platform?: string;
  deployTarget?: string;
  nodeVersion?: string;
  marketsCount?: number;
}

export class ErrorLogService {
  constructor(private readonly supabase: SupabaseClient) {}

  async logError(params: ErrorLogParams): Promise<void> {
    try {
      await this.supabase.from('error_logs').insert({
        user_id: params.userId ?? null,
        user_email: params.userEmail ?? null,
        endpoint: params.endpoint,
        http_method: params.httpMethod,
        request_payload: params.requestPayload ?? null,
        error_type: params.errorType,
        error_message: params.errorMessage,
        stack_trace: params.stackTrace ?? null,
        http_status: params.httpStatus,
        user_facing_error: params.userFacingError,
        platform: params.platform ?? null,
        deploy_target: params.deployTarget ?? null,
        node_version: params.nodeVersion ?? null,
        markets_count: params.marketsCount ?? null,
      });
    } catch {
      // Intentionally silent — error logging must never disrupt the request flow.
    }
  }
}
