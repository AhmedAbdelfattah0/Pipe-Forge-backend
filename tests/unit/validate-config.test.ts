/**
 * validate-config.test.ts
 *
 * Unit tests for `GeneratorConfigSchema` Zod validation.
 *
 * Tests exercise the schema directly (not the Express middleware) so there is
 * no HTTP layer to mock.
 */

import { GeneratorConfigSchema } from '../../src/features/pipelines/middleware/validate-config.middleware';
import { validConfig } from '../fixtures/valid-config';
import type { GeneratorConfig } from '../../src/features/pipelines/models/generator-config.model';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns a deep clone of `validConfig` with the supplied overrides applied.
 * Using `structuredClone` avoids object-mutation bugs across tests.
 */
function buildPayload(overrides: Partial<Record<string, unknown>> = {}): unknown {
  return { ...(structuredClone(validConfig as unknown) as Record<string, unknown>), ...overrides };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('GeneratorConfigSchema', () => {
  describe('valid configuration', () => {
    it('passes for a complete, valid config', () => {
      const result = GeneratorConfigSchema.safeParse(validConfig);

      expect(result.success).toBe(true);
    });

    it('accepts all three valid nodeVersion values', () => {
      for (const version of ['18.x', '20.x', '22.x'] as const) {
        const result = GeneratorConfigSchema.safeParse(
          buildPayload({ nodeVersion: version }),
        );
        expect(result.success).toBe(true);
      }
    });

    it('accepts deployTarget as null', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ deployTarget: null }),
      );
      expect(result.success).toBe(true);
    });

    it('accepts all valid deployTarget values', () => {
      const targets = ['storage-account', 'static-web-app', 'app-service'];
      for (const target of targets) {
        const result = GeneratorConfigSchema.safeParse(
          buildPayload({ deployTarget: target }),
        );
        expect(result.success).toBe(true);
      }
    });

    it('accepts both valid outputFormat values together', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ outputFormats: ['yaml', 'classic-json'] }),
      );
      expect(result.success).toBe(true);
    });
  });

  describe('mfeName validation', () => {
    it('fails when mfeName is missing', () => {
      const payload = buildPayload() as Partial<GeneratorConfig>;
      delete (payload as Record<string, unknown>)['mfeName'];

      const result = GeneratorConfigSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });

    it('fails when mfeName is an empty string', () => {
      const result = GeneratorConfigSchema.safeParse(buildPayload({ mfeName: '' }));

      expect(result.success).toBe(false);
    });

    it('fails when mfeName exceeds 100 characters', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ mfeName: 'a'.repeat(101) }),
      );

      expect(result.success).toBe(false);
    });

    it('accepts mfeName of exactly 100 characters', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ mfeName: 'a'.repeat(100) }),
      );

      expect(result.success).toBe(true);
    });

    it('accepts mfeName with spaces', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ mfeName: 'my app' }),
      );

      expect(result.success).toBe(true);
    });

    it('fails when mfeName contains special chars like @', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ mfeName: 'my@app' }),
      );

      expect(result.success).toBe(false);
    });

    it('accepts mfeName with hyphens and underscores', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ mfeName: 'my-app_v2' }),
      );

      expect(result.success).toBe(true);
    });
  });

  describe('markets validation', () => {
    it('fails when markets array is empty', () => {
      const result = GeneratorConfigSchema.safeParse(buildPayload({ markets: [] }));

      expect(result.success).toBe(false);
    });

    it('fails when no markets are enabled', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({
          markets: [
            { name: 'KSA', code: 'sa', enabled: false },
            { name: 'UAE', code: 'ae', enabled: false },
          ],
        }),
      );

      expect(result.success).toBe(false);
    });

    it('fails when a market is missing a required field (name)', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({
          markets: [{ code: 'sa', enabled: true }],
        }),
      );

      expect(result.success).toBe(false);
    });

    it('passes when at least one market is enabled', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({
          markets: [
            { name: 'KSA', code: 'sa', enabled: false },
            { name: 'UAE', code: 'ae', enabled: true },
          ],
        }),
      );

      expect(result.success).toBe(true);
    });
  });

  describe('environments validation', () => {
    it('fails when environments array is empty', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ environments: [] }),
      );

      expect(result.success).toBe(false);
    });

    it('fails when environments contains an invalid value', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ environments: ['STAGING'] }),
      );

      expect(result.success).toBe(false);
    });

    it('accepts ["QA"] as a valid single-environment array', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ environments: ['QA'] }),
      );

      expect(result.success).toBe(true);
    });
  });

  describe('deployTarget validation', () => {
    it('fails when deployTarget is an unrecognised string', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ deployTarget: 'kubernetes' }),
      );

      expect(result.success).toBe(false);
    });
  });

  describe('outputFormats validation', () => {
    it('fails when outputFormats array is empty', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ outputFormats: [] }),
      );

      expect(result.success).toBe(false);
    });

    it('fails when outputFormats contains an invalid value', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ outputFormats: ['xml'] }),
      );

      expect(result.success).toBe(false);
    });
  });

  describe('buildScripts record size limit', () => {
    it('fails when buildScripts has more than 100 keys', () => {
      const bigMatrix: Record<string, string> = {};
      for (let i = 0; i <= 100; i++) {
        bigMatrix[`key-${i}`] = `script-${i}`;
      }

      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ buildScripts: bigMatrix }),
      );

      expect(result.success).toBe(false);
    });

    it('passes when buildScripts has exactly 100 keys', () => {
      const maxMatrix: Record<string, string> = {};
      for (let i = 0; i < 100; i++) {
        maxMatrix[`key-${i}`] = `script-${i}`;
      }

      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ buildScripts: maxMatrix }),
      );

      expect(result.success).toBe(true);
    });
  });

  describe('storageAccounts record size limit', () => {
    it('fails when storageAccounts has more than 100 keys', () => {
      const bigMap: Record<string, string> = {};
      for (let i = 0; i <= 100; i++) {
        bigMap[`key-${i}`] = `storage-${i}`;
      }

      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ storageAccounts: bigMap }),
      );

      expect(result.success).toBe(false);
    });
  });

  describe('nodeVersion validation', () => {
    it('fails when nodeVersion is not one of the allowed values', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ nodeVersion: '16.x' }),
      );

      expect(result.success).toBe(false);
    });
  });

  describe('Zod error structure', () => {
    it('returns issues array on failure', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ mfeName: '' }),
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(Array.isArray(result.error.issues)).toBe(true);
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('includes the field path in the issue for a nested field error', () => {
      const result = GeneratorConfigSchema.safeParse(
        buildPayload({ markets: [] }),
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path.join('.'));
        expect(paths.some((p) => p.includes('markets'))).toBe(true);
      }
    });
  });
});
