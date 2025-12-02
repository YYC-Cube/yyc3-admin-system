// ESLint 配置文件
// 基于 Next.js + TypeScript + React 项目的推荐配置

import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  // 基础配置
  js.configs.recommended,

  // 忽略 node_modules 和构建产物
  { ignores: ['node_modules/**', '.next/**', 'out/**', 'dist/**', 'services/**'] },

  // React 配置
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        React: 'readonly',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Next.js 13+ 不需要 React 导入
      'react/prop-types': 'off', // 使用 TypeScript 类型检查
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Prettier 集成
  prettier,
];
