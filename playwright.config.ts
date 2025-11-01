import { defineConfig, devices } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3015'
const USE_WS = process.env.PLAYWRIGHT_WEB_SERVER !== ''

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/globalSetup.ts',
  timeout: 30_000,
  use: {
    baseURL: BASE,
    trace: 'on-first-retry',
    video: 'retry-with-video',
    screenshot: 'only-on-failure',
  },
  webServer: USE_WS ? {
    command: 'pnpm exec next dev -p 3015',
    url: 'http://localhost:3015/api/health',
    reuseExistingServer: true,
    timeout: 120_000,
  } : undefined,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
