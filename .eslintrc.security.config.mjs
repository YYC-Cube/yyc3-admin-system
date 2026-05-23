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
      'coverage/**',
      'scripts/**'
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
    },
    rules: {
      // Security-focused rules
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-script-url': 'error',
      'no-alert': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      
      // TypeScript security rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-nullish-coalescing': 'warn',
      'prefer-optional-chain': 'warn',
      
      // Code quality
      'prefer-const': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      'array-callback-return': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '__tests__/**/*'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      // Relaxed rules for test files
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'no-debugger': 'off',
    },
  }
);