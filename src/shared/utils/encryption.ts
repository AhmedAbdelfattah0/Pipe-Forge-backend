/**
 * encryption.ts
 *
 * AES-256-GCM field-level encryption for sensitive config values
 * stored in Supabase.
 *
 * Format: "{iv}:{authTag}:{ciphertext}" (all hex-encoded).
 * Each call uses a fresh random IV to ensure semantic security.
 *
 * Workers-compatible: uses node:crypto via nodejs_compat flag.
 * The encryption key is passed as a parameter (no global config).
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { AppError } from './app-error.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a plaintext string using AES-256-GCM.
 *
 * @param plainText - The string to encrypt.
 * @param keyHex - 64-character hex string (32 bytes) encryption key.
 * @returns `"{iv}:{authTag}:{ciphertext}"` — all segments hex-encoded.
 */
export function encrypt(plainText: string, keyHex: string): string {
  const key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) {
    throw new AppError(
      `ENCRYPTION_KEY must be a 64-character hex string (32 bytes). Got ${key.length} bytes from a ${keyHex.length}-character input.`,
      500,
      false,
    );
  }
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts a ciphertext string produced by `encrypt()`.
 *
 * @param cipherText - format `"{iv}:{authTag}:{encrypted}"` (hex-encoded).
 * @param keyHex - 64-character hex string (32 bytes) encryption key.
 * @returns The original plaintext string.
 * @throws If the ciphertext is malformed or the auth tag verification fails.
 */
export function decrypt(cipherText: string, keyHex: string): string {
  const parts = cipherText.split(':');
  if (parts.length !== 3) throw new Error('Invalid ciphertext format');
  const [ivHex, authTagHex, encryptedHex] = parts;
  const key = Buffer.from(keyHex, 'hex');
  const iv = Buffer.from(ivHex!, 'hex');
  const authTag = Buffer.from(authTagHex!, 'hex');
  const encrypted = Buffer.from(encryptedHex!, 'hex');
  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}
