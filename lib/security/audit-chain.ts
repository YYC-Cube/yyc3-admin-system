import crypto from "crypto"

// 审计事件类型
export enum AuditEventType {
  USER_LOGIN = "USER_LOGIN",
  USER_LOGOUT = "USER_LOGOUT",
  DATA_ACCESS = "DATA_ACCESS",
  DATA_MODIFY = "DATA_MODIFY",
  DATA_DELETE = "DATA_DELETE",
  PERMISSION_CHANGE = "PERMISSION_CHANGE",
  SECURITY_ALERT = "SECURITY_ALERT",
  SYSTEM_CONFIG = "SYSTEM_CONFIG",
}

// 审计事件
export interface AuditEvent {
  id: string
  timestamp: number
  type: AuditEventType
  userId: string
  userName: string
  action: string
  resource: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  result: "success" | "failure"
  previousHash: string
  hash: string
}

// 审计链系统
export class AuditChainSystem {
  private chain: AuditEvent[] = []
  private readonly MAX_CHAIN_LENGTH = 10000

  // 添加审计事件
  addEvent(event: Omit<AuditEvent, "id" | "timestamp" | "previousHash" | "hash">): AuditEvent {
    const previousHash = this.chain.length > 0 ? this.chain[this.chain.length - 1].hash : "0"

    const auditEvent: AuditEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      previousHash,
      hash: "",
    }

    // 计算当前事件的哈希
    auditEvent.hash = this.calculateHash(auditEvent)

    // 添加到链中
    this.chain.push(auditEvent)

    // 限制链长度
    if (this.chain.length > this.MAX_CHAIN_LENGTH) {
      this.chain.shift()
    }

    return auditEvent
  }

  // 计算事件哈希
  private calculateHash(event: AuditEvent): string {
    const data = JSON.stringify({
      id: event.id,
      timestamp: event.timestamp,
      type: event.type,
      userId: event.userId,
      action: event.action,
      resource: event.resource,
      details: event.details,
      result: event.result,
      previousHash: event.previousHash,
    })

    return crypto.createHash("sha256").update(data).digest("hex")
  }

  // 验证审计链完整性
  verifyChainIntegrity(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    for (let i = 0; i < this.chain.length; i++) {
      const event = this.chain[i]

      // 验证哈希
      const calculatedHash = this.calculateHash(event)
      if (event.hash !== calculatedHash) {
        errors.push(`Event ${event.id} has invalid hash`)
      }

      // 验证链接
      if (i > 0) {
        const previousEvent = this.chain[i - 1]
        if (event.previousHash !== previousEvent.hash) {
          errors.push(`Event ${event.id} has broken chain link`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  // 查询审计事件
  queryEvents(filters: {
    userId?: string
    type?: AuditEventType
    startTime?: number
    endTime?: number
    resource?: string
  }): AuditEvent[] {
    return this.chain.filter((event) => {
      if (filters.userId && event.userId !== filters.userId) return false
      if (filters.type && event.type !== filters.type) return false
      if (filters.startTime && event.timestamp < filters.startTime) return false
      if (filters.endTime && event.timestamp > filters.endTime) return false
      if (filters.resource && !event.resource.includes(filters.resource)) return false
      return true
    })
  }

  // 获取审计统计
  getStatistics() {
    const stats = {
      totalEvents: this.chain.length,
      eventsByType: {} as Record<string, number>,
      eventsByUser: {} as Record<string, number>,
      successRate: 0,
      recentEvents: this.chain.slice(-10),
    }

    let successCount = 0

    for (const event of this.chain) {
      // 按类型统计
      stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1

      // 按用户统计
      stats.eventsByUser[event.userId] = (stats.eventsByUser[event.userId] || 0) + 1

      // 成功率
      if (event.result === "success") {
        successCount++
      }
    }

    stats.successRate = this.chain.length > 0 ? (successCount / this.chain.length) * 100 : 0

    return stats
  }
}

export const auditChain = new AuditChainSystem()
