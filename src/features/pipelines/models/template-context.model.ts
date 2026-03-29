/**
 * template-context.model.ts
 *
 * Typed context objects passed to each Handlebars template at render time.
 * Keeping these as explicit interfaces prevents `unknown` bleed-through into
 * templates and makes it trivial to catch shape mismatches at compile time.
 */

import type { GeneratorConfig, PipelineCombination, GeneratedFile } from './generator-config.model.js';

/**
 * Context passed to `build-pipeline.yaml.hbs`.
 * Contains a single combination alongside the full project config so that
 * the template can reference both per-combination values (branch, buildScript)
 * and global values (nodeVersion, installFlags, …).
 */
export interface BuildTemplateContext {
  /** The specific market/env/lang variant being rendered. */
  combination: PipelineCombination;
  /** The full wizard configuration snapshot. */
  config: GeneratorConfig;
}

/**
 * Context passed to `build-pipeline.json.hbs` (Classic release build definition).
 * Structurally identical to BuildTemplateContext — kept as a separate type
 * so that the release template can diverge without a breaking model change.
 */
export interface ReleaseTemplateContext {
  /** The specific market/env/lang variant being rendered. */
  combination: PipelineCombination;
  /** The full wizard configuration snapshot. */
  config: GeneratorConfig;
}

/**
 * Context passed to `readme.md.hbs`.
 * Provides the full set of generated combinations and the final file list so
 * that the README can summarise what was produced.
 */
export interface ReadmeTemplateContext {
  /** The full wizard configuration snapshot. */
  config: GeneratorConfig;
  /** Every pipeline combination that was generated. */
  combinations: PipelineCombination[];
  /** Metadata for every file included in the ZIP. */
  generatedFiles: GeneratedFile[];
  /** ISO 8601 timestamp of when the generation was performed. */
  generatedAt: string;
}
