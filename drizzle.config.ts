import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit config. `expo` driver emits migrations compatible with the
 * expo-sqlite migrator (applied on app start; see src/db/client.ts). Run
 * `npm run db:generate` after any schema change.
 */
export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './src/db/schema/index.ts',
  out: './drizzle',
});
