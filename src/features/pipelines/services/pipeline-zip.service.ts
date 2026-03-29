/**
 * pipeline-zip.service.ts
 *
 * Assembles a ZIP archive from an array of rendered pipeline files using JSZip.
 *
 * Folder structure inside the ZIP:
 *   {projectName}-pipelines/
 *     build/
 *       *.yml
 *       *.json
 *     release/
 *       *.json
 *     README.md
 *
 * The `path` field on each file already encodes the correct subdirectory
 * (e.g. `"my-app-pipelines/build/"`) so this service simply concatenates
 * `path + name` as the ZIP entry key.
 */

import JSZip from 'jszip';

// ─── Input type ───────────────────────────────────────────────────────────────

/** Minimal shape required to place a file into the ZIP. */
export interface ZipEntry {
  /** File name, e.g. `"QA-SAUDI-SHOPPINGBAG-EN.yml"`. */
  name: string;
  /** Directory path within the ZIP, e.g. `"my-app-pipelines/build/"`. */
  path: string;
  /** Rendered file content as a UTF-8 string. */
  content: string;
}

// ─── Service class ────────────────────────────────────────────────────────────

/**
 * Stateless service that packs an array of {@link ZipEntry} objects into a
 * ZIP `Buffer` ready to be streamed to the client as a download.
 */
export class PipelineZipService {
  /**
   * Creates a ZIP archive containing all supplied files under the standard
   * `{projectName}-pipelines/` folder hierarchy.
   *
   * Each file is placed at `entry.path + entry.name` within the archive.
   * The `path` values produced by {@link PipelineGeneratorService} already
   * include the project-name prefix, so no additional path munging is needed.
   *
   * @param files - The array of rendered pipeline files to include.
   * @param projectName - The MFE / project name used as the root folder prefix.
   *   Only used to validate that the archive root matches expectations; the
   *   actual paths come from the `files` entries.
   * @returns A `Promise` that resolves to a `Buffer` containing the ZIP data.
   *
   * @example
   * ```typescript
   * const zipService = new PipelineZipService();
   * const buffer = await zipService.createZip(renderedFiles, 'shoppingbag');
   * res.set('Content-Type', 'application/zip');
   * res.set('Content-Disposition', 'attachment; filename="shoppingbag-pipelines.zip"');
   * res.send(buffer);
   * ```
   */
  async createZip(files: ZipEntry[], projectName: string): Promise<Buffer> {
    const zip = new JSZip();

    // Ensure the canonical root folder exists even if `files` is empty.
    const rootFolder = `${projectName}-pipelines`;
    zip.folder(`${rootFolder}/build`);
    zip.folder(`${rootFolder}/release`);

    for (const file of files) {
      const zipPath = `${file.path}${file.name}`;
      zip.file(zipPath, file.content);
    }

    const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    return buffer;
  }
}
