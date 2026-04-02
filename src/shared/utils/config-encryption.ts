/**
 * config-encryption.ts
 *
 * Encrypts and decrypts sensitive fields within a GeneratorConfig snapshot
 * before storing to / after reading from Supabase.
 *
 * Encrypted fields:
 *   - serviceConnectionId  (string)
 *   - storageAccounts      (Record<string, string> — values only)
 *   - swaTokens            (Record<string, string> — values only)
 *   - appServiceNames      (Record<string, string> — values only)
 *
 * Keys in Record fields are preserved as-is (they are deployment-target
 * identifiers like "sa-qa", not secrets).
 */

import { encrypt, decrypt } from './encryption.js';

/** Fields that are simple strings and should be encrypted. */
const ENCRYPTED_STRING_FIELDS = ['serviceConnectionId'] as const;

/** Fields that are Record<string, string> whose values should be encrypted. */
const ENCRYPTED_RECORD_FIELDS = [
  'storageAccounts',
  'swaTokens',
  'appServiceNames',
] as const;

/**
 * Returns a deep clone of `config` with sensitive fields encrypted.
 * Safe to call even if a field is missing or empty — skips gracefully.
 * If `keyHex` is undefined or empty, returns the config unencrypted
 * (with a console warning) so the route doesn't crash in environments
 * where the secret has not been set yet.
 */
export function encryptConfigSnapshot(
  config: Record<string, unknown>,
  keyHex: string | undefined,
): Record<string, unknown> {
  if (!keyHex) {
    console.warn('[config-encryption] ENCRYPTION_KEY is not set — storing config snapshot unencrypted.');
    return structuredClone(config);
  }
  const clone = structuredClone(config);

  // Encrypt simple string fields.
  for (const field of ENCRYPTED_STRING_FIELDS) {
    const value = clone[field];
    if (typeof value === 'string' && value.length > 0) {
      clone[field] = encrypt(value, keyHex);
    }
  }

  // Encrypt values in Record<string, string> fields.
  for (const field of ENCRYPTED_RECORD_FIELDS) {
    const record = clone[field];
    if (record && typeof record === 'object' && !Array.isArray(record)) {
      const encrypted: Record<string, string> = {};
      for (const [key, value] of Object.entries(record as Record<string, string>)) {
        encrypted[key] = typeof value === 'string' && value.length > 0
          ? encrypt(value, keyHex)
          : value;
      }
      clone[field] = encrypted;
    }
  }

  return clone;
}

/**
 * Returns a deep clone of `config` with sensitive fields decrypted.
 * Safe to call even if a field is missing, empty, or was never encrypted
 * (pre-encryption records) — returns original value on decryption failure.
 * If `keyHex` is undefined or empty, returns the config as-is.
 */
export function decryptConfigSnapshot(
  config: Record<string, unknown>,
  keyHex: string | undefined,
): Record<string, unknown> {
  if (!keyHex) return structuredClone(config);
  const clone = structuredClone(config);

  // Decrypt simple string fields.
  for (const field of ENCRYPTED_STRING_FIELDS) {
    const value = clone[field];
    if (typeof value === 'string' && value.includes(':')) {
      try {
        clone[field] = decrypt(value, keyHex);
      } catch {
        // Value was not encrypted (legacy record) — leave as-is.
      }
    }
  }

  // Decrypt values in Record<string, string> fields.
  for (const field of ENCRYPTED_RECORD_FIELDS) {
    const record = clone[field];
    if (record && typeof record === 'object' && !Array.isArray(record)) {
      const decrypted: Record<string, string> = {};
      for (const [key, value] of Object.entries(record as Record<string, string>)) {
        if (typeof value === 'string' && value.includes(':')) {
          try {
            decrypted[key] = decrypt(value, keyHex);
          } catch {
            decrypted[key] = value; // Legacy or non-encrypted value.
          }
        } else {
          decrypted[key] = value;
        }
      }
      clone[field] = decrypted;
    }
  }

  return clone;
}
