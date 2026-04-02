/**
 * diagnose.routes.ts
 *
 * AI Error Diagnosis routes — JWT-protected.
 *
 * Mounted at: `/api/diagnose`
 *
 * Routes:
 *   POST /api/diagnose             — diagnose a pipeline failure using Claude
 *   POST /api/diagnose/regenerate  — apply suggested config changes and re-generate pipeline ZIP
 */

import { Hono } from 'hono';
import { AppError } from '../../../shared/utils/app-error.js';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import { HistoryRepository } from '../../history/repositories/history.repository.js';
import { DiagnoseService } from '../services/diagnose.service.js';
import { PipelineGeneratorService } from '../../pipelines/services/pipeline-generator.service.js';
import { PipelineZipService } from '../../pipelines/services/pipeline-zip.service.js';
import { GeneratorConfigSchema } from '../../pipelines/middleware/validate-config.middleware.js';
import {
  decryptConfigSnapshot,
  encryptConfigSnapshot,
} from '../../../shared/utils/config-encryption.js';
import { checkFeatureLock } from '../../billing/middleware/feature-gate.middleware.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';

const generatorService = new PipelineGeneratorService();
const zipService = new PipelineZipService();

export function diagnoseRoutes() {
  const app = new Hono<HonoEnv>();

  // ─── POST / ───────────────────────────────────────────────────────────────
  // Body: { generationId: string; errorLog: string }
  // Returns: { errorType, rootCause, fix, canAutoFix, updatedConfig? }

  app.post('/', async (c) => {
    const userId = c.get('userId');
    const body = await c.req.json<{ generationId?: string; errorLog?: string }>();

    if (!body.generationId || typeof body.generationId !== 'string') {
      throw new AppError('generationId is required', 400);
    }

    if (!body.errorLog || typeof body.errorLog !== 'string') {
      throw new AppError('errorLog is required', 400);
    }

    if (body.errorLog.length > 10_000) {
      throw new AppError('errorLog exceeds the 10 KB limit', 400);
    }

    const supabase = createSupabaseAdmin(c.env);
    const historyRepository = new HistoryRepository(supabase);

    // ── Feature gate: enforce plan limits for AI diagnosis ─────────────────
    await checkFeatureLock(supabase, userId, 'ai_diagnosis');

    // ── Load generation config ─────────────────────────────────────────────
    const project = await historyRepository.findById(body.generationId);

    if (!project) {
      throw new AppError('Generation not found', 404);
    }

    if (project.user_id !== userId) {
      throw new AppError('Generation not found', 404);
    }

    const config = decryptConfigSnapshot(project.config_snapshot, c.env.ENCRYPTION_KEY);

    // ── Call Gemini ───────────────────────────────────────────────────────
    const diagnoseService = new DiagnoseService(c.env.GEMINI_API_KEY);
    const result = await diagnoseService.diagnose(config, body.errorLog);

    // ── Log the attempt ────────────────────────────────────────────────────
    await supabase.from('diagnosis_logs').insert({
      user_id: userId,
      project_id: body.generationId,
      error_type: result.errorType,
    });

    return c.json(result);
  });

  // ─── POST /regenerate ─────────────────────────────────────────────────────
  // Body: { generationId: string; updatedConfig: Record<string, unknown> }
  // Returns: ZIP binary

  app.post('/regenerate', async (c) => {
    const userId = c.get('userId');
    const body = await c.req.json<{
      generationId?: string;
      updatedConfig?: Record<string, unknown>;
    }>();

    if (!body.generationId) throw new AppError('generationId is required', 400);
    if (!body.updatedConfig) throw new AppError('updatedConfig is required', 400);

    const supabase = createSupabaseAdmin(c.env);
    const historyRepository = new HistoryRepository(supabase);

    const project = await historyRepository.findById(body.generationId);
    if (!project) throw new AppError('Generation not found', 404);
    if (project.user_id !== userId) throw new AppError('Generation not found', 404);

    // Merge updatedConfig over the original snapshot.
    const original = decryptConfigSnapshot(project.config_snapshot, c.env.ENCRYPTION_KEY);
    const merged = { ...original, ...body.updatedConfig };

    const parseResult = GeneratorConfigSchema.safeParse(merged);
    if (!parseResult.success) {
      throw new AppError('Updated config is invalid: ' + parseResult.error.message, 422);
    }

    const config = parseResult.data;
    const projectName = config.projectName || 'my-app';
    const safeFilename = projectName.replace(/[^a-zA-Z0-9_-]/g, '_');

    const renderedFiles = generatorService.generate(config);
    const zipBuffer = await zipService.createZip(renderedFiles, projectName);

    // Persist the regenerated project record with the updated config snapshot.
    const reEncrypted = encryptConfigSnapshot(
      config as unknown as Record<string, unknown>,
      c.env.ENCRYPTION_KEY,
    );
    const enabledMarkets = config.markets.filter((m) => m.enabled).map((m) => m.code);
    const languages = config.isMultiLanguage ? config.languages.map((l) => l.code) : [];

    await historyRepository.create({
      user_id: userId,
      mfe_name: config.projectName,
      repository_name: config.repositoryName,
      deploy_target: config.deployTarget ?? 'storage-account',
      markets: enabledMarkets,
      environments: config.environments,
      languages,
      output_formats: config.outputFormats,
      pipeline_count: renderedFiles.length,
      config_snapshot: reEncrypted,
    });

    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${safeFilename}-fixed-pipelines.zip"`,
      },
    });
  });

  return app;
}
