/**
 * pipeline.routes.ts
 *
 * Pipeline generation feature routes — all protected by `authMiddleware`
 * applied in `src/index.ts` at the router mount level.
 *
 * Mounted at: `/api/pipelines`
 *
 * Routes:
 *   POST /api/pipelines/generate   — generate ZIP, persist run + project record
 *   GET  /api/pipelines/runs       — list user's pipeline run history
 *   GET  /api/pipelines/runs/:id   — get a specific pipeline run
 */

import { Router } from 'express';
import { asyncHandler } from '../../../shared/utils/async-handler.js';
import { AppError } from '../../../shared/utils/app-error.js';
import { validateConfigMiddleware } from '../middleware/validate-config.middleware.js';
import { planLimiterMiddleware } from '../../billing/middleware/plan-limiter.middleware.js';
import { PipelineGeneratorService } from '../services/pipeline-generator.service.js';
import { GitHubActionsGeneratorService } from '../services/github-actions-generator.service.js';
import { PipelineZipService } from '../services/pipeline-zip.service.js';
import { PipelineRunRepository } from '../repositories/pipeline-run.repository.js';
import { HistoryRepository } from '../../history/repositories/history.repository.js';
import { SubscriptionRepository } from '../../billing/repositories/subscription.repository.js';
import { GenerationRepository } from '../../feedback/repositories/generation.repository.js';
import { encryptConfigSnapshot } from '../../../shared/utils/config-encryption.js';
import type { ValidatedGeneratorConfig } from '../middleware/validate-config.middleware.js';

const router = Router();

// Instantiate services and repositories once (stateless singletons).
const generatorService = new PipelineGeneratorService();
const githubActionsGeneratorService = new GitHubActionsGeneratorService();
const zipService = new PipelineZipService();
const runRepository = new PipelineRunRepository();
const historyRepository = new HistoryRepository();
const subscriptionRepository = new SubscriptionRepository();
const generationRepo = new GenerationRepository();

// ─── POST /generate ───────────────────────────────────────────────────────────

/**
 * POST /api/pipelines/generate
 *
 * Full pipeline generation flow:
 *  1. Validate request body with Zod (`validateConfigMiddleware`)
 *  2. Check plan limits (`planLimiterMiddleware`)
 *  3. Create a `pipeline_runs` record (status: 'pending')
 *  4. Update status to 'generating'
 *  5. Render Handlebars templates → `RenderedFile[]`
 *  6. Pack files into a JSZip `Buffer`
 *  7. Create a `projects` (history) record
 *  8. Update run to 'success' with file count
 *  9. Increment `mfe_used_this_month` on the subscription
 * 10. Send ZIP as binary response
 *
 * On any error after step 3: update run status to 'error' before re-throwing.
 *
 * Response: ZIP binary download
 *   Content-Type: application/zip
 *   Content-Disposition: attachment; filename="{mfeName}-pipelines.zip"
 */
router.post(
  '/generate',
  validateConfigMiddleware,
  planLimiterMiddleware,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const config = req.body as ValidatedGeneratorConfig;
    const mfeName = config.mfeName || 'my-app';
    const safeFilename = mfeName.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Step 3 — Create pipeline run record (status: 'pending').
    // We need a project_id for the run; create the project record first
    // (with a preliminary pipeline_count of 0) so we have a valid FK reference,
    // then update count after generation succeeds.
    const enabledMarkets = config.markets.filter((m) => m.enabled).map((m) => m.code);
    const languages = config.isMultiLanguage
      ? config.languages.map((l) => l.code)
      : [];

    // Encrypt sensitive fields before persisting the config snapshot.
    const encryptedSnapshot = encryptConfigSnapshot(
      config as unknown as Record<string, unknown>,
    );

    const project = await historyRepository.create({
      user_id: userId,
      mfe_name: config.mfeName,
      repository_name: config.repositoryName,
      deploy_target: config.deployTarget ?? 'storage-account',
      markets: enabledMarkets,
      environments: config.environments,
      languages,
      output_formats: config.outputFormats,
      pipeline_count: 0, // Placeholder — updated after generation.
      config_snapshot: encryptedSnapshot,
    });

    const run = await runRepository.create({
      user_id: userId,
      project_id: project.id,
      status: 'pending',
    });

    try {
      // Step 4 — Transition to 'generating'.
      await runRepository.updateStatus(run.id, 'generating');

      // Step 5 — Render templates.
      const renderedFiles = generatorService.generate(config);

      // Step 6 — Assemble ZIP.
      const zipBuffer = await zipService.createZip(renderedFiles, mfeName);

      const fileCount = renderedFiles.length;

      // Step 8 — Update run to 'success'.
      await runRepository.updateStatus(run.id, 'success', fileCount);

      // Step 9 — Increment subscription usage counter.
      await subscriptionRepository.incrementUsage(userId);

      // Save generation record for feedback tracking (with encrypted snapshot).
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

      // Step 10 — Send the ZIP file.
      res.set('Content-Type', 'application/zip');
      res.set(
        'Content-Disposition',
        `attachment; filename="${safeFilename}-pipelines.zip"`,
      );
      res.status(200).send(zipBuffer);
    } catch (err) {
      // On any generation error, mark the run as failed.
      const message = err instanceof Error ? err.message : 'Unknown generation error';
      await runRepository.updateStatus(run.id, 'error', undefined, message);
      throw err;
    }
  }),
);

// ─── POST /generate/github-actions ────────────────────────────────────────────

/**
 * POST /api/pipelines/generate/github-actions
 *
 * GitHub Actions pipeline generation flow — identical to POST /generate
 * but uses `GitHubActionsGeneratorService` instead of `PipelineGeneratorService`.
 *
 * Response: ZIP binary download
 *   Content-Type: application/zip
 *   Content-Disposition: attachment; filename="{mfeName}-pipelines.zip"
 */
router.post(
  '/generate/github-actions',
  validateConfigMiddleware,
  planLimiterMiddleware,
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const config = req.body as ValidatedGeneratorConfig;
    const mfeName = config.mfeName || 'my-app';
    const safeFilename = mfeName.replace(/[^a-zA-Z0-9_-]/g, '_');

    const enabledMarkets = config.markets.filter((m) => m.enabled).map((m) => m.code);
    const languages = config.isMultiLanguage
      ? config.languages.map((l) => l.code)
      : [];

    // Encrypt sensitive fields before persisting the config snapshot.
    const encryptedSnapshot = encryptConfigSnapshot(
      config as unknown as Record<string, unknown>,
    );

    const project = await historyRepository.create({
      user_id: userId,
      mfe_name: config.mfeName,
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

      const zipBuffer = await zipService.createZip(renderedFiles, mfeName);

      const fileCount = renderedFiles.length;

      await runRepository.updateStatus(run.id, 'success', fileCount);

      await subscriptionRepository.incrementUsage(userId);

      // Save generation record for feedback tracking (with encrypted snapshot).
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
        // Non-critical — don't fail the generation if feedback tracking fails
      }

      res.set('Content-Type', 'application/zip');
      res.set(
        'Content-Disposition',
        `attachment; filename="${safeFilename}-pipelines.zip"`,
      );
      res.status(200).send(zipBuffer);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown generation error';
      await runRepository.updateStatus(run.id, 'error', undefined, message);
      throw err;
    }
  }),
);

// ─── GET /runs ────────────────────────────────────────────────────────────────

/**
 * GET /api/pipelines/runs
 *
 * Returns all pipeline run records for the authenticated user,
 * ordered most-recent first.
 *
 * Response shape: `{ runs: PipelineRun[] }`
 */
router.get(
  '/runs',
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const runs = await runRepository.findByUserId(userId);
    res.status(200).json({ runs });
  }),
);

// ─── GET /runs/:id ────────────────────────────────────────────────────────────

/**
 * GET /api/pipelines/runs/:id
 *
 * Returns a specific pipeline run by its UUID.
 * Returns 404 if the run does not exist or belongs to another user.
 *
 * Response shape: `{ run: PipelineRun }`
 */
router.get(
  '/runs/:id',
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const id = String(req.params['id']);

    const run = await runRepository.findById(id);

    if (!run) {
      throw new AppError('Pipeline run not found', 404);
    }

    // Ownership check — avoid leaking another user's run data.
    if (run.user_id !== userId) {
      throw new AppError('Pipeline run not found', 404);
    }

    res.status(200).json({ run });
  }),
);

export default router;
