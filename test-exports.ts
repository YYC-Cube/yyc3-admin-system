// 测试文件：验证环境变量模块导出是否正确
// 此文件仅用于验证，不会在生产环境中使用

import { validateEnv } from "@/config/env.validator"
import { env } from "@/env.sync"

console.log("[测试] 开始验证环境变量模块导出...")

// 测试 validateEnv 函数是否可以导入和调用
if (typeof validateEnv === "function") {
  console.log("✅ validateEnv 函数导出正确")
  const result = validateEnv(["NODE_ENV"])
  console.log("✅ validateEnv 函数可以正常调用", result)
} else {
  console.error("❌ validateEnv 函数导出失败")
}

// 测试 env 对象是否可以导入和访问
if (typeof env === "object" && env !== null) {
  console.log("✅ env 对象导出正确")
  console.log("✅ env.NODE_ENV =", env.NODE_ENV)
} else {
  console.error("❌ env 对象导出失败")
}

console.log("[测试] 环境变量模块导出验证完成")
