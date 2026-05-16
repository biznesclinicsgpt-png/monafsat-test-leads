/**
 * Credential Encryption Service
 *
 * AES-256-GCM encryption for API keys stored in the database.
 * Server-side only - NEVER expose to frontend.
 *
 * Environment Variable Required:
 *   CREDENTIAL_ENCRYPTION_KEY=<64 hex chars / 32 bytes>
 *
 * Generate with: openssl rand -hex 32
 */

import crypto from 'crypto';

// ==========================================
// Types
// ==========================================

export interface EncryptedCredential {
  ciphertext: string; // Base64 encoded
  iv: string;         // Base64 encoded
  authTag: string;    // Base64 encoded (for GCM)
}

export interface StorageCredential {
  encryptedApiKey: string;   // Base64: ciphertext + authTag
  encryptedApiKeyIv: string; // Base64: IV
}

// ==========================================
// Constants
// ==========================================

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;        // 96 bits for GCM
const AUTH_TAG_LENGTH = 16;  // 128 bits
const KEY_LENGTH = 32;       // 256 bits

// ==========================================
// Key Management
// ==========================================

let encryptionKey: Buffer | null = null;

/**
 * Get the encryption key from environment
 * Validates and caches the key
 */
const getEncryptionKey = (): Buffer => {
  if (encryptionKey) {
    return encryptionKey;
  }

  const keyHex = process.env.CREDENTIAL_ENCRYPTION_KEY;

  if (!keyHex) {
    throw new Error(
      'CREDENTIAL_ENCRYPTION_KEY environment variable is required. ' +
      'Generate with: openssl rand -hex 32'
    );
  }

  if (keyHex.length !== 64) {
    throw new Error(
      'CREDENTIAL_ENCRYPTION_KEY must be 64 hex characters (32 bytes). ' +
      'Current length: ' + keyHex.length
    );
  }

  // Validate hex format
  if (!/^[0-9a-fA-F]+$/.test(keyHex)) {
    throw new Error('CREDENTIAL_ENCRYPTION_KEY must be valid hexadecimal');
  }

  encryptionKey = Buffer.from(keyHex, 'hex');

  if (encryptionKey.length !== KEY_LENGTH) {
    throw new Error('CREDENTIAL_ENCRYPTION_KEY must decode to 32 bytes');
  }

  return encryptionKey;
};

// ==========================================
// Core Encryption Functions
// ==========================================

/**
 * Encrypt a plaintext credential using AES-256-GCM
 *
 * @param plaintext - The API key or credential to encrypt
 * @returns Encrypted credential with IV and auth tag
 */
export const encryptCredential = (plaintext: string): EncryptedCredential => {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new Error('Plaintext must be a non-empty string');
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
  ciphertext += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  return {
    ciphertext,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
};

/**
 * Decrypt an encrypted credential using AES-256-GCM
 *
 * @param encrypted - The encrypted credential object
 * @returns Decrypted plaintext
 */
export const decryptCredential = (encrypted: EncryptedCredential): string => {
  if (!encrypted || !encrypted.ciphertext || !encrypted.iv || !encrypted.authTag) {
    throw new Error('Invalid encrypted credential format');
  }

  const key = getEncryptionKey();
  const iv = Buffer.from(encrypted.iv, 'base64');
  const authTag = Buffer.from(encrypted.authTag, 'base64');
  const ciphertext = encrypted.ciphertext;

  if (iv.length !== IV_LENGTH) {
    throw new Error('Invalid IV length');
  }

  if (authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error('Invalid auth tag length');
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
  plaintext += decipher.final('utf8');

  return plaintext;
};

// ==========================================
// Database Storage Helpers
// ==========================================

/**
 * Prepare a credential for database storage
 * Combines ciphertext + authTag into single field for simpler schema
 *
 * @param apiKey - The plaintext API key
 * @returns Object with encryptedApiKey and encryptedApiKeyIv for DB storage
 */
export const prepareForStorage = (apiKey: string): StorageCredential => {
  const encrypted = encryptCredential(apiKey);

  // Combine ciphertext and authTag (both base64)
  const combined = encrypted.ciphertext + ':' + encrypted.authTag;

  return {
    encryptedApiKey: combined,
    encryptedApiKeyIv: encrypted.iv,
  };
};

/**
 * Retrieve and decrypt a credential from database storage
 *
 * @param encryptedApiKey - Combined ciphertext:authTag from DB
 * @param iv - IV from DB
 * @returns Decrypted API key
 */
export const retrieveFromStorage = (
  encryptedApiKey: string,
  iv: string
): string => {
  if (!encryptedApiKey || !iv) {
    throw new Error('Both encryptedApiKey and iv are required');
  }

  // Split combined ciphertext and authTag
  const parts = encryptedApiKey.split(':');

  if (parts.length !== 2) {
    throw new Error('Invalid encrypted API key format');
  }

  const [ciphertext, authTag] = parts;

  return decryptCredential({
    ciphertext,
    iv,
    authTag,
  });
};

// ==========================================
// Validation Helpers
// ==========================================

/**
 * Check if a provider has valid encrypted credentials
 */
export const hasValidCredentials = (
  encryptedApiKey?: string | null,
  encryptedApiKeyIv?: string | null
): boolean => {
  return !!(
    encryptedApiKey &&
    encryptedApiKeyIv &&
    encryptedApiKey.includes(':')
  );
};

/**
 * Safely attempt to decrypt credentials
 * Returns null if decryption fails instead of throwing
 */
export const safeRetrieveFromStorage = (
  encryptedApiKey?: string | null,
  iv?: string | null
): string | null => {
  if (!encryptedApiKey || !iv) {
    return null;
  }

  try {
    return retrieveFromStorage(encryptedApiKey, iv);
  } catch (error) {
    console.error('Failed to decrypt credentials:', error);
    return null;
  }
};

// ==========================================
// Key Rotation Support
// ==========================================

/**
 * Re-encrypt a credential with current key
 * Useful for key rotation - decrypt with old key, re-encrypt with new
 *
 * @param oldPlaintext - Already decrypted credential
 * @returns New storage credential
 */
export const rotateCredential = (oldPlaintext: string): StorageCredential => {
  return prepareForStorage(oldPlaintext);
};

/**
 * Mask an API key for display purposes
 * Shows first 4 and last 4 characters only
 */
export const maskApiKey = (apiKey: string): string => {
  if (!apiKey || apiKey.length < 12) {
    return '****';
  }

  const first = apiKey.slice(0, 4);
  const last = apiKey.slice(-4);
  const middle = '*'.repeat(Math.min(apiKey.length - 8, 20));

  return `${first}${middle}${last}`;
};

// ==========================================
// Environment Validation
// ==========================================

/**
 * Check if encryption is properly configured
 * Call this at app startup to validate setup
 */
export const validateEncryptionSetup = (): { valid: boolean; message: string } => {
  try {
    getEncryptionKey();

    // Test encrypt/decrypt cycle
    const testValue = 'test-' + Date.now();
    const encrypted = encryptCredential(testValue);
    const decrypted = decryptCredential(encrypted);

    if (decrypted !== testValue) {
      return {
        valid: false,
        message: 'Encryption round-trip test failed',
      };
    }

    return {
      valid: true,
      message: 'Encryption configured correctly',
    };
  } catch (error) {
    return {
      valid: false,
      message: (error as Error).message,
    };
  }
};
