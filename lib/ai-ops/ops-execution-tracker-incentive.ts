import { db } from "@/lib/db/mysql"

// 任务状态
export interface TaskStatus {
  taskId: string
  assignee: string
  status: "pending" | "in_progress" | "completed" | "overdue"
  progress: number
  startTime: Date
  deadline: Date
  completedTime?: Date
  description: string
  priority: "low" | "medium" | "high" | "urgent"
}

// 执行数据
export interface ExecutionData {
  taskId: string
  employeeId: string
  action: string
  timestamp: Date
  duration: number
  quality: number
  notes?: string
}

// 异常
export interface Anomaly {
  id: string
  type: AnomalyType
  severity: "low" | "medium" | "high" | "critical"
  taskId: string
  employeeId: string
  description: string
  detectedAt: Date
  resolved: boolean
}

export enum AnomalyType {
  DELAY = "delay",
  QUALITY_ISSUE = "quality_issue",
  INCOMPLETE = "incomplete",
  REPEATED_FAILURE = "repeated_failure",
  RESOURCE_WASTE = "resource_waste",
}

// 绩效评分
export interface PerformanceScore {
  employeeId: string
  employeeName: string
  taskCompletionRate: number
  qualityScore: number
  efficiencyScore: number
  overallScore: number
  rank: number
  totalTasks: number
  completedTasks: number
  averageQuality: number
  averageDuration: number
}

// 奖惩规则
export interface IncentiveRules {
  bonusRules: BonusRule[]
  penaltyRules: PenaltyRule[]
  bonusPool: number
}

export interface BonusRule {
  id: string
  name: string
  condition: string
  amount: number
  type: "fixed" | "percentage"
}

export interface PenaltyRule {
  id: string
  name: string
  condition: string
  amount: number
  type: "fixed" | "percentage"
}

// 奖惩结果
export interface IncentiveResult {
  employeeId: string
  employeeName: string
  bonus: number
  penalty: number
  netIncentive: number
  reason: string[]
  appliedRules: string[]
}

// 优化计划
export interface OptimizationPlan {
  bottlenecks: Bottleneck[]
  recommendations: Recommendation[]
  estimatedImprovement: number
  priority: "low" | "medium" | "high"
}

export interface Bottleneck {
  area: string
  description: string
  impact: number
  affectedTasks: string[]
}

export interface Recommendation {
  title: string
  description: string
  expectedBenefit: string
  implementation: string
  priority: "low" | "medium" | "high"
}

export interface TimeRange {
  startDate: Date
  endDate: Date
}

export class OpsExecutionTrackerIncentive {
  /**
   * 跟踪任务状态
   */
  async trackTask(taskId: string): Promise<TaskStatus> {
    const query = `
      SELECT 
        id as taskId,
        assignee,
        status,
        progress,
        start_time as startTime,
        deadline,
        completed_time as completedTime,
        description,
        priority
      FROM tasks
      WHERE id = ?
    `

    const [results] = await db.query(query, [taskId])

    if (!results || results.length === 0) {
      throw new Error(`Task ${taskId} not found`)
    }

    const task = results[0]

    // 检查是否逾期
    if (task.status !== "completed" && new Date(task.deadline) < new Date()) {
      task.status = "overdue"
      await db.query("UPDATE tasks SET status = ? WHERE id = ?", ["overdue", taskId])
    }

    return task
  }

  /**
   * 检测异常
   */
  async detectAnomalies(executionData: ExecutionData[]): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = []

    for (const data of executionData) {
      // 获取任务信息
      const task = await this.trackTask(data.taskId)

      // 检测延期
      if (task.status === "overdue") {
        anomalies.push({
          id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: AnomalyType.DELAY,
          severity: this.calculateDelaySeverity(task),
          taskId: data.taskId,
          employeeId: data.employeeId,
          description: `任务 ${task.description} 已逾期 ${this.getDaysOverdue(task)} 天`,
          detectedAt: new Date(),
          resolved: false,
        })
      }

      // 检测质量问题
      if (data.quality < 60) {
        anomalies.push({
          id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: AnomalyType.QUALITY_ISSUE,
          severity: data.quality < 40 ? "high" : "medium",
          taskId: data.taskId,
          employeeId: data.employeeId,
          description: `任务质量评分过低: ${data.quality}/100`,
          detectedAt: new Date(),
          resolved: false,
        })
      }

      // 检测重复失败
      const failureCount = await this.getTaskFailureCount(data.taskId, data.employeeId)
      if (failureCount >= 3) {
        anomalies.push({
          id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: AnomalyType.REPEATED_FAILURE,
          severity: "high",
          taskId: data.taskId,
          employeeId: data.employeeId,
          description: `任务重复失败 ${failureCount} 次`,
          detectedAt: new Date(),
          resolved: false,
        })
      }

      // 检测资源浪费
      const expectedDuration = await this.getExpectedDuration(data.taskId)
      if (data.duration > expectedDuration * 2) {
        anomalies.push({
          id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: AnomalyType.RESOURCE_WASTE,
          severity: "medium",
          taskId: data.taskId,
          employeeId: data.employeeId,
          description: `任务耗时超出预期 ${Math.round((data.duration / expectedDuration - 1) * 100)}%`,
          detectedAt: new Date(),
          resolved: false,
        })
      }
    }

    // 保存异常到数据库
    for (const anomaly of anomalies) {
      await this.saveAnomaly(anomaly)
    }

    return anomalies
  }

  /**
   * 评估绩效
   */
  async evaluatePerformance(employeeId: string, timeRange: TimeRange): Promise<PerformanceScore> {
    // 获取员工信息
    const employeeQuery = "SELECT name FROM employees WHERE id = ?"
    const [employeeResults] = await db.query(employeeQuery, [employeeId])
    const employeeName = employeeResults[0]?.name || "Unknown"

    // 获取任务统计
    const statsQuery = `
      SELECT 
        COUNT(*) as totalTasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedTasks,
        AVG(CASE WHEN status = 'completed' THEN quality_score ELSE NULL END) as averageQuality,
        AVG(CASE WHEN status = 'completed' THEN TIMESTAMPDIFF(HOUR, start_time, completed_time) ELSE NULL END) as averageDuration
      FROM tasks
      WHERE assignee = ?
        AND start_time BETWEEN ? AND ?
    `

    const [statsResults] = await db.query(statsQuery, [employeeId, timeRange.startDate, timeRange.endDate])
    const stats = statsResults[0]

    // 计算完成率
    const taskCompletionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0

    // 计算质量评分
    const qualityScore = stats.averageQuality || 0

    // 计算效率评分（基于平均耗时）
    const expectedDuration = 8 // 小时
    const efficiencyScore = stats.averageDuration
      ? Math.max(0, 100 - ((stats.averageDuration - expectedDuration) / expectedDuration) * 50)
      : 0

    // 计算综合评分
    const overallScore = taskCompletionRate * 0.4 + qualityScore * 0.4 + efficiencyScore * 0.2

    // 获取排名
    const rank = await this.getEmployeeRank(employeeId, timeRange)

    return {
      employeeId,
      employeeName,
      taskCompletionRate,
      qualityScore,
      efficiencyScore,
      overallScore,
      rank,
      totalTasks: stats.totalTasks,
      completedTasks: stats.completedTasks,
      averageQuality: stats.averageQuality || 0,
      averageDuration: stats.averageDuration || 0,
    }
  }

  /**
   * 计算奖惩
   */
  async calculateIncentive(performance: PerformanceScore, rules: IncentiveRules): Promise<IncentiveResult> {
    let bonus = 0
    let penalty = 0
    const reason: string[] = []
    const appliedRules: string[] = []

    // 应用奖励规则
    for (const rule of rules.bonusRules) {
      if (this.evaluateCondition(rule.condition, performance)) {
        const amount = rule.type === "percentage" ? (rule.amount / 100) * rules.bonusPool : rule.amount
        bonus += amount
        reason.push(`${rule.name}: +¥${amount.toFixed(2)}`)
        appliedRules.push(rule.id)
      }
    }

    // 应用惩罚规则
    for (const rule of rules.penaltyRules) {
      if (this.evaluateCondition(rule.condition, performance)) {
        const amount = rule.type === "percentage" ? (rule.amount / 100) * rules.bonusPool : rule.amount
        penalty += amount
        reason.push(`${rule.name}: -¥${amount.toFixed(2)}`)
        appliedRules.push(rule.id)
      }
    }

    const netIncentive = bonus - penalty

    // 保存奖惩记录
    await this.saveIncentiveRecord({
      employeeId: performance.employeeId,
      employeeName: performance.employeeName,
      bonus,
      penalty,
      netIncentive,
      reason,
      appliedRules,
    })

    return {
      employeeId: performance.employeeId,
      employeeName: performance.employeeName,
      bonus,
      penalty,
      netIncentive,
      reason,
      appliedRules,
    }
  }

  /**
   * 生成优化建议
   */
  async generateOptimization(executionData: ExecutionData[]): Promise<OptimizationPlan> {
    const bottlenecks: Bottleneck[] = []
    const recommendations: Recommendation[] = []

    // 分析任务耗时
    const taskDurations = new Map<string, number[]>()
    executionData.forEach((data) => {
      if (!taskDurations.has(data.taskId)) {
        taskDurations.set(data.taskId, [])
      }
      taskDurations.get(data.taskId)!.push(data.duration)
    })

    // 识别耗时瓶颈
    for (const [taskId, durations] of taskDurations.entries()) {
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
      const expectedDuration = await this.getExpectedDuration(taskId)

      if (avgDuration > expectedDuration * 1.5) {
        const task = await this.trackTask(taskId)
        bottlenecks.push({
          area: task.description,
          description: `平均耗时 ${avgDuration.toFixed(1)} 小时，超出预期 ${((avgDuration / expectedDuration - 1) * 100).toFixed(0)}%`,
          impact: (avgDuration - expectedDuration) * durations.length,
          affectedTasks: [taskId],
        })

        recommendations.push({
          title: `优化 ${task.description} 流程`,
          description: "该任务耗时明显超出预期，建议分析流程瓶颈并优化",
          expectedBenefit: `预计可节省 ${((avgDuration - expectedDuration) * durations.length).toFixed(1)} 小时`,
          implementation: "1. 分析任务步骤 2. 识别耗时环节 3. 优化或自动化 4. 培训员工",
          priority: avgDuration > expectedDuration * 2 ? "high" : "medium",
        })
      }
    }

    // 分析质量问题
    const lowQualityTasks = executionData.filter((data) => data.quality < 70)
    if (lowQualityTasks.length > executionData.length * 0.2) {
      bottlenecks.push({
        area: "任务质量",
        description: `${((lowQualityTasks.length / executionData.length) * 100).toFixed(0)}% 的任务质量不达标`,
        impact: lowQualityTasks.length,
        affectedTasks: lowQualityTasks.map((t) => t.taskId),
      })

      recommendations.push({
        title: "提升任务质量标准",
        description: "大量任务质量不达标，建议加强培训和质量控制",
        expectedBenefit: "预计可提升整体质量评分 20-30 分",
        implementation: "1. 制定质量标准 2. 加强培训 3. 引入质检流程 4. 建立反馈机制",
        priority: "high",
      })
    }

    // 分析员工负载
    const employeeWorkload = new Map<string, number>()
    executionData.forEach((data) => {
      employeeWorkload.set(data.employeeId, (employeeWorkload.get(data.employeeId) || 0) + 1)
    })

    const workloads = Array.from(employeeWorkload.values())
    const avgWorkload = workloads.reduce((a, b) => a + b, 0) / workloads.length
    const maxWorkload = Math.max(...workloads)

    if (maxWorkload > avgWorkload * 1.5) {
      recommendations.push({
        title: "平衡员工工作负载",
        description: "部分员工工作负载过重，建议重新分配任务",
        expectedBenefit: "预计可提升团队整体效率 15-20%",
        implementation: "1. 分析负载分布 2. 识别高负载员工 3. 重新分配任务 4. 监控效果",
        priority: "medium",
      })
    }

    // 计算预期改进
    const estimatedImprovement = bottlenecks.reduce((sum, b) => sum + b.impact, 0) * 0.3

    return {
      bottlenecks,
      recommendations,
      estimatedImprovement,
      priority: bottlenecks.length > 3 ? "high" : bottlenecks.length > 1 ? "medium" : "low",
    }
  }

  // 辅助方法

  private calculateDelaySeverity(task: TaskStatus): "low" | "medium" | "high" | "critical" {
    const daysOverdue = this.getDaysOverdue(task)

    if (daysOverdue > 7) return "critical"
    if (daysOverdue > 3) return "high"
    if (daysOverdue > 1) return "medium"
    return "low"
  }

  private getDaysOverdue(task: TaskStatus): number {
    const now = new Date()
    const deadline = new Date(task.deadline)
    return Math.max(0, Math.ceil((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24)))
  }

  private async getTaskFailureCount(taskId: string, employeeId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM task_history
      WHERE task_id = ?
        AND employee_id = ?
        AND status = 'failed'
        AND created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
    `

    const [results] = await db.query(query, [taskId, employeeId])
    return results[0]?.count || 0
  }

  private async getExpectedDuration(taskId: string): Promise<number> {
    const query = "SELECT expected_duration FROM tasks WHERE id = ?"
    const [results] = await db.query(query, [taskId])
    return results[0]?.expected_duration || 8
  }

  private async saveAnomaly(anomaly: Anomaly): Promise<void> {
    await db.query(
      `INSERT INTO anomalies (id, type, severity, task_id, employee_id, description, detected_at, resolved, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        anomaly.id,
        anomaly.type,
        anomaly.severity,
        anomaly.taskId,
        anomaly.employeeId,
        anomaly.description,
        anomaly.detectedAt,
        anomaly.resolved,
      ],
    )
  }

  private async getEmployeeRank(employeeId: string, timeRange: TimeRange): Promise<number> {
    const query = `
      SELECT COUNT(*) + 1 as rank
      FROM (
        SELECT 
          assignee,
          (COUNT(CASE WHEN status = 'completed' THEN 1 END) / COUNT(*)) * 0.4 +
          AVG(CASE WHEN status = 'completed' THEN quality_score ELSE 0 END) * 0.4 +
          (100 - AVG(CASE WHEN status = 'completed' THEN TIMESTAMPDIFF(HOUR, start_time, completed_time) ELSE 0 END) / 8 * 50) * 0.2 as score
        FROM tasks
        WHERE start_time BETWEEN ? AND ?
        GROUP BY assignee
        HAVING score > (
          SELECT 
            (COUNT(CASE WHEN status = 'completed' THEN 1 END) / COUNT(*)) * 0.4 +
            AVG(CASE WHEN status = 'completed' THEN quality_score ELSE 0 END) * 0.4 +
            (100 - AVG(CASE WHEN status = 'completed' THEN TIMESTAMPDIFF(HOUR, start_time, completed_time) ELSE 0 END) / 8 * 50) * 0.2
          FROM tasks
          WHERE assignee = ?
            AND start_time BETWEEN ? AND ?
        )
      ) as rankings
    `

    const [results] = await db.query(query, [
      timeRange.startDate,
      timeRange.endDate,
      employeeId,
      timeRange.startDate,
      timeRange.endDate,
    ])
    return results[0]?.rank || 1
  }

  private evaluateCondition(condition: string, performance: PerformanceScore): boolean {
    // 简单的条件评估（实际应使用表达式解析器）
    try {
      // 替换变量
      const expr = condition
        .replace(/taskCompletionRate/g, performance.taskCompletionRate.toString())
        .replace(/qualityScore/g, performance.qualityScore.toString())
        .replace(/efficiencyScore/g, performance.efficiencyScore.toString())
        .replace(/overallScore/g, performance.overallScore.toString())
        .replace(/rank/g, performance.rank.toString())

      // 评估表达式
      return eval(expr)
    } catch (error) {
      console.error("[v0] Condition evaluation failed:", error)
      return false
    }
  }

  private async saveIncentiveRecord(result: IncentiveResult): Promise<void> {
    await db.query(
      `INSERT INTO incentive_records (employee_id, employee_name, bonus, penalty, net_incentive, reason, applied_rules, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        result.employeeId,
        result.employeeName,
        result.bonus,
        result.penalty,
        result.netIncentive,
        JSON.stringify(result.reason),
        JSON.stringify(result.appliedRules),
      ],
    )
  }
}

export const opsExecutionTrackerIncentive = new OpsExecutionTrackerIncentive()
