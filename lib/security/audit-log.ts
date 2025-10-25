// 审计日志系统
import { mockDB } from "@/lib/utils/storage"

export interface AuditLog {
  id: string
  userId: string
  username: string
  action: string
  resource: string
  resourceId?: string
  details?: any
  ip?: string
  userAgent?: string
  timestamp: string
  status: "success" | "failure"
}

export class AuditLogger {
  private static instance: AuditLogger

  private constructor() {}

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  async log(log: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
    const auditLog: AuditLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    }

    // 存储到数据库
    const logs = mockDB.get("audit_logs") || []
    logs.push(auditLog)
    mockDB.set("audit_logs", logs)

    // 在生产环境中，应该写入专门的日志系统
    console.log("[AUDIT]", auditLog)
  }

  async getLogs(filters?: {
    userId?: string
    action?: string
    startDate?: string
    endDate?: string
  }): Promise<AuditLog[]> {
    let logs: AuditLog[] = mockDB.get("audit_logs") || []

    if (filters) {
      if (filters.userId) {
        logs = logs.filter((log) => log.userId === filters.userId)
      }
      if (filters.action) {
        logs = logs.filter((log) => log.action === filters.action)
      }
      if (filters.startDate) {
        logs = logs.filter((log) => log.timestamp >= filters.startDate!)
      }
      if (filters.endDate) {
        logs = logs.filter((log) => log.timestamp <= filters.endDate!)
      }
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }
}

export const auditLogger = AuditLogger.getInstance()
