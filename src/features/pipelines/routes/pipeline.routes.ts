/**
 * pipeline.routes.ts
 *
 * Pipeline generation feature routes — all protected by `authMiddleware`
 * applied in `src/index.ts` at the router mount level.
 *
 * Mounted at: `/api/pipelines`
 *
 * Routes:
 *   POST /api/pipelines/generate               — generate Azure DevOps ZIP
 *   POST /api/pipelines/generate/github-actions — generate GitHub Actions ZIP
 *   GET  /api/pipelines/runs                    — list user's pipeline run history
 *   GET  /api/pipelines/runs/:id                — get a specific pipeline run
 */

import { Hono } from 'hono';
import { AppError } from '../../../shared/utils/app-error.js';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import { GeneratorConfigSchema } from '../middleware/validate-config.middleware.js';
import type { ValidatedGeneratorConfig } from '../middleware/validate-config.middleware.js';
import { checkPlanLimits } from '../../billing/middleware/plan-limiter.middleware.js';
import { checkFeatureLock } from '../../billing/middleware/feature-gate.middleware.js';
import { PipelineGeneratorService } from '../services/pipeline-generator.service.js';
import { GitHubActionsGeneratorService } from '../services/github-actions-generator.service.js';
import { PipelineZipService } from '../services/pipeline-zip.service.js';
import { PipelineRunRepository } from '../repositories/pipeline-run.repository.js';
import { HistoryRepository } from '../../history/repositories/history.repository.js';
import { SubscriptionRepository } from '../../billing/repositories/subscription.repository.js';
import { GenerationRepository } from '../../feedback/repositories/generation.repository.js';
import { encryptConfigSnapshot } from '../../../shared/utils/config-encryption.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';
import { ErrorLogService } from '../../../shared/services/error-log.service.js';

// ─── Error classification ────────────────────────────────────────────────────

function classifyError(err: unknown, httpStatus: number): string {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  if (httpStatus === 401 || httpStatus === 403)                return 'AUTH_ERROR';
  if (msg.includes('template') || msg.includes('handlebars'))  return 'TEMPLATE_ERROR';
  if (msg.includes('zip'))                                     return 'ZIP_ERROR';
  if (httpStatus === 400)                                      return 'VALIDATION_ERROR';
  if (msg.includes('supabase') || msg.includes('database') || msg.includes('db')) return 'DB_ERROR';
  if (msg.includes('config') || msg.includes('combination'))   return 'CONFIG_ERROR';
  return 'UNKNOWN_ERROR';
}

// Services are stateless — safe to instantiate once.
const generatorService = new PipelineGeneratorService();
const githubActionsGeneratorService = new GitHubActionsGeneratorService();
const zipService = new PipelineZipService();

export function pipelineRoutes() {
  const app = new Hono<HonoEnv>();

  // ─── POST /generate ─────────────────────────────────────────────────────────

  app.post('/generate', async (c) => {
    const body = await c.req.json();
    const result = GeneratorConfigSchema.safeParse(body);
    if (!result.success) {
      return c.json(
        { status: 'error', message: 'Invalid generator configuration', issues: result.error.issues },
        400,
      );
    }
    const config = result.data;
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);

    // Check plan limits and feature gate.
    await checkPlanLimits(supabase, userId, config);
    await checkFeatureLock(supabase, userId, 'generate');

    const projectName = config.projectName || 'my-app';
    const safeFilename = projectName.replace(/[^a-zA-Z0-9_-]/g, '_');

    const enabledMarkets = config.markets.filter((m) => m.enabled).map((m) => m.code);
    const languages = config.isMultiLanguage
      ? config.languages.map((l) => l.code)
      : [];

    // Encrypt sensitive fields before persisting the config snapshot.
    const encryptedSnapshot = encryptConfigSnapshot(
      config as unknown as Record<string, unknown>,
      c.env.ENCRYPTION_KEY,
    );

    const historyRepository = new HistoryRepository(supabase);
    const runRepository = new PipelineRunRepository(supabase);
    const subscriptionRepository = new SubscriptionRepository(supabase);
    const generationRepo = new GenerationRepository(supabase);

    const project = await historyRepository.create({
      user_id: userId,
      mfe_name: config.projectName,
      repository_name: config.repositoryName,
      deploy_target: config.deployTarget ?? 'storage-account',
      markets: enabledMarkets,
      environments: config.environments,
      languages,
      output_formats: config.outputFormats,
      pipeline_count: 0,
      config_snapshot: encryptedSnapshot,
    });

    const run = await runRepository.create({
      user_id: userId,
      project_id: project.id,
      status: 'pending',
    });

    try {
      await runRepository.updateStatus(run.id, 'generating');

      const renderedFiles = generatorService.generate(config);
      const zipBuffer = await zipService.createZip(renderedFiles, projectName);
      const fileCount = renderedFiles.length;

      await runRepository.updateStatus(run.id, 'success', fileCount);
      await subscriptionRepository.incrementUsage(userId);

      // Save generation record for feedback tracking.
      try {
        const enabledMarketNames = config.markets.filter((m) => m.enabled).map((m) => m.name);
        await generationRepo.create({
          user_id: userId,
          config: encryptedSnapshot,
          platform: 'azure-devops',
          deploy_target: config.deployTarget,
          markets: enabledMarketNames,
          environments: config.environments,
          languages: config.languages.map((l) => l.name),
          is_multi_language: config.isMultiLanguage,
          pipeline_count: renderedFiles.length,
        });
      } catch {
        // Non-critical — don't fail the generation if feedback tracking fails
      }

      return new Response(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${safeFilename}-pipelines.zip"`,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown generation error';
      await runRepository.updateStatus(run.id, 'error', undefined, message);

      const httpStatus = err instanceof AppError ? err.statusCode : 500;
      const userFacingError =
        err instanceof AppError && err.isOperational
          ? err.message
          : 'Pipeline generation failed. Please try again.';

      const errorLogger = new ErrorLogService(supabase);
      await errorLogger.logError({
        userId,
        endpoint: '/api/pipelines/generate',
        httpMethod: 'POST',
        requestPayload: config as unknown as object,
        errorType: classifyError(err, httpStatus),
        errorMessage: message,
        stackTrace: err instanceof Error ? err.stack : undefined,
        httpStatus,
        userFacingError,
        platform: 'azure-devops',
        deployTarget: config.deployTarget ?? undefined,
        marketsCount: config.markets.filter((m) => m.enabled).length,
      });

      throw err;
    }
  });

  // ─── POST /generate/github-actions ──────────────────────────────────────────

  app.post('/generate/github-actions', async (c) => {
    const body = await c.req.json();
    const result = GeneratorConfigSchema.safeParse(body);
    if (!result.success) {
      return c.json(
        { status: 'error', message: 'Invalid generator configuration', issues: result.error.issues },
        400,
      );
    }
    const config = result.data;
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);

    await checkPlanLimits(supabase, userId, config);
    await checkFeatureLock(supabase, userId, 'generate');

    const projectName = config.projectName || 'my-app';
    const safeFilename = projectName.replace(/[^a-zA-Z0-9_-]/g, '_');

    const enabledMarkets = config.markets.filter((m) => m.enabled).map((m) => m.code);
    const languages = config.isMultiLanguage
      ? config.languages.map((l) => l.code)
      : [];

    const encryptedSnapshot = encryptConfigSnapshot(
      config as unknown as Record<string, unknown>,
      c.env.ENCRYPTION_KEY,
    );

    const historyRepository = new HistoryRepository(supabase);
    const runRepository = new PipelineRunRepository(supabase);
    const subscriptionRepository = new SubscriptionRepository(supabase);
    const generationRepo = new GenerationRepository(supabase);

    const project = await historyRepository.create({
      user_id: userId,
      mfe_name: config.projectName,
      repository_name: config.repositoryName,
      deploy_target: config.deployTarget ?? 'storage-account',
      markets: enabledMarkets,
      environments: config.environments,
      languages,
      output_formats: config.outputFormats,
      pipeline_count: 0,
      config_snapshot: encryptedSnapshot,
    });

    const run = await runRepository.create({
      user_id: userId,
      project_id: project.id,
      status: 'pending',
    });

    try {
      await runRepository.updateStatus(run.id, 'generating');

      const renderedFiles = githubActionsGeneratorService.generate(config);
      const zipBuffer = await zipService.createZip(renderedFiles, projectName);
      const fileCount = renderedFiles.length;

      await runRepository.updateStatus(run.id, 'success', fileCount);
      await subscriptionRepository.incrementUsage(userId);

      try {
        const enabledMarketNames = config.markets.filter((m) => m.enabled).map((m) => m.name);
        await generationRepo.create({
          user_id: userId,
          config: encryptedSnapshot,
          platform: 'github-actions',
          deploy_target: config.deployTarget,
          markets: enabledMarketNames,
          environments: config.environments,
          languages: config.languages.map((l) => l.name),
          is_multi_language: config.isMultiLanguage,
          pipeline_count: renderedFiles.length,
        });
      } catch {
        // Non-critical
      }

      return new Response(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${safeFilename}-pipelines.zip"`,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown generation error';
      await runRepository.updateStatus(run.id, 'error', undefined, message);

      const httpStatus = err instanceof AppError ? err.statusCode : 500;
      const userFacingError =
        err instanceof AppError && err.isOperational
          ? err.message
          : 'Pipeline generation failed. Please try again.';

      const errorLogger = new ErrorLogService(supabase);
      await errorLogger.logError({
        userId,
        endpoint: '/api/pipelines/generate/github-actions',
        httpMethod: 'POST',
        requestPayload: config as unknown as object,
        errorType: classifyError(err, httpStatus),
        errorMessage: message,
        stackTrace: err instanceof Error ? err.stack : undefined,
        httpStatus,
        userFacingError,
        platform: 'github-actions',
        deployTarget: config.deployTarget ?? undefined,
        marketsCount: config.markets.filter((m) => m.enabled).length,
      });

      throw err;
    }
  });

  // ─── GET /runs ──────────────────────────────────────────────────────────────

  app.get('/runs', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    const runRepository = new PipelineRunRepository(supabase);
    const runs = await runRepository.findByUserId(userId);
    return c.json({ runs });
  });

  // ─── GET /runs/:id ──────────────────────────────────────────────────────────

  app.get('/runs/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    const runRepository = new PipelineRunRepository(supabase);

    const run = await runRepository.findById(id);

    if (!run) {
      throw new AppError('Pipeline run not found', 404);
    }

    if (run.user_id !== userId) {
      throw new AppError('Pipeline run not found', 404);
    }

    return c.json({ run });
  });

  return app;
}
