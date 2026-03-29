/**
 * combination.service.test.ts
 *
 * Unit tests for `computePipelineCombinations`.
 */

import { computePipelineCombinations } from '../../src/features/pipelines/services/combination.service';
import type { GeneratorConfig, Market, Language } from '../../src/features/pipelines/models/generator-config.model';
import { validConfig, validMultiLangConfig } from '../fixtures/valid-config';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildConfig(overrides: Partial<GeneratorConfig>): GeneratorConfig {
  return { ...validConfig, ...overrides };
}

const singleMarket: Market[] = [{ name: 'KSA', code: 'sa', enabled: true }];
const twoMarkets: Market[] = [
  { name: 'KSA', code: 'sa', enabled: true },
  { name: 'UAE', code: 'ae', enabled: true },
];
const twoLanguages: Language[] = [
  { name: 'EN', code: 'en' },
  { name: 'AR', code: 'ar' },
];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('computePipelineCombinations', () => {
  describe('combination count', () => {
    it('produces 1 combination for single market, single environment, single-language mode', () => {
      const config = buildConfig({
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
        languages: [],
      });

      const result = computePipelineCombinations(config);

      expect(result).toHaveLength(1);
    });

    it('produces 4 combinations for two markets × two environments in single-language mode', () => {
      const config = buildConfig({
        markets: twoMarkets,
        environments: ['QA', 'PROD'],
        isMultiLanguage: false,
        languages: [],
      });

      const result = computePipelineCombinations(config);

      expect(result).toHaveLength(4);
    });

    it('doubles combinations when multi-language mode has 2 languages', () => {
      const config = buildConfig({
        markets: singleMarket,
        environments: ['QA', 'PROD'],
        isMultiLanguage: true,
        languages: twoLanguages,
        buildScripts: {},
      });

      const result = computePipelineCombinations(config);

      // 1 market × 2 envs × 2 langs = 4
      expect(result).toHaveLength(4);
    });

    it('returns an empty array when no markets are defined', () => {
      const config = buildConfig({ markets: [], isMultiLanguage: false });

      const result = computePipelineCombinations(config);

      expect(result).toHaveLength(0);
    });

    it('returns an empty array when all markets are disabled', () => {
      const config = buildConfig({
        markets: [
          { name: 'KSA', code: 'sa', enabled: false },
          { name: 'UAE', code: 'ae', enabled: false },
        ],
        isMultiLanguage: false,
      });

      const result = computePipelineCombinations(config);

      expect(result).toHaveLength(0);
    });

    it('skips disabled markets and only generates combinations for enabled ones', () => {
      const config = buildConfig({
        markets: [
          { name: 'KSA', code: 'sa', enabled: true },
          { name: 'UAE', code: 'ae', enabled: false },
        ],
        environments: ['QA', 'PROD'],
        isMultiLanguage: false,
      });

      const result = computePipelineCombinations(config);

      expect(result).toHaveLength(2);
      result.forEach((c) => expect(c.market.code).toBe('sa'));
    });
  });

  describe('pipeline naming — {ENV}-{MARKET}-{MFE} pattern', () => {
    it('formats single-language pipeline name as ENV-MARKET-MFE', () => {
      const config = buildConfig({
        mfeName: 'shoppingbag',
        markets: [{ name: 'UAE', code: 'ae', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.pipelineName).toBe('QA-UAE-SHOPPINGBAG');
    });

    it('formats multi-language pipeline name as ENV-MARKET-MFE-LANG', () => {
      const config = buildConfig({
        mfeName: 'checkout',
        markets: [{ name: 'UAE', code: 'ae', enabled: true }],
        environments: ['PROD'],
        isMultiLanguage: true,
        languages: [{ name: 'EN', code: 'en' }],
        buildScripts: {},
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.pipelineName).toBe('PROD-UAE-CHECKOUT-EN');
    });

    it('uppercases the mfeName in the pipeline name regardless of input case', () => {
      const config = buildConfig({
        mfeName: 'my-app',
        markets: [{ name: 'UAE', code: 'ae', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.pipelineName).toContain('MY-APP');
    });
  });

  describe('market name mapping', () => {
    it('maps KSA → SAUDI in the pipeline name', () => {
      const config = buildConfig({
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.pipelineName).toContain('SAUDI');
      expect(combination.pipelineName).not.toContain('KSA');
    });

    it('maps BAHRAIN → BH in the pipeline name', () => {
      const config = buildConfig({
        markets: [{ name: 'BAHRAIN', code: 'bh', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.pipelineName).toContain('BH');
      expect(combination.pipelineName).not.toContain('BAHRAIN');
    });

    it('leaves UAE unchanged since it has no replacement rule', () => {
      const config = buildConfig({
        markets: [{ name: 'UAE', code: 'ae', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.pipelineName).toContain('UAE');
    });
  });

  describe('artifactAlias', () => {
    it('prefixes pipelineName with underscore', () => {
      const config = buildConfig({
        markets: [{ name: 'UAE', code: 'ae', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.artifactAlias).toBe(`_${combination.pipelineName}`);
    });

    it('artifact alias starts with underscore for every combination', () => {
      const combinations = computePipelineCombinations(validMultiLangConfig);

      combinations.forEach((c) => {
        expect(c.artifactAlias.startsWith('_')).toBe(true);
      });
    });
  });

  describe('deploymentPath', () => {
    it('uses {marketCode}/{mfeName} format in single-language mode', () => {
      const config = buildConfig({
        mfeName: 'shoppingbag',
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.deploymentPath).toBe('sa/shoppingbag');
    });

    it('uses {marketCode}/{langCode}/{mfeName} format in multi-language mode', () => {
      const config = buildConfig({
        mfeName: 'shoppingbag',
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: true,
        languages: [{ name: 'EN', code: 'en' }],
        buildScripts: {},
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.deploymentPath).toBe('sa/en/shoppingbag');
    });

    it('uses lowercase mfeName in deploymentPath even if mfeName was provided in mixed case', () => {
      const config = buildConfig({
        mfeName: 'ShoppingBag',
        markets: [{ name: 'UAE', code: 'ae', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.deploymentPath).toBe('ae/shoppingbag');
    });
  });

  describe('buildScript lookup', () => {
    it('looks up the correct script key for single-language mode: {marketCode}-{env}', () => {
      const config = buildConfig({
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
        buildScripts: { 'sa-QA': 'ksaqa-script' },
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.buildScript).toBe('ksaqa-script');
    });

    it('looks up the correct script key for multi-language mode: {marketCode}-{env}-{langCode}', () => {
      const config = buildConfig({
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: true,
        languages: [{ name: 'AR', code: 'ar' }],
        buildScripts: { 'sa-QA-ar': 'ksaqa-ar-script' },
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.buildScript).toBe('ksaqa-ar-script');
    });

    it('returns empty string when buildScript key is not present', () => {
      const config = buildConfig({
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['PROD'],
        isMultiLanguage: false,
        buildScripts: {},
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.buildScript).toBe('');
    });
  });

  describe('branchName', () => {
    it('uses qaBranch for QA environment', () => {
      const config = buildConfig({
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
        qaBranch: 'develop',
        productionBranch: 'main',
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.branchName).toBe('develop');
    });

    it('uses productionBranch for PROD environment', () => {
      const config = buildConfig({
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['PROD'],
        isMultiLanguage: false,
        qaBranch: 'develop',
        productionBranch: 'main',
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.branchName).toBe('main');
    });

    it('assigns correct branches when both QA and PROD environments are present', () => {
      const config = buildConfig({
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA', 'PROD'],
        isMultiLanguage: false,
        qaBranch: 'develop',
        productionBranch: 'main',
      });

      const combinations = computePipelineCombinations(config);
      const qa = combinations.find((c) => c.environment === 'QA');
      const prod = combinations.find((c) => c.environment === 'PROD');

      expect(qa?.branchName).toBe('develop');
      expect(prod?.branchName).toBe('main');
    });
  });

  describe('language field', () => {
    it('sets language field in multi-language mode', () => {
      const config = buildConfig({
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: true,
        languages: [{ name: 'EN', code: 'en' }],
        buildScripts: {},
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.language).toEqual({ name: 'EN', code: 'en' });
    });

    it('leaves language field undefined in single-language mode', () => {
      const config = buildConfig({
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
        languages: [],
      });

      const [combination] = computePipelineCombinations(config);

      expect(combination.language).toBeUndefined();
    });
  });
});
