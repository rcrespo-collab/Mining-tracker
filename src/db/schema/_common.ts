/**
 * Shared column helpers for the Drizzle schema.
 *
 * Conventions (docs/SPEC.md §6):
 *  - `uuid`  → text primary/foreign keys (UUID v4 strings).
 *  - `ts`    → integer epoch-ms (`timestamp_ms`).
 *  - `date`  → text ISO date `YYYY-MM-DD`.
 *  - `bool`  → integer 0/1 (`mode: 'boolean'`).
 *  - `enum`  → text typed to the enum tuple, with a CHECK constraint.
 *  - `enum[]`→ text holding a JSON array; element validation lives in the
 *              repository layer (SQLite cannot CHECK JSON array members).
 */
import { sql } from 'drizzle-orm';
import { text, integer, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { check } from 'drizzle-orm/sqlite-core';
import type { CheckBuilder } from 'drizzle-orm/sqlite-core';

/** A UUID primary key column. */
export const pk = () => text('id').primaryKey();

/** A timestamp column (epoch ms). */
export const ts = (name: string) => integer(name, { mode: 'timestamp_ms' });

/** A boolean column (stored 0/1). */
export const bool = (name: string) => integer(name, { mode: 'boolean' });

/** A text column typed to an enum tuple (no CHECK — pair with `enumCheck`). */
export const enumText = <const T extends readonly [string, ...string[]]>(name: string, values: T) =>
  text(name, { enum: values });

/**
 * Build a CHECK constraint restricting `column` to `values` (allowing NULL, so
 * optional enums stay nullable). Add the returned constraint to the table's
 * constraint array.
 */
export function enumCheck(
  name: string,
  column: AnySQLiteColumn,
  values: readonly string[],
) {
  const list = values.map((v) => `'${v}'`).join(', ');
  return check(name, sql.raw(`"${column.name}" IS NULL OR "${column.name}" IN (${list})`));
}

/**
 * Collect table constraints into the object shape drizzle-orm's table-config
 * callback expects (`Record<string, CheckBuilder>`). Keys are synthetic — the
 * real constraint name is embedded in each `check(name, ...)`.
 */
export function constraints(...items: CheckBuilder[]): Record<string, CheckBuilder> {
  return Object.fromEntries(items.map((c, i) => [`ck_${i}`, c]));
}
