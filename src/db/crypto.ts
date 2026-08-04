/**
 * Field-level encryption (docs/SPEC.md §11 "at rest").
 *
 * Pure, dependency-light AES-256-GCM using the audited `@noble/ciphers`. This
 * module is deliberately free of any Expo/React-Native import so it can be unit
 * tested in plain Node — the key and CSPRNG are injected, not imported. Runtime
 * key management (secure-store) lives in `keystore.ts`.
 *
 * Stored format (base64): [12-byte nonce][ciphertext+tag]. A 256-bit key gives
 * AES-256-GCM. Randomness comes from the global Web Crypto `getRandomValues`,
 * which is present in Node 20 and polyfilled by Expo on-device.
 */
import { gcm } from '@noble/ciphers/aes';

const NONCE_BYTES = 12;

function randomNonce(): Uint8Array {
  const nonce = new Uint8Array(NONCE_BYTES);
  // Web Crypto CSPRNG — available in Node and polyfilled by Expo. Not a network API.
  globalThis.crypto.getRandomValues(nonce);
  return nonce;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  // btoa exists in Node 20 global scope and in Hermes.
  return globalThis.btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = globalThis.atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/** Encrypt a UTF-8 string. Returns base64 `nonce||ciphertext`. */
export function encryptString(plaintext: string, key: Uint8Array): string {
  assertKey(key);
  const nonce = randomNonce();
  const ct = gcm(key, nonce).encrypt(encoder.encode(plaintext));
  const packed = new Uint8Array(nonce.length + ct.length);
  packed.set(nonce, 0);
  packed.set(ct, nonce.length);
  return toBase64(packed);
}

/** Decrypt a value produced by {@link encryptString}. */
export function decryptString(payload: string, key: Uint8Array): string {
  assertKey(key);
  const packed = fromBase64(payload);
  const nonce = packed.subarray(0, NONCE_BYTES);
  const ct = packed.subarray(NONCE_BYTES);
  const pt = gcm(key, nonce).decrypt(ct);
  return decoder.decode(pt);
}

/** Encrypt only when a value is present; pass through null/undefined. */
export function encryptNullable(value: string | null | undefined, key: Uint8Array): string | null {
  return value == null ? null : encryptString(value, key);
}

/** Decrypt only when a value is present; pass through null. */
export function decryptNullable(value: string | null | undefined, key: Uint8Array): string | null {
  return value == null ? null : decryptString(value, key);
}

function assertKey(key: Uint8Array): void {
  if (key.length !== 32) {
    throw new Error(`Encryption key must be 32 bytes (AES-256); got ${key.length}.`);
  }
}
