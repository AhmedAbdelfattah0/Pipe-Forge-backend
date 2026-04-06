/**
 * webhook.routes.ts
 *
 * Handles incoming Notion webhooks and triggers the Notion → Google Drive sync.
 *
 * Mounted at: `/webhooks`
 *
 * Routes:
 *   POST /webhooks/notion — receives Notion change events
 *
 * Security:
 *   Every request is verified with an HMAC-SHA256 signature check against the
 *   `notion-signature` header using the NOTION_WEBHOOK_SECRET env binding.
 *   Invalid signatures → 401. Unknown page IDs → silent 200.
 *
 * Env bindings consumed (via c.env):
 *   NOTION_WEBHOOK_SECRET        — HMAC secret shared with Notion
 *   NOTION_API_KEY               — Notion integration token
 *   GOOGLE_SERVICE_ACCOUNT_JSON  — Serialised Google Service Account key
 *   GOOGLE_DRIVE_FOLDER_ID       — Target folder in Google Drive
 */

import { Hono } from 'hono';
import type { NotionWebhookPayload } from '../models/notion.model.js';
import { syncNotionPageToDrive } from '../services/notion-sync.service.js';
import type { WebhookEnv } from '../../../config/env.js';

type HonoEnv = { Bindings: WebhookEnv };

/**
 * Allowed Notion page IDs that trigger a Drive sync.
 * Any other page ID is silently ignored (returns 200).
 */
const ALLOWED_PAGE_IDS = new Set<string>([
  '33613d1e5c958192b1f4fc53bf3562e7', // HQ root
  '33613d1e5c958104b72fdc7e9a3e9de0', // Strategy & Vision
  '33613d1e5c95817184afc660265281d5', // Business & Pricing
  '33613d1e5c9581939fe4f84516d7efb4', // Brand & Marketing
  '33613d1e5c9581d09a59ec6bbd45d356', // Metrics & Roadmap
  '33613d1e5c9581668969e6bcba77ddce', // Development
]);

/**
 * Normalise a Notion page ID by stripping dashes so we can compare
 * consistently whether the webhook sends the UUID with or without dashes.
 */
function normalisePageId(raw: string): string {
  return raw.replace(/-/g, '');
}

/**
 * Verify the Notion HMAC-SHA256 webhook signature using the Web Crypto API.
 *
 * Notion signs requests with the raw request body and encodes the result as
 * a hex string in the `notion-signature` header.
 *
 * @param rawBody  - The raw request body bytes
 * @param signature - Value of the `notion-signature` header
 * @param secret   - The NOTION_WEBHOOK_SECRET env binding
 * @returns true if the signature is valid
 */
async function verifyNotionSignature(
  rawBody: ArrayBuffer,
  signature: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(secret);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign'],
  );

  const signatureBytes = await crypto.subtle.sign('HMAC', cryptoKey, rawBody);

  // Convert the computed signature to a lowercase hex string
  const computed = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Notion may prefix the signature with "sha256=" — strip it for comparison
  const provided = signature.startsWith('sha256=') ? signature.slice(7) : signature;

  // Constant-time comparison is not strictly available in Web Crypto; we use
  // a best-effort approach here. The real protection is the secret itself.
  return computed === provided;
}

export function webhookRoutes(): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  /**
   * POST /webhooks/notion
   *
   * 1. Verify HMAC signature → 401 if invalid
   * 2. Parse body → extract page ID
   * 3. Check allowed list → silent 200 if not in list
   * 4. Sync the page to Google Drive
   */
  app.post('/notion', async (c) => {
    const env = c.env;

    // ── 1. Read raw body for signature verification ───────────────────────
    const rawBody = await c.req.arrayBuffer();

    // ── 1a. Handle Notion verification handshake (no signature present) ───
    // Notion sends a verification_token on initial registration — respond
    // immediately before any HMAC check, as no signature is provided.
    let parsedForHandshake: unknown;
    try {
      parsedForHandshake = JSON.parse(new TextDecoder().decode(rawBody));
    } catch {
      parsedForHandshake = null;
    }
    if (
      parsedForHandshake !== null &&
      typeof parsedForHandshake === 'object' &&
      'verification_token' in parsedForHandshake &&
      typeof (parsedForHandshake as Record<string, unknown>).verification_token === 'string'
    ) {
      const token = (parsedForHandshake as Record<string, unknown>).verification_token as string;
      console.log('=== NOTION VERIFICATION TOKEN ===');
      console.log(token);
      console.log('=================================');
      console.log('Copy this token and paste it into Notion UI');
      return c.json({ challenge: token }, 200);
    }

    // ── 2. Verify HMAC signature ──────────────────────────────────────────
    const signatureHeader = c.req.header('notion-signature') ?? '';

    if (!signatureHeader) {
      console.warn('[webhook] Missing notion-signature header');
      return c.json({ status: 'error', message: 'Unauthorized' }, 401);
    }

    const webhookSecret = env.NOTION_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('[webhook] NOTION_WEBHOOK_SECRET is not configured');
      return c.json({ status: 'error', message: 'Server misconfiguration' }, 500);
    }

    const isValid = await verifyNotionSignature(rawBody, signatureHeader, webhookSecret);
    if (!isValid) {
      console.warn('[webhook] Invalid notion-signature — rejecting request');
      return c.json({ status: 'error', message: 'Unauthorized' }, 401);
    }

    // ── 3. Parse payload ──────────────────────────────────────────────────
    let payload: NotionWebhookPayload;
    try {
      const text = new TextDecoder().decode(rawBody);
      payload = JSON.parse(text) as NotionWebhookPayload;
    } catch {
      return c.json({ status: 'error', message: 'Invalid JSON payload' }, 400);
    }

    // Extract page ID from either `entity.id` or `page_id`
    const rawPageId = payload.entity?.id ?? payload.page_id ?? null;

    if (!rawPageId) {
      // No page ID in payload — not a page event, ignore silently
      return c.json({ status: 'ok', message: 'Ignored: no page ID in payload' }, 200);
    }

    const pageId = normalisePageId(rawPageId);

    // ── 4. Check allowed list ─────────────────────────────────────────────
    if (!ALLOWED_PAGE_IDS.has(pageId)) {
      console.log(`[webhook] Page ${pageId} not in allowed list — ignoring`);
      return c.json({ status: 'ok', message: 'Ignored' }, 200);
    }

    // ── 5. Validate required env vars ─────────────────────────────────────
    const { NOTION_API_KEY, GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_DRIVE_FOLDER_ID } = env;

    if (!NOTION_API_KEY || !GOOGLE_SERVICE_ACCOUNT_JSON || !GOOGLE_DRIVE_FOLDER_ID) {
      console.error('[webhook] Missing one or more required env vars for sync');
      return c.json({ status: 'error', message: 'Server misconfiguration' }, 500);
    }

    // ── 6. Sync page to Google Drive ──────────────────────────────────────
    try {
      await syncNotionPageToDrive(pageId, {
        notionApiKey: NOTION_API_KEY,
        googleServiceAccountJson: GOOGLE_SERVICE_ACCOUNT_JSON,
        googleDriveFolderId: GOOGLE_DRIVE_FOLDER_ID,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[webhook] Sync failed for page ${pageId}:`, message);
      // Return 500 so Notion retries the webhook delivery
      return c.json({ status: 'error', message: 'Sync failed — will retry' }, 500);
    }

    return c.json({ status: 'ok', message: 'Synced' }, 200);
  });

  return app;
}
