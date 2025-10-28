import { auditChain, AuditEventType } from "./audit-chain"

// 安全评分系统
export class SecurityScoringSystem {
  private readonly WEIGHTS = {
    authentication: 0.25,
    authorization: 0.2,
    dataProtection: 0.2,
    auditCompliance: 0.15,
    incidentResponse: 0.1,
    systemHardening: 0.1,
  }

  // 计算总体安全评分
  calculateOverallScore(): {
    score: number
    grade: string
    breakdown: Record<string, number>
    recommendations: string[]
  } {
    const breakdown = {
      authentication: this.evaluateAuthentication(),
      authorization: this.evaluateAuthorization(),
      dataProtection: this.evaluateDataProtection(),
      auditCompliance: this.evaluateAuditCompliance(),
      incidentResponse: this.evaluateIncidentResponse(),
      systemHardening: this.evaluateSystemHardening(),
    }

    // 计算加权总分
    let totalScore = 0
    for (const [category, weight] of Object.entries(this.WEIGHTS)) {
      totalScore += breakdown[category as keyof typeof breakdown] * weight
    }

    const grade = this.getGrade(totalScore)
    const recommendations = this.generateRecommendations(breakdown)

    return {
      score: Math.round(totalScore),
      grade,
      breakdown,
      recommendations,
    }
  }

  // 评估身份认证
  private evaluateAuthentication(): number {
    let score = 100
    const stats = auditChain.getStatistics()

    // 检查登录失败率
    const loginEvents = auditChain.queryEvents({ type: AuditEventType.USER_LOGIN })
    const failedLogins = loginEvents.filter((e) => e.result === "failure").length
    const failureRate = loginEvents.length > 0 ? failedLogins / loginEvents.length : 0

    if (failureRate > 0.1) score -= 20 // 失败率超过10%
    if (failureRate > 0.2) score -= 30 // 失败率超过20%

    return Math.max(0, score)
  }

  // 评估授权控制
  private evaluateAuthorization(): number {
    let score = 100

    // 检查权限变更事件
    const permissionChanges = auditChain.queryEvents({
      type: AuditEventType.PERMISSION_CHANGE,
    })

    // 频繁的权限变更可能表示配置不当
    if (permissionChanges.length > 50) score -= 20

    return Math.max(0, score)
  }

  // 评估数据保护
  private evaluateDataProtection(): number {
    let score = 100

    // 检查数据访问和修改事件
    const dataEvents = auditChain.queryEvents({})
    const sensitiveAccess = dataEvents.filter((e) => e.resource.includes("sensitive") || e.resource.includes("private"))

    // 检查是否有未授权的敏感数据访问
    const unauthorizedAccess = sensitiveAccess.filter((e) => e.result === "failure")
    if (unauthorizedAccess.length > 0) score -= 30

    return Math.max(0, score)
  }

  // 评估审计合规性
  private evaluateAuditCompliance(): number {
    let score = 100

    // 检查审计链完整性
    const integrity = auditChain.verifyChainIntegrity()
    if (!integrity.valid) {
      score -= 50
    }

    // 检查审计覆盖率
    const stats = auditChain.getStatistics()
    if (stats.totalEvents < 100) score -= 20 // 审计事件太少

    return Math.max(0, score)
  }

  // 评估事件响应
  private evaluateIncidentResponse(): number {
    let score = 100

    // 检查安全告警
    const alerts = auditChain.queryEvents({ type: AuditEventType.SECURITY_ALERT })

    // 未处理的安全告警
    if (alerts.length > 10) score -= 30

    return Math.max(0, score)
  }

  // 评估系统加固
  private evaluateSystemHardening(): number {
    let score = 100

    // 检查系统配置变更
    const configChanges = auditChain.queryEvents({
      type: AuditEventType.SYSTEM_CONFIG,
    })

    // 检查是否有安全配置
    const hasSecurityConfig = configChanges.some((e) => e.details.category === "security")

    if (!hasSecurityConfig) score -= 20

    return Math.max(0, score)
  }

  // 获取评级
  private getGrade(score: number): string {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
  }

  // 生成改进建议
  private generateRecommendations(breakdown: Record<string, number>): string[] {
    const recommendations: string[] = []

    if (breakdown.authentication < 80) {
      recommendations.push("加强身份认证机制，考虑启用多因素认证")
    }

    if (breakdown.authorization < 80) {
      recommendations.push("优化权限管理策略，实施最小权限原则")
    }

    if (breakdown.dataProtection < 80) {
      recommendations.push("加强数据加密和访问控制，定期审查敏感数据访问")
    }

    if (breakdown.auditCompliance < 80) {
      recommendations.push("完善审计日志记录，确保审计链完整性")
    }

    if (breakdown.incidentResponse < 80) {
      recommendations.push("建立安全事件响应流程，及时处理安全告警")
    }

    if (breakdown.systemHardening < 80) {
      recommendations.push("加强系统安全配置，定期进行安全加固")
    }

    return recommendations
  }
}

export const securityScoring = new SecurityScoringSystem()
