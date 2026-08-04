// ESLint (flat-config-free classic setup) for the Repair Expo app.
module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  ignorePatterns: ['node_modules/', 'dist/', '.expo/', 'coverage/', 'drizzle/'],
  rules: {
    // The no-network guarantee is enforced structurally by
    // scripts/check-no-network.mjs; these bans give an in-editor signal too.
    'no-restricted-globals': [
      'error',
      { name: 'fetch', message: 'No network in Phase 1 (see docs/SPEC.md §11).' },
      { name: 'XMLHttpRequest', message: 'No network in Phase 1 (see docs/SPEC.md §11).' },
      { name: 'WebSocket', message: 'No network in Phase 1 (see docs/SPEC.md §11).' },
    ],
    // Copy is verbatim from the spec wireframes and full of apostrophes and
    // quotes in JSX text; escaping them would corrupt clinical wording.
    'react/no-unescaped-entities': 'off',
    // Unused symbols are a warning, not a build-breaking error.
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
};
