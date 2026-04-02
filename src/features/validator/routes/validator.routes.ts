/**
 * validator.routes.ts
 *
 * Pipeline static analysis routes — JWT-protected.
 *
 * Mounted at: `/api/validator`
 *
 * Routes:
 *   POST /api/validator       — analyse a pipeline file, return issues + health score
 *   POST /api/validator/fix   — apply auto-fixable rules, return corrected ZIP
 */

import { Hono } from 'hono';
import { AppError } from '../../../shared/utils/app-error.js';
import { ValidatorService } from '../services/validator.service.js';
import { checkFeatureLock } from '../../billing/middleware/feature-gate.middleware.js';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';

const validatorService = new ValidatorService();

export function validatorRoutes() {
  const app = new Hono<HonoEnv>();

  // ─── POST / ───────────────────────────────────────────────────────────────
  // Body: { filename: string; content: string; platform?: 'ado' | 'gha' }
  // Returns: { platform, healthScore, issues }

  app.post('/', async (c) => {
    // ── Feature gate: enforce plan limits for validator ────────────────────
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await checkFeatureLock(supabase, userId, 'validator');

    const body = await c.req.json<{
      filename?: string;
      content?: string;
      platform?: 'ado' | 'gha';
    }>();

    if (!body.content || typeof body.content !== 'string') {
      throw new AppError('content is required and must be a string', 400);
    }

    if (body.content.length > 100_000) {
      throw new AppError('File exceeds the 100 KB limit', 400);
    }

    const result = validatorService.analyse(body.content, body.platform, body.filename);

    // Log the validation attempt for monthly cap enforcement.
    await supabase.from('validator_logs').insert({
      user_id: userId,
      filename: body.filename ?? null,
      platform: body.platform ?? null,
    });

    return c.json(result);
  });

  // ─── POST /fix ────────────────────────────────────────────────────────────
  // Body: { filename: string; content: string; platform?: 'ado' | 'gha' }
  // Returns: ZIP binary with fixed file + changelog.txt

  app.post('/fix', async (c) => {
    // ── Feature gate: enforce plan limits for validator ────────────────────
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    await checkFeatureLock(supabase, userId, 'validator');

    const body = await c.req.json<{
      filename?: string;
      content?: string;
      platform?: 'ado' | 'gha';
    }>();

    if (!body.content || typeof body.content !== 'string') {
      throw new AppError('content is required', 400);
    }

    if (body.content.length > 100_000) {
      throw new AppError('File exceeds the 100 KB limit', 400);
    }

    // Sanitise filename: strip path traversal sequences and non-safe characters
    const rawFilename = body.filename ?? 'pipeline';
    const filename = rawFilename
      .replace(/\.\.\//g, '')
      .replace(/\.\.\\/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 100);
    const { fixed, changelog } = validatorService.fix(body.content, body.platform, body.filename);

    // Build ZIP in-memory using the same pattern as the pipeline generator.
    const { PipelineZipService } = await import(
      '../../pipelines/services/pipeline-zip.service.js'
    );
    const zipService = new PipelineZipService();
    const ext = filename.endsWith('.json') ? '.json' : '.yml';
    const zipBuffer = await zipService.createZip(
      [
        { name: `fixed-pipeline${ext}`, path: 'pipeline-fix-pipelines/', content: fixed },
        { name: 'changelog.txt', path: 'pipeline-fix-pipelines/', content: changelog },
      ],
      'pipeline-fix',
    );

    // Log the fix attempt for monthly cap enforcement.
    await supabase.from('validator_logs').insert({
      user_id: userId,
      filename: body.filename ?? null,
      platform: body.platform ?? null,
    });

    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="pipeline-fix.zip"`,
      },
    });
  });

  return app;
}
