/**
 * Runtime key management for field-level encryption (docs/SPEC.md §11).
 *
 * The 256-bit key is generated on first launch and stored in the platform
 * keychain/keystore via `expo-secure-store` — never in the SQLite file, never
 * in plain app storage. This module is the only place that touches the key
 * material; the cipher itself (`crypto.ts`) stays pure and testable.
 */
import * as SecureStore from 'expo-secure-store';

const KEY_ID = 'repair.field-encryption-key.v1';
const KEY_BYTES = 32;

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return globalThis.btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = globalThis.atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

/**
 * Return the device's field-encryption key, generating and persisting one on
 * first use. Requires device unlock (secure-store default accessibility).
 */
export async function getOrCreateEncryptionKey(): Promise<Uint8Array> {
  const existing = await SecureStore.getItemAsync(KEY_ID);
  if (existing) return fromBase64(existing);

  const key = new Uint8Array(KEY_BYTES);
  // Web Crypto CSPRNG, polyfilled by Expo. Not a network API.
  globalThis.crypto.getRandomValues(key);
  await SecureStore.setItemAsync(KEY_ID, toBase64(key), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return key;
}
