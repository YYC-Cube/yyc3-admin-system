// 🛡️ 统一错误处理（非组件环境）
// 在工具类与服务中避免使用 React Hooks，改为日志与可扩展的告警机制

export class ErrorHandler {
  static handleParseError(format: string, language: string = "zh") {
    console.error(`🚨 [ParseError] 格式 ${format} 解析失败`, { language })
  }

  static handleGenerateError(format: string, language: string = "zh") {
    console.error(`🚨 [GenerateError] 格式 ${format} 生成失败`, { language })
  }

  // === 新增：统一告警与错误入口，便于集成监控系统（如 Sentry） ===
  static handle(error: unknown, context: string) {
    console.error(`🚨 [${context}] 错误:`, error)
    this.sendAlert(error, context)
  }

  static sendAlert(error: unknown, context: string) {
    console.error(`📣 [${context}] 告警:`, error)
    // TODO: 集成外部监控系统，如 Sentry、自建Webhook等
  }
}