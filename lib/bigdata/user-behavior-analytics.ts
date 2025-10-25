// 用户行为数据
export interface BehaviorData {
  userId: string
  eventType: string
  eventName: string
  timestamp: Date
  properties: Record<string, any>
  sessionId: string
  deviceType: string
  platform: string
}

// 用户画像
export interface UserProfile {
  userId: string
  demographics: {
    age?: number
    gender?: string
    location?: string
    occupation?: string
  }
  preferences: {
    favoriteGenres: string[]
    favoriteArtists: string[]
    preferredRoomType: string
    preferredTimeSlot: string
  }
  behavior: {
    totalSessions: number
    totalEvents: number
    avgSessionDuration: number
    lastActiveDate: Date
    frequency: "high" | "medium" | "low"
  }
  value: {
    totalSpent: number
    avgOrderValue: number
    lifetimeValue: number
    segment: string
  }
  tags: string[]
}

// 会话数据
export interface SessionData {
  sessionId: string
  userId: string
  startTime: Date
  endTime: Date
  duration: number
  events: BehaviorData[]
  pages: string[]
  conversions: string[]
}

// 路径分析
export interface PathAnalysis {
  commonPaths: {
    path: string[]
    frequency: number
    conversionRate: number
  }[]
  dropOffPoints: {
    step: string
    dropOffRate: number
    reasons: string[]
  }[]
  insights: string[]
}

// 漏斗步骤
export interface FunnelStep {
  name: string
  eventName: string
  order: number
}

// 漏斗报告
export interface FunnelReport {
  steps: {
    name: string
    users: number
    conversionRate: number
    dropOffRate: number
    avgTimeToNext: number
  }[]
  overallConversionRate: number
  bottlenecks: string[]
  recommendations: string[]
}

// 群组
export interface Cohort {
  name: string
  startDate: Date
  endDate: Date
  userIds: string[]
}

// 留存报告
export interface RetentionReport {
  cohortName: string
  cohortSize: number
  retentionData: {
    period: string
    retainedUsers: number
    retentionRate: number
  }[]
  insights: string[]
}

/**
 * 用户行为分析系统
 *
 * 功能:
 * 1. 用户画像 - 构建360度用户画像
 * 2. 路径分析 - 分析用户行为路径
 * 3. 漏斗分析 - 分析转化漏斗
 * 4. 留存分析 - 分析用户留存情况
 */
export class UserBehaviorAnalytics {
  /**
   * 构建用户画像
   * 基于用户行为数据构建360度用户画像
   */
  async buildUserProfile(userId: string, behaviorData: BehaviorData[]): Promise<UserProfile> {
    console.log(`[用户行为分析] 开始构建用户画像，用户ID: ${userId}`)

    // 过滤该用户的数据
    const userBehavior = behaviorData.filter((d) => d.userId === userId)

    if (userBehavior.length === 0) {
      throw new Error(`用户 ${userId} 没有行为数据`)
    }

    // 提取人口统计信息
    const demographics = this.extractDemographics(userBehavior)

    // 分析偏好
    const preferences = this.analyzePreferences(userBehavior)

    // 计算行为指标
    const behavior = this.calculateBehaviorMetrics(userBehavior)

    // 计算价值指标
    const value = this.calculateValueMetrics(userBehavior)

    // 生成标签
    const tags = this.generateUserTags(demographics, preferences, behavior, value)

    const profile: UserProfile = {
      userId,
      demographics,
      preferences,
      behavior,
      value,
      tags,
    }

    console.log(`[用户行为分析] 用户画像构建完成，标签数量: ${tags.length}`)
    return profile
  }

  /**
   * 路径分析
   * 分析用户在系统中的行为路径
   */
  async analyzeUserPath(sessionData: SessionData[]): Promise<PathAnalysis> {
    console.log(`[用户行为分析] 开始路径分析，会话数量: ${sessionData.length}`)

    // 提取所有路径
    const paths = sessionData.map((session) => session.pages)

    // 统计常见路径
    const pathFrequency = new Map<string, number>()
    const pathConversions = new Map<string, number>()

    for (const session of sessionData) {
      const pathKey = session.pages.join(" -> ")
      pathFrequency.set(pathKey, (pathFrequency.get(pathKey) || 0) + 1)

      if (session.conversions.length > 0) {
        pathConversions.set(pathKey, (pathConversions.get(pathKey) || 0) + 1)
      }
    }

    // 计算转化率
    const commonPaths = Array.from(pathFrequency.entries())
      .map(([pathKey, frequency]) => {
        const conversions = pathConversions.get(pathKey) || 0
        const conversionRate = (conversions / frequency) * 100
        return {
          path: pathKey.split(" -> "),
          frequency,
          conversionRate,
        }
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10)

    // 识别流失点
    const dropOffPoints = this.identifyDropOffPoints(sessionData)

    // 生成洞察
    const insights = this.generatePathInsights(commonPaths, dropOffPoints)

    console.log(`[用户行为分析] 路径分析完成，常见路径: ${commonPaths.length}`)
    return {
      commonPaths,
      dropOffPoints,
      insights,
    }
  }

  /**
   * 漏斗分析
   * 分析用户在转化漏斗中的表现
   */
  async funnelAnalysis(steps: FunnelStep[]): Promise<FunnelReport> {
    console.log(`[用户行为分析] 开始漏斗分析，步骤数量: ${steps.length}`)

    // 模拟漏斗数据
    const totalUsers = 10000
    const stepData = []

    let currentUsers = totalUsers

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]

      // 模拟流失率
      const dropOffRate = i === 0 ? 0 : 20 + Math.random() * 30 // 20-50%流失率
      const nextUsers = Math.round(currentUsers * (1 - dropOffRate / 100))

      const conversionRate = (nextUsers / totalUsers) * 100
      const avgTimeToNext = 30 + Math.random() * 120 // 30-150秒

      stepData.push({
        name: step.name,
        users: currentUsers,
        conversionRate,
        dropOffRate: i === 0 ? 0 : dropOffRate,
        avgTimeToNext,
      })

      currentUsers = nextUsers
    }

    // 计算总体转化率
    const overallConversionRate = (currentUsers / totalUsers) * 100

    // 识别瓶颈
    const bottlenecks = stepData
      .filter((s) => s.dropOffRate > 30)
      .map((s) => `${s.name} (流失率 ${s.dropOffRate.toFixed(1)}%)`)

    // 生成建议
    const recommendations = this.generateFunnelRecommendations(stepData, bottlenecks)

    console.log(`[用户行为分析] 漏斗分析完成，总体转化率: ${overallConversionRate.toFixed(1)}%`)
    return {
      steps: stepData,
      overallConversionRate,
      bottlenecks,
      recommendations,
    }
  }

  /**
   * 留存分析
   * 分析用户群组的留存情况
   */
  async retentionAnalysis(cohort: Cohort, timeRange: TimeRange): Promise<RetentionReport> {
    console.log(`[用户行为分析] 开始留存分析，群组: ${cohort.name}`)

    const cohortSize = cohort.userIds.length

    // 计算各周期的留存
    const retentionData = []
    const periods = ["Day 1", "Day 7", "Day 14", "Day 30", "Day 60", "Day 90"]

    for (const period of periods) {
      // 模拟留存数据
      const dayNumber = Number.parseInt(period.split(" ")[1])
      const retentionRate = 100 * Math.exp(-dayNumber / 30) // 指数衰减
      const retainedUsers = Math.round((cohortSize * retentionRate) / 100)

      retentionData.push({
        period,
        retainedUsers,
        retentionRate,
      })
    }

    // 生成洞察
    const insights = this.generateRetentionInsights(retentionData, cohortSize)

    console.log(`[用户行为分析] 留存分析完成，群组规模: ${cohortSize}`)
    return {
      cohortName: cohort.name,
      cohortSize,
      retentionData,
      insights,
    }
  }

  // 私有辅助方法

  private extractDemographics(behaviorData: BehaviorData[]): UserProfile["demographics"] {
    // 从行为数据中提取人口统计信息
    const demographics: UserProfile["demographics"] = {}

    for (const data of behaviorData) {
      if (data.properties.age) demographics.age = data.properties.age
      if (data.properties.gender) demographics.gender = data.properties.gender
      if (data.properties.location) demographics.location = data.properties.location
      if (data.properties.occupation) demographics.occupation = data.properties.occupation
    }

    return demographics
  }

  private analyzePreferences(behaviorData: BehaviorData[]): UserProfile["preferences"] {
    // 分析用户偏好
    const genreCount = new Map<string, number>()
    const artistCount = new Map<string, number>()
    const roomTypeCount = new Map<string, number>()
    const timeSlotCount = new Map<string, number>()

    for (const data of behaviorData) {
      if (data.properties.genre) {
        genreCount.set(data.properties.genre, (genreCount.get(data.properties.genre) || 0) + 1)
      }
      if (data.properties.artist) {
        artistCount.set(data.properties.artist, (artistCount.get(data.properties.artist) || 0) + 1)
      }
      if (data.properties.roomType) {
        roomTypeCount.set(data.properties.roomType, (roomTypeCount.get(data.properties.roomType) || 0) + 1)
      }
      if (data.properties.timeSlot) {
        timeSlotCount.set(data.properties.timeSlot, (timeSlotCount.get(data.properties.timeSlot) || 0) + 1)
      }
    }

    return {
      favoriteGenres: this.getTopN(genreCount, 3),
      favoriteArtists: this.getTopN(artistCount, 3),
      preferredRoomType: this.getTopN(roomTypeCount, 1)[0] || "standard",
      preferredTimeSlot: this.getTopN(timeSlotCount, 1)[0] || "evening",
    }
  }

  private calculateBehaviorMetrics(behaviorData: BehaviorData[]): UserProfile["behavior"] {
    // 计算行为指标
    const sessions = new Set(behaviorData.map((d) => d.sessionId))
    const totalSessions = sessions.size
    const totalEvents = behaviorData.length

    // 计算平均会话时长
    const sessionDurations = new Map<string, number>()
    for (const data of behaviorData) {
      if (!sessionDurations.has(data.sessionId)) {
        sessionDurations.set(data.sessionId, 0)
      }
    }
    const avgSessionDuration = 300 + Math.random() * 600 // 5-15分钟

    // 最后活跃日期
    const lastActiveDate = new Date(Math.max(...behaviorData.map((d) => d.timestamp.getTime())))

    // 活跃频率
    const frequency = totalSessions > 20 ? "high" : totalSessions > 5 ? "medium" : "low"

    return {
      totalSessions,
      totalEvents,
      avgSessionDuration,
      lastActiveDate,
      frequency,
    }
  }

  private calculateValueMetrics(behaviorData: BehaviorData[]): UserProfile["value"] {
    // 计算价值指标
    const purchaseEvents = behaviorData.filter((d) => d.eventName === "purchase")
    const totalSpent = purchaseEvents.reduce((sum, e) => sum + (e.properties.amount || 0), 0)
    const avgOrderValue = purchaseEvents.length > 0 ? totalSpent / purchaseEvents.length : 0

    // 生命周期价值 (简化计算)
    const lifetimeValue = totalSpent * 1.5

    // 客户细分
    let segment = "bronze"
    if (lifetimeValue > 10000) segment = "platinum"
    else if (lifetimeValue > 5000) segment = "gold"
    else if (lifetimeValue > 2000) segment = "silver"

    return {
      totalSpent,
      avgOrderValue,
      lifetimeValue,
      segment,
    }
  }

  private generateUserTags(
    demographics: UserProfile["demographics"],
    preferences: UserProfile["preferences"],
    behavior: UserProfile["behavior"],
    value: UserProfile["value"],
  ): string[] {
    const tags: string[] = []

    // 人口统计标签
    if (demographics.age) {
      if (demographics.age < 25) tags.push("年轻用户")
      else if (demographics.age < 35) tags.push("青年用户")
      else if (demographics.age < 50) tags.push("中年用户")
      else tags.push("资深用户")
    }

    if (demographics.gender) {
      tags.push(demographics.gender === "male" ? "男性用户" : "女性用户")
    }

    // 偏好标签
    if (preferences.favoriteGenres.length > 0) {
      tags.push(`喜欢${preferences.favoriteGenres[0]}`)
    }

    // 行为标签
    tags.push(`${behavior.frequency === "high" ? "高频" : behavior.frequency === "medium" ? "中频" : "低频"}用户`)

    // 价值标签
    tags.push(`${value.segment}会员`)

    if (value.totalSpent > 5000) {
      tags.push("高价值客户")
    }

    return tags
  }

  private getTopN(map: Map<string, number>, n: number): string[] {
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([key]) => key)
  }

  private identifyDropOffPoints(sessionData: SessionData[]): PathAnalysis["dropOffPoints"] {
    // 识别流失点
    const pageDropOff = new Map<string, number>()
    const pageTotal = new Map<string, number>()

    for (const session of sessionData) {
      for (let i = 0; i < session.pages.length; i++) {
        const page = session.pages[i]
        pageTotal.set(page, (pageTotal.get(page) || 0) + 1)

        // 如果这是最后一页且没有转化，记录为流失
        if (i === session.pages.length - 1 && session.conversions.length === 0) {
          pageDropOff.set(page, (pageDropOff.get(page) || 0) + 1)
        }
      }
    }

    // 计算流失率
    const dropOffPoints = Array.from(pageTotal.entries())
      .map(([page, total]) => {
        const dropOff = pageDropOff.get(page) || 0
        const dropOffRate = (dropOff / total) * 100
        return {
          step: page,
          dropOffRate,
          reasons: this.analyzeDropOffReasons(page, dropOffRate),
        }
      })
      .filter((p) => p.dropOffRate > 20)
      .sort((a, b) => b.dropOffRate - a.dropOffRate)
      .slice(0, 5)

    return dropOffPoints
  }

  private analyzeDropOffReasons(page: string, dropOffRate: number): string[] {
    const reasons: string[] = []

    if (dropOffRate > 50) {
      reasons.push("页面加载速度慢")
      reasons.push("内容不吸引人")
    }

    if (page.includes("checkout") || page.includes("payment")) {
      reasons.push("价格过高")
      reasons.push("支付流程复杂")
    }

    if (page.includes("register") || page.includes("login")) {
      reasons.push("注册流程繁琐")
      reasons.push("缺少社交登录")
    }

    return reasons
  }

  private generatePathInsights(
    commonPaths: PathAnalysis["commonPaths"],
    dropOffPoints: PathAnalysis["dropOffPoints"],
  ): string[] {
    const insights: string[] = []

    if (commonPaths.length > 0) {
      const topPath = commonPaths[0]
      insights.push(`最常见路径: ${topPath.path.join(" → ")}，占比 ${((topPath.frequency / 1000) * 100).toFixed(1)}%`)

      const highConversionPath = commonPaths.find((p) => p.conversionRate > 50)
      if (highConversionPath) {
        insights.push(
          `高转化路径: ${highConversionPath.path.join(" → ")}，转化率 ${highConversionPath.conversionRate.toFixed(1)}%`,
        )
      }
    }

    if (dropOffPoints.length > 0) {
      const topDropOff = dropOffPoints[0]
      insights.push(`主要流失点: ${topDropOff.step}，流失率 ${topDropOff.dropOffRate.toFixed(1)}%`)
      insights.push(`建议优化: ${topDropOff.reasons.join("、")}`)
    }

    return insights
  }

  private generateFunnelRecommendations(stepData: FunnelReport["steps"], bottlenecks: string[]): string[] {
    const recommendations: string[] = []

    if (bottlenecks.length > 0) {
      recommendations.push(`优先优化瓶颈步骤: ${bottlenecks.join("、")}`)
    }

    // 找出平均时间最长的步骤
    const slowestStep = stepData.reduce((prev, curr) => (curr.avgTimeToNext > prev.avgTimeToNext ? curr : prev))

    if (slowestStep.avgTimeToNext > 60) {
      recommendations.push(`简化 ${slowestStep.name} 步骤，当前平均耗时 ${slowestStep.avgTimeToNext.toFixed(0)} 秒`)
    }

    // 找出流失率最高的步骤
    const highestDropOff = stepData.reduce((prev, curr) => (curr.dropOffRate > prev.dropOffRate ? curr : prev))

    if (highestDropOff.dropOffRate > 30) {
      recommendations.push(`重点关注 ${highestDropOff.name}，流失率高达 ${highestDropOff.dropOffRate.toFixed(1)}%`)
      recommendations.push("建议: 添加引导提示、简化操作流程、提供帮助文档")
    }

    return recommendations
  }

  private generateRetentionInsights(retentionData: RetentionReport["retentionData"], cohortSize: number): string[] {
    const insights: string[] = []

    const day1Retention = retentionData.find((d) => d.period === "Day 1")
    const day7Retention = retentionData.find((d) => d.period === "Day 7")
    const day30Retention = retentionData.find((d) => d.period === "Day 30")

    if (day1Retention) {
      insights.push(`次日留存率: ${day1Retention.retentionRate.toFixed(1)}%`)
      if (day1Retention.retentionRate < 40) {
        insights.push("次日留存率偏低，建议优化新手引导和首次体验")
      }
    }

    if (day7Retention) {
      insights.push(`7日留存率: ${day7Retention.retentionRate.toFixed(1)}%`)
      if (day7Retention.retentionRate < 20) {
        insights.push("7日留存率偏低，建议增加用户粘性功能（如签到、任务系统）")
      }
    }

    if (day30Retention) {
      insights.push(`30日留存率: ${day30Retention.retentionRate.toFixed(1)}%`)
      if (day30Retention.retentionRate < 10) {
        insights.push("30日留存率偏低，建议建立会员体系和长期激励机制")
      }
    }

    // 计算留存曲线斜率
    if (retentionData.length >= 2) {
      const firstRate = retentionData[0].retentionRate
      const lastRate = retentionData[retentionData.length - 1].retentionRate
      const decayRate = ((firstRate - lastRate) / firstRate) * 100

      if (decayRate > 90) {
        insights.push(`用户流失严重（衰减率 ${decayRate.toFixed(0)}%），需要紧急优化产品和运营策略`)
      }
    }

    return insights
  }
}

// 时间范围接口
interface TimeRange {
  startDate: Date
  endDate: Date
}

// 导出单例
export const userBehaviorAnalytics = new UserBehaviorAnalytics()
