export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: Error
  userId?: string
  requestId?: string
}

class Logger {
  private serviceName: string

  constructor(serviceName = "ktv-admin") {
    this.serviceName = serviceName
  }

  private formatLog(entry: LogEntry): string {
    return JSON.stringify({
      service: this.serviceName,
      ...entry,
      timestamp: new Date().toISOString(),
    })
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error
        ? ({
            name: error.name,
            message: error.message,
            stack: error.stack,
          } as any)
        : undefined,
    }

    const formatted = this.formatLog(entry)

    // 根据环境选择输出方式
    if (process.env.NODE_ENV === "production") {
      // 生产环境：发送到日志收集服务
      this.sendToLogService(formatted)
    } else {
      // 开发环境：控制台输出
      console.log(formatted)
    }
  }

  private async sendToLogService(log: string) {
    // 发送到日志收集服务（如ELK、Datadog等）
    try {
      if (process.env.LOG_SERVICE_URL) {
        await fetch(process.env.LOG_SERVICE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: log,
        })
      }
    } catch (error) {
      console.error("[v0] Failed to send log:", error)
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context, error)
  }
}

export const logger = new Logger()
