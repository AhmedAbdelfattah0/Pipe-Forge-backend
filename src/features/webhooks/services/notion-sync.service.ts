/**
 * notion-sync.service.ts
 *
 * Orchestrates the Notion → Google Drive sync pipeline:
 *   1. Fetch the updated page and its blocks from Notion
 *   2. Convert blocks to clean Markdown
 *   3. Upload/replace the file in Google Drive
 */

import { fetchNotionPage, fetchNotionBlocks } from './notion-api.js';
import { notionToMarkdown } from './notion-to-markdown.js';
import { uploadToDrive } from './google-drive.js';

/**
 * Credentials and config needed for one sync run.
 */
export interface SyncConfig {
  readonly notionApiKey: string;
  readonly googleServiceAccountJson: string;
  readonly googleDriveFolderId: string;
}

/**
 * Fetch the given Notion page, convert to Markdown, and upload to Drive.
 *
 * @param pageId - Notion page UUID to sync
 * @param config - API keys and Drive folder ID
 */
export async function syncNotionPageToDrive(
  pageId: string,
  config: SyncConfig,
): Promise<void> {
  console.log(`[notion-sync] Starting sync for page ${pageId}`);

  // 1. Fetch page metadata (title) and all content blocks
  const [page, blocks] = await Promise.all([
    fetchNotionPage(pageId, config.notionApiKey),
    fetchNotionBlocks(pageId, config.notionApiKey),
  ]);

  // 2. Convert to Markdown
  const { markdown, filename } = notionToMarkdown(page, blocks);
  console.log(`[notion-sync] Converted page to ${filename} (${markdown.length} chars)`);

  // 3. Upload to Google Drive (create or replace)
  await uploadToDrive(
    filename,
    markdown,
    config.googleServiceAccountJson,
    config.googleDriveFolderId,
  );

  console.log(`[notion-sync] Sync complete for page ${pageId} → ${filename}`);
}
