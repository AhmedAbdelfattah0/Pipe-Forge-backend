/**
 * notion-api.ts
 *
 * Thin wrapper around the Notion REST API using the global fetch API.
 * Compatible with Cloudflare Workers (no @notionhq/client which has Node dependencies).
 *
 * Docs: https://developers.notion.com/reference/intro
 */

import type { NotionBlock, NotionBlocksResponse, NotionPage } from '../models/notion.model.js';

const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

/**
 * Build common Notion API request headers.
 */
function notionHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
}

/**
 * Fetch a single Notion page by ID.
 *
 * @param pageId - The Notion page UUID (dashes optional)
 * @param apiKey - The Notion integration token
 * @returns The Notion page object
 * @throws Error if the API call fails
 */
export async function fetchNotionPage(
  pageId: string,
  apiKey: string,
): Promise<NotionPage> {
  const response = await fetch(`${NOTION_API_BASE}/pages/${pageId}`, {
    method: 'GET',
    headers: notionHeaders(apiKey),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Notion page fetch failed for ${pageId} (${response.status}): ${text}`);
  }

  return (await response.json()) as NotionPage;
}

/**
 * Fetch all blocks for a Notion page, automatically paginating through
 * all cursor pages so the caller receives a flat array of all blocks.
 *
 * @param pageId - The Notion page UUID
 * @param apiKey - The Notion integration token
 * @returns Flat array of all block objects
 * @throws Error if any API call fails
 */
export async function fetchNotionBlocks(
  pageId: string,
  apiKey: string,
): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const url = cursor
      ? `${NOTION_API_BASE}/blocks/${pageId}/children?start_cursor=${cursor}&page_size=100`
      : `${NOTION_API_BASE}/blocks/${pageId}/children?page_size=100`;

    const response = await fetch(url, {
      method: 'GET',
      headers: notionHeaders(apiKey),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Notion blocks fetch failed for ${pageId} (${response.status}): ${text}`,
      );
    }

    const data = (await response.json()) as NotionBlocksResponse;
    blocks.push(...data.results);
    cursor = data.next_cursor;
    hasMore = data.has_more;
  }

  return blocks;
}
