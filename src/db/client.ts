/**
 * SQLite + Drizzle client (docs/SPEC.md §11 "local-first, works fully offline").
 *
 * The database and the field-encryption key are initialised once at app start
 * (`initDatabase`) and then read synchronously by the repositories. All data is
 * local to the device; there is no sync target in Phase 1.
 */
import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../../drizzle/migrations';
import * as schema from './schema';
import { getOrCreateEncryptionKey } from './keystore';

const DB_NAME = 'repair.db';

let db: ExpoSQLiteDatabase<typeof schema> | null = null;
let encryptionKey: Uint8Array | null = null;

/**
 * Open the database, enable foreign keys, apply migrations, and load the
 * encryption key. Idempotent — safe to call from the root layout on every mount.
 */
export async function initDatabase(): Promise<void> {
  if (db) return;
  const sqlite = openDatabaseSync(DB_NAME);
  sqlite.execSync('PRAGMA foreign_keys = ON;');
  const instance = drizzle(sqlite, { schema });
  await migrate(instance, migrations);
  db = instance;
  encryptionKey = await getOrCreateEncryptionKey();
}

/** The Drizzle database. Throws if accessed before {@link initDatabase}. */
export function getDb(): ExpoSQLiteDatabase<typeof schema> {
  if (!db) throw new Error('Database not initialised — call initDatabase() first.');
  return db;
}

/** The field-encryption key. Throws if accessed before {@link initDatabase}. */
export function getKey(): Uint8Array {
  if (!encryptionKey) throw new Error('Encryption key not loaded — call initDatabase() first.');
  return encryptionKey;
}

export { schema };
