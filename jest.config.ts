import type { Config } from "jest"
import nextJest from "next/jest"

const createJestConfig = nextJest({
  dir: "./",
})

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/dist/**",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/dist/",
    "/e2e/", // Exclude Playwright e2e tests
    "/tests/security/", // Exclude Playwright security tests
    "/__tests__/lib/security/security\\.audit\\.chain\\.ts$",
    "/__tests__/lib/security/security\\.score\\.ts$",
    "/__tests__/lib/sync/sync\\.kafka\\.config\\.ts$",
    "/__tests__/lib/sync/data-integrity-check\\.ts$",
    "/__tests__/lib/integration/api\\.map\\.ts$",
    "/__tests__/lib/integration/graphql\\.gateway\\.ts$",
  ],
  testTimeout: 10000,
}

export default createJestConfig(config)
