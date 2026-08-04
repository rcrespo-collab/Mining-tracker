import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

/**
 * Vitest runs the pure-logic and guardrail suites (metrics, rules, schema
 * guarantee, no-network, severity containment, safety routing). These are
 * plain TypeScript and Drizzle table objects — no React Native runtime — so
 * they run fast in Node and gate every commit.
 *
 * Component tests that need the RN runtime use Jest + React Native Testing
 * Library (see jest.config.js) and are matched by `*.test.tsx`.
 */
export default defineConfig({
  // The logic suites are plain TypeScript; keep them independent of the
  // Expo/React-Native tsconfig so they transform and run in a bare Node
  // environment (no `expo/tsconfig.base` needed).
  esbuild: {
    tsconfigRaw: { compilerOptions: { target: 'es2022' } },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.expo'],
  },
});
