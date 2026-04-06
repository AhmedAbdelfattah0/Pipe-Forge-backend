/**
 * google-drive.ts
 *
 * Google Drive upload service using Service Account JWT authentication.
 *
 * All HTTP calls use the global `fetch` API (Cloudflare Workers compatible).
 * No googleapis SDK or jsonwebtoken — JWT is constructed manually using Web Crypto.
 *
 * Required env vars (injected via Hono `c.env`):
 *   GOOGLE_SERVICE_ACCOUNT_JSON — full service account JSON key as a string
 *   GOOGLE_DRIVE_FOLDER_ID      — target Drive folder ID
 */

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
    scope: 'https://www.googleapis.com/auth/drive.file',
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

// ── Drive API calls ───────────────────────────────────────────────────────────

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
  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&spaces=drive`;

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
    mimeType: 'text/markdown',
    parents: [folderId],
  };

  const boundary = '-------314159265358979323846';
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    'Content-Type: text/markdown',
    '',
    content,
    `--${boundary}--`,
  ].join('\r\n');

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
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
  const response = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'text/markdown',
      },
      body: content,
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
 * @param filename                - Target filename (e.g. "strategy-and-vision.md")
 * @param content                 - Markdown string to write
 * @param googleServiceAccountJson - Serialised service account JSON key
 * @param googleDriveFolderId     - Target Google Drive folder ID
 */
export async function uploadToDrive(
  filename: string,
  content: string,
  googleServiceAccountJson: string,
  googleDriveFolderId: string,
): Promise<void> {
  // Parse service account credentials
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

  // Obtain access token via Service Account JWT flow
  const jwt = await buildServiceAccountJwt(client_email, private_key);
  const accessToken = await fetchAccessToken(jwt);

  // Check if file already exists in the target folder
  const existingFileId = await findExistingFile(accessToken, filename, googleDriveFolderId);

  if (existingFileId !== null) {
    await updateFile(accessToken, existingFileId, content);
    console.log(`[google-drive] Updated existing file: ${filename} (id=${existingFileId})`);
  } else {
    await createFile(accessToken, filename, content, googleDriveFolderId);
    console.log(`[google-drive] Created new file: ${filename}`);
  }
}
