/**
 * google-drive.ts
 *
 * Google Drive upload service.
 *
 * Authentication priority:
 *   1. OAuth2 refresh-token flow  — if GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET +
 *      GOOGLE_REFRESH_TOKEN are all present in env. Files are uploaded as the
 *      authenticated user (Ahmed's personal Drive), so personal storage quota
 *      applies and the 403 "Service Accounts do not have storage quota" error
 *      is avoided.
 *   2. Service Account JWT flow   — fallback when OAuth2 vars are absent.
 *
 * All HTTP calls use the global `fetch` API (Cloudflare Workers compatible).
 * No googleapis SDK or jsonwebtoken — JWT is constructed manually using Web Crypto.
 *
 * Required env vars (injected via Hono `c.env`):
 *   GOOGLE_SERVICE_ACCOUNT_JSON — full service account JSON key as a string (fallback)
 *   GOOGLE_DRIVE_FOLDER_ID      — target Drive folder ID
 *
 * Optional OAuth2 env vars (preferred when all three are present):
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REFRESH_TOKEN
 */

import type { WebhookEnv } from '../../../config/env.js';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ServiceAccountKey {
  readonly client_email: string;
  readonly private_key: string;
}

interface GoogleTokenResponse {
  readonly access_token: string;
  readonly token_type: string;
  readonly expires_in: number;
}

interface OAuth2TokenResponse {
  readonly access_token?: string;
  readonly error?: string;
  readonly error_description?: string;
}

interface DriveFile {
  readonly id: string;
  readonly name: string;
}

interface DriveFileListResponse {
  readonly files: readonly DriveFile[];
}

// ── JWT helpers ───────────────────────────────────────────────────────────────

/**
 * Base64URL-encode a Uint8Array (no padding, URL-safe alphabet).
 */
function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Base64URL-encode a plain string.
 */
function base64UrlEncodeString(str: string): string {
  const encoder = new TextEncoder();
  return base64UrlEncode(encoder.encode(str));
}

/**
 * Import a PEM RSA private key for RS256 signing using Web Crypto API.
 * Cloudflare Workers expose the standard Web Crypto API (`crypto.subtle`).
 */
async function importPrivateKey(pemKey: string): Promise<CryptoKey> {
  // Strip PEM headers and newlines, decode base64 to get DER bytes
  const pemBody = pemKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/-----BEGIN RSA PRIVATE KEY-----/g, '')
    .replace(/-----END RSA PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '');

  const derBuffer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    'pkcs8',
    derBuffer.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
    false,
    ['sign'],
  );
}

/**
 * Build and sign a Google Service Account JWT for the Drive API.
 *
 * Spec: https://developers.google.com/identity/protocols/oauth2/service-account#jwt-auth
 */
async function buildServiceAccountJwt(
  clientEmail: string,
  privateKey: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600; // 1-hour lifetime

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/drive',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: expiry,
  };

  const encodedHeader = base64UrlEncodeString(JSON.stringify(header));
  const encodedPayload = base64UrlEncodeString(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const cryptoKey = await importPrivateKey(privateKey);
  const encoder = new TextEncoder();
  const signatureBytes = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(signingInput),
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signatureBytes));
  return `${signingInput}.${encodedSignature}`;
}

/**
 * Exchange a signed Service Account JWT for a Google OAuth2 access token.
 */
async function fetchAccessToken(jwt: string): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google token exchange failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as GoogleTokenResponse;
  return data.access_token;
}

// ── Primary auth helper ───────────────────────────────────────────────────────

/**
 * Obtain a Google Drive access token from env bindings.
 *
 * Strategy:
 *   - If GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN are
 *     all present, exchange the refresh token for an access token via the
 *     standard OAuth2 token endpoint.  Files will be owned by the user who
 *     authorised the token (Ahmed's personal Drive), avoiding the service-
 *     account storage-quota 403 error.
 *   - Otherwise fall back to the Service Account JWT flow.
 */
async function getAccessToken(env: WebhookEnv): Promise<string> {
  if (env.GOOGLE_REFRESH_TOKEN && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        refresh_token: env.GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });

    const data = (await response.json()) as OAuth2TokenResponse;

    if (data.error) {
      throw new Error(
        `OAuth2 token refresh failed: ${data.error}${data.error_description ? ` — ${data.error_description}` : ''}`,
      );
    }

    if (!data.access_token) {
      throw new Error('OAuth2 token response did not contain an access_token');
    }

    console.log('[google-drive] Using OAuth2 refresh-token auth (personal Drive)');
    return data.access_token;
  }

  // Fallback: service account JWT flow
  console.log('[google-drive] Using Service Account JWT auth (fallback)');
  return getAccessTokenFromJson(env.GOOGLE_SERVICE_ACCOUNT_JSON);
}

// ── Drive API calls ───────────────────────────────────────────────────────────

interface DrivePermissionPayload {
  readonly type: 'user' | 'group' | 'domain' | 'anyone';
  readonly role: 'reader' | 'writer' | 'owner' | 'organizer' | 'fileOrganizer';
  readonly emailAddress?: string;
}

/**
 * Search for an existing file by name within a specific Drive folder.
 * Returns the file ID if found, or null if not found.
 */
async function findExistingFile(
  accessToken: string,
  filename: string,
  folderId: string,
): Promise<string | null> {
  const q = encodeURIComponent(
    `name = '${filename.replace(/'/g, "\\'")}' and '${folderId}' in parents and trashed = false`,
  );
  const fields = encodeURIComponent('files(id,name)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&spaces=drive&supportsAllDrives=true&includeItemsFromAllDrives=true`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Drive file search failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as DriveFileListResponse;
  return data.files.length > 0 ? data.files[0].id : null;
}

/**
 * Create a new file in Google Drive using multipart upload.
 */
async function createFile(
  accessToken: string,
  filename: string,
  content: string,
  folderId: string,
): Promise<void> {
  const metadata = {
    name: filename,
    mimeType: 'application/vnd.google-apps.document',
    parents: [folderId],
  };

  const boundary = '-------314159265358979323846';
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    'Content-Type: text/plain',
    '',
    content,
    `--${boundary}--`,
  ].join('\r\n');

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`,
      },
      body,
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Drive file creation failed (${response.status}): ${text}`);
  }
}

/**
 * Update an existing file's content in Google Drive.
 */
async function updateFile(
  accessToken: string,
  fileId: string,
  content: string,
): Promise<void> {
  const boundary = '-------314159265358979323846';
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify({ mimeType: 'application/vnd.google-apps.document' }),
    `--${boundary}`,
    'Content-Type: text/plain',
    '',
    content,
    `--${boundary}--`,
  ].join('\r\n');

  const response = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart&supportsAllDrives=true`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`,
      },
      body,
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Drive file update failed (${response.status}): ${text}`);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Upload or replace a Markdown file in the configured Google Drive folder.
 *
 * If a file with the same name already exists in the folder, its content is
 * replaced (PATCH). Otherwise a new file is created (POST).
 *
 * Authentication is delegated to `getAccessToken(env)`:
 *   - OAuth2 refresh-token flow when GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET /
 *     GOOGLE_REFRESH_TOKEN are all present (uploads to Ahmed's personal Drive).
 *   - Service Account JWT flow otherwise.
 *
 * @param filename - Target filename (e.g. "strategy-and-vision.md")
 * @param content  - Markdown string to write
 * @param env      - Webhook env bindings (contains credentials + folder ID)
 */
export async function uploadToDrive(
  filename: string,
  content: string,
  env: WebhookEnv,
): Promise<void> {
  const accessToken = await getAccessToken(env);
  const folderId = env.GOOGLE_DRIVE_FOLDER_ID;

  // Check if file already exists in the target folder
  const existingFileId = await findExistingFile(accessToken, filename, folderId);

  if (existingFileId !== null) {
    await updateFile(accessToken, existingFileId, content);
    console.log(`[google-drive] Updated existing file: ${filename} (id=${existingFileId})`);
  } else {
    await createFile(accessToken, filename, content, folderId);
    console.log(`[google-drive] Created new file: ${filename}`);
  }
}

// ── Folder management ─────────────────────────────────────────────────────────

/**
 * Obtain a fresh Drive access token using the service account credentials
 * embedded in a serialised JSON key string.
 *
 * Extracted as a shared helper so folder-management functions can reuse the
 * same JWT → token exchange without duplicating credential parsing.
 */
async function getAccessTokenFromJson(googleServiceAccountJson: string): Promise<string> {
  const parsed: unknown = JSON.parse(googleServiceAccountJson);
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('client_email' in parsed) ||
    !('private_key' in parsed) ||
    typeof (parsed as Record<string, unknown>)['client_email'] !== 'string' ||
    typeof (parsed as Record<string, unknown>)['private_key'] !== 'string'
  ) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is missing client_email or private_key');
  }

  const { client_email, private_key } = parsed as ServiceAccountKey;
  const jwt = await buildServiceAccountJwt(client_email, private_key);
  return fetchAccessToken(jwt);
}

/**
 * Create a new Drive folder owned by the service account.
 *
 * Because the folder is owned by the service account (not a user account) it
 * does not consume any user's storage quota, eliminating the 403 "Service
 * Accounts do not have storage quota" error when uploading into user-owned
 * folders.
 *
 * @param folderName              - Display name for the new folder
 * @param googleServiceAccountJson - Serialised service account JSON key
 * @returns The ID of the newly created folder
 */
export async function createRootFolder(
  folderName: string,
  googleServiceAccountJson: string,
): Promise<string> {
  const accessToken = await getAccessTokenFromJson(googleServiceAccountJson);

  const metadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  const response = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Drive folder creation failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as DriveFile;
  console.log(`[google-drive] Created folder "${folderName}" (id=${data.id})`);
  return data.id;
}

/**
 * Share a Drive file or folder with a specific user.
 *
 * Call this after `createRootFolder` to give the owner's Google account
 * access so they can browse files in Drive and use them with NotebookLM.
 *
 * @param fileId                  - Drive file or folder ID to share
 * @param email                   - Email address of the recipient
 * @param role                    - Permission level ('reader' | 'writer' | 'owner')
 * @param googleServiceAccountJson - Serialised service account JSON key
 */
export async function shareFolderWithUser(
  fileId: string,
  email: string,
  role: DrivePermissionPayload['role'],
  googleServiceAccountJson: string,
): Promise<void> {
  const accessToken = await getAccessTokenFromJson(googleServiceAccountJson);

  const permission: DrivePermissionPayload = {
    type: 'user',
    role,
    emailAddress: email,
  };

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permission),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Drive permission grant failed (${response.status}): ${text}`);
  }

  console.log(`[google-drive] Shared file/folder ${fileId} with ${email} (role=${role})`);
}
