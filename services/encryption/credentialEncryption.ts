/**
 * Credential Encryption Service
 *
 * Provides AES-256-GCM encryption for API keys and sensitive credentials.
 * In production, the encryption key should be stored in environment variables
 * or a secure key management service.
 */

// Encryption configuration
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM
const TAG_LENGTH = 128; // 128 bits authentication tag

// In production, this should come from environment variables or KMS
const getEncryptionKey = (): string => {
  // Check for environment variable first
  if (typeof process !== 'undefined' && process.env?.CREDENTIAL_ENCRYPTION_KEY) {
    return process.env.CREDENTIAL_ENCRYPTION_KEY;
  }

  // Fallback for development - In production, NEVER use a hardcoded key
  console.warn('[Security Warning] Using development encryption key. Set CREDENTIAL_ENCRYPTION_KEY in production.');
  return 'dev-key-32-chars-exactly-here!!'; // Must be 32 characters for AES-256
};

/**
 * Convert string to ArrayBuffer
 */
const stringToBuffer = (str: string): ArrayBuffer => {
  return new TextEncoder().encode(str);
};

/**
 * Convert ArrayBuffer to base64 string
 */
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * Convert base64 string to ArrayBuffer
 */
const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Generate a random IV
 */
const generateIV = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
};

/**
 * Import the encryption key
 */
const importKey = async (keyString: string): Promise<CryptoKey> => {
  const keyBuffer = stringToBuffer(keyString);

  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypt credentials using AES-256-GCM
 *
 * @param plaintext - The API key or credential to encrypt
 * @returns Object containing encrypted data and IV (both base64 encoded)
 */
export const encryptCredentials = async (
  plaintext: string
): Promise<{ encrypted: string; iv: string }> => {
  try {
    const key = await importKey(getEncryptionKey());
    const iv = generateIV();
    const plaintextBuffer = stringToBuffer(plaintext);

    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
        tagLength: TAG_LENGTH,
      },
      key,
      plaintextBuffer
    );

    return {
      encrypted: bufferToBase64(encryptedBuffer),
      iv: bufferToBase64(iv.buffer),
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt credentials');
  }
};

/**
 * Decrypt credentials using AES-256-GCM
 *
 * @param encrypted - Base64 encoded encrypted data
 * @param iv - Base64 encoded initialization vector
 * @returns Decrypted plaintext
 */
export const decryptCredentials = async (
  encrypted: string,
  iv: string
): Promise<string> => {
  try {
    const key = await importKey(getEncryptionKey());
    const encryptedBuffer = base64ToBuffer(encrypted);
    const ivBuffer = new Uint8Array(base64ToBuffer(iv));

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: ivBuffer,
        tagLength: TAG_LENGTH,
      },
      key,
      encryptedBuffer
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt credentials');
  }
};

/**
 * Mask an API key for display (show only last 4 characters)
 *
 * @param apiKey - The API key to mask
 * @returns Masked API key (e.g., "••••••••••••abcd")
 */
export const maskApiKey = (apiKey: string): string => {
  if (!apiKey || apiKey.length < 4) {
    return '••••••••';
  }

  const lastFour = apiKey.slice(-4);
  const maskLength = Math.min(apiKey.length - 4, 12);
  return '•'.repeat(maskLength) + lastFour;
};

/**
 * Validate API key format (basic validation)
 *
 * @param apiKey - The API key to validate
 * @returns boolean indicating if the key appears valid
 */
export const validateApiKeyFormat = (apiKey: string): boolean => {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  // Basic validation: must be at least 10 characters
  if (apiKey.length < 10) {
    return false;
  }

  // Should only contain alphanumeric characters, hyphens, and underscores
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return validPattern.test(apiKey);
};

/**
 * Simple synchronous encryption for development/localStorage
 * NOT for production use - use async version with Web Crypto API
 */
export const encryptCredentialsSync = (plaintext: string): { encrypted: string; iv: string } => {
  // Simple XOR-based obfuscation for development only
  // In production, always use the async AES-GCM version
  const key = getEncryptionKey();
  const iv = Array.from({ length: IV_LENGTH }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  let encrypted = '';
  for (let i = 0; i < plaintext.length; i++) {
    const charCode = plaintext.charCodeAt(i) ^ key.charCodeAt(i % key.length) ^ parseInt(iv.substr((i * 2) % iv.length, 2), 16);
    encrypted += String.fromCharCode(charCode);
  }

  return {
    encrypted: btoa(encrypted),
    iv: iv,
  };
};

/**
 * Simple synchronous decryption for development/localStorage
 * NOT for production use - use async version with Web Crypto API
 */
export const decryptCredentialsSync = (encrypted: string, iv: string): string => {
  const key = getEncryptionKey();
  const decoded = atob(encrypted);

  let decrypted = '';
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length) ^ parseInt(iv.substr((i * 2) % iv.length, 2), 16);
    decrypted += String.fromCharCode(charCode);
  }

  return decrypted;
};

export default {
  encryptCredentials,
  decryptCredentials,
  encryptCredentialsSync,
  decryptCredentialsSync,
  maskApiKey,
  validateApiKeyFormat,
};
