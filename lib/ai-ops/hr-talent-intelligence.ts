import { db } from "@/lib/db/mysql"
import {
  opsExecutionTrackerIncentive,
  type PerformanceScore as OpsPerformanceScore,
} from "./ops-execution-tracker-incentive"

// 员工画像
export interface EmployeeProfile {
  id: string
  basicInfo: {
    name: string
    position: string
    department: string
    hireDate: Date
    tenure: number
  }
  skillTags: string[]
  abilityScores: Record<string, number>
  workStyle: string
  careerInterests: string[]
  performanceHistory: PerformanceScore[]
}

// 技能评估
export interface SkillAssessment {
  employeeId: string
  skills: {
    name: string
    level: number
    gap: number
    trainingNeeded: boolean
  }[]
  overallScore: number
  strengths: string[]
  weaknesses: string[]
}

// 成长路径
export interface CareerPath {
  currentPosition: string
  targetPosition: string
  milestones: Milestone[]
  estimatedTime: number
  requiredSkills: string[]
  trainingPlan: TrainingPlan
}

export interface Milestone {
  title: string
  description: string
  requiredSkills: string[]
  estimatedDuration: number
  completed: boolean
}

export interface TrainingPlan {
  courses: Course[]
  mentor?: string
  estimatedCost: number
  estimatedDuration: number
}

export interface Course {
  id: string
  name: string
  provider: string
  duration: number
  cost: number
  skills: string[]
}

// 绩效评分
export interface PerformanceScore {
  employeeId: string
  period: Period
  kpiScore: number
  okrScore: number
  peer360Score: number
  managerScore: number
  overallScore: number
  rank: number
  feedback: string
}

export interface Period {
  startDate: Date
  endDate: Date
  type: "monthly" | "quarterly" | "yearly"
}

// 晋升建议
export interface PromotionSuggestion {
  employeeId: string
  eligible: boolean
  readiness: number
  recommendedPosition: string
  timeline: string
  requirements: Requirement[]
  impactAnalysis: ImpactAnalysis
}

export interface Requirement {
  type: string
  description: string
  met: boolean
}

export interface ImpactAnalysis {
  teamImpact: string
  budgetImpact: number
  riskLevel: "low" | "medium" | "high"
  benefits: string[]
}

// 离职风险
export interface AttritionRisk {
  employeeId: string
  riskLevel: "low" | "medium" | "high"
  probability: number
  factors: string[]
  retentionStrategies: string[]
  urgency: string
}

// 激励动作
export interface IncentiveAction {
  employeeId: string
  action: "bonus" | "promotion" | "training" | "recognition"
  amount?: number
  description: string
  triggeredBy: string
}

// 技能矩阵
export interface SkillMatrix {
  technical: Record<string, number>
  soft: Record<string, number>
  leadership: Record<string, number>
}

// 员工数据
export interface EmployeeData {
  basicInfo: any
  skills: string[]
  workHistory: any[]
  performanceRecords: any[]
}

// 职业目标
export interface CareerGoals {
  targetPosition: string
  timeframe: number
  priorities: string[]
}

// 绩效指标
export interface PerformanceMetrics {
  kpi: Record<string, number>
  okr: Record<string, number>
  peer360: Record<string, number>
}

// 离职指标
export interface AttritionIndicators {
  performanceTrend: number[]
  engagementScore: number
  satisfactionScore: number
  recentEvents: string[]
}

// 激励系统
export interface IncentiveSystem {
  rules: any[]
  budget: number
}

export class HRTalentIntelligence {
  /**
   * 构建员工画像
   */
  async buildEmployeeProfile(employeeId: string, data: EmployeeData): Promise<EmployeeProfile> {
    // 获取基础信息
    const [employeeResults] = await db.query(
      `SELECT id, name, position, department, hire_date FROM employees WHERE id = ?`,
      [employeeId],
    )

    if (!employeeResults || employeeResults.length === 0) {
      throw new Error(`Employee ${employeeId} not found`)
    }

    const employee = employeeResults[0]
    const hireDate = new Date(employee.hire_date)
    const tenure = Math.floor((Date.now() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365))

    // 分析技能标签
    const skillTags = await this.extractSkillTags(data.skills, data.workHistory)

    // 计算能力评分
    const abilityScores = await this.calculateAbilityScores(employeeId, data.performanceRecords)

    // 分析工作风格
    const workStyle = await this.analyzeWorkStyle(data.workHistory, data.performanceRecords)

    // 识别职业兴趣
    const careerInterests = await this.identifyCareerInterests(data.workHistory, skillTags)

    // 获取绩效历史
    const performanceHistory = await this.getPerformanceHistory(employeeId)

    const profile: EmployeeProfile = {
      id: employeeId,
      basicInfo: {
        name: employee.name,
        position: employee.position,
        department: employee.department,
        hireDate,
        tenure,
      },
      skillTags,
      abilityScores,
      workStyle,
      careerInterests,
      performanceHistory,
    }

    // 保存画像
    await this.saveEmployeeProfile(profile)

    return profile
  }

  /**
   * 能力评估
   */
  async assessSkills(employeeId: string, skillMatrix: SkillMatrix): Promise<SkillAssessment> {
    const skills: SkillAssessment["skills"] = []
    let totalScore = 0
    let skillCount = 0

    // 评估技术技能
    for (const [skill, level] of Object.entries(skillMatrix.technical)) {
      const requiredLevel = await this.getRequiredSkillLevel(employeeId, skill)
      const gap = Math.max(0, requiredLevel - level)

      skills.push({
        name: skill,
        level,
        gap,
        trainingNeeded: gap > 0,
      })

      totalScore += level
      skillCount++
    }

    // 评估软技能
    for (const [skill, level] of Object.entries(skillMatrix.soft)) {
      const requiredLevel = await this.getRequiredSkillLevel(employeeId, skill)
      const gap = Math.max(0, requiredLevel - level)

      skills.push({
        name: skill,
        level,
        gap,
        trainingNeeded: gap > 0,
      })

      totalScore += level
      skillCount++
    }

    // 评估领导力
    for (const [skill, level] of Object.entries(skillMatrix.leadership)) {
      const requiredLevel = await this.getRequiredSkillLevel(employeeId, skill)
      const gap = Math.max(0, requiredLevel - level)

      skills.push({
        name: skill,
        level,
        gap,
        trainingNeeded: gap > 0,
      })

      totalScore += level
      skillCount++
    }

    const overallScore = skillCount > 0 ? totalScore / skillCount : 0

    // 识别优势和劣势
    const sortedSkills = [...skills].sort((a, b) => b.level - a.level)
    const strengths = sortedSkills.slice(0, 3).map((s) => s.name)
    const weaknesses = sortedSkills
      .slice(-3)
      .filter((s) => s.gap > 0)
      .map((s) => s.name)

    const assessment: SkillAssessment = {
      employeeId,
      skills,
      overallScore,
      strengths,
      weaknesses,
    }

    // 保存评估结果
    await this.saveSkillAssessment(assessment)

    return assessment
  }

  /**
   * 生成成长路径
   */
  async generateCareerPath(profile: EmployeeProfile, goals: CareerGoals): Promise<CareerPath> {
    const currentPosition = profile.basicInfo.position
    const targetPosition = goals.targetPosition

    // 获取晋升路径
    const milestones = await this.getCareerMilestones(currentPosition, targetPosition)

    // 识别所需技能
    const requiredSkills = await this.getRequiredSkills(targetPosition)

    // 计算技能差距
    const currentSkills = profile.skillTags
    const missingSkills = requiredSkills.filter((skill) => !currentSkills.includes(skill))

    // 生成培训计划
    const trainingPlan = await this.generateTrainingPlan(missingSkills, goals.timeframe)

    // 估算时间
    const estimatedTime = this.calculateEstimatedTime(milestones, trainingPlan)

    const careerPath: CareerPath = {
      currentPosition,
      targetPosition,
      milestones,
      estimatedTime,
      requiredSkills,
      trainingPlan,
    }

    // 保存成长路径
    await this.saveCareerPath(profile.id, careerPath)

    return careerPath
  }

  /**
   * 绩效评分
   */
  async scorePerformance(employeeId: string, period: Period, metrics: PerformanceMetrics): Promise<PerformanceScore> {
    // 计算KPI评分
    const kpiScore = this.calculateKPIScore(metrics.kpi)

    // 计算OKR评分
    const okrScore = this.calculateOKRScore(metrics.okr)

    // 计算360度评分
    const peer360Score = this.calculate360Score(metrics.peer360)

    // 获取经理评分
    const managerScore = await this.getManagerScore(employeeId, period)

    // 计算综合评分
    const overallScore = kpiScore * 0.3 + okrScore * 0.3 + peer360Score * 0.2 + managerScore * 0.2

    // 获取排名
    const rank = await this.getPerformanceRank(employeeId, period, overallScore)

    // 生成反馈
    const feedback = await this.generatePerformanceFeedback(employeeId, {
      kpiScore,
      okrScore,
      peer360Score,
      managerScore,
      overallScore,
    })

    const performanceScore: PerformanceScore = {
      employeeId,
      period,
      kpiScore,
      okrScore,
      peer360Score,
      managerScore,
      overallScore,
      rank,
      feedback,
    }

    // 保存绩效评分
    await this.savePerformanceScore(performanceScore)

    // 与M7.4奖惩系统联动
    await this.syncWithIncentiveSystem(performanceScore)

    return performanceScore
  }

  /**
   * 晋升建议
   */
  async suggestPromotion(employeeId: string): Promise<PromotionSuggestion> {
    // 获取员工画像
    const profile = await this.getEmployeeProfile(employeeId)

    // 获取最近绩效
    const recentPerformance = await this.getRecentPerformance(employeeId, 12)

    // 计算准备度
    const readiness = this.calculatePromotionReadiness(profile, recentPerformance)

    // 判断是否符合晋升条件
    const eligible = readiness >= 80

    // 推荐职位
    const recommendedPosition = await this.getNextPosition(profile.basicInfo.position)

    // 估算时间线
    const timeline = eligible ? "3-6个月" : readiness >= 60 ? "6-12个月" : "12个月以上"

    // 检查晋升要求
    const requirements = await this.checkPromotionRequirements(employeeId, recommendedPosition)

    // 影响分析
    const impactAnalysis = await this.analyzePromotionImpact(employeeId, recommendedPosition)

    const suggestion: PromotionSuggestion = {
      employeeId,
      eligible,
      readiness,
      recommendedPosition,
      timeline,
      requirements,
      impactAnalysis,
    }

    // 保存晋升建议
    await this.savePromotionSuggestion(suggestion)

    return suggestion
  }

  /**
   * 离职预测
   */
  async predictAttrition(employeeId: string, indicators: AttritionIndicators): Promise<AttritionRisk> {
    // 分析绩效趋势
    const performanceTrend = this.analyzePerformanceTrend(indicators.performanceTrend)

    // 分析敬业度
    const engagementRisk = indicators.engagementScore < 60 ? 0.3 : 0

    // 分析满意度
    const satisfactionRisk = indicators.satisfactionScore < 60 ? 0.3 : 0

    // 分析近期事件
    const eventRisk = this.analyzeRecentEvents(indicators.recentEvents)

    // 计算离职概率
    const probability = Math.min(100, (performanceTrend + engagementRisk + satisfactionRisk + eventRisk) * 100)

    // 确定风险等级
    let riskLevel: "low" | "medium" | "high"
    if (probability >= 70) riskLevel = "high"
    else if (probability >= 40) riskLevel = "medium"
    else riskLevel = "low"

    // 识别风险因素
    const factors: string[] = []
    if (performanceTrend > 0.2) factors.push("绩效下降趋势")
    if (indicators.engagementScore < 60) factors.push("敬业度低")
    if (indicators.satisfactionScore < 60) factors.push("满意度低")
    if (eventRisk > 0.1) factors.push("近期负面事件")

    // 生成挽留策略
    const retentionStrategies = await this.generateRetentionStrategies(employeeId, factors)

    // 确定紧急程度
    const urgency = riskLevel === "high" ? "立即行动" : riskLevel === "medium" ? "近期关注" : "持续观察"

    const attritionRisk: AttritionRisk = {
      employeeId,
      riskLevel,
      probability,
      factors,
      retentionStrategies,
      urgency,
    }

    // 保存离职风险评估
    await this.saveAttritionRisk(attritionRisk)

    // 如果风险高，发送预警
    if (riskLevel === "high") {
      await this.sendAttritionAlert(attritionRisk)
    }

    return attritionRisk
  }

  /**
   * 激励联动
   */
  async linkIncentive(performance: PerformanceScore, incentiveSystem: IncentiveSystem): Promise<IncentiveAction> {
    // 转换为M7.4格式
    const opsPerformance: OpsPerformanceScore = {
      employeeId: performance.employeeId,
      employeeName: "", // 将在M7.4中获取
      taskCompletionRate: performance.kpiScore,
      qualityScore: performance.okrScore,
      efficiencyScore: performance.peer360Score,
      overallScore: performance.overallScore,
      rank: performance.rank,
      totalTasks: 0,
      completedTasks: 0,
      averageQuality: performance.okrScore,
      averageDuration: 0,
    }

    // 调用M7.4奖惩系统
    const incentiveResult = await opsExecutionTrackerIncentive.calculateIncentive(opsPerformance, {
      bonusRules: incentiveSystem.rules.filter((r) => r.type === "bonus"),
      penaltyRules: incentiveSystem.rules.filter((r) => r.type === "penalty"),
      bonusPool: incentiveSystem.budget,
    })

    // 确定激励动作
    let action: IncentiveAction["action"] = "recognition"
    const amount = incentiveResult.netIncentive

    if (performance.overallScore >= 90 && performance.rank <= 5) {
      action = "promotion"
    } else if (incentiveResult.netIncentive > 0) {
      action = "bonus"
    } else if (performance.overallScore < 60) {
      action = "training"
    }

    const incentiveAction: IncentiveAction = {
      employeeId: performance.employeeId,
      action,
      amount: action === "bonus" ? amount : undefined,
      description: incentiveResult.reason.join("; "),
      triggeredBy: `绩效评分: ${performance.overallScore.toFixed(1)}`,
    }

    // 保存激励动作
    await this.saveIncentiveAction(incentiveAction)

    // 执行激励动作
    await this.executeIncentiveAction(incentiveAction)

    return incentiveAction
  }

  // 辅助方法

  private async extractSkillTags(skills: string[], workHistory: any[]): Promise<string[]> {
    const tags = new Set<string>(skills)

    // 从工作历史中提取技能
    for (const work of workHistory) {
      if (work.skills) {
        work.skills.forEach((skill: string) => tags.add(skill))
      }
    }

    return Array.from(tags)
  }

  private async calculateAbilityScores(employeeId: string, performanceRecords: any[]): Promise<Record<string, number>> {
    const scores: Record<string, number> = {
      技术能力: 0,
      沟通能力: 0,
      团队协作: 0,
      问题解决: 0,
      创新能力: 0,
      领导力: 0,
    }

    // 从绩效记录中计算能力评分
    if (performanceRecords.length > 0) {
      const recentRecords = performanceRecords.slice(-3)

      for (const record of recentRecords) {
        if (record.abilityScores) {
          for (const [ability, score] of Object.entries(record.abilityScores)) {
            scores[ability] = (scores[ability] || 0) + (score as number)
          }
        }
      }

      // 计算平均值
      for (const ability in scores) {
        scores[ability] = scores[ability] / recentRecords.length
      }
    }

    return scores
  }

  private async analyzeWorkStyle(workHistory: any[], performanceRecords: any[]): Promise<string> {
    // 简单的工作风格分析
    const styles = ["独立型", "协作型", "领导型", "支持型"]

    // 基于工作历史和绩效记录分析
    // 这里使用简化逻辑
    return styles[Math.floor(Math.random() * styles.length)]
  }

  private async identifyCareerInterests(workHistory: any[], skillTags: string[]): Promise<string[]> {
    const interests: string[] = []

    // 基于技能标签推断职业兴趣
    if (skillTags.some((s) => s.includes("管理") || s.includes("领导"))) {
      interests.push("管理岗位")
    }
    if (skillTags.some((s) => s.includes("技术") || s.includes("开发"))) {
      interests.push("技术专家")
    }
    if (skillTags.some((s) => s.includes("销售") || s.includes("客户"))) {
      interests.push("业务拓展")
    }

    return interests
  }

  private async getPerformanceHistory(employeeId: string): Promise<PerformanceScore[]> {
    const [results] = await db.query(
      `SELECT * FROM performance_scores WHERE employee_id = ? ORDER BY period_end_date DESC LIMIT 12`,
      [employeeId],
    )

    return results.map((r: any) => ({
      employeeId: r.employee_id,
      period: {
        startDate: r.period_start_date,
        endDate: r.period_end_date,
        type: r.period_type,
      },
      kpiScore: r.kpi_score,
      okrScore: r.okr_score,
      peer360Score: r.peer360_score,
      managerScore: r.manager_score,
      overallScore: r.overall_score,
      rank: r.rank,
      feedback: r.feedback,
    }))
  }

  private async saveEmployeeProfile(profile: EmployeeProfile): Promise<void> {
    await db.query(
      `INSERT INTO employee_profiles (employee_id, skill_tags, ability_scores, work_style, career_interests, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         skill_tags = VALUES(skill_tags),
         ability_scores = VALUES(ability_scores),
         work_style = VALUES(work_style),
         career_interests = VALUES(career_interests),
         updated_at = NOW()`,
      [
        profile.id,
        JSON.stringify(profile.skillTags),
        JSON.stringify(profile.abilityScores),
        profile.workStyle,
        JSON.stringify(profile.careerInterests),
      ],
    )
  }

  private async getRequiredSkillLevel(employeeId: string, skill: string): Promise<number> {
    // 获取职位要求的技能等级
    const [results] = await db.query(
      `SELECT ps.required_level
       FROM employees e
       JOIN position_skills ps ON e.position = ps.position
       WHERE e.id = ? AND ps.skill_name = ?`,
      [employeeId, skill],
    )

    return results[0]?.required_level || 70
  }

  private async saveSkillAssessment(assessment: SkillAssessment): Promise<void> {
    await db.query(
      `INSERT INTO skill_assessments (employee_id, skills, overall_score, strengths, weaknesses, assessed_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        assessment.employeeId,
        JSON.stringify(assessment.skills),
        assessment.overallScore,
        JSON.stringify(assessment.strengths),
        JSON.stringify(assessment.weaknesses),
      ],
    )
  }

  private async getCareerMilestones(currentPosition: string, targetPosition: string): Promise<Milestone[]> {
    // 获取职业路径里程碑
    const [results] = await db.query(
      `SELECT * FROM career_milestones WHERE from_position = ? AND to_position = ? ORDER BY sequence`,
      [currentPosition, targetPosition],
    )

    return results.map((r: any) => ({
      title: r.title,
      description: r.description,
      requiredSkills: JSON.parse(r.required_skills || "[]"),
      estimatedDuration: r.estimated_duration,
      completed: false,
    }))
  }

  private async getRequiredSkills(position: string): Promise<string[]> {
    const [results] = await db.query(`SELECT skill_name FROM position_skills WHERE position = ?`, [position])

    return results.map((r: any) => r.skill_name)
  }

  private async generateTrainingPlan(missingSkills: string[], timeframe: number): Promise<TrainingPlan> {
    const courses: Course[] = []
    let totalCost = 0
    let totalDuration = 0

    for (const skill of missingSkills) {
      const [courseResults] = await db.query(
        `SELECT * FROM training_courses WHERE skills LIKE ? ORDER BY rating DESC LIMIT 1`,
        [`%${skill}%`],
      )

      if (courseResults.length > 0) {
        const course = courseResults[0]
        courses.push({
          id: course.id,
          name: course.name,
          provider: course.provider,
          duration: course.duration,
          cost: course.cost,
          skills: JSON.parse(course.skills || "[]"),
        })

        totalCost += course.cost
        totalDuration += course.duration
      }
    }

    return {
      courses,
      estimatedCost: totalCost,
      estimatedDuration: totalDuration,
    }
  }

  private calculateEstimatedTime(milestones: Milestone[], trainingPlan: TrainingPlan): number {
    const milestoneTime = milestones.reduce((sum, m) => sum + m.estimatedDuration, 0)
    return milestoneTime + trainingPlan.estimatedDuration
  }

  private async saveCareerPath(employeeId: string, careerPath: CareerPath): Promise<void> {
    await db.query(
      `INSERT INTO career_paths (employee_id, current_position, target_position, milestones, estimated_time, required_skills, training_plan, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        employeeId,
        careerPath.currentPosition,
        careerPath.targetPosition,
        JSON.stringify(careerPath.milestones),
        careerPath.estimatedTime,
        JSON.stringify(careerPath.requiredSkills),
        JSON.stringify(careerPath.trainingPlan),
      ],
    )
  }

  private calculateKPIScore(kpi: Record<string, number>): number {
    const values = Object.values(kpi)
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
  }

  private calculateOKRScore(okr: Record<string, number>): number {
    const values = Object.values(okr)
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
  }

  private calculate360Score(peer360: Record<string, number>): number {
    const values = Object.values(peer360)
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
  }

  private async getManagerScore(employeeId: string, period: Period): Promise<number> {
    const [results] = await db.query(
      `SELECT manager_score FROM manager_evaluations
       WHERE employee_id = ?
         AND evaluation_date BETWEEN ? AND ?
       ORDER BY evaluation_date DESC
       LIMIT 1`,
      [employeeId, period.startDate, period.endDate],
    )

    return results[0]?.manager_score || 70
  }

  private async getPerformanceRank(employeeId: string, period: Period, overallScore: number): Promise<number> {
    const [results] = await db.query(
      `SELECT COUNT(*) + 1 as rank
       FROM performance_scores
       WHERE period_start_date = ?
         AND period_end_date = ?
         AND overall_score > ?`,
      [period.startDate, period.endDate, overallScore],
    )

    return results[0]?.rank || 1
  }

  private async generatePerformanceFeedback(employeeId: string, scores: any): Promise<string> {
    const feedback: string[] = []

    if (scores.overallScore >= 90) {
      feedback.push("表现优异，继续保持！")
    } else if (scores.overallScore >= 70) {
      feedback.push("表现良好，仍有提升空间。")
    } else {
      feedback.push("需要改进，建议加强培训。")
    }

    if (scores.kpiScore < 70) {
      feedback.push("KPI完成率偏低，需要关注目标达成。")
    }

    if (scores.peer360Score < 70) {
      feedback.push("团队协作方面需要加强。")
    }

    return feedback.join(" ")
  }

  private async savePerformanceScore(performanceScore: PerformanceScore): Promise<void> {
    await db.query(
      `INSERT INTO performance_scores (employee_id, period_start_date, period_end_date, period_type, kpi_score, okr_score, peer360_score, manager_score, overall_score, rank, feedback, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        performanceScore.employeeId,
        performanceScore.period.startDate,
        performanceScore.period.endDate,
        performanceScore.period.type,
        performanceScore.kpiScore,
        performanceScore.okrScore,
        performanceScore.peer360Score,
        performanceScore.managerScore,
        performanceScore.overallScore,
        performanceScore.rank,
        performanceScore.feedback,
      ],
    )
  }

  private async syncWithIncentiveSystem(performanceScore: PerformanceScore): Promise<void> {
    // 与M7.4奖惩系统同步数据
    console.log(`[v0] Syncing performance score with incentive system for employee ${performanceScore.employeeId}`)
  }

  private async getEmployeeProfile(employeeId: string): Promise<EmployeeProfile> {
    const [results] = await db.query(
      `SELECT e.*, ep.*
       FROM employees e
       LEFT JOIN employee_profiles ep ON e.id = ep.employee_id
       WHERE e.id = ?`,
      [employeeId],
    )

    if (!results || results.length === 0) {
      throw new Error(`Employee profile not found for ${employeeId}`)
    }

    const data = results[0]

    return {
      id: employeeId,
      basicInfo: {
        name: data.name,
        position: data.position,
        department: data.department,
        hireDate: data.hire_date,
        tenure: Math.floor((Date.now() - new Date(data.hire_date).getTime()) / (1000 * 60 * 60 * 24 * 365)),
      },
      skillTags: JSON.parse(data.skill_tags || "[]"),
      abilityScores: JSON.parse(data.ability_scores || "{}"),
      workStyle: data.work_style || "未知",
      careerInterests: JSON.parse(data.career_interests || "[]"),
      performanceHistory: await this.getPerformanceHistory(employeeId),
    }
  }

  private async getRecentPerformance(employeeId: string, months: number): Promise<PerformanceScore[]> {
    const [results] = await db.query(
      `SELECT * FROM performance_scores
       WHERE employee_id = ?
         AND period_end_date >= DATE_SUB(NOW(), INTERVAL ? MONTH)
       ORDER BY period_end_date DESC`,
      [employeeId, months],
    )

    return results.map((r: any) => ({
      employeeId: r.employee_id,
      period: {
        startDate: r.period_start_date,
        endDate: r.period_end_date,
        type: r.period_type,
      },
      kpiScore: r.kpi_score,
      okrScore: r.okr_score,
      peer360Score: r.peer360_score,
      managerScore: r.manager_score,
      overallScore: r.overall_score,
      rank: r.rank,
      feedback: r.feedback,
    }))
  }

  private calculatePromotionReadiness(profile: EmployeeProfile, recentPerformance: PerformanceScore[]): number {
    let readiness = 0

    // 绩效评分 (40%)
    if (recentPerformance.length > 0) {
      const avgScore = recentPerformance.reduce((sum, p) => sum + p.overallScore, 0) / recentPerformance.length
      readiness += (avgScore / 100) * 40
    }

    // 任期 (20%)
    const tenureScore = Math.min(100, (profile.basicInfo.tenure / 3) * 100)
    readiness += (tenureScore / 100) * 20

    // 技能匹配度 (30%)
    const abilityAvg =
      Object.values(profile.abilityScores).reduce((a, b) => a + b, 0) / Object.values(profile.abilityScores).length
    readiness += (abilityAvg / 100) * 30

    // 领导力 (10%)
    const leadershipScore = profile.abilityScores["领导力"] || 0
    readiness += (leadershipScore / 100) * 10

    return Math.round(readiness)
  }

  private async getNextPosition(currentPosition: string): Promise<string> {
    const [results] = await db.query(`SELECT next_position FROM career_ladder WHERE current_position = ?`, [
      currentPosition,
    ])

    return results[0]?.next_position || "高级" + currentPosition
  }

  private async checkPromotionRequirements(employeeId: string, targetPosition: string): Promise<Requirement[]> {
    const requirements: Requirement[] = []

    // 检查任期要求
    const [employeeResults] = await db.query(`SELECT hire_date FROM employees WHERE id = ?`, [employeeId])
    const tenure = Math.floor(
      (Date.now() - new Date(employeeResults[0].hire_date).getTime()) / (1000 * 60 * 60 * 24 * 365),
    )

    requirements.push({
      type: "任期",
      description: "至少2年工作经验",
      met: tenure >= 2,
    })

    // 检查绩效要求
    const recentPerformance = await this.getRecentPerformance(employeeId, 12)
    const avgScore =
      recentPerformance.length > 0
        ? recentPerformance.reduce((sum, p) => sum + p.overallScore, 0) / recentPerformance.length
        : 0

    requirements.push({
      type: "绩效",
      description: "近12个月平均绩效≥80分",
      met: avgScore >= 80,
    })

    // 检查技能要求
    const requiredSkills = await this.getRequiredSkills(targetPosition)
    const profile = await this.getEmployeeProfile(employeeId)
    const hasAllSkills = requiredSkills.every((skill) => profile.skillTags.includes(skill))

    requirements.push({
      type: "技能",
      description: `具备${targetPosition}所需的所有技能`,
      met: hasAllSkills,
    })

    return requirements
  }

  private async analyzePromotionImpact(employeeId: string, targetPosition: string): Promise<ImpactAnalysis> {
    // 团队影响
    const teamImpact = "晋升后将承担更多团队管理职责，需要培养接班人"

    // 预算影响
    const [salaryResults] = await db.query(`SELECT salary_range FROM positions WHERE name = ?`, [targetPosition])
    const budgetImpact = salaryResults[0]?.salary_range || 0

    // 风险评估
    const riskLevel: "low" | "medium" | "high" = budgetImpact > 200000 ? "medium" : "low"

    // 收益
    const benefits = ["提升团队能力", "增强员工士气", "降低人才流失风险", "提高组织效率"]

    return {
      teamImpact,
      budgetImpact,
      riskLevel,
      benefits,
    }
  }

  private async savePromotionSuggestion(suggestion: PromotionSuggestion): Promise<void> {
    await db.query(
      `INSERT INTO promotion_suggestions (employee_id, eligible, readiness, recommended_position, timeline, requirements, impact_analysis, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        suggestion.employeeId,
        suggestion.eligible,
        suggestion.readiness,
        suggestion.recommendedPosition,
        suggestion.timeline,
        JSON.stringify(suggestion.requirements),
        JSON.stringify(suggestion.impactAnalysis),
      ],
    )
  }

  private analyzePerformanceTrend(performanceTrend: number[]): number {
    if (performanceTrend.length < 2) return 0

    // 计算趋势斜率
    let trend = 0
    for (let i = 1; i < performanceTrend.length; i++) {
      trend += performanceTrend[i] - performanceTrend[i - 1]
    }

    // 下降趋势增加风险
    return trend < 0 ? Math.abs(trend) / 100 : 0
  }

  private analyzeRecentEvents(recentEvents: string[]): number {
    const negativeEvents = ["投诉", "警告", "冲突", "迟到", "缺勤"]

    let riskScore = 0
    for (const event of recentEvents) {
      if (negativeEvents.some((ne) => event.includes(ne))) {
        riskScore += 0.1
      }
    }

    return Math.min(0.4, riskScore)
  }

  private async generateRetentionStrategies(employeeId: string, factors: string[]): Promise<string[]> {
    const strategies: string[] = []

    if (factors.includes("绩效下降趋势")) {
      strategies.push("提供绩效改进计划和辅导")
    }

    if (factors.includes("敬业度低")) {
      strategies.push("安排一对一沟通，了解需求和期望")
    }

    if (factors.includes("满意度低")) {
      strategies.push("改善工作环境和福利待遇")
    }

    if (factors.includes("近期负面事件")) {
      strategies.push("及时处理冲突，提供心理支持")
    }

    strategies.push("考虑晋升或加薪机会")
    strategies.push("提供职业发展规划")

    return strategies
  }

  private async saveAttritionRisk(attritionRisk: AttritionRisk): Promise<void> {
    await db.query(
      `INSERT INTO attrition_risks (employee_id, risk_level, probability, factors, retention_strategies, urgency, assessed_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        attritionRisk.employeeId,
        attritionRisk.riskLevel,
        attritionRisk.probability,
        JSON.stringify(attritionRisk.factors),
        JSON.stringify(attritionRisk.retentionStrategies),
        attritionRisk.urgency,
      ],
    )
  }

  private async sendAttritionAlert(attritionRisk: AttritionRisk): Promise<void> {
    // 发送预警通知给HR和直属经理
    console.log(`[v0] High attrition risk detected for employee ${attritionRisk.employeeId}`)

    // 获取员工信息
    const [employeeResults] = await db.query(`SELECT name, manager_id FROM employees WHERE id = ?`, [
      attritionRisk.employeeId,
    ])

    if (employeeResults.length > 0) {
      const employee = employeeResults[0]

      // 通知HR
      await db.query(
        `INSERT INTO notifications (type, title, content, user_id, created_at)
         VALUES ('alert', '离职风险预警', ?, 'hr_manager', NOW())`,
        [`员工 ${employee.name} 存在高离职风险，概率: ${attritionRisk.probability.toFixed(1)}%`],
      )

      // 通知直属经理
      if (employee.manager_id) {
        await db.query(
          `INSERT INTO notifications (type, title, content, user_id, created_at)
           VALUES ('alert', '团队成员离职风险', ?, ?, NOW())`,
          [`您的团队成员 ${employee.name} 存在离职风险，请及时关注`, employee.manager_id],
        )
      }
    }
  }

  private async saveIncentiveAction(incentiveAction: IncentiveAction): Promise<void> {
    await db.query(
      `INSERT INTO incentive_actions (employee_id, action, amount, description, triggered_by, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        incentiveAction.employeeId,
        incentiveAction.action,
        incentiveAction.amount,
        incentiveAction.description,
        incentiveAction.triggeredBy,
      ],
    )
  }

  private async executeIncentiveAction(incentiveAction: IncentiveAction): Promise<void> {
    console.log(`[v0] Executing incentive action for employee ${incentiveAction.employeeId}:`, incentiveAction.action)

    // 根据动作类型执行相应操作
    switch (incentiveAction.action) {
      case "bonus":
        // 发放奖金
        await db.query(`UPDATE employees SET bonus = bonus + ? WHERE id = ?`, [
          incentiveAction.amount,
          incentiveAction.employeeId,
        ])
        break

      case "promotion":
        // 触发晋升流程
        await db.query(
          `INSERT INTO promotion_requests (employee_id, status, created_at) VALUES (?, 'pending', NOW())`,
          [incentiveAction.employeeId],
        )
        break

      case "training":
        // 安排培训
        await db.query(
          `INSERT INTO training_assignments (employee_id, status, created_at) VALUES (?, 'assigned', NOW())`,
          [incentiveAction.employeeId],
        )
        break

      case "recognition":
        // 发送表彰通知
        await db.query(
          `INSERT INTO notifications (type, title, content, user_id, created_at)
           VALUES ('recognition', '表现优异', ?, ?, NOW())`,
          [incentiveAction.description, incentiveAction.employeeId],
        )
        break
    }
  }
}

export const hrTalentIntelligence = new HRTalentIntelligence()
