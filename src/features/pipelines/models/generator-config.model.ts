/**
 * generator-config.model.ts
 *
 * Mirror of the frontend's generator.model.ts.
 * These types describe the full configuration payload sent by the client
 * and the derived pipeline combination / generated-file shapes.
 */

// ─── Union Types ─────────────────────────────────────────────────────────────

/** The deploy-target strategy. */
export type DeployTarget =
  | 'storage-account'
  | 'static-web-app'
  | 'app-service'
  | 'ftp-cpanel'
  | 'vercel'
  | 'netlify'
  | 'firebase'
  | 'github-pages'
  | 'cloudflare-pages';

/** CI/CD platform selection */
export type CICDPlatform = 'azure-devops' | 'github-actions';

/** GitHub Actions-specific configuration */
export interface GitHubConfig {
  owner: string;
  repositoryName: string;
  triggers: {
    push: boolean;
    pullRequest: boolean;
    manual: boolean;
    schedule: boolean;
  };
  cronExpression: string;
}

/** GitHub secret name mapping for SWA */
export interface GitHubSwaSecretNames {
  [key: string]: string;
}

/** The pipeline output format requested by the user. */
export type OutputFormat = 'yaml' | 'classic-json';

/** The environment tier being targeted by a pipeline. */
export type EnvironmentType = 'QA' | 'PROD';

// ─── Interfaces ──────────────────────────────────────────────────────────────

/** A single deployment market (region). */
export interface Market {
  /** Human-readable name, e.g. "KSA". */
  name: string;
  /** Short ISO-style code, e.g. "sa". */
  code: string;
  /** Whether this market is currently selected by the user. */
  enabled: boolean;
}

/** A supported UI language. */
export interface Language {
  /** Display name, e.g. "EN". */
  name: string;
  /** BCP-47 code, e.g. "en". */
  code: string;
}

/**
 * Sparse matrix mapping a market+env(+lang) key to an npm build-script name.
 *
 * - Multi-language key format : `"{marketCode}-{env}-{langCode}"` e.g. `"sa-QA-en"`
 * - Single-language key format: `"{marketCode}-{env}"` e.g. `"sa-QA"`
 */
export interface BuildScriptMatrix {
  [key: string]: string;
}

/**
 * Sparse map from `"{marketCode}-{env}"` key to an Azure Storage Account name.
 * Used when `deployTarget === 'storage-account'`.
 */
export interface StorageAccountConfig {
  [key: string]: string;
}

/**
 * Sparse map from `"{marketCode}-{env}"` key to an Azure Static Web App deployment token.
 * Used when `deployTarget === 'static-web-app'`.
 */
export interface StaticWebAppConfig {
  [key: string]: string;
}

/**
 * Sparse map from `"{marketCode}-{env}"` key to an Azure App Service name.
 * Used when `deployTarget === 'app-service'`.
 */
export interface AppServiceConfig {
  [key: string]: string;
}

/** A single quality-gate check (e.g. TypeScript, lint, tests, format). */
export interface QualityGateScript {
  enabled: boolean;
  command: string;
}

/** Optional quality gates that run before the main build step. */
export interface QualityGates {
  enabled: boolean;
  typescript: QualityGateScript;
  lint: QualityGateScript;
  tests: QualityGateScript;
  format: QualityGateScript;
}

/** A single token name / pipeline variable name pair. */
export interface TokenMapping {
  tokenName: string;
  variableName: string;
}

/** Configuration for the token-replacement step during build. */
export interface TokenReplacement {
  /** Whether the token-replacement step should be emitted. */
  enabled: boolean;
  /** Glob pattern of files to search (e.g. "src/environments/environment.*.ts"). */
  filePattern: string;
  /** Token format style used in the files. */
  tokenFormat: '#{TOKEN}#' | '__TOKEN__' | '${TOKEN}';
  /** Per-token name mappings. */
  tokenMappings: TokenMapping[];
  /** @deprecated Use filePattern instead. */
  environmentFilePath: string;
  /** @deprecated Use tokenMappings instead. */
  secretVariableNames: string;
}

/** Modern hosting config for platforms outside Azure. */
export interface ModernHostingConfig {
  vercelToken?: string;
  vercelOrgId?: string;
  vercelProjectId?: string;
  netlifySiteId?: string;
  firebaseProjectId?: string;
  ghPagesBranch?: string;
  cloudflarePagesProject?: string;
}

/** Full configuration payload produced by the frontend wizard. */
export interface GeneratorConfig {
  // ── Step 1 — Project Info ─────────────────────────────────────────────────
  projectName: string;
  repositoryName: string;
  nodeVersion: '18.x' | '20.x' | '22.x';
  distFolder: string;
  installFlags: string;
  hasBrowserSubfolder: boolean;
  qaBranch: string;
  productionBranch: string;
  adoOrganization: string;
  adoProjectName: string;
  serviceConnectionId: string;

  // ── Step 2 — Markets & Environments ──────────────────────────────────────
  markets: Market[];
  environments: EnvironmentType[];

  // ── Step 3 — Languages & Scripts ─────────────────────────────────────────
  isMultiLanguage: boolean;
  languages: Language[];
  buildScripts: BuildScriptMatrix;
  tokenReplacement: TokenReplacement;
  qualityGates?: QualityGates;

  // ── Step 4 — Deploy Target ────────────────────────────────────────────────
  deployTarget: DeployTarget | null;
  storageAccounts: StorageAccountConfig;
  swaTokens: StaticWebAppConfig;
  appServiceNames: AppServiceConfig;
  triggerPipelineAfterDeploy: boolean;
  triggerPipelineId: string;
  /** FTP remote path for cPanel/FTP deployments, e.g. "/public_html/". */
  ftpRemotePath?: string;
  /** Paths to preserve across storage account deployments (backup/restore). */
  protectedPaths?: string[];
  /** Container name for storing protected path backups. */
  protectedPathsContainer?: string;
  /** Whether to copy files from a source container into the destination container before deploying. */
  preserveFiles?: boolean;
  /** Azure container holding the files to be preserved (e.g. "certificates"). */
  preserveSourceContainer?: string;
  /** Folder to create inside the destination container (e.g. ".well-known"). */
  preserveDestinationFolder?: string;
  /** Destination container for the static site deployment (default: "$web"). */
  preserveDestinationContainer?: string;
  /** Modern hosting platform config (Vercel, Netlify, Firebase, GitHub Pages, Cloudflare Pages). */
  modernHosting?: ModernHostingConfig;

  // ── Step 5 — Output ───────────────────────────────────────────────────────
  outputFormats: OutputFormat[];

  // ── Platform Selection ───────────────────────────────────────────────────
  platform?: CICDPlatform;
  githubConfig?: GitHubConfig;
  githubSwaSecretNames?: GitHubSwaSecretNames;
}

/** Metadata describing a single pipeline file to be placed inside the ZIP. */
export interface GeneratedFile {
  /** File name, e.g. `"QA-SAUDI-SHOPPINGBAG-EN.yml"`. */
  name: string;
  /** Directory path within the ZIP, e.g. `"my-app-pipelines/build/"`. */
  path: string;
  /** Logical role of the file, used for template selection. */
  type: 'build-yaml' | 'build-json' | 'release-json' | 'readme';
}

/**
 * A fully resolved pipeline variant produced by crossing
 * market × environment × language (when multi-language).
 */
export interface PipelineCombination {
  /** The source market for this combination. */
  market: Market;
  /** The target environment tier. */
  environment: EnvironmentType;
  /** The target language — `undefined` in single-language mode. */
  language?: Language;
  /**
   * Human-readable ADO pipeline name.
   * Multi: `"{ENV}-{MARKET}-{MFE}-{LANG}"` e.g. `"QA-SAUDI-SHOPPINGBAG-EN"`
   * Single: `"{ENV}-{MARKET}-{MFE}"` e.g. `"QA-SAUDI-SHOPPINGBAG"`
   */
  pipelineName: string;
  /** ADO artifact alias derived by prefixing pipelineName with `_`. */
  artifactAlias: string;
  /**
   * Blob/CDN deployment path.
   * Multi: `"{marketCode}/{langCode}/{projectName}"` e.g. `"sa/en/shoppingbag"`
   * Single: `"{marketCode}/{projectName}"` e.g. `"sa/shoppingbag"`
   */
  deploymentPath: string;
  /** npm build-script name resolved from the BuildScriptMatrix, e.g. `"ksaqa"`. */
  buildScript: string;
  /** Git branch that triggers this pipeline. */
  branchName: string;
}
