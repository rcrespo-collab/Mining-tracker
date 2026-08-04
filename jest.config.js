/**
 * Jest + React Native Testing Library for component tests (matched by
 * `*.test.tsx`). The pure-logic and guardrail suites run under Vitest
 * (`*.test.ts`); this runner covers rendering and interaction.
 */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/?(*.)+(test).tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|zustand|drizzle-orm|@noble/.*|victory-native|@shopify/react-native-skia)/)',
  ],
};
