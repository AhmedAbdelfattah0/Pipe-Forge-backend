/**
 * pipeline-generator.service.ts
 *
 * Orchestrates the full pipeline generation flow:
 *  1. Compute pipeline combinations from the GeneratorConfig.
 *  2. For each combination × output format, render the appropriate templates.
 *  3. Always append a README.
 *  4. Return an array of rendered files (metadata + content).
 */

import type { GeneratorConfig, GeneratedFile, PipelineCombination } from '../models/generator-config.model.js';
import type { BuildTemplateContext, ReleaseTemplateContext, ReadmeTemplateContext } from '../models/template-context.model.js';
import { computePipelineCombinations } from './combination.service.js';
import { renderTemplate } from './template.service.js';

// ─── Extended output type ─────────────────────────────────────────────────────

/** A GeneratedFile enriched with its rendered template content. */
export type RenderedFile = GeneratedFile & { content: string };

// ─── Release template name mapping ───────────────────────────────────────────

/**
 * Maps a deploy-target value to the release `.hbs` template file name.
 * Extend this map when new deploy-target strategies are supported.
 */
const RELEASE_TEMPLATE_MAP: Readonly<Record<string, string>> = {
  'storage-account': 'release-storage.json.hbs',
  'static-web-app': 'release-swa.json.hbs',
  'app-service': 'release-appservice.json.hbs',
};

// ─── Service class ────────────────────────────────────────────────────────────

/**
 * Stateless service that produces an array of {@link RenderedFile} objects
 * from a {@link GeneratorConfig}.
 *
 * All rendering is synchronous (Handlebars templates are pre-compiled).
 * The service holds no instance state — every call to `generate` is
 * independent and thread-safe.
 */
export class PipelineGeneratorService {
  /**
   * Generates all pipeline files described by `config`.
   *
   * Processing order:
   *  - For each combination × format:
   *      - `yaml` → one `build-pipeline.yaml.hbs` file (type: `build-yaml`)
   *      - `classic-json` → one `build-pipeline.json.hbs` (type: `build-json`)
   *                         + one release template (type: `release-json`)
   *  - After all combinations: one `readme.md.hbs` (type: `readme`)
   *
   * @param config - The validated generator configuration from the client.
   * @returns An ordered array of rendered pipeline files ready for ZIP assembly.
   *
   * @example
   * ```typescript
   * const service = new PipelineGeneratorService();
   * const files = service.generate(config);
   * // files[0] → { name: 'QA-SAUDI-SHOPPINGBAG-EN.yml', path: 'my-app-pipelines/build/', type: 'build-yaml', content: '...' }
   * ```
   */
  generate(config: GeneratorConfig): RenderedFile[] {
    const combinations = computePipelineCombinations(config);
    const generatedAt = new Date().toISOString();
    const mfe = config.mfeName || 'my-app';
    const files: RenderedFile[] = [];

    for (const combination of combinations) {
      if (config.outputFormats.includes('yaml')) {
        files.push(this.renderBuildYaml(combination, config, mfe));
      }

      if (config.outputFormats.includes('classic-json')) {
        files.push(this.renderBuildJson(combination, config, mfe));
        files.push(this.renderReleaseJson(combination, config, mfe, generatedAt));
      }
    }

    // README is always produced once per generation.
    files.push(this.renderReadme(config, combinations, files, mfe, generatedAt));

    return files;
  }

  // ─── Private render helpers ───────────────────────────────────────────────

  /**
   * Renders the YAML build pipeline for a single combination.
   *
   * @param combination - The resolved pipeline variant.
   * @param config - The full generator configuration.
   * @param mfe - Lowercase MFE name used to derive the ZIP folder.
   * @returns A RenderedFile with type `build-yaml`.
   */
  private renderBuildYaml(
    combination: PipelineCombination,
    config: GeneratorConfig,
    mfe: string,
  ): RenderedFile {
    const context: BuildTemplateContext = { combination, config };
    const content = renderTemplate('build-pipeline.yaml.hbs', context);

    return {
      name: `${combination.pipelineName}.yml`,
      path: `${mfe}-pipelines/build/`,
      type: 'build-yaml',
      content,
    };
  }

  /**
   * Renders the Classic JSON build pipeline for a single combination.
   *
   * @param combination - The resolved pipeline variant.
   * @param config - The full generator configuration.
   * @param mfe - Lowercase MFE name used to derive the ZIP folder.
   * @returns A RenderedFile with type `build-json`.
   */
  private renderBuildJson(
    combination: PipelineCombination,
    config: GeneratorConfig,
    mfe: string,
  ): RenderedFile {
    const context: BuildTemplateContext = { combination, config };
    const content = renderTemplate('build-pipeline.json.hbs', context);

    return {
      name: `${combination.pipelineName}.json`,
      path: `${mfe}-pipelines/build/`,
      type: 'build-json',
      content,
    };
  }

  /**
   * Renders the Classic JSON release pipeline for a single combination.
   *
   * The template is chosen based on `config.deployTarget`.  Each release
   * template receives the combination, config, the resolved deploy-target
   * resource name, and the generation timestamp.
   *
   * @param combination - The resolved pipeline variant.
   * @param config - The full generator configuration.
   * @param mfe - Lowercase MFE name used to derive the ZIP folder.
   * @param generatedAt - ISO 8601 generation timestamp.
   * @returns A RenderedFile with type `release-json`.
   */
  private renderReleaseJson(
    combination: PipelineCombination,
    config: GeneratorConfig,
    mfe: string,
    generatedAt: string,
  ): RenderedFile {
    const deployTarget = config.deployTarget ?? 'storage-account';
    const templateName = RELEASE_TEMPLATE_MAP[deployTarget] ?? 'release-storage.json.hbs';

    // Resolve the deploy-target-specific resource name for the combination key.
    const resourceKey = `${combination.market.code}-${combination.environment}`;
    const storageAccountName = config.storageAccounts[resourceKey] ?? '';
    const swaToken = config.swaTokens[resourceKey] ?? '';
    const appServiceName = config.appServiceNames[resourceKey] ?? '';

    const context: ReleaseTemplateContext & {
      generatedAt: string;
      storageAccountName: string;
      swaToken: string;
      appServiceName: string;
    } = {
      combination,
      config,
      generatedAt,
      storageAccountName,
      swaToken,
      appServiceName,
    };

    const content = renderTemplate(templateName, context);

    return {
      name: `${combination.pipelineName}.json`,
      path: `${mfe}-pipelines/release/`,
      type: 'release-json',
      content,
    };
  }

  /**
   * Renders the README summary file.
   *
   * The README is always produced once regardless of format selection.
   * It receives the full list of combinations and file metadata so the
   * template can produce a human-readable index of what was generated.
   *
   * @param config - The full generator configuration.
   * @param combinations - All computed pipeline combinations.
   * @param generatedFiles - The pipeline files already rendered (without README itself).
   * @param mfe - Lowercase MFE name used to derive the ZIP folder.
   * @param generatedAt - ISO 8601 generation timestamp.
   * @returns A RenderedFile with type `readme`.
   */
  private renderReadme(
    config: GeneratorConfig,
    combinations: PipelineCombination[],
    generatedFiles: RenderedFile[],
    mfe: string,
    generatedAt: string,
  ): RenderedFile {
    // Strip `content` before passing to template — template only needs metadata.
    const fileMetadata: GeneratedFile[] = generatedFiles.map(({ name, path, type }) => ({
      name,
      path,
      type,
    }));

    const context: ReadmeTemplateContext = {
      config,
      combinations,
      generatedFiles: fileMetadata,
      generatedAt,
    };

    const content = renderTemplate('readme.md.hbs', context);

    return {
      name: 'README.md',
      path: `${mfe}-pipelines/`,
      type: 'readme',
      content,
    };
  }
}
