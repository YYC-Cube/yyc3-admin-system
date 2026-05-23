import { defineConfig } from "@playwright/test"
import dotenv from "dotenv"

// ✅ 加载测试环境变量
dotenv.config({ path: ".env.test" })

export default defineConfig({
  use: {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${process.env.JWT_SECRET}`,
    },
  },
  webServer: {
    command: "npm run dev",
    port: Number(process.env.DEV_PORT || 3000),
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
})
