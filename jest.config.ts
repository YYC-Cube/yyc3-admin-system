/** @type {import('jest').Config} */
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // 提供 Next.js 应用程序的路径
  dir: './',
})

// 添加自定义 Jest 配置
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(msw)/)', // 允许转换msw模块
  ],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!coverage/**',
    '!jest.config.js',
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
  testMatch: [
    '**/__tests__/**/*.test.{js,jsx,ts,tsx}',
    '**/__tests__/working/**/*.test.{js,jsx,ts,tsx}',
    '**/__tests__/basic/**/*.test.{js,jsx,ts,tsx}',
    '**/__tests__/*.test.{js,jsx,ts,tsx}',
    '**/*.(test|spec).{js,jsx,ts,tsx}',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}

// createJestConfig 在这里被导出以确保配置文件不失效
module.exports = createJestConfig(customJestConfig)
