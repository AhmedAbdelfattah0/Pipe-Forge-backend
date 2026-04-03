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
 *   PUT    /api/history/:id        — update config + re-generate pipelines (edit mode)
 *   DELETE /api/history/:id        — delete a project (ownership enforced)
 *   POST   /api/history/:id/regenerate — re-generate from stored config snapshot
 */

import { Hono } from 'hono';
import { AppError } from '../../../shared/utils/app-error.js';
import { createSupabaseAdmin } from '../../../config/supabase.js';
import { HistoryRepository } from '../repositories/history.repository.js';
import { PipelineGeneratorService } from '../../pipelines/services/pipeline-generator.service.js';
import { GitHubActionsGeneratorService } from '../../pipelines/services/github-actions-generator.service.js';
import { PipelineZipService } from '../../pipelines/services/pipeline-zip.service.js';
import { PipelineRunRepository } from '../../pipelines/repositories/pipeline-run.repository.js';
import { SubscriptionRepository } from '../../billing/repositories/subscription.repository.js';
import { GeneratorConfigSchema } from '../../pipelines/middleware/validate-config.middleware.js';
import {
  encryptConfigSnapshot,
  decryptConfigSnapshot,
} from '../../../shared/utils/config-encryption.js';
import type { HonoEnv } from '../../../shared/middleware/auth.js';

// Services are stateless — safe to instantiate once.
const generatorService = new PipelineGeneratorService();
const githubActionsGeneratorService = new GitHubActionsGeneratorService();
const zipService = new PipelineZipService();

export function historyRoutes() {
  const app = new Hono<HonoEnv>();

  // ─── GET / ────────────────────────────────────────────────────────────────

  app.get('/', async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseAdmin(c.env);
    const historyRepository = new HistoryRepository(supabase);

    const page = Math.max(1, parseInt(c.req.query('page') ?? '1', 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') ?? '10', 10) || 10));
    const search = c.req.query('q') || undefined;
    const offset = (page - 1) * limit;

    const projects = await historyRepository.findByUserId(userId, { search, limit, offset });

    // Decrypt sensitive fields before returning to the frontend.
    const decryptedProjects = projects.map((p) => ({
      ...p,
      config_snapshot: decryptConfigSnapshot(p.config_snapshot, c.env.ENCRYPTION_KEY),
    }));

    return c.json({ projects: decryptedProjects, page, limit });
  });

  // ─── GET /:id ─────────────────────────────────────────────────────────────

  app.get('/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    const historyRepository = new HistoryRepository(supabase);

    const project = await historyRepository.findById(id);

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (project.user_id !== userId) {
      throw new AppError('Project not found', 404);
    }

    const decryptedProject = {
      ...project,
      config_snapshot: decryptConfigSnapshot(project.config_snapshot, c.env.ENCRYPTION_KEY),
    };

    return c.json({ project: decryptedProject });
  });

  // ─── PUT /:id ─────────────────────────────────────────────────────────────
  //
  // Updates an existing project's config_snapshot (and derived metadata) and
  // re-generates + re-downloads the pipeline ZIP.  This is the "edit + save"
  // path: no new project row is created; the existing record is mutated in place.

  app.put('/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    const historyRepository = new HistoryRepository(supabase);
    const runRepository = new PipelineRunRepository(supabase);
    const subscriptionRepository = new SubscriptionRepository(supabase);

    // Ownership check.
    const existing = await historyRepository.findById(id);
    if (!existing) {
      throw new AppError('Project not found', 404);
    }
    if (existing.user_id !== userId) {
      throw new AppError('Project not found', 404);
    }

    // Parse + validate the new config from the request body.
    const body = await c.req.json();
    const parseResult = GeneratorConfigSchema.safeParse(body);
    if (!parseResult.success) {
      return c.json(
        { status: 'error', message: 'Invalid generator configuration', issues: parseResult.error.issues },
        400,
      );
    }
    const config = parseResult.data;
    const projectName = config.projectName || 'my-app';
    const safeFilename = projectName.replace(/[^a-zA-Z0-9_-]/g, '_');

    const enabledMarkets = config.markets.filter((m) => m.enabled).map((m) => m.code);
    const languages = config.isMultiLanguage ? config.languages.map((l) => l.code) : [];

    const reEncryptedSnapshot = encryptConfigSnapshot(
      config as unknown as Record<string, unknown>,
      c.env.ENCRYPTION_KEY,
    );

    // Create a tracking run for this edit-regeneration.
    const run = await runRepository.create({
      user_id: userId,
      project_id: id,
      status: 'pending',
    });

    try {
      await runRepository.updateStatus(run.id, 'generating');

      const isGHA = config.platform === 'github-actions';
      const renderedFiles = isGHA
        ? githubActionsGeneratorService.generate(config)
        : generatorService.generate(config);

      const zipBuffer = await zipService.createZip(renderedFiles, projectName);
      const fileCount = renderedFiles.length;

      // Update the existing project record — no new row.
      await historyRepository.updateById(id, userId, {
        mfe_name: config.projectName,
        repository_name: config.repositoryName,
        deploy_target: config.deployTarget ?? 'storage-account',
        markets: enabledMarkets,
        environments: config.environments,
        languages,
        output_formats: config.outputFormats,
        pipeline_count: fileCount,
        config_snapshot: reEncryptedSnapshot,
      });

      await runRepository.updateStatus(run.id, 'success', fileCount);
      await subscriptionRepository.incrementUsage(userId);

      return new Response(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${safeFilename}-pipelines.zip"`,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown generation error';
      await runRepository.updateStatus(run.id, 'error', undefined, message);
      throw err;
    }
  });

  // ─── DELETE /:id ──────────────────────────────────────────────────────────

  app.delete('/:id', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    const historyRepository = new HistoryRepository(supabase);

    await historyRepository.deleteById(id, userId);

    return c.json({ message: 'Project deleted successfully' });
  });

  // ─── POST /:id/regenerate ─────────────────────────────────────────────────

  app.post('/:id/regenerate', async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const supabase = createSupabaseAdmin(c.env);
    const historyRepository = new HistoryRepository(supabase);
    const runRepository = new PipelineRunRepository(supabase);
    const subscriptionRepository = new SubscriptionRepository(supabase);

    // Fetch the source project and enforce ownership.
    const sourceProject = await historyRepository.findById(id);

    if (!sourceProject) {
      throw new AppError('Project not found', 404);
    }

    if (sourceProject.user_id !== userId) {
      throw new AppError('Project not found', 404);
    }

    // Decrypt the stored config snapshot before validating.
    const decryptedSnapshot = decryptConfigSnapshot(
      sourceProject.config_snapshot,
      c.env.ENCRYPTION_KEY,
    );
    const parseResult = GeneratorConfigSchema.safeParse(decryptedSnapshot);
    if (!parseResult.success) {
      throw new AppError('Stored config snapshot is invalid', 422);
    }
    const config = parseResult.data;
    const projectName = config.projectName || 'my-app';
    const safeFilename = projectName.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Create a pipeline_run tracking record.
    const run = await runRepository.create({
      user_id: userId,
      project_id: sourceProject.id,
      status: 'pending',
    });

    try {
      await runRepository.updateStatus(run.id, 'generating');

      const renderedFiles = generatorService.generate(config);
      const zipBuffer = await zipService.createZip(renderedFiles, projectName);

      // Create a new project record for this regeneration.
      const enabledMarkets = config.markets.filter((m) => m.enabled).map((m) => m.code);
      const languages = config.isMultiLanguage
        ? config.languages.map((l) => l.code)
        : [];

      const reEncryptedSnapshot = encryptConfigSnapshot(
        config as unknown as Record<string, unknown>,
        c.env.ENCRYPTION_KEY,
      );

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
        config_snapshot: reEncryptedSnapshot,
      });

      await runRepository.updateStatus(run.id, 'success', renderedFiles.length);
      await subscriptionRepository.incrementUsage(userId);

      return new Response(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${safeFilename}-pipelines.zip"`,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown generation error';
      await runRepository.updateStatus(run.id, 'error', undefined, message);
      throw err;
    }
  });

  return app;
}
