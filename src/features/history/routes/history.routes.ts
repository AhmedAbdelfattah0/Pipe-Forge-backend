/**
 * history.routes.ts
 *
 * History (projects) feature routes — all protected by `authMiddleware`
 * applied in `src/index.ts` at the router mount level.
 *
 * Mounted at: `/api/history`
 *
 * Routes:
 *   GET    /api/history            — paginated + searchable project list
 *   GET    /api/history/:id        — single project with config_snapshot
 *   DELETE /api/history/:id        — delete a project (ownership enforced)
 *   POST   /api/history/:id/regenerate — re-generate from stored config snapshot
 */

import { Router } from 'express';
import { asyncHandler } from '../../../shared/utils/async-handler.js';
import { AppError } from '../../../shared/utils/app-error.js';
import { HistoryRepository } from '../repositories/history.repository.js';
import { PipelineGeneratorService } from '../../pipelines/services/pipeline-generator.service.js';
import { PipelineZipService } from '../../pipelines/services/pipeline-zip.service.js';
import { PipelineRunRepository } from '../../pipelines/repositories/pipeline-run.repository.js';
import { SubscriptionRepository } from '../../billing/repositories/subscription.repository.js';
import { HistoryRepository as HistoryRepo } from '../repositories/history.repository.js';
import { GeneratorConfigSchema } from '../../pipelines/middleware/validate-config.middleware.js';
import {
  encryptConfigSnapshot,
  decryptConfigSnapshot,
} from '../../../shared/utils/config-encryption.js';

const router = Router();
const historyRepository = new HistoryRepository();
const generatorService = new PipelineGeneratorService();
const zipService = new PipelineZipService();
const runRepository = new PipelineRunRepository();
const subscriptionRepository = new SubscriptionRepository();

// ─── GET / ────────────────────────────────────────────────────────────────────

/**
 * GET /api/history
 *
 * Returns a paginated list of the authenticated user's past pipeline
 * generation projects, ordered most-recent first.
 *
 * Query params:
 *   `page`  — page number (1-based, default: 1)
 *   `limit` — items per page (default: 10, max: 50)
 *   `q`     — substring search on `mfe_name` or `repository_name`
 *
 * Response shape: `{ projects: Project[], page: number, limit: number }`
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query['limit'] ?? '10'), 10) || 10));
    const search = typeof req.query['q'] === 'string' ? req.query['q'] : undefined;
    const offset = (page - 1) * limit;

    const projects = await historyRepository.findByUserId(userId, { search, limit, offset });

    // Decrypt sensitive fields before returning to the frontend.
    const decryptedProjects = projects.map((p) => ({
      ...p,
      config_snapshot: decryptConfigSnapshot(p.config_snapshot),
    }));

    res.status(200).json({ projects: decryptedProjects, page, limit });
  }),
);

// ─── GET /:id ─────────────────────────────────────────────────────────────────

/**
 * GET /api/history/:id
 *
 * Returns a single project record including its full `config_snapshot`
 * (used to power the regenerate flow).
 *
 * Response shape: `{ project: Project }`
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const id = String(req.params['id']);

    const project = await historyRepository.findById(id);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Ownership check — users may only access their own projects.
    if (project.user_id !== userId) {
      throw new AppError('Project not found', 404);
    }

    // Decrypt sensitive fields before returning to the frontend.
    const decryptedProject = {
      ...project,
      config_snapshot: decryptConfigSnapshot(project.config_snapshot),
    };

    res.status(200).json({ project: decryptedProject });
  }),
);

// ─── DELETE /:id ──────────────────────────────────────────────────────────────

/**
 * DELETE /api/history/:id
 *
 * Permanently deletes a project. The repository enforces ownership by
 * filtering on both `id` and `user_id` — attempting to delete another
 * user's project returns 404 rather than 403 to avoid information leakage.
 *
 * Response shape: `{ message: string }`
 */
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const id = String(req.params['id']);

    await historyRepository.deleteById(id, userId);

    res.status(200).json({ message: 'Project deleted successfully' });
  }),
);

// ─── POST /:id/regenerate ─────────────────────────────────────────────────────

/**
 * POST /api/history/:id/regenerate
 *
 * Re-runs pipeline generation using the `config_snapshot` stored with
 * an existing project. Follows the same steps as `POST /api/pipelines/generate`
 * but reads the config from the database instead of the request body.
 *
 * Response: ZIP binary download
 *   Content-Type: application/zip
 *   Content-Disposition: attachment; filename="{mfeName}-pipelines.zip"
 */
router.post(
  '/:id/regenerate',
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const id = String(req.params['id']);

    // Fetch the source project and enforce ownership.
    const sourceProject = await historyRepository.findById(id);

    if (!sourceProject) {
      throw new AppError('Project not found', 404);
    }

    if (sourceProject.user_id !== userId) {
      throw new AppError('Project not found', 404);
    }

    // Decrypt the stored config snapshot before validating.
    const decryptedSnapshot = decryptConfigSnapshot(sourceProject.config_snapshot);
    const parseResult = GeneratorConfigSchema.safeParse(decryptedSnapshot);
    if (!parseResult.success) {
      throw new AppError('Stored config snapshot is invalid', 422);
    }
    const config = parseResult.data;
    const mfeName = config.mfeName || 'my-app';
    const safeFilename = mfeName.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Create a pipeline_run tracking record (project_id is the SOURCE project).
    const run = await runRepository.create({
      user_id: userId,
      project_id: sourceProject.id,
      status: 'pending',
    });

    try {
      // Transition to generating.
      await runRepository.updateStatus(run.id, 'generating');

      // Generate files and assemble ZIP.
      const renderedFiles = generatorService.generate(config);
      const zipBuffer = await zipService.createZip(renderedFiles, mfeName);

      // Create a new project record for this regeneration.
      const newHistoryRepo = new HistoryRepo();
      const enabledMarkets = config.markets.filter((m) => m.enabled).map((m) => m.code);
      const languages = config.isMultiLanguage
        ? config.languages.map((l) => l.code)
        : [];

      // Re-encrypt sensitive fields for the new project record.
      const reEncryptedSnapshot = encryptConfigSnapshot(
        config as unknown as Record<string, unknown>,
      );

      await newHistoryRepo.create({
        user_id: userId,
        mfe_name: config.mfeName,
        repository_name: config.repositoryName,
        deploy_target: config.deployTarget ?? 'storage-account',
        markets: enabledMarkets,
        environments: config.environments,
        languages,
        output_formats: config.outputFormats,
        pipeline_count: renderedFiles.length,
        config_snapshot: reEncryptedSnapshot,
      });

      // Mark the run as successful.
      await runRepository.updateStatus(run.id, 'success', renderedFiles.length);

      // Increment usage counter.
      await subscriptionRepository.incrementUsage(userId);

      // Send the ZIP.
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

export default router;
