/**
 * admin-generations.routes.ts
 *
 * Admin pipeline generation analytics.
 *
 * Routes:
 *   GET /api/admin/generations  — aggregated stats + recent list
 */

import { Hono } from 'hono';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import { AppError } from '../../../shared/utils/app-error.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';
import type { Project } from '../../../database/types/database.types.js';

async function requireAdmin(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  userId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', userId)
    .single();
  if (error || !data) throw new AppError('Forbidden', 403);
}

export function adminGenerationsRoutes() {
  const app = new Hono<HonoEnv>();

  app.get('/generations', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await requireAdmin(supabase, userId);

    // Fetch all projects (no PII needed — only aggregate + limited recent list)
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, mfe_name, deploy_target, markets, output_formats, generated_at, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch projects: ${error.message}`, 500);
    }

    const rows = (projects ?? []) as (Pick<
      Project,
      'id' | 'mfe_name' | 'deploy_target' | 'markets' | 'output_formats' | 'generated_at' | 'created_at'
    >)[];

    // ── by platform (derived from output_formats) ──────────────────────────────
    // 'yaml' / 'classic-json' → Azure DevOps; 'github-actions-*' → GitHub Actions
    const byPlatform: Record<string, number> = { ado: 0, 'github-actions': 0, other: 0 };
    for (const row of rows) {
      const formats = row.output_formats ?? [];
      if (formats.some((f) => f.startsWith('github-actions'))) {
        byPlatform['github-actions'] = (byPlatform['github-actions'] ?? 0) + 1;
      } else if (formats.some((f) => f === 'yaml' || f === 'classic-json')) {
        byPlatform['ado'] = (byPlatform['ado'] ?? 0) + 1;
      } else {
        byPlatform['other'] = (byPlatform['other'] ?? 0) + 1;
      }
    }

    // ── by deploy target ───────────────────────────────────────────────────────
    const byDeployTarget: Record<string, number> = {};
    for (const row of rows) {
      const target = row.deploy_target;
      byDeployTarget[target] = (byDeployTarget[target] ?? 0) + 1;
    }

    // ── total this month ───────────────────────────────────────────────────────
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const totalThisMonth = rows.filter((r) => r.created_at >= monthStart).length;

    // ── recent 20 ─────────────────────────────────────────────────────────────
    const recentGenerations = rows.slice(0, 20).map((r) => ({
      id: r.id,
      mfeName: r.mfe_name,
      deployTarget: r.deploy_target,
      markets: r.markets,
      createdAt: r.created_at,
    }));

    return c.json({
      byPlatform,
      byDeployTarget,
      recentGenerations,
      totalThisMonth,
    });
  });

  return app;
}
