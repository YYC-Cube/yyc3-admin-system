/**
 * @file Vitest 配置
 * @description 使用 Node 环境，支持 TypeScript 与别名 '@/*'
 * @author YYC
 */
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "lib/**/*.test.ts",
    ],
    globals: true,
    restoreMocks: true,
    passWithNoTests: false,
  },
  resolve: {
    alias: {
      "@": new URL("./", import.meta.url).pathname,
    },
  },
})
