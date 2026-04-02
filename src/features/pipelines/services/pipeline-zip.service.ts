/**
 * pipeline-zip.service.ts
 *
 * Assembles a ZIP archive from an array of rendered pipeline files using JSZip.
 * Returns ArrayBuffer instead of Buffer for Cloudflare Workers compatibility.
 *
 * Folder structure inside the ZIP:
 *   {projectName}-pipelines/
 *     build/
 *       *.yml
 *       *.json
 *     release/
 *       *.json
 *     README.md
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
 * ZIP `ArrayBuffer` ready to be returned as a Response body.
 */
export class PipelineZipService {
  async createZip(files: ZipEntry[], projectName: string): Promise<ArrayBuffer> {
    const zip = new JSZip();
    // Sanitise project name to prevent path traversal in ZIP entry names.
    const safeName = projectName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const rootFolder = `${safeName}-pipelines`;
    zip.folder(`${rootFolder}/build`);
    zip.folder(`${rootFolder}/release`);

    for (const file of files) {
      // Defense-in-depth: reject any path containing traversal sequences.
      const fullPath = `${file.path}${file.name}`;
      if (fullPath.includes('..') || fullPath.startsWith('/')) {
        throw new Error(`Invalid ZIP entry path: ${fullPath}`);
      }
      zip.file(fullPath, file.content);
    }

    return zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE' });
  }
}
