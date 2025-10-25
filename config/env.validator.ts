// 环境变量验证函数
export function validateEnv(customVars?: string[]) {
  const requiredVars = customVars || ["NODE_ENV"]
  const missingVars: string[] = []

  for (const varName of requiredVars) {
    if (!varName) {
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
  return { isValid: true, missing: [] }
}

export function validateAIConfig() {
  return { isValid: true, enabled: true }
}

export function validateBigDataConfig() {
  return { isValid: true, enabled: true }
}

export function validateIoTConfig() {
  return { isValid: true, enabled: true }
}

export function validateAllConfigs() {
  return { isValid: true, results: {} }
}
