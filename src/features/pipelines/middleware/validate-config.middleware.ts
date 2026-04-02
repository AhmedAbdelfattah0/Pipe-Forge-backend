/**
 * validate-config.middleware.ts
 *
 * Zod schema for the `GeneratorConfig` request body.
 *
 * In the Hono migration, validation happens inline in route handlers
 * using `GeneratorConfigSchema.safeParse()`. The Express middleware
 * export has been removed.
 */

import { z } from 'zod';

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const MarketSchema = z.object({
  name: z.string().min(1, 'Market name is required').max(100),
  code: z.string().min(1, 'Market code is required').max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Market code may only contain letters, numbers, hyphens, and underscores'),
  enabled: z.boolean(),
});

const LanguageSchema = z.object({
  name: z.string().min(1, 'Language name is required').max(10).regex(/^[a-zA-Z]+$/),
  code: z.string().min(1, 'Language code is required').max(10).regex(/^[a-zA-Z]+$/),
});

const QualityGateScriptSchema = z.object({
  enabled: z.boolean(),
  // Empty string is valid (gate disabled). Only enforce character allowlist when non-empty.
  command: z.string().max(500).refine(
    (v) => v === '' || /^[a-zA-Z0-9 _\-:./@=]+$/.test(v),
    { message: 'Command contains invalid characters' },
  ),
});

const QualityGatesSchema = z.object({
  enabled: z.boolean(),
  typescript: QualityGateScriptSchema,
  lint: QualityGateScriptSchema,
  tests: QualityGateScriptSchema,
  format: QualityGateScriptSchema,
});

const TokenMappingSchema = z.object({
  tokenName: z.string().max(200).regex(
    /^[a-zA-Z0-9_.-]+$/,
    'Token name may only contain letters, numbers, underscores, dots, and hyphens',
  ),
  variableName: z.string().max(200).regex(
    /^[a-zA-Z0-9_.-]+$/,
    'Variable name may only contain letters, numbers, underscores, dots, and hyphens',
  ),
});

const TokenReplacementSchema = z.object({
  enabled: z.boolean(),
  filePattern: z.string().max(300).optional().default('src/environments/environment.*.ts'),
  tokenFormat: z.enum(['#{TOKEN}#', '__TOKEN__', '${TOKEN}']).optional().default('#{TOKEN}#'),
  tokenMappings: z.array(TokenMappingSchema).max(50).optional().default([]),
  // Backward-compatible deprecated fields
  environmentFilePath: z.string().max(300).optional().default(''),
  secretVariableNames: z.string().max(500).optional().default(''),
});

const BuildScriptMatrixSchema = z.record(z.string(), z.string()).refine(
  (obj) => Object.keys(obj).length <= 100,
  { message: 'buildScripts must not exceed 100 entries' },
);
const StorageAccountConfigSchema = z.record(z.string(), z.string()).refine(
  (obj) => Object.keys(obj).length <= 100,
  { message: 'storageAccounts must not exceed 100 entries' },
);
const StaticWebAppConfigSchema = z.record(z.string(), z.string()).refine(
  (obj) => Object.keys(obj).length <= 100,
  { message: 'swaTokens must not exceed 100 entries' },
);
const AppServiceConfigSchema = z.record(z.string(), z.string()).refine(
  (obj) => Object.keys(obj).length <= 100,
  { message: 'appServiceNames must not exceed 100 entries' },
);

const GitHubConfigSchema = z.object({
  owner: z.string().max(100),
  repositoryName: z.string().max(200),
  triggers: z.object({
    push: z.boolean(),
    pullRequest: z.boolean(),
    manual: z.boolean(),
    schedule: z.boolean(),
  }),
  cronExpression: z.string().max(50),
});

const GitHubSwaSecretNamesSchema = z.record(z.string(), z.string()).refine(
  (obj) => Object.keys(obj).length <= 100,
  { message: 'githubSwaSecretNames must not exceed 100 entries' },
);

/**
 * Full Zod validation schema mirroring the `GeneratorConfig` interface.
 */
export const GeneratorConfigSchema = z
  .object({
    // ── Step 1 — Project Info ───────────────────────────────────────────────
    projectName: z.string().min(1, 'Project name is required').max(100).regex(/^[a-zA-Z0-9 _.-]+$/, 'Project name may only contain letters, numbers, spaces, hyphens, underscores, and dots'),
    repositoryName: z.string().min(1, 'Repository name is required').max(200).regex(/^[a-zA-Z0-9 _./\\@-]+$/, 'Repository name contains invalid characters'),
    nodeVersion: z.enum(['18.x', '20.x', '22.x'], {
      errorMap: () => ({ message: "Node version must be '18.x', '20.x', or '22.x'" }),
    }),
    distFolder: z.string().min(1, 'Dist folder is required').max(300).regex(/^[a-zA-Z0-9 _./\\-]+$/, 'Dist folder contains invalid characters'),
    installFlags: z.string().max(500),
    hasBrowserSubfolder: z.boolean(),
    qaBranch: z.string().max(200),
    productionBranch: z.string().max(200),
    adoOrganization: z.string().max(200),
    adoProjectName: z.string().max(200),
    serviceConnectionId: z.string().max(200),

    // ── Step 2 — Markets & Environments ────────────────────────────────────
    markets: z
      .array(MarketSchema)
      .min(1, 'At least one market must be defined'),
    environments: z
      .array(z.enum(['QA', 'PROD']))
      .min(1, 'At least one environment must be selected'),

    // ── Step 3 — Languages & Scripts ───────────────────────────────────────
    isMultiLanguage: z.boolean(),
    languages: z.array(LanguageSchema),
    buildScripts: BuildScriptMatrixSchema,
    tokenReplacement: TokenReplacementSchema,
    qualityGates: QualityGatesSchema.optional(),

    // ── Step 4 — Deploy Target ──────────────────────────────────────────────
    deployTarget: z
      .enum(['storage-account', 'static-web-app', 'app-service', 'ftp-cpanel', 'vercel', 'netlify', 'firebase', 'github-pages', 'cloudflare-pages'])
      .nullable(),
    storageAccounts: StorageAccountConfigSchema,
    swaTokens: StaticWebAppConfigSchema,
    appServiceNames: AppServiceConfigSchema,
    triggerPipelineAfterDeploy: z.boolean(),
    triggerPipelineId: z.string().max(50),
    ftpRemotePath: z.string().max(500).optional().default('/public_html/'),
    protectedPaths: z.array(z.string().max(500)).max(50).optional().default([]),
    protectedPathsContainer: z.string().max(200).optional().default(''),
    modernHosting: z.object({
      vercelToken: z.string().max(200).optional(),
      vercelOrgId: z.string().max(200).optional(),
      vercelProjectId: z.string().max(200).optional(),
      netlifySiteId: z.string().max(200).optional(),
      firebaseProjectId: z.string().max(200).optional(),
      ghPagesBranch: z.string().max(100).optional().default('gh-pages'),
      cloudflarePagesProject: z.string().max(200).optional(),
    }).optional(),

    // ── Platform Selection ─────────────────────────────────────────────────
    platform: z.enum(['azure-devops', 'github-actions']).optional().default('azure-devops'),
    githubConfig: GitHubConfigSchema.optional(),
    githubSwaSecretNames: GitHubSwaSecretNamesSchema.optional(),

    // ── Step 5 — Output ─────────────────────────────────────────────────────
    outputFormats: z
      .array(z.enum(['yaml', 'classic-json']))
      .min(1, 'At least one output format must be selected'),
  })
  .refine(
    (data) => data.markets.some((m) => m.enabled),
    { message: 'At least one market must be enabled', path: ['markets'] },
  )
  .refine(
    (data) => {
      if (data.platform === 'azure-devops') {
        return data.adoOrganization.trim().length > 0;
      }
      return true;
    },
    { message: 'ADO organization is required', path: ['adoOrganization'] },
  )
  .refine(
    (data) => {
      if (data.platform === 'azure-devops') {
        return data.adoProjectName.trim().length > 0;
      }
      return true;
    },
    { message: 'ADO project name is required', path: ['adoProjectName'] },
  )
  .refine(
    (data) => {
      if (data.platform === 'github-actions' && data.githubConfig) {
        return data.githubConfig.owner.trim().length > 0;
      }
      return true;
    },
    { message: 'GitHub owner is required', path: ['githubConfig', 'owner'] },
  )
  .refine(
    (data) => {
      if (data.platform === 'github-actions' && data.githubConfig) {
        return data.githubConfig.repositoryName.trim().length > 0;
      }
      return true;
    },
    { message: 'GitHub repository is required', path: ['githubConfig', 'repositoryName'] },
  );

export type ValidatedGeneratorConfig = z.infer<typeof GeneratorConfigSchema>;
