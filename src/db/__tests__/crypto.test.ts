import { describe, it, expect } from 'vitest';
import { encryptString, decryptString, encryptNullable, decryptNullable } from '../crypto';

function key(): Uint8Array {
  const k = new Uint8Array(32);
  globalThis.crypto.getRandomValues(k);
  return k;
}

describe('field-level encryption (AES-256-GCM)', () => {
  it('round-trips a string', () => {
    const k = key();
    const secret = 'I felt unimportant.';
    const ct = encryptString(secret, k);
    expect(ct).not.toContain(secret);
    expect(decryptString(ct, k)).toBe(secret);
  });

  it('produces different ciphertext each time (random nonce)', () => {
    const k = key();
    expect(encryptString('same', k)).not.toBe(encryptString('same', k));
  });

  it('fails to decrypt with the wrong key', () => {
    const ct = encryptString('secret', key());
    expect(() => decryptString(ct, key())).toThrow();
  });

  it('rejects a key of the wrong length', () => {
    expect(() => encryptString('x', new Uint8Array(16))).toThrow(/32 bytes/);
  });

  it('passes null through the nullable helpers', () => {
    const k = key();
    expect(encryptNullable(null, k)).toBeNull();
    expect(decryptNullable(null, k)).toBeNull();
    expect(decryptNullable(encryptNullable('x', k), k)).toBe('x');
  });

  it('handles unicode', () => {
    const k = key();
    const s = 'não é sobre o cartão de crédito — é reconhecimento 💛';
    expect(decryptString(encryptString(s, k), k)).toBe(s);
  });
});
