/**
 * encryption.ts
 *
 * AES-256-GCM field-level encryption for sensitive config values
 * stored in Supabase.
 *
 * Format: "{iv}:{authTag}:{ciphertext}" (all hex-encoded).
 * Each call uses a fresh random IV to ensure semantic security.
 *
 * Requires `ENCRYPTION_KEY` env var — 64 hex characters (32 bytes).
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { config } from '../../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128-bit auth tag

/** Lazily resolved encryption key (Buffer). */
let keyBuffer: Buffer | null = null;

function getKey(): Buffer {
  if (!keyBuffer) {
    keyBuffer = Buffer.from(config.ENCRYPTION_KEY, 'hex');
  }
  return keyBuffer;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 *
 * @returns `"{iv}:{authTag}:{ciphertext}"` — all segments hex-encoded.
 */
export function encrypt(plainText: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts a ciphertext string produced by `encrypt()`.
 *
 * @param cipherText — format `"{iv}:{authTag}:{encrypted}"` (hex-encoded).
 * @returns The original plaintext string.
 * @throws If the ciphertext is malformed or the auth tag verification fails.
 */
export function decrypt(cipherText: string): string {
  const parts = cipherText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid ciphertext format — expected "iv:authTag:encrypted"');
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex!, 'hex');
  const authTag = Buffer.from(authTagHex!, 'hex');
  const encrypted = Buffer.from(encryptedHex!, 'hex');

  const decipher = createDecipheriv(ALGORITHM, getKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}
