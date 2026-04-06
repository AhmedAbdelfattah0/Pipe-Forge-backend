/**
 * notion.model.ts
 *
 * TypeScript interfaces for Notion API responses used by the webhook sync feature.
 */

// ── Notion rich text ──────────────────────────────────────────────────────────

export interface NotionRichTextAnnotations {
  readonly bold: boolean;
  readonly italic: boolean;
  readonly strikethrough: boolean;
  readonly underline: boolean;
  readonly code: boolean;
  readonly color: string;
}

export interface NotionRichTextItem {
  readonly type: 'text' | 'mention' | 'equation';
  readonly plain_text: string;
  readonly href: string | null;
  readonly annotations: NotionRichTextAnnotations;
}

// ── Notion page ───────────────────────────────────────────────────────────────

export interface NotionPageTitle {
  readonly type: 'title';
  readonly title: readonly NotionRichTextItem[];
}

export interface NotionPageProperties {
  readonly title?: NotionPageTitle;
  readonly Name?: NotionPageTitle;
  readonly [key: string]: unknown;
}

export interface NotionPage {
  readonly id: string;
  readonly object: 'page';
  readonly properties: NotionPageProperties;
  readonly url: string;
}

// ── Notion blocks ─────────────────────────────────────────────────────────────

export type NotionBlockType =
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'paragraph'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'code'
  | 'table'
  | 'table_row'
  | 'toggle'
  | 'callout'
  | 'child_page'
  | 'divider'
  | string;

export interface NotionRichTextContent {
  readonly rich_text: readonly NotionRichTextItem[];
  readonly language?: string;
  readonly icon?: { readonly emoji?: string };
}

export interface NotionTableContent {
  readonly table_width: number;
  readonly has_column_header: boolean;
  readonly has_row_header: boolean;
}

export interface NotionTableRowContent {
  readonly cells: readonly (readonly NotionRichTextItem[])[];
}

export interface NotionChildPageContent {
  readonly title: string;
}

export interface NotionBlock {
  readonly id: string;
  readonly type: NotionBlockType;
  readonly has_children: boolean;
  readonly heading_1?: NotionRichTextContent;
  readonly heading_2?: NotionRichTextContent;
  readonly heading_3?: NotionRichTextContent;
  readonly paragraph?: NotionRichTextContent;
  readonly bulleted_list_item?: NotionRichTextContent;
  readonly numbered_list_item?: NotionRichTextContent;
  readonly code?: NotionRichTextContent;
  readonly table?: NotionTableContent;
  readonly table_row?: NotionTableRowContent;
  readonly toggle?: NotionRichTextContent;
  readonly callout?: NotionRichTextContent;
  readonly child_page?: NotionChildPageContent;
}

export interface NotionBlocksResponse {
  readonly object: 'list';
  readonly results: readonly NotionBlock[];
  readonly next_cursor: string | null;
  readonly has_more: boolean;
}

// ── Webhook payload ───────────────────────────────────────────────────────────

export interface NotionWebhookEntity {
  readonly id: string;
  readonly type?: string;
}

export interface NotionWebhookPayload {
  readonly entity?: NotionWebhookEntity;
  readonly page_id?: string;
  readonly type?: string;
}
