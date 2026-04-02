/**
 * pipeline-zip.service.test.ts
 *
 * Unit tests for `PipelineZipService.createZip`.
 *
 * Uses JSZip to validate the produced archive without hitting the filesystem.
 */

import JSZip from 'jszip';
import { PipelineZipService } from '../../src/features/pipelines/services/pipeline-zip.service';
import type { ZipEntry } from '../../src/features/pipelines/services/pipeline-zip.service';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Builds a minimal set of ZipEntry objects for a given MFE name. */
function buildEntries(mfeName: string): ZipEntry[] {
  return [
    {
      name: `QA-SAUDI-${mfeName.toUpperCase()}.yml`,
      path: `${mfeName}-pipelines/build/`,
      content: 'trigger:\n  branches:\n    include:\n      - develop\n',
    },
    {
      name: `PROD-SAUDI-${mfeName.toUpperCase()}.yml`,
      path: `${mfeName}-pipelines/build/`,
      content: 'trigger:\n  branches:\n    include:\n      - main\n',
    },
    {
      name: 'README.md',
      path: `${mfeName}-pipelines/`,
      content: '# Pipeline README\n',
    },
  ];
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PipelineZipService.createZip', () => {
  let service: PipelineZipService;

  beforeEach(() => {
    service = new PipelineZipService();
  });

  describe('return type', () => {
    it('returns a Buffer', async () => {
      const entries = buildEntries('shoppingbag');
      const result = await service.createZip(entries, 'shoppingbag');

      expect(result).toBeInstanceOf(ArrayBuffer);
    });
  });

  describe('ZIP validity', () => {
    it('produced buffer starts with the PK ZIP magic bytes (0x50 0x4B)', async () => {
      const entries = buildEntries('shoppingbag');
      const buffer = await service.createZip(entries, 'shoppingbag');

      // ZIP local-file-header signature: PK\x03\x04 (or PK\x05\x06 for empty archive)
      const bytes = new Uint8Array(buffer);
      expect(bytes[0]).toBe(0x50); // 'P'
      expect(bytes[1]).toBe(0x4b); // 'K'
    });

    it('can be parsed by JSZip without throwing', async () => {
      const entries = buildEntries('checkout');
      const buffer = await service.createZip(entries, 'checkout');

      await expect(JSZip.loadAsync(buffer)).resolves.toBeDefined();
    });
  });

  describe('ZIP contents', () => {
    it('contains all supplied file entries at the correct paths', async () => {
      const mfeName = 'shoppingbag';
      const entries = buildEntries(mfeName);
      const buffer = await service.createZip(entries, mfeName);
      const zip = await JSZip.loadAsync(buffer);

      for (const entry of entries) {
        const zipPath = `${entry.path}${entry.name}`;
        expect(zip.file(zipPath)).not.toBeNull();
      }
    });

    it('file contents inside the ZIP match the original entry content', async () => {
      const mfeName = 'checkout';
      const entries = buildEntries(mfeName);
      const buffer = await service.createZip(entries, mfeName);
      const zip = await JSZip.loadAsync(buffer);

      for (const entry of entries) {
        const zipPath = `${entry.path}${entry.name}`;
        const zipFile = zip.file(zipPath);
        expect(zipFile).not.toBeNull();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const extractedContent = await zipFile!.async('string');
        expect(extractedContent).toBe(entry.content);
      }
    });

    it('contains the expected number of files', async () => {
      const mfeName = 'shoppingbag';
      const entries = buildEntries(mfeName);
      const buffer = await service.createZip(entries, mfeName);
      const zip = await JSZip.loadAsync(buffer);

      // JSZip includes folder entries; filter to actual files only
      const fileEntries = Object.values(zip.files).filter((f) => !f.dir);
      expect(fileEntries).toHaveLength(entries.length);
    });
  });

  describe('canonical folder structure', () => {
    it('always creates {projectName}-pipelines/build/ folder even when files is empty', async () => {
      const buffer = await service.createZip([], 'shoppingbag');
      const zip = await JSZip.loadAsync(buffer);

      const folders = Object.keys(zip.files).filter(
        (name) => zip.files[name]!.dir,
      );

      expect(folders.some((f) => f.includes('shoppingbag-pipelines/build'))).toBe(true);
    });

    it('always creates {projectName}-pipelines/release/ folder even when files is empty', async () => {
      const buffer = await service.createZip([], 'shoppingbag');
      const zip = await JSZip.loadAsync(buffer);

      const folders = Object.keys(zip.files).filter(
        (name) => zip.files[name]!.dir,
      );

      expect(folders.some((f) => f.includes('shoppingbag-pipelines/release'))).toBe(true);
    });

    it('empty files array still produces a valid ZIP with correct magic bytes', async () => {
      const buffer = await service.createZip([], 'myapp');

      expect(buffer).toBeInstanceOf(ArrayBuffer);
      const bytes = new Uint8Array(buffer);
      expect(bytes[0]).toBe(0x50);
      expect(bytes[1]).toBe(0x4b);
    });
  });

  describe('multiple file types mixed', () => {
    it('places build files in the build/ subdirectory and release files in release/', async () => {
      const mfeName = 'payments';
      const mixedEntries: ZipEntry[] = [
        {
          name: 'QA-SAUDI-PAYMENTS.yml',
          path: `${mfeName}-pipelines/build/`,
          content: 'build yaml content',
        },
        {
          name: 'QA-SAUDI-PAYMENTS.json',
          path: `${mfeName}-pipelines/build/`,
          content: '{"type":"build"}',
        },
        {
          name: 'QA-SAUDI-PAYMENTS.json',
          path: `${mfeName}-pipelines/release/`,
          content: '{"type":"release"}',
        },
        {
          name: 'README.md',
          path: `${mfeName}-pipelines/`,
          content: '# README',
        },
      ];

      const buffer = await service.createZip(mixedEntries, mfeName);
      const zip = await JSZip.loadAsync(buffer);

      expect(zip.file(`${mfeName}-pipelines/build/QA-SAUDI-PAYMENTS.yml`)).not.toBeNull();
      expect(zip.file(`${mfeName}-pipelines/build/QA-SAUDI-PAYMENTS.json`)).not.toBeNull();
      expect(zip.file(`${mfeName}-pipelines/release/QA-SAUDI-PAYMENTS.json`)).not.toBeNull();
      expect(zip.file(`${mfeName}-pipelines/README.md`)).not.toBeNull();
    });
  });
});
