/**
 * combination.service.ts
 *
 * Pure function that derives the full set of pipeline combinations from a
 * GeneratorConfig.  Ported 1-to-1 from the frontend's
 * `GeneratorStateService.pipelineCombinations` computed signal
 * (generator-state.service.ts lines 99-141).
 *
 * No class — this is stateless logic that takes config and returns data.
 */

import type { GeneratorConfig, PipelineCombination } from '../models/generator-config.model.js';

/**
 * Maps the canonical market name used in the wizard to the abbreviated form
 * used in pipeline names.
 *
 * Must stay in sync with the frontend's marketCode derivation logic.
 */
const MARKET_NAME_REPLACEMENTS: ReadonlyArray<[string, string]> = [
  ['KSA', 'SAUDI'],
  ['BAHRAIN', 'BH'],
];

/**
 * Applies the pipeline-name abbreviation rules to a raw market name.
 *
 * @param name - The market name as stored in the Market record (e.g. "KSA").
 * @returns The abbreviated form used in pipeline names (e.g. "SAUDI").
 */
function toPipelineMarketCode(name: string): string {
  let code = name.toUpperCase();
  for (const [from, to] of MARKET_NAME_REPLACEMENTS) {
    code = code.replace(from, to);
  }
  return code;
}

/**
 * Computes the full list of pipeline combinations for the given configuration.
 *
 * Iterates every enabled market × configured environment × language (when in
 * multi-language mode) and assembles the derived fields (pipelineName,
 * artifactAlias, deploymentPath, buildScript, branchName) following the same
 * naming conventions as the frontend wizard.
 *
 * @param config - The validated GeneratorConfig sent by the client.
 * @returns An ordered array of PipelineCombination objects, one per pipeline file.
 *
 * @example
 * ```typescript
 * const combinations = computePipelineCombinations(config);
 * // [{ pipelineName: 'QA-SAUDI-SHOPPINGBAG-EN', ... }, ...]
 * ```
 */
export function computePipelineCombinations(config: GeneratorConfig): PipelineCombination[] {
  const combinations: PipelineCombination[] = [];
  const projectName = config.projectName.toUpperCase();
  const isMulti = config.isMultiLanguage;
  const enabledMarkets = config.markets.filter((m) => m.enabled);

  for (const market of enabledMarkets) {
    const marketCode = toPipelineMarketCode(market.name);

    for (const env of config.environments) {
      const branchName = env === 'QA' ? config.qaBranch : config.productionBranch;

      if (isMulti) {
        for (const lang of config.languages) {
          const pipelineName = `${env}-${marketCode}-${projectName}-${lang.name}`;
          combinations.push({
            market,
            environment: env,
            language: lang,
            pipelineName,
            artifactAlias: `_${pipelineName}`,
            deploymentPath: `${market.code}/${lang.code}/${config.projectName.toLowerCase()}`,
            buildScript: config.buildScripts[`${market.code}-${env}-${lang.code}`] ?? '',
            branchName,
          });
        }
      } else {
        const pipelineName = `${env}-${marketCode}-${projectName}`;
        combinations.push({
          market,
          environment: env,
          pipelineName,
          artifactAlias: `_${pipelineName}`,
          deploymentPath: `${market.code}/${config.projectName.toLowerCase()}`,
          buildScript: config.buildScripts[`${market.code}-${env}`] ?? '',
          branchName,
        });
      }
    }
  }

  return combinations;
}
