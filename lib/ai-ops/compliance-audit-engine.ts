import type { BlockchainRecord } from "@/lib/blockchain/financial-audit-chain"
import { getFinancialAuditChain } from "@/lib/blockchain/financial-audit-chain"

// 操作类型定义
export enum OperationType {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  LOGIN = "login",
  LOGOUT = "logout",
  PERMISSION_CHANGE = "permission_change",
  CONFIG_CHANGE = "config_change",
  DATA_EXPORT = "data_export",
  DATA_IMPORT = "data_import",
}

// 审计日志
export interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  userName: string
  operation: OperationType
  entity: string
  entityId: string
  action: "create" | "read" | "update" | "delete"
  before?: any
  after?: any
  ip: string
  userAgent: string
  result: "success" | "failure"
  errorMessage?: string
  riskLevel: "low" | "medium" | "high" | "critical"
}

// 合规规则
export interface ComplianceRule {
  id: string
  name: string
  category: string
  severity: "critical" | "high" | "medium" | "low"
  description: string
  checkFunction: (data: any) => boolean
  remediation: string
}

// 合规检查结果
export interface ComplianceResult {
  entity: string
  compliant: boolean
  violations: {
    rule: string
    severity: "critical" | "high" | "medium" | "low"
    description: string
    remediation: string
  }[]
  score: number
  timestamp: Date
}

// 审计报告
export interface AuditReport {
  id: string
  period: {
    start: Date
    end: Date
  }
  scope: string
  summary: {
    totalOperations: number
    successfulOperations: number
    failedOperations: number
    violations: number
    criticalFindings: number
  }
  findings: Finding[]
  recommendations: string[]
  complianceScore: number
  securityScore: number
  riskLevel: RiskLevel
  generatedAt: Date
  generatedBy: string
}

// 发现问题
export interface Finding {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  category: string
  title: string
  description: string
  evidence: string[]
  impact: string
  recommendation: string
  status: "open" | "in_progress" | "resolved" | "accepted"
}

// 安全评分
export interface SecurityScore {
  overall: number
  categories: {
    authentication: number
    authorization: number
    dataProtection: number
    networkSecurity: number
    compliance: number
  }
  trend: "improving" | "stable" | "declining"
  recommendations: string[]
}

// 风险等级
export interface RiskLevel {
  level: "critical" | "high" | "medium" | "low"
  score: number
  factors: {
    name: string
    weight: number
    score: number
  }[]
  heatmap: RiskHeatmap
  mitigation: string[]
}

// 风险热力图
export interface RiskHeatmap {
  categories: string[]
  data: number[][]
}

// 告警
export interface Alert {
  id: string
  type: "security" | "compliance" | "risk" | "anomaly"
  severity: "critical" | "high" | "medium" | "low"
  title: string
  message: string
  timestamp: Date
  source: string
  details: any
}

/**
 * 合规与审计自动化引擎
 * 实现操作审计、合规检查、安全评分和风险评估
 */
export class ComplianceAuditEngine {
  private auditLogs: AuditLog[] = []
  private complianceRules: ComplianceRule[] = []

  constructor() {
    this.initializeComplianceRules()
  }

  /**
   * 记录操作日志
   */
  async logOperation(
    userId: string,
    operation: OperationType,
    context: {
      entity: string
      entityId: string
      action: "create" | "read" | "update" | "delete"
      before?: any
      after?: any
      ip: string
      userAgent: string
      result: "success" | "failure"
      errorMessage?: string
    },
  ): Promise<AuditLog> {
    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId,
      userName: await this.getUserName(userId),
      operation,
      ...context,
      riskLevel: this.assessOperationRisk(operation, context),
    }

    this.auditLogs.push(log)

    // 如果是高风险操作，发送告警
    if (log.riskLevel === "high" || log.riskLevel === "critical") {
      await this.sendAlert({
        id: `alert_${Date.now()}`,
        type: "security",
        severity: log.riskLevel,
        title: "高风险操作检测",
        message: `用户 ${log.userName} 执行了高风险操作: ${operation}`,
        timestamp: new Date(),
        source: "ComplianceAuditEngine",
        details: log,
      })
    }

    return log
  }

  /**
   * 追踪数据变更
   */
  async trackDataChange(entity: string, before: any, after: any, userId: string): Promise<AuditLog> {
    const changes = this.detectChanges(before, after)

    return await this.logOperation(userId, OperationType.UPDATE, {
      entity,
      entityId: before.id || after.id,
      action: "update",
      before,
      after,
      ip: "127.0.0.1", // 实际应从请求中获取
      userAgent: "Unknown", // 实际应从请求中获取
      result: "success",
    })
  }

  /**
   * 合规检查
   */
  async checkCompliance(entity: string, data: any): Promise<ComplianceResult> {
    const violations: ComplianceResult["violations"] = []

    for (const rule of this.complianceRules) {
      if (!rule.checkFunction(data)) {
        violations.push({
          rule: rule.name,
          severity: rule.severity,
          description: rule.description,
          remediation: rule.remediation,
        })
      }
    }

    const compliant = violations.length === 0
    const score = this.calculateComplianceScore(violations)

    return {
      entity,
      compliant,
      violations,
      score,
      timestamp: new Date(),
    }
  }

  /**
   * 生成审计报告
   */
  async generateAuditReport(timeRange: { start: Date; end: Date }, scope: string): Promise<AuditReport> {
    const logs = this.auditLogs.filter((log) => log.timestamp >= timeRange.start && log.timestamp <= timeRange.end)

    const summary = {
      totalOperations: logs.length,
      successfulOperations: logs.filter((log) => log.result === "success").length,
      failedOperations: logs.filter((log) => log.result === "failure").length,
      violations: logs.filter((log) => log.riskLevel === "high" || log.riskLevel === "critical").length,
      criticalFindings: logs.filter((log) => log.riskLevel === "critical").length,
    }

    const findings = await this.analyzeFindings(logs)
    const recommendations = this.generateRecommendations(findings)
    const complianceScore = await this.calculateOverallComplianceScore()
    const securityScore = await this.calculateSecurityScore()
    const riskLevel = await this.assessRiskLevel(findings)

    // 与SYSTEM_AUDIT_REPORT.md联动
    await this.updateSystemAuditReport({
      summary,
      findings,
      complianceScore,
      securityScore,
      riskLevel,
    })

    return {
      id: `report_${Date.now()}`,
      period: timeRange,
      scope,
      summary,
      findings,
      recommendations,
      complianceScore,
      securityScore: securityScore.overall,
      riskLevel,
      generatedAt: new Date(),
      generatedBy: "ComplianceAuditEngine",
    }
  }

  /**
   * 计算安全评分
   */
  async calculateSecurityScore(): Promise<SecurityScore> {
    const categories = {
      authentication: this.evaluateAuthentication(),
      authorization: this.evaluateAuthorization(),
      dataProtection: this.evaluateDataProtection(),
      networkSecurity: this.evaluateNetworkSecurity(),
      compliance: this.evaluateCompliance(),
    }

    const overall = Object.values(categories).reduce((sum, score) => sum + score, 0) / 5

    const trend = this.calculateTrend(overall)
    const recommendations = this.generateSecurityRecommendations(categories)

    return {
      overall,
      categories,
      trend,
      recommendations,
    }
  }

  /**
   * 评估风险等级
   */
  async assessRiskLevel(findings: Finding[]): Promise<RiskLevel> {
    const factors = [
      { name: "数据泄露风险", weight: 0.3, score: this.assessDataLeakageRisk(findings) },
      { name: "未授权访问风险", weight: 0.25, score: this.assessUnauthorizedAccessRisk(findings) },
      { name: "合规违规风险", weight: 0.2, score: this.assessComplianceViolationRisk(findings) },
      { name: "系统漏洞风险", weight: 0.15, score: this.assessSystemVulnerabilityRisk(findings) },
      { name: "操作失误风险", weight: 0.1, score: this.assessOperationalErrorRisk(findings) },
    ]

    const score = factors.reduce((sum, factor) => sum + factor.weight * factor.score, 0)

    let level: "critical" | "high" | "medium" | "low"
    if (score >= 80) level = "critical"
    else if (score >= 60) level = "high"
    else if (score >= 40) level = "medium"
    else level = "low"

    const heatmap = this.generateRiskHeatmap(findings)
    const mitigation = this.generateMitigationStrategies(level, factors)

    return {
      level,
      score,
      factors,
      heatmap,
      mitigation,
    }
  }

  /**
   * 发送告警
   */
  async sendAlert(alert: Alert): Promise<void> {
    console.log(`[v0] 发送告警: ${alert.title}`)

    // 实际实现应该发送邮件、短信或推送通知
    // 这里只是记录日志
  }

  /**
   * 验证数据完整性（与区块链联动）
   */
  async verifyDataIntegrity(
    data: any,
    blockchain: BlockchainRecord,
  ): Promise<{
    isValid: boolean
    message: string
  }> {
    try {
      const financialAuditChain = getFinancialAuditChain()
      const result = await financialAuditChain.verifyDataIntegrity(data.id)

      return {
        isValid: result.isValid,
        message: result.message,
      }
    } catch (error) {
      console.error("[v0] 验证数据完整性失败:", error)
      return {
        isValid: false,
        message: `验证失败: ${error.message}`,
      }
    }
  }

  // ========== 私有辅助方法 ==========

  /**
   * 初始化合规规则
   */
  private initializeComplianceRules(): void {
    this.complianceRules = [
      {
        id: "GDPR_001",
        name: "GDPR - 数据最小化",
        category: "数据保护",
        severity: "high",
        description: "只收集必要的个人数据",
        checkFunction: (data) => {
          // 检查是否收集了不必要的敏感数据
          return true // 简化实现
        },
        remediation: "删除不必要的数据字段",
      },
      {
        id: "SOX_001",
        name: "SOX - 财务数据完整性",
        category: "财务合规",
        severity: "critical",
        description: "确保财务数据不可篡改",
        checkFunction: (data) => {
          // 检查财务数据是否有区块链记录
          return true // 简化实现
        },
        remediation: "将财务数据记录到区块链",
      },
      {
        id: "ISO27001_001",
        name: "ISO 27001 - 访问控制",
        category: "信息安全",
        severity: "high",
        description: "实施基于角色的访问控制",
        checkFunction: (data) => {
          // 检查是否有适当的访问控制
          return true // 简化实现
        },
        remediation: "配置RBAC权限",
      },
    ]
  }

  /**
   * 评估操作风险
   */
  private assessOperationRisk(operation: OperationType, context: any): "low" | "medium" | "high" | "critical" {
    // 高风险操作
    const highRiskOps = [
      OperationType.DELETE,
      OperationType.PERMISSION_CHANGE,
      OperationType.CONFIG_CHANGE,
      OperationType.DATA_EXPORT,
    ]

    if (highRiskOps.includes(operation)) {
      return "high"
    }

    // 失败的操作
    if (context.result === "failure") {
      return "medium"
    }

    return "low"
  }

  /**
   * 检测数据变更
   */
  private detectChanges(before: any, after: any): string[] {
    const changes: string[] = []

    for (const key in after) {
      if (before[key] !== after[key]) {
        changes.push(`${key}: ${before[key]} -> ${after[key]}`)
      }
    }

    return changes
  }

  /**
   * 计算合规评分
   */
  private calculateComplianceScore(violations: ComplianceResult["violations"]): number {
    if (violations.length === 0) return 100

    const severityWeights = {
      critical: 25,
      high: 15,
      medium: 10,
      low: 5,
    }

    const totalDeduction = violations.reduce((sum, v) => sum + severityWeights[v.severity], 0)

    return Math.max(0, 100 - totalDeduction)
  }

  /**
   * 分析发现问题
   */
  private async analyzeFindings(logs: AuditLog[]): Promise<Finding[]> {
    const findings: Finding[] = []

    // 分析失败的操作
    const failedOps = logs.filter((log) => log.result === "failure")
    if (failedOps.length > 10) {
      findings.push({
        id: `finding_${Date.now()}_1`,
        severity: "high",
        category: "操作失败",
        title: "大量操作失败",
        description: `检测到 ${failedOps.length} 次操作失败`,
        evidence: failedOps.slice(0, 5).map((log) => log.id),
        impact: "可能影响系统稳定性和用户体验",
        recommendation: "调查失败原因并修复相关问题",
        status: "open",
      })
    }

    // 分析高风险操作
    const highRiskOps = logs.filter((log) => log.riskLevel === "high" || log.riskLevel === "critical")
    if (highRiskOps.length > 5) {
      findings.push({
        id: `finding_${Date.now()}_2`,
        severity: "medium",
        category: "高风险操作",
        title: "频繁的高风险操作",
        description: `检测到 ${highRiskOps.length} 次高风险操作`,
        evidence: highRiskOps.slice(0, 5).map((log) => log.id),
        impact: "可能存在安全风险",
        recommendation: "审查高风险操作的必要性和权限控制",
        status: "open",
      })
    }

    return findings
  }

  /**
   * 生成建议
   */
  private generateRecommendations(findings: Finding[]): string[] {
    const recommendations: string[] = []

    if (findings.some((f) => f.severity === "critical")) {
      recommendations.push("立即处理所有严重问题")
    }

    if (findings.some((f) => f.category === "操作失败")) {
      recommendations.push("优化错误处理机制")
    }

    if (findings.some((f) => f.category === "高风险操作")) {
      recommendations.push("加强权限控制和审批流程")
    }

    recommendations.push("定期进行安全审计")
    recommendations.push("加强员工安全培训")

    return recommendations
  }

  /**
   * 计算整体合规评分
   */
  private async calculateOverallComplianceScore(): Promise<number> {
    // 简化实现：基于最近的合规检查结果
    return 85
  }

  /**
   * 评估认证安全
   */
  private evaluateAuthentication(): number {
    // 简化实现
    return 90
  }

  /**
   * 评估授权安全
   */
  private evaluateAuthorization(): number {
    // 简化实现
    return 85
  }

  /**
   * 评估数据保护
   */
  private evaluateDataProtection(): number {
    // 简化实现
    return 80
  }

  /**
   * 评估网络安全
   */
  private evaluateNetworkSecurity(): number {
    // 简化实现
    return 88
  }

  /**
   * 评估合规性
   */
  private evaluateCompliance(): number {
    // 简化实现
    return 85
  }

  /**
   * 计算趋势
   */
  private calculateTrend(currentScore: number): "improving" | "stable" | "declining" {
    // 简化实现：与历史数据对比
    return "stable"
  }

  /**
   * 生成安全建议
   */
  private generateSecurityRecommendations(categories: SecurityScore["categories"]): string[] {
    const recommendations: string[] = []

    if (categories.authentication < 90) {
      recommendations.push("加强身份认证机制，考虑实施多因素认证")
    }

    if (categories.authorization < 85) {
      recommendations.push("优化权限控制，实施最小权限原则")
    }

    if (categories.dataProtection < 85) {
      recommendations.push("加强数据加密和访问控制")
    }

    return recommendations
  }

  /**
   * 评估数据泄露风险
   */
  private assessDataLeakageRisk(findings: Finding[]): number {
    // 简化实现
    return 30
  }

  /**
   * 评估未授权访问风险
   */
  private assessUnauthorizedAccessRisk(findings: Finding[]): number {
    // 简化实现
    return 25
  }

  /**
   * 评估合规违规风险
   */
  private assessComplianceViolationRisk(findings: Finding[]): number {
    // 简化实现
    return 20
  }

  /**
   * 评估系统漏洞风险
   */
  private assessSystemVulnerabilityRisk(findings: Finding[]): number {
    // 简化实现
    return 15
  }

  /**
   * 评估操作失误风险
   */
  private assessOperationalErrorRisk(findings: Finding[]): number {
    // 简化实现
    return 10
  }

  /**
   * 生成风险热力图
   */
  private generateRiskHeatmap(findings: Finding[]): RiskHeatmap {
    return {
      categories: ["数据安全", "访问控制", "合规性", "系统安全", "操作安全"],
      data: [
        [30, 25, 20, 15, 10],
        [25, 30, 15, 20, 10],
        [20, 15, 30, 25, 10],
      ],
    }
  }

  /**
   * 生成缓解策略
   */
  private generateMitigationStrategies(
    level: "critical" | "high" | "medium" | "low",
    factors: RiskLevel["factors"],
  ): string[] {
    const strategies: string[] = []

    if (level === "critical" || level === "high") {
      strategies.push("立即启动应急响应流程")
      strategies.push("加强实时监控和告警")
    }

    factors.forEach((factor) => {
      if (factor.score > 60) {
        strategies.push(`重点关注: ${factor.name}`)
      }
    })

    strategies.push("定期进行风险评估")
    strategies.push("持续优化安全措施")

    return strategies
  }

  /**
   * 更新系统审计报告
   */
  private async updateSystemAuditReport(data: any): Promise<void> {
    // 实际实现应该更新SYSTEM_AUDIT_REPORT.md文件
    console.log("[v0] 更新系统审计报告")
  }

  /**
   * 获取用户名
   */
  private async getUserName(userId: string): Promise<string> {
    // 实际应该从数据库查询
    return `User_${userId}`
  }
}

// 导出单例实例
export const complianceAuditEngine = new ComplianceAuditEngine()
