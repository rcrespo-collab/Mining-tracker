/** UUID generation for primary keys. Uses expo-crypto's CSPRNG-backed UUIDs. */
import * as Crypto from 'expo-crypto';

export function newId(): string {
  return Crypto.randomUUID();
}
