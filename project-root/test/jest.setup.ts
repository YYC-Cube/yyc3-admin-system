// ✅ 加载测试环境变量
import dotenv from "dotenv"
dotenv.config({ path: ".env.test" })

// ✅ 启用客户端模式（适用于 Next.js 前端组件测试）
"use client"

import "@testing-library/jest-dom"
import { jest } from "@jest/globals"

// ✅ Mock Next.js 路由相关方法
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return "/"
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// ✅ Mock framer-motion 动画组件（避免测试中报错）
jest.mock("framer-motion", () => ({
  motion: {
    div: "div",
    button: "button",
    span: "span",
  },
  AnimatePresence: ({ children }: any) => children,
}))
