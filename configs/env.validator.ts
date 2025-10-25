import { env } from "./env.sync"

export function validateEnv(required: (keyof typeof env)[]) {
  const missing = required.filter((key) => env[key] === undefined || env[key] === "")
  if (missing.length > 0) {
    throw new Error(`❌ 缺少环境变量: ${missing.join(", ")}`)
  }
}
