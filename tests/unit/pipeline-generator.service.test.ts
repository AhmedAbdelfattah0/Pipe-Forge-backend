/**
 * pipeline-generator.service.test.ts
 *
 * Unit tests for `PipelineGeneratorService.generate`.
 *
 * `template.service` is mocked so that tests do not hit the filesystem.
 * Each mock template returns a deterministic string that encodes the
 * template name so assertions can verify the right template was chosen.
 */

// Mock template.service before any imports that transitively require it.
jest.mock('../../src/features/pipelines/services/template.service', () => ({
  renderTemplate: jest.fn((templateName: string, _context: unknown): string => {
    return `RENDERED:${templateName}`;
  }),
  listLoadedTemplates: jest.fn(() => [
    'build-pipeline.yaml.hbs',
    'build-pipeline.json.hbs',
    'release-storage.json.hbs',
    'release-swa.json.hbs',
    'release-app-service.json.hbs',
    'readme.md.hbs',
  ]),
}));

import { PipelineGeneratorService } from '../../src/features/pipelines/services/pipeline-generator.service';
import type { RenderedFile } from '../../src/features/pipelines/services/pipeline-generator.service';
import type { GeneratorConfig } from '../../src/features/pipelines/models/generator-config.model';
import { validConfig, validMultiLangConfig } from '../fixtures/valid-config';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildConfig(overrides: Partial<GeneratorConfig>): GeneratorConfig {
  return { ...validConfig, ...overrides };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PipelineGeneratorService.generate', () => {
  let service: PipelineGeneratorService;

  beforeEach(() => {
    service = new PipelineGeneratorService();
    jest.clearAllMocks();
  });

  describe('YAML only output format', () => {
    it('produces build-yaml files and README when outputFormats is ["yaml"]', () => {
      const config = buildConfig({
        outputFormats: ['yaml'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);

      const buildYamlFiles = files.filter((f) => f.type === 'build-yaml');
      const readmeFiles = files.filter((f) => f.type === 'readme');

      expect(buildYamlFiles).toHaveLength(1);
      expect(readmeFiles).toHaveLength(1);
    });

    it('does not produce build-json or release-json files when format is yaml only', () => {
      const config = buildConfig({
        outputFormats: ['yaml'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);

      const jsonFiles = files.filter(
        (f) => f.type === 'build-json' || f.type === 'release-json',
      );
      expect(jsonFiles).toHaveLength(0);
    });
  });

  describe('classic-json only output format', () => {
    it('produces build-json and release-json files and README when outputFormats is ["classic-json"]', () => {
      const config = buildConfig({
        outputFormats: ['classic-json'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);

      const buildJsonFiles = files.filter((f) => f.type === 'build-json');
      const releaseJsonFiles = files.filter((f) => f.type === 'release-json');
      const readmeFiles = files.filter((f) => f.type === 'readme');

      expect(buildJsonFiles).toHaveLength(1);
      expect(releaseJsonFiles).toHaveLength(1);
      expect(readmeFiles).toHaveLength(1);
    });

    it('does not produce build-yaml files when format is classic-json only', () => {
      const config = buildConfig({
        outputFormats: ['classic-json'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);

      const yamlFiles = files.filter((f) => f.type === 'build-yaml');
      expect(yamlFiles).toHaveLength(0);
    });
  });

  describe('both output formats', () => {
    it('produces build-yaml, build-json, and release-json per combination plus one README', () => {
      const config = buildConfig({
        outputFormats: ['yaml', 'classic-json'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);

      expect(files.filter((f) => f.type === 'build-yaml')).toHaveLength(1);
      expect(files.filter((f) => f.type === 'build-json')).toHaveLength(1);
      expect(files.filter((f) => f.type === 'release-json')).toHaveLength(1);
      expect(files.filter((f) => f.type === 'readme')).toHaveLength(1);
    });

    it('total file count is (combinations × 3) + 1 readme for both formats', () => {
      // 2 markets × 2 environments = 4 combinations, 3 files each + 1 readme = 13
      const config = buildConfig({
        outputFormats: ['yaml', 'classic-json'],
        markets: [
          { name: 'KSA', code: 'sa', enabled: true },
          { name: 'UAE', code: 'ae', enabled: true },
        ],
        environments: ['QA', 'PROD'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);

      expect(files).toHaveLength(4 * 3 + 1);
    });
  });

  describe('file paths include projectName', () => {
    it('places files in a folder named {projectName}-pipelines/', () => {
      const config = buildConfig({
        projectName: 'checkout',
        outputFormats: ['yaml'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);

      files.forEach((file: RenderedFile) => {
        expect(file.path.startsWith('checkout-pipelines/')).toBe(true);
      });
    });

    it('build files are placed in {projectName}-pipelines/build/', () => {
      const config = buildConfig({
        projectName: 'checkout',
        outputFormats: ['yaml'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);
      const buildFiles = files.filter((f) => f.type === 'build-yaml');

      buildFiles.forEach((file) => {
        expect(file.path).toBe('checkout-pipelines/build/');
      });
    });

    it('release files are placed in {projectName}-pipelines/release/', () => {
      const config = buildConfig({
        projectName: 'checkout',
        outputFormats: ['classic-json'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);
      const releaseFiles = files.filter((f) => f.type === 'release-json');

      releaseFiles.forEach((file) => {
        expect(file.path).toBe('checkout-pipelines/release/');
      });
    });

    it('README is placed in {projectName}-pipelines/', () => {
      const config = buildConfig({
        projectName: 'checkout',
        outputFormats: ['yaml'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);
      const readme = files.find((f) => f.type === 'readme');

      expect(readme?.path).toBe('checkout-pipelines/');
    });
  });

  describe('README is generated exactly once per generation', () => {
    it('produces exactly one README file regardless of combination count', () => {
      const config = buildConfig({
        outputFormats: ['yaml'],
        markets: [
          { name: 'KSA', code: 'sa', enabled: true },
          { name: 'UAE', code: 'ae', enabled: true },
          { name: 'BAHRAIN', code: 'bh', enabled: true },
        ],
        environments: ['QA', 'PROD'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);
      const readmes = files.filter((f) => f.type === 'readme');

      expect(readmes).toHaveLength(1);
    });

    it('produces exactly one README even for multi-language configs', () => {
      const files = service.generate(validMultiLangConfig);
      const readmes = files.filter((f) => f.type === 'readme');

      expect(readmes).toHaveLength(1);
    });
  });

  describe('release template selection by deployTarget', () => {
    it('uses release-storage.json.hbs for storage-account deploy target', () => {
      const { renderTemplate } = jest.requireMock(
        '../../src/features/pipelines/services/template.service',
      ) as { renderTemplate: jest.Mock };

      const config = buildConfig({
        deployTarget: 'storage-account',
        outputFormats: ['classic-json'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      service.generate(config);

      const releaseCalls = renderTemplate.mock.calls.filter(
        (call: [string, unknown]) => call[0].startsWith('release-'),
      );
      expect(releaseCalls[0][0]).toBe('release-storage.json.hbs');
    });

    it('uses release-swa.json.hbs for static-web-app deploy target', () => {
      const { renderTemplate } = jest.requireMock(
        '../../src/features/pipelines/services/template.service',
      ) as { renderTemplate: jest.Mock };

      const config = buildConfig({
        deployTarget: 'static-web-app',
        outputFormats: ['classic-json'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      service.generate(config);

      const releaseCalls = renderTemplate.mock.calls.filter(
        (call: [string, unknown]) => call[0].startsWith('release-'),
      );
      expect(releaseCalls[0][0]).toBe('release-swa.json.hbs');
    });

    it('uses release-app-service.json.hbs for app-service deploy target', () => {
      const { renderTemplate } = jest.requireMock(
        '../../src/features/pipelines/services/template.service',
      ) as { renderTemplate: jest.Mock };

      const config = buildConfig({
        deployTarget: 'app-service',
        outputFormats: ['classic-json'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      service.generate(config);

      const releaseCalls = renderTemplate.mock.calls.filter(
        (call: [string, unknown]) => call[0].startsWith('release-'),
      );
      expect(releaseCalls[0][0]).toBe('release-appservice.json.hbs');
    });

    it('falls back to release-storage.json.hbs when deployTarget is null', () => {
      const { renderTemplate } = jest.requireMock(
        '../../src/features/pipelines/services/template.service',
      ) as { renderTemplate: jest.Mock };

      const config = buildConfig({
        deployTarget: null,
        outputFormats: ['classic-json'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      service.generate(config);

      const releaseCalls = renderTemplate.mock.calls.filter(
        (call: [string, unknown]) => call[0].startsWith('release-'),
      );
      expect(releaseCalls[0][0]).toBe('release-storage.json.hbs');
    });
  });

  describe('file count matches expected formula', () => {
    it('yaml only: count = combinations + 1 readme', () => {
      // 2 markets × 2 envs = 4 combinations
      const config = buildConfig({
        outputFormats: ['yaml'],
        markets: [
          { name: 'KSA', code: 'sa', enabled: true },
          { name: 'UAE', code: 'ae', enabled: true },
        ],
        environments: ['QA', 'PROD'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);

      // 4 build-yaml + 1 readme
      expect(files).toHaveLength(5);
    });

    it('classic-json only: count = (combinations × 2) + 1 readme', () => {
      // 1 market × 1 env = 1 combination → 2 json files + 1 readme
      const config = buildConfig({
        outputFormats: ['classic-json'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);

      expect(files).toHaveLength(3);
    });

    it('multi-language both formats: count = (combinations × 3) + 1 readme', () => {
      // 2 markets × 2 envs × 2 langs = 8 combinations → 24 files + 1 readme
      const config = buildConfig({
        ...validMultiLangConfig,
        outputFormats: ['yaml', 'classic-json'],
        markets: [
          { name: 'KSA', code: 'sa', enabled: true },
          { name: 'UAE', code: 'ae', enabled: true },
        ],
        environments: ['QA', 'PROD'],
      });

      const files = service.generate(config);

      expect(files).toHaveLength(8 * 3 + 1);
    });
  });

  describe('file names', () => {
    it('yaml file has .yml extension named after the pipelineName', () => {
      const config = buildConfig({
        projectName: 'shoppingbag',
        outputFormats: ['yaml'],
        markets: [{ name: 'KSA', code: 'sa', enabled: true }],
        environments: ['QA'],
        isMultiLanguage: false,
      });

      const files = service.generate(config);
      const yamlFile = files.find((f) => f.type === 'build-yaml');

      expect(yamlFile?.name).toBe('QA-SAUDI-SHOPPINGBAG.yml');
    });

    it('README is always named README.md', () => {
      const files = service.generate(validConfig);
      const readme = files.find((f) => f.type === 'readme');

      expect(readme?.name).toBe('README.md');
    });
  });
});
