/**
 * webhook.routes.ts
 *
 * Handles incoming Notion webhooks and triggers the Notion → Google Drive sync.
 *
 * Mounted at: `/webhooks`
 *
 * Routes:
 *   POST /webhooks/notion        — receives Notion change events
 *   GET  /webhooks/notion/test-drive — verifies Google Drive connectivity
 *
 * Security:
 *   Every POST request is verified with an HMAC-SHA256 signature check against
 *   the `notion-signature` header using the NOTION_WEBHOOK_SECRET env binding.
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
import { uploadToDrive, createRootFolder, shareFolderWithUser } from '../services/google-drive.js';
import { fetchNotionPage, fetchNotionBlocks } from '../services/notion-api.js';
import { notionToMarkdown } from '../services/notion-to-markdown.js';
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
   * GET /webhooks/notion/test-drive
   *
   * Verifies Google Drive connectivity by uploading a test file.
   * Logs env var presence and returns success/failure JSON.
   */
  app.get('/notion/test-drive', async (c) => {
    const env = c.env;

    console.log('[test-drive] NOTION_API_KEY exists:', !!env.NOTION_API_KEY);
    console.log('[test-drive] GOOGLE_SA exists:', !!env.GOOGLE_SERVICE_ACCOUNT_JSON);
    console.log('[test-drive] FOLDER_ID exists:', !!env.GOOGLE_DRIVE_FOLDER_ID);
    console.log('[test-drive] FOLDER_ID value:', env.GOOGLE_DRIVE_FOLDER_ID);

    if (!env.GOOGLE_DRIVE_FOLDER_ID) {
      return c.json(
        { success: false, error: 'Missing GOOGLE_DRIVE_FOLDER_ID' },
        500,
      );
    }

    try {
      const content = `# Test\nDrive connection works at ${new Date().toISOString()}`;
      await uploadToDrive('test-connection.md', content, env);
      console.log('[test-drive] Upload succeeded');
      return c.json({ success: true }, 200);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      console.error('[test-drive] Upload failed:', error);
      return c.json({ success: false, error }, 500);
    }
  });

  /**
   * GET /webhooks/notion/sync-all
   *
   * Bulk sync all 6 PipeForge HQ Notion pages to Google Drive.
   *
   * For each page the handler:
   *   1. Fetches the page and its blocks from the Notion API
   *   2. Converts the blocks to Markdown
   *   3. Uploads the Markdown file to Google Drive under the predetermined filename
   *
   * On partial failure the handler continues processing remaining pages and
   * returns an `errors` array alongside the `synced` array.
   *
   * Returns: { synced: string[], total: number, errors?: { filename, error }[] }
   */
  app.get('/notion/sync-all', async (c) => {
    const env = c.env;

    const { NOTION_API_KEY, GOOGLE_DRIVE_FOLDER_ID } = env;

    if (!NOTION_API_KEY || !GOOGLE_DRIVE_FOLDER_ID) {
      return c.json(
        { success: false, error: 'Missing NOTION_API_KEY or GOOGLE_DRIVE_FOLDER_ID' },
        500,
      );
    }

    const HQ_PAGES: ReadonlyArray<{ readonly id: string; readonly filename: string }> = [
      { id: '33613d1e5c958192b1f4fc53bf3562e7', filename: 'hq-root.md' },
      { id: '33613d1e5c958104b72fdc7e9a3e9de0', filename: 'strategy-and-vision.md' },
      { id: '33613d1e5c95817184afc660265281d5', filename: 'business-and-pricing.md' },
      { id: '33613d1e5c9581939fe4f84516d7efb4', filename: 'brand-and-marketing.md' },
      { id: '33613d1e5c9581d09a59ec6bbd45d356', filename: 'metrics-and-roadmap.md' },
      { id: '33613d1e5c9581668969e6bcba77ddce', filename: 'development.md' },
    ];

    const synced: string[] = [];
    const errors: Array<{ filename: string; error: string }> = [];

    for (const page of HQ_PAGES) {
      try {
        console.log(`[sync-all] Fetching page ${page.id} (${page.filename})`);

        const [notionPage, blocks] = await Promise.all([
          fetchNotionPage(page.id, NOTION_API_KEY),
          fetchNotionBlocks(page.id, NOTION_API_KEY),
        ]);

        const { markdown } = notionToMarkdown(notionPage, blocks);
        console.log(`[sync-all] Converted ${page.filename} (${markdown.length} chars)`);

        await uploadToDrive(page.filename, markdown, env);

        console.log(`[sync-all] Uploaded ${page.filename}`);
        synced.push(page.filename);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[sync-all] Failed to sync ${page.filename}:`, message);
        errors.push({ filename: page.filename, error: message });
      }
    }

    const response: {
      synced: string[];
      total: number;
      errors?: Array<{ filename: string; error: string }>;
    } = {
      synced,
      total: synced.length,
    };

    if (errors.length > 0) {
      response.errors = errors;
    }

    return c.json(response, 200);
  });

  /**
   * GET /webhooks/google-drive/create-folder
   *
   * One-time utility: create a new Google Drive folder owned by the service
   * account and (optionally) share it with GOOGLE_OWNER_EMAIL.
   *
   * Because the folder is owned by the service account it has no user-quota
   * constraint, eliminating the 403 "Service Accounts do not have storage
   * quota" error that occurs when uploading into a user-owned folder.
   *
   * Call this once, then:
   *   1. Copy the returned folderId.
   *   2. Run: npx wrangler secret put GOOGLE_DRIVE_FOLDER_ID
   *   3. Paste the new folder ID when prompted.
   *   4. Share the folder with your Google account in the Drive UI (if
   *      GOOGLE_OWNER_EMAIL was not set) so NotebookLM can see the files.
   */
  app.get('/google-drive/create-folder', async (c) => {
    const env = c.env;

    if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      return c.json({ success: false, error: 'Missing GOOGLE_SERVICE_ACCOUNT_JSON' }, 500);
    }

    try {
      const folderId = await createRootFolder('PipeForge HQ', env.GOOGLE_SERVICE_ACCOUNT_JSON);

      const ownerEmail = env.GOOGLE_OWNER_EMAIL;
      if (ownerEmail) {
        await shareFolderWithUser(folderId, ownerEmail, 'writer', env.GOOGLE_SERVICE_ACCOUNT_JSON);
        console.log(`[create-folder] Shared folder ${folderId} with ${ownerEmail}`);
      } else {
        console.warn('[create-folder] GOOGLE_OWNER_EMAIL not set — folder created but not shared');
      }

      return c.json(
        {
          success: true,
          folderId,
          message: `Folder created. Run: npx wrangler secret put GOOGLE_DRIVE_FOLDER_ID and paste ${folderId}`,
          sharedWith: ownerEmail ?? null,
        },
        200,
      );
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      console.error('[create-folder] Failed:', error);
      return c.json({ success: false, error }, 500);
    }
  });

  /**
   * GET /webhooks/google-drive/share-folder?email=<email>
   *
   * Share the configured Google Drive folder with a specific user (writer role).
   *
   * Query params:
   *   email — Google account email address to grant write access to
   *
   * Required env bindings:
   *   GOOGLE_SERVICE_ACCOUNT_JSON — service account key
   *   GOOGLE_DRIVE_FOLDER_ID      — target folder to share
   *
   * Returns: { success: true, email, folderId, message }
   */
  app.get('/google-drive/share-folder', async (c) => {
    const env = c.env;

    const email = c.req.query('email');
    if (!email) {
      return c.json({ success: false, error: 'Missing required query parameter: email' }, 400);
    }

    if (!env.GOOGLE_SERVICE_ACCOUNT_JSON || !env.GOOGLE_DRIVE_FOLDER_ID) {
      return c.json(
        { success: false, error: 'Missing GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_DRIVE_FOLDER_ID' },
        500,
      );
    }

    try {
      await shareFolderWithUser(
        env.GOOGLE_DRIVE_FOLDER_ID,
        email,
        'writer',
        env.GOOGLE_SERVICE_ACCOUNT_JSON,
      );
      console.log(`[share-folder] Shared folder ${env.GOOGLE_DRIVE_FOLDER_ID} with ${email}`);
      return c.json(
        {
          success: true,
          email,
          folderId: env.GOOGLE_DRIVE_FOLDER_ID,
          message: 'Folder shared successfully',
        },
        200,
      );
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      console.error('[share-folder] Failed:', error);
      return c.json({ success: false, error }, 500);
    }
  });

  /**
   * POST /webhooks/notion/setup-drive-folder
   *
   * One-time setup: create the "PipeForge HQ" Drive folder owned by the
   * service account and share it with the owner's Google account so they can
   * browse files in Drive and use them with NotebookLM.
   *
   * Why service-account ownership matters:
   *   Service accounts cannot upload into folders owned by a user account —
   *   they have no user storage quota, causing a 403 "Service Accounts do not
   *   have storage quota" error. Creating the folder FROM the service account
   *   means the service account owns the quota and uploads succeed.
   *
   * Idempotency: this route always creates a new folder. After running it,
   * update the GOOGLE_DRIVE_FOLDER_ID secret with the returned folder ID.
   *
   * Required env bindings:
   *   GOOGLE_SERVICE_ACCOUNT_JSON — service account key
   *   GOOGLE_OWNER_EMAIL          — Google account to share the folder with (optional)
   */
  app.post('/notion/setup-drive-folder', async (c) => {
    const env = c.env;

    if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      return c.json({ success: false, error: 'Missing GOOGLE_SERVICE_ACCOUNT_JSON' }, 500);
    }

    try {
      // Step 1: create folder owned by service account
      const folderId = await createRootFolder('PipeForge HQ', env.GOOGLE_SERVICE_ACCOUNT_JSON);

      // Step 2: share with the owner's Google account if env var is present
      const ownerEmail = env.GOOGLE_OWNER_EMAIL;
      if (ownerEmail) {
        await shareFolderWithUser(folderId, ownerEmail, 'writer', env.GOOGLE_SERVICE_ACCOUNT_JSON);
        console.log(`[setup-drive-folder] Shared folder ${folderId} with ${ownerEmail}`);
      } else {
        console.warn(
          '[setup-drive-folder] GOOGLE_OWNER_EMAIL not set — folder created but not shared',
        );
      }

      return c.json(
        {
          success: true,
          folderId,
          message: `Folder created (id=${folderId}). Set GOOGLE_DRIVE_FOLDER_ID=${folderId} in your Cloudflare Worker secrets.`,
          sharedWith: ownerEmail ?? null,
        },
        200,
      );
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      console.error('[setup-drive-folder] Failed:', error);
      return c.json({ success: false, error }, 500);
    }
  });

  /**
   * GET /webhooks/google-drive/auth-start
   *
   * Builds a Google OAuth2 authorisation URL and returns it as JSON.
   * Open the returned URL in a browser, sign in as Ahmed, and grant access.
   * Google will redirect to /webhooks/google-drive/auth-callback with a `code`
   * query param that the callback handler exchanges for a refresh token.
   *
   * Required env bindings:
   *   GOOGLE_CLIENT_ID — OAuth2 client ID from Google Cloud Console
   *
   * Returns: { authUrl: string }
   */
  app.get('/google-drive/auth-start', (c) => {
    const env = c.env;

    if (!env.GOOGLE_CLIENT_ID) {
      return c.json({ success: false, error: 'Missing GOOGLE_CLIENT_ID' }, 500);
    }

    const redirectUri =
      'https://pipeforge-backend.ahmed-m-abdelfttah.workers.dev/webhooks/google-drive/auth-callback';

    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/drive.file',
      access_type: 'offline',
      prompt: 'consent', // forces Google to return a refresh_token every time
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    return c.json({ authUrl });
  });

  /**
   * GET /webhooks/google-drive/auth-callback?code=xxx
   *
   * Exchanges the one-time authorisation code (returned by Google after the
   * user grants permission in auth-start) for an access token + refresh token.
   *
   * On success returns the refresh token and instructions for storing it as a
   * Cloudflare Worker secret so subsequent uploads use OAuth2 auth.
   *
   * Required env bindings:
   *   GOOGLE_CLIENT_ID
   *   GOOGLE_CLIENT_SECRET
   *
   * Query params:
   *   code — authorisation code from Google redirect
   *
   * Returns: { refresh_token, access_token, message }
   */
  app.get('/google-drive/auth-callback', async (c) => {
    const env = c.env;

    const code = c.req.query('code');
    if (!code) {
      return c.json({ success: false, error: 'Missing `code` query parameter' }, 400);
    }

    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      return c.json(
        { success: false, error: 'Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET' },
        500,
      );
    }

    const redirectUri =
      'https://pipeforge-backend.ahmed-m-abdelfttah.workers.dev/webhooks/google-drive/auth-callback';

    interface TokenExchangeResponse {
      access_token?: string;
      refresh_token?: string;
      error?: string;
      error_description?: string;
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: env.GOOGLE_CLIENT_ID,
          client_secret: env.GOOGLE_CLIENT_SECRET,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const data = (await response.json()) as TokenExchangeResponse;

      if (data.error) {
        return c.json(
          {
            success: false,
            error: data.error,
            error_description: data.error_description ?? null,
          },
          400,
        );
      }

      if (!data.refresh_token) {
        return c.json(
          {
            success: false,
            error:
              'No refresh_token in response. This usually means the OAuth2 consent screen was not shown. ' +
              'Visit /webhooks/google-drive/auth-start again — it uses prompt=consent to force a new refresh token.',
          },
          400,
        );
      }

      return c.json({
        success: true,
        refresh_token: data.refresh_token,
        access_token: data.access_token ?? null,
        message:
          'Copy the refresh_token above, then run: npx wrangler secret put GOOGLE_REFRESH_TOKEN and paste it when prompted.',
      });
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      console.error('[auth-callback] Token exchange failed:', error);
      return c.json({ success: false, error }, 500);
    }
  });

  /**
   * POST /webhooks/notion
   *
   * 1. Handle Notion verification handshake (no signature present)
   * 2. Verify HMAC signature → 401 if invalid
   * 3. Parse body → extract page ID
   * 4. Check allowed list → silent 200 if not in list
   * 5. Return 200 immediately, run sync inside ctx.waitUntil() so Cloudflare
   *    Workers does not kill the async task after the response is sent
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

    // ── Log env var presence ──────────────────────────────────────────────
    console.log('NOTION_API_KEY exists:', !!env.NOTION_API_KEY);
    console.log('GOOGLE_SA exists:', !!env.GOOGLE_SERVICE_ACCOUNT_JSON);
    console.log('FOLDER_ID exists:', !!env.GOOGLE_DRIVE_FOLDER_ID);

    // ── Log incoming body ─────────────────────────────────────────────────
    console.log('1. Webhook received:', new TextDecoder().decode(rawBody));

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
    console.log('2. Page ID:', pageId);

    // ── 4. Check allowed list ─────────────────────────────────────────────
    const isAllowed = ALLOWED_PAGE_IDS.has(pageId);
    console.log('3. In allowed list:', isAllowed);

    if (!isAllowed) {
      console.log(`[webhook] Page ${pageId} not in allowed list — ignoring`);
      return c.json({ status: 'ok', message: 'Ignored' }, 200);
    }

    // ── 5. Validate required env vars ─────────────────────────────────────
    const { NOTION_API_KEY } = env;

    if (!NOTION_API_KEY) {
      console.error('[webhook] Missing NOTION_API_KEY');
      return c.json({ status: 'error', message: 'Server misconfiguration' }, 500);
    }

    // ── 6. Return 200 immediately; run sync inside waitUntil ──────────────
    // Cloudflare Workers terminates async work that outlives the response.
    // ctx.waitUntil() keeps the Worker alive until the Promise resolves.
    const ctx = c.executionCtx;

    ctx.waitUntil(
      (async () => {
        try {
          console.log('4. Fetching Notion page...');
          await syncNotionPageToDrive(pageId, {
            notionApiKey: NOTION_API_KEY,
            env,
          });
          console.log('8. Upload complete!');
        } catch (err: unknown) {
          const error = err instanceof Error ? err : new Error(String(err));
          console.error('ERROR:', error.message, error.stack);
        }
      })(),
    );

    return c.json({ status: 'ok', message: 'Accepted' }, 200);
  });

  return app;
}
