export function validateEnv(customVars?: string[]) {
  const requiredVars = customVars || ["NODE_ENV"]
  const missingVars: string[] = []

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  }

  if (missingVars.length > 0) {
    console.warn(`[环境变量警告] 以下环境变量未配置: ${missingVars.join(", ")}`)
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
  }
}

export function validateDatabaseConfig() {
  const required = ["YYC3_YY_DB_HOST", "YYC3_YY_DB_USER", "YYC3_YY_DB_PASSWORD", "YYC3_YY_DB_NAME"]
  const missing = required.filter((v) => !process.env[v])
  return { isValid: missing.length === 0, missing }
}

export function validateAIConfig() {
  const enabled = !!process.env.OPENAI_API_KEY || !!process.env.AI_API_KEY
  return { isValid: true, enabled }
}

export function validateBigDataConfig() {
  const enabled = !!process.env.BI_HOST && !!process.env.OLAP_HOST
  return { isValid: true, enabled }
}

export function validateIoTConfig() {
  const enabled = !!process.env.MQTT_BROKER_URL
  return { isValid: true, enabled }
}

export function validateAllConfigs() {
  const results = {
    env: validateEnv(),
    database: validateDatabaseConfig(),
    ai: validateAIConfig(),
    bigdata: validateBigDataConfig(),
    iot: validateIoTConfig(),
  }
  const isValid = results.env.isValid && results.database.isValid
  return { isValid, results }
}
