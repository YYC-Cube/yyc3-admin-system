import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'public/**',
      'tests/performance/**', // k6 performance tests
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unsafe-function-type': 'warn', // Allow Function type with warning
      '@typescript-eslint/no-unused-expressions': 'warn', // Convert to warning
      'no-case-declarations': 'warn', // Convert to warning
    },
  }
);
