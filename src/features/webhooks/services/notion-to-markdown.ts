/**
 * notion-to-markdown.ts
 *
 * Converts Notion page blocks into clean Markdown text.
 *
 * Supported block types:
 *   heading_1, heading_2, heading_3, paragraph, bulleted_list_item,
 *   numbered_list_item, code, table/table_row, toggle, callout,
 *   child_page, divider
 *
 * Unknown block types are skipped silently.
 */

import type {
  NotionBlock,
  NotionPage,
  NotionRichTextItem,
} from '../models/notion.model.js';

export interface MarkdownResult {
  readonly markdown: string;
  readonly filename: string;
}

/**
 * Extract plain text from a Notion rich_text array.
 */
function richTextToPlain(items: readonly NotionRichTextItem[]): string {
  return items.map((item) => item.plain_text).join('');
}

/**
 * Slugify a page title into a safe filename.
 *
 * Examples:
 *   "Strategy & Vision" → "strategy-and-vision.md"
 *   "Development"       → "development.md"
 */
function slugifyTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') + '.md'
  );
}

/**
 * Extract the page title string from Notion page properties.
 * Falls back to "untitled" when no title property is found.
 */
function extractPageTitle(page: NotionPage): string {
  const props = page.properties;

  // Notion pages can have the title property under 'title' or 'Name'
  const titleProp = props['title'] ?? props['Name'];
  if (
    titleProp !== undefined &&
    titleProp !== null &&
    typeof titleProp === 'object' &&
    'title' in titleProp &&
    Array.isArray(titleProp.title)
  ) {
    const text = richTextToPlain(titleProp.title as readonly NotionRichTextItem[]);
    if (text.trim().length > 0) {
      return text.trim();
    }
  }

  return 'untitled';
}

/**
 * Convert a single Notion block to a Markdown string.
 * Returns null for unknown or empty blocks (caller skips them).
 */
function blockToMarkdown(
  block: NotionBlock,
  numberedListCounters: Map<string, number>,
): string | null {
  switch (block.type) {
    case 'heading_1': {
      const text = richTextToPlain(block.heading_1?.rich_text ?? []);
      return text ? `# ${text}` : null;
    }

    case 'heading_2': {
      const text = richTextToPlain(block.heading_2?.rich_text ?? []);
      return text ? `## ${text}` : null;
    }

    case 'heading_3': {
      const text = richTextToPlain(block.heading_3?.rich_text ?? []);
      return text ? `### ${text}` : null;
    }

    case 'paragraph': {
      const text = richTextToPlain(block.paragraph?.rich_text ?? []);
      // Empty paragraphs become blank lines for spacing
      return text || '';
    }

    case 'bulleted_list_item': {
      const text = richTextToPlain(block.bulleted_list_item?.rich_text ?? []);
      return text ? `- ${text}` : null;
    }

    case 'numbered_list_item': {
      const text = richTextToPlain(block.numbered_list_item?.rich_text ?? []);
      if (!text) return null;
      // Track counter per parent context (using block id as proxy-key reset)
      const current = (numberedListCounters.get('__numbered__') ?? 0) + 1;
      numberedListCounters.set('__numbered__', current);
      return `${current}. ${text}`;
    }

    case 'code': {
      const text = richTextToPlain(block.code?.rich_text ?? []);
      const lang = block.code?.language ?? '';
      return `\`\`\`${lang}\n${text}\n\`\`\``;
    }

    case 'table': {
      // Table blocks themselves carry no row data; rows are child blocks.
      // We emit a placeholder that is replaced when child rows are processed.
      // Actual table rendering is handled by the table_row accumulation pass.
      return null;
    }

    case 'table_row': {
      const cells = block.table_row?.cells ?? [];
      const cellTexts = cells.map((cell) => richTextToPlain(cell));
      return `| ${cellTexts.join(' | ')} |`;
    }

    case 'toggle': {
      const text = richTextToPlain(block.toggle?.rich_text ?? []);
      // Render toggle heading as ## — children are rendered separately by the
      // caller when it fetches nested blocks.
      return text ? `## ${text}` : null;
    }

    case 'callout': {
      const text = richTextToPlain(block.callout?.rich_text ?? []);
      const icon = block.callout?.icon?.emoji ? `${block.callout.icon.emoji} ` : '';
      return text ? `> ${icon}${text}` : null;
    }

    case 'child_page': {
      const title = block.child_page?.title ?? 'Untitled';
      return `[${title}](notion://page/${block.id})`;
    }

    case 'divider': {
      return '---';
    }

    default:
      // Unknown block type — skip silently
      return null;
  }
}

/**
 * Post-process raw line array to:
 * 1. Insert Markdown table separator rows after header rows
 * 2. Reset numbered-list counters when a non-numbered-list line appears
 */
function postProcess(lines: string[]): string[] {
  const result: string[] = [];
  let inTable = false;
  let tableHeaderEmitted = false;
  let lastWasNumbered = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableRow = line.startsWith('| ') && line.endsWith(' |');
    const isNumbered = /^\d+\. /.test(line);

    // Reset numbered list counter tracking
    if (!isNumbered && lastWasNumbered) {
      // no-op here; counter is already managed in blockToMarkdown
    }
    lastWasNumbered = isNumbered;

    if (isTableRow) {
      if (!inTable) {
        // First row of a new table — it's the header
        result.push(line);
        // Count columns from the pipe-delimited string
        const cols = line.split('|').filter((s) => s.trim().length > 0).length;
        result.push('| ' + Array(cols).fill('---').join(' | ') + ' |');
        inTable = true;
        tableHeaderEmitted = true;
      } else if (tableHeaderEmitted) {
        // Skip the auto-generated separator if this is still the same table
        tableHeaderEmitted = false;
        result.push(line);
      } else {
        result.push(line);
      }
    } else {
      inTable = false;
      tableHeaderEmitted = false;
      result.push(line);
    }
  }

  return result;
}

/**
 * Convert Notion page + blocks to a Markdown string and a derived filename.
 *
 * @param page   - The Notion page object (used for title extraction)
 * @param blocks - Flat list of blocks retrieved from the Notion blocks API
 * @returns      `{ markdown, filename }` where filename is a slugified .md path
 */
export function notionToMarkdown(
  page: NotionPage,
  blocks: readonly NotionBlock[],
): MarkdownResult {
  const title = extractPageTitle(page);
  const filename = slugifyTitle(title);

  const numberedListCounters = new Map<string, number>();
  const rawLines: string[] = [`# ${title}`, ''];

  for (const block of blocks) {
    // Reset numbered counter when block type changes away from numbered list
    if (block.type !== 'numbered_list_item') {
      numberedListCounters.set('__numbered__', 0);
    }

    const line = blockToMarkdown(block, numberedListCounters);
    if (line !== null) {
      rawLines.push(line);
    }
  }

  const processedLines = postProcess(rawLines);
  const markdown = processedLines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';

  return { markdown, filename };
}
