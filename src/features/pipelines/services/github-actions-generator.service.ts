/**
 * github-actions-generator.service.ts
 *
 * Generates GitHub Actions workflow files from a GeneratorConfig.
 * Unlike ADO which has separate build + release, GHA uses combined
 * build+deploy workflow files.
 */

import type { GeneratorConfig, GeneratedFile, PipelineCombination } from '../models/generator-config.model.js';
import { computePipelineCombinations } from './combination.service.js';
import { renderTemplate } from './template.service.js';

export type RenderedFile = GeneratedFile & { content: string };

// Maps deploy target to the GHA template file name
const GHA_TEMPLATE_MAP: Readonly<Record<string, string>> = {
  // Azure targets
  'storage-account': 'github-actions/gha-storage.yml.hbs',
  'static-web-app': 'github-actions/gha-swa.yml.hbs',
  'app-service': 'github-actions/gha-appservice.yml.hbs',
  // Traditional
  'ftp-cpanel': 'github-actions/gha-ftp-cpanel.yml.hbs',
  // Modern Hosting (GitHub Actions only)
  'vercel': 'github-actions/gha-vercel.yml.hbs',
  'netlify': 'github-actions/gha-netlify.yml.hbs',
  'firebase': 'github-actions/gha-firebase.yml.hbs',
  'github-pages': 'github-actions/gha-github-pages.yml.hbs',
  'cloudflare-pages': 'github-actions/gha-cloudflare-pages.yml.hbs',
};

export class GitHubActionsGeneratorService {
  generate(config: GeneratorConfig): RenderedFile[] {
    const combinations = computePipelineCombinations(config);
    const generatedAt = new Date().toISOString();
    const mfe = config.projectName || 'my-app';
    const deployTarget = config.deployTarget ?? 'storage-account';
    const templateName = GHA_TEMPLATE_MAP[deployTarget] ?? 'github-actions/gha-storage.yml.hbs';
    const files: RenderedFile[] = [];

    for (const combination of combinations) {
      files.push(this.renderWorkflow(combination, config, mfe, templateName));
    }

    // README
    files.push(this.renderReadme(config, combinations, files, mfe, generatedAt));

    // Secrets guide
    files.push(this.renderSecretsGuide(config, combinations, mfe, generatedAt));

    return files;
  }

  private renderWorkflow(
    combination: PipelineCombination,
    config: GeneratorConfig,
    mfe: string,
    templateName: string,
  ): RenderedFile {
    // Build GHA-style pipeline name: deploy-{marketCode}-{env}-{langCode}
    const env = combination.environment.toLowerCase();
    const marketCode = combination.market.code;
    const langSuffix = combination.language ? `-${combination.language.code}` : '';
    const ghaPipelineName = `deploy-${marketCode}-${env}${langSuffix}`;

    const resourceKey = `${combination.market.code}-${combination.environment}`;
    const storageAccountName = config.storageAccounts[resourceKey] ?? '';
    const swaSecretName = config.swaTokens[resourceKey] ?? '';
    const appServiceName = config.appServiceNames[resourceKey] ?? '';

    // Extract GitHub-specific config (these fields will be added to GeneratorConfig)
    const githubConfig = (config as any).githubConfig;
    const triggers = githubConfig?.triggers ?? { push: true, pullRequest: true, manual: true, schedule: false };
    const cronExpression = githubConfig?.cronExpression ?? '0 2 * * 1';

    const remotePath = config.ftpRemotePath ?? '/public_html/';

    // Protected paths (storage account file preservation)
    const protectedPaths = config.protectedPaths ?? [];
    const protectedPathsContainer = config.protectedPathsContainer || `${mfe}-protected`;
    const hasProtectedPaths = protectedPaths.length > 0;

    const modernHosting = config.modernHosting ?? {};

    const context = {
      pipelineName: ghaPipelineName,
      projectName: mfe,
      branch: combination.branchName,
      nodeVersion: config.nodeVersion,
      installFlags: config.installFlags,
      buildScript: combination.buildScript,
      distFolder: config.distFolder,
      hasBrowserSubfolder: config.hasBrowserSubfolder,
      deployTarget: config.deployTarget,
      storageAccountName,
      deploymentPath: combination.deploymentPath,
      swaSecretName,
      appServiceName,
      remotePath,
      hasProtectedPaths,
      protectedPathsContainer,
      qualityGates: config.qualityGates ?? { enabled: false, typescript: { enabled: false, command: '' }, lint: { enabled: false, command: '' }, tests: { enabled: false, command: '' }, format: { enabled: false, command: '' } },
      useTokenReplacement: config.tokenReplacement?.enabled ?? false,
      envFilePath: config.tokenReplacement?.filePattern ?? config.tokenReplacement?.environmentFilePath ?? '',
      tokenMappings: config.tokenReplacement?.tokenMappings ?? [],
      tokenFormat: config.tokenReplacement?.tokenFormat ?? '#{TOKEN}#',
      triggers: {
        push: triggers.push,
        pr: triggers.pullRequest,
        manual: triggers.manual,
        schedule: triggers.schedule,
      },
      cronExpression,
      // Modern hosting config
      vercelToken: modernHosting.vercelToken ?? '',
      vercelOrgId: modernHosting.vercelOrgId ?? '',
      vercelProjectId: modernHosting.vercelProjectId ?? '',
      netlifySiteId: modernHosting.netlifySiteId ?? '',
      firebaseProjectId: modernHosting.firebaseProjectId ?? '',
      ghPagesBranch: modernHosting.ghPagesBranch ?? 'gh-pages',
      cloudflarePagesProject: modernHosting.cloudflarePagesProject ?? '',
    };

    const content = renderTemplate(templateName, context);

    return {
      name: `${ghaPipelineName}.yml`,
      path: `${mfe}-pipelines/.github/workflows/`,
      type: 'build-yaml' as const,
      content,
    };
  }

  private renderReadme(
    config: GeneratorConfig,
    combinations: PipelineCombination[],
    generatedFiles: RenderedFile[],
    mfe: string,
    generatedAt: string,
  ): RenderedFile {
    const fileMetadata: GeneratedFile[] = generatedFiles.map(({ name, path, type }) => ({
      name, path, type,
    }));

    const context = {
      config,
      combinations,
      generatedFiles: fileMetadata,
      generatedAt,
    };

    const content = renderTemplate('readme.md.hbs', context);

    return {
      name: 'README.md',
      path: `${mfe}-pipelines/`,
      type: 'readme' as const,
      content,
    };
  }

  private renderSecretsGuide(
    config: GeneratorConfig,
    _combinations: PipelineCombination[],
    mfe: string,
    generatedAt: string,
  ): RenderedFile {
    // Build SWA secrets list for the template
    const swaSecrets: { secretName: string; label: string }[] = [];
    if (config.deployTarget === 'static-web-app') {
      const enabledMarkets = config.markets.filter(m => m.enabled);
      for (const market of enabledMarkets) {
        for (const env of config.environments) {
          const key = `${market.code}-${env}`;
          const secretName = config.swaTokens[key] ?? `SWA_TOKEN_${market.code.toUpperCase()}_${env}`;
          swaSecrets.push({ secretName, label: `${market.name} ${env}` });
        }
      }
    }

    const modernHosting = config.modernHosting ?? {};

    const context = {
      projectName: mfe,
      deployTarget: config.deployTarget,
      useTokenReplacement: config.tokenReplacement?.enabled ?? false,
      tokenMappings: config.tokenReplacement?.tokenMappings ?? [],
      swaSecrets,
      generatedAt,
      // Modern hosting config for secrets guide
      vercelProjectId: modernHosting.vercelProjectId ?? '',
      netlifySiteId: modernHosting.netlifySiteId ?? '',
      firebaseProjectId: modernHosting.firebaseProjectId ?? '',
      ghPagesBranch: modernHosting.ghPagesBranch ?? 'gh-pages',
      cloudflarePagesProject: modernHosting.cloudflarePagesProject ?? '',
    };

    const content = renderTemplate('github-actions/secrets-guide.md.hbs', context);

    return {
      name: 'SECRETS_GUIDE.md',
      path: `${mfe}-pipelines/`,
      type: 'readme' as const,
      content,
    };
  }
}
