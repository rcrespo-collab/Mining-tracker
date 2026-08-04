/**
 * Helpers for `enum[]` columns (stored as JSON text) with runtime validation,
 * and for the encrypted-field boundary. SQLite cannot CHECK the members of a
 * JSON array, so validation happens here on the way in and out.
 */
import { z } from 'zod';

/** Serialise a validated enum array to JSON text (null when empty/absent). */
export function packEnumArray<T extends string>(
  values: T[] | null | undefined,
  schema: z.ZodEnum<[T, ...T[]]>,
): string | null {
  if (!values || values.length === 0) return null;
  const validated = values.map((v) => schema.parse(v));
  return JSON.stringify(validated);
}

/** Parse a JSON enum array back to a validated array (empty when null). */
export function unpackEnumArray<T extends string>(
  json: string | null | undefined,
  schema: z.ZodEnum<[T, ...T[]]>,
): T[] {
  if (!json) return [];
  const parsed = JSON.parse(json) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed.map((v) => schema.parse(v));
}
