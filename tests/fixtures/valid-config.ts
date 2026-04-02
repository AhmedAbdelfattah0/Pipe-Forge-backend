/**
 * valid-config.ts
 *
 * A complete, valid GeneratorConfig object shared across unit tests.
 * Matches every field required by GeneratorConfigSchema.
 */

import type { GeneratorConfig } from '../../src/features/pipelines/models/generator-config.model';

export const validConfig: GeneratorConfig = {
  // Step 1 — Project Info
  projectName: 'shoppingbag',
  repositoryName: 'shopping-bag-mfe',
  nodeVersion: '20.x',
  distFolder: 'dist/shoppingbag',
  installFlags: '--legacy-peer-deps',
  hasBrowserSubfolder: true,
  qaBranch: 'develop',
  productionBranch: 'main',
  adoOrganization: 'my-org',
  adoProjectName: 'My Project',
  serviceConnectionId: 'sc-123',

  // Step 2 — Markets & Environments
  markets: [
    { name: 'KSA', code: 'sa', enabled: true },
    { name: 'UAE', code: 'ae', enabled: true },
  ],
  environments: ['QA', 'PROD'],

  // Step 3 — Languages & Scripts
  isMultiLanguage: false,
  languages: [],
  buildScripts: {
    'sa-QA': 'build:ksa:qa',
    'sa-PROD': 'build:ksa:prod',
    'ae-QA': 'build:uae:qa',
    'ae-PROD': 'build:uae:prod',
  },
  tokenReplacement: {
    enabled: false,
    filePattern: 'src/environments/environment.*.ts',
    tokenFormat: '#{TOKEN}#',
    tokenMappings: [],
    environmentFilePath: '',
    secretVariableNames: '',
  },

  // Step 4 — Deploy Target
  deployTarget: 'storage-account',
  storageAccounts: {
    'sa-QA': 'mystorageqa',
    'sa-PROD': 'mystorageprod',
    'ae-QA': 'aestorageqa',
    'ae-PROD': 'aestorageprod',
  },
  swaTokens: {},
  appServiceNames: {},
  triggerPipelineAfterDeploy: false,
  triggerPipelineId: '',

  // Step 5 — Output
  outputFormats: ['yaml'],
};

/**
 * A multi-language variant of the valid config for tests that require
 * multi-language mode.
 */
export const validMultiLangConfig: GeneratorConfig = {
  ...validConfig,
  isMultiLanguage: true,
  languages: [
    { name: 'EN', code: 'en' },
    { name: 'AR', code: 'ar' },
  ],
  buildScripts: {
    'sa-QA-en': 'build:ksa:qa:en',
    'sa-QA-ar': 'build:ksa:qa:ar',
    'sa-PROD-en': 'build:ksa:prod:en',
    'sa-PROD-ar': 'build:ksa:prod:ar',
    'ae-QA-en': 'build:uae:qa:en',
    'ae-QA-ar': 'build:uae:qa:ar',
    'ae-PROD-en': 'build:uae:prod:en',
    'ae-PROD-ar': 'build:uae:prod:ar',
  },
};
