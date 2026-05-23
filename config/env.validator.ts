/**
 * @file env.validator.ts
 * @description 环境变量验证 - 真正的验证逻辑
 * @module config
 * @author YYC³
 * @version 2.0.0
 * @created 2025-01-19
 * @updated 2026-05-23
 */

interface EnvValidationResult {
  isValid: boolean
  missingVars: string[]
}

interface ConfigValidationResult {
  isValid: boolean
  missing: string[]
  warnings?: string[]
}

export function validateEnv(requiredVars?: string[]): EnvValidationResult {
  const defaults = ["NODE_ENV"]
  const varsToCheck = requiredVars || defaults
  const missingVars: string[] = []

  for (const varName of varsToCheck) {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  }

  if (missingVars.length > 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `[ENV FATAL] 生产环境缺少必要变量: ${missingVars.join(', ')}`
      )
    }
    console.warn(
      `[ENV WARN] 以下环境变量未配置: ${missingVars.join(', ')}`
    )
  }

  return { isValid: missingVars.length === 0, missingVars }
}

export function validateDatabaseConfig(): ConfigValidationResult {
  const required = ['PG_HOST', 'PG_USER', 'PG_DATABASE']
  const missing = required.filter(v => !process.env[v] && !process.env.DATABASE_URL)
  const warnings: string[] = []

  if (!process.env.DATABASE_URL && !process.env.PG_PORT) warnings.push('PG_PORT 未设置，使用默认 5432')
  if (!process.env.DATABASE_URL && !process.env.PG_PASSWORD && process.env.NODE_ENV === 'production') {
    warnings.push('PG_PASSWORD 生产环境未设置')
  }

  return { isValid: missing.length === 0, missing, warnings }
}

export function validateAIConfig(): ConfigValidationResult {
  const missing: string[] = []
  const warnings: string[] = []

  if (!process.env.OPENAI_API_KEY) warnings.push('OPENAI_API_KEY 未设置，AI 功能将不可用')

  return { isValid: true, missing, warnings }
}

export function validateBigDataConfig(): ConfigValidationResult {
  return { isValid: true, missing: [], warnings: [] }
}

export function validateIoTConfig(): ConfigValidationResult {
  const warnings: string[] = []
  if (!process.env.MQTT_BROKER_URL) warnings.push('MQTT_BROKER_URL 未设置，IoT 设备通信将不可用')
  return { isValid: true, missing: [], warnings }
}

export function validateRedisConfig(): ConfigValidationResult {
  const missing: string[] = []
  const warnings: string[] = []

  if (!process.env.REDIS_URL) warnings.push('REDIS_URL 未设置，缓存功能将不可用')
  if (!process.env.REDIS_PASSWORD && process.env.NODE_ENV === 'production') {
    warnings.push('REDIS_PASSWORD 生产环境未设置')
  }

  return { isValid: missing.length === 0, missing, warnings }
}

export function validateAllConfigs(): {
  isValid: boolean
  results: Record<string, ConfigValidationResult | EnvValidationResult>
} {
  const results: Record<string, ConfigValidationResult | EnvValidationResult> = {
    env: validateEnv(),
    database: validateDatabaseConfig(),
    ai: validateAIConfig(),
    bigdata: validateBigDataConfig(),
    iot: validateIoTConfig(),
    redis: validateRedisConfig(),
  }

  const isValid = Object.values(results).every(r => r.isValid)

  return { isValid, results }
}
