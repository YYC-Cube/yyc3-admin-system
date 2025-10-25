import { db } from "@/lib/db/mysql"

// 反馈来源
export type FeedbackSource = "form" | "voice" | "sms" | "email"

// 反馈类型
export type FeedbackType = "customer" | "internal"

// 反馈分类
export type FeedbackCategory = "complaint" | "suggestion" | "inquiry"

// 情绪
export type Sentiment = "positive" | "negative" | "neutral"

// 优先级
export type Priority = "high" | "medium" | "low"

// 状态
export type FeedbackStatus = "pending" | "processing" | "resolved" | "closed"

// 反馈
export interface Feedback {
  id: string
  type: FeedbackType
  source: FeedbackSource
  category: FeedbackCategory
  content: string
  sentiment: Sentiment
  satisfactionScore: number
  priority: Priority
  status: FeedbackStatus
  customerId?: string
  employeeId?: string
  assignedTo?: string
  isAnonymous: boolean
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

// 情绪评分
export interface SentimentScore {
  sentiment: Sentiment
  score: number
  confidence: number
  keywords: string[]
}

// 满意度评分
export interface SatisfactionScore {
  score: number
  level: "very_dissatisfied" | "dissatisfied" | "neutral" | "satisfied" | "very_satisfied"
  factors: string[]
}

// 处理分配
export interface Assignment {
  feedbackId: string
  assignedTo: string
  assignedBy: string
  assignedAt: Date
  expectedResolutionTime: Date
  notes?: string
}

// 反馈洞察
export interface FeedbackInsights {
  totalCount: number
  categoryDistribution: Record<string, number>
  sentimentDistribution: Record<string, number>
  avgSatisfactionScore: number
  hotTopics: string[]
  improvementSuggestions: string[]
  trendAnalysis: TrendData[]
}

export interface TrendData {
  date: string
  count: number
  avgSatisfaction: number
  sentiment: Record<Sentiment, number>
}

export interface TimeRange {
  startDate: Date
  endDate: Date
}

export class FeedbackIntelligenceSystem {
  /**
   * 收集反馈
   */
  async collectFeedback(
    type: FeedbackType,
    source: FeedbackSource,
    content: string,
    customerId?: string,
    employeeId?: string,
    isAnonymous = false,
  ): Promise<Feedback> {
    // 自动分类
    const category = await this.classifyFeedback(content)

    // 情绪识别
    const sentimentResult = await this.analyzeSentiment(content)

    // 满意度评分
    const satisfactionResult = await this.scoreSatisfaction(content, sentimentResult)

    // 优先级判定
    const priority = this.determinePriority(category, sentimentResult, satisfactionResult)

    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const feedback: Feedback = {
      id: feedbackId,
      type,
      source,
      category,
      content,
      sentiment: sentimentResult.sentiment,
      satisfactionScore: satisfactionResult.score,
      priority,
      status: "pending",
      customerId,
      employeeId,
      isAnonymous,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // 保存到数据库
    await this.saveFeedback(feedback)

    // 自动分配处理人
    if (priority === "high" || category === "complaint") {
      await this.assignHandler(feedback)
    }

    return feedback
  }

  /**
   * 分类反馈
   */
  private async classifyFeedback(content: string): Promise<FeedbackCategory> {
    const lowerContent = content.toLowerCase()

    // 投诉关键词
    const complaintKeywords = ["投诉", "不满", "差", "糟糕", "失望", "问题", "错误", "延迟", "态度", "服务差"]

    // 建议关键词
    const suggestionKeywords = ["建议", "希望", "可以", "应该", "改进", "优化", "增加", "提供"]

    // 咨询关键词
    const inquiryKeywords = ["怎么", "如何", "什么", "哪里", "为什么", "是否", "能否", "可以吗"]

    // 统计关键词出现次数
    const complaintCount = complaintKeywords.filter((kw) => lowerContent.includes(kw)).length
    const suggestionCount = suggestionKeywords.filter((kw) => lowerContent.includes(kw)).length
    const inquiryCount = inquiryKeywords.filter((kw) => lowerContent.includes(kw)).length

    // 判断分类
    if (complaintCount > suggestionCount && complaintCount > inquiryCount) {
      return "complaint"
    } else if (suggestionCount > inquiryCount) {
      return "suggestion"
    } else {
      return "inquiry"
    }
  }

  /**
   * 情绪识别
   */
  async analyzeSentiment(content: string): Promise<SentimentScore> {
    const lowerContent = content.toLowerCase()

    // 正面关键词
    const positiveKeywords = ["好", "满意", "喜欢", "优秀", "棒", "赞", "感谢", "完美", "专业", "热情", "周到"]

    // 负面关键词
    const negativeKeywords = ["差", "不满", "失望", "糟糕", "问题", "错误", "慢", "贵", "冷淡", "态度", "投诉"]

    // 统计关键词
    const positiveCount = positiveKeywords.filter((kw) => lowerContent.includes(kw)).length
    const negativeCount = negativeKeywords.filter((kw) => lowerContent.includes(kw)).length

    // 提取关键词
    const keywords: string[] = []
    positiveKeywords.forEach((kw) => {
      if (lowerContent.includes(kw)) keywords.push(kw)
    })
    negativeKeywords.forEach((kw) => {
      if (lowerContent.includes(kw)) keywords.push(kw)
    })

    // 计算情绪
    let sentiment: Sentiment
    let score: number
    let confidence: number

    if (positiveCount > negativeCount) {
      sentiment = "positive"
      score = Math.min(100, 50 + positiveCount * 10)
      confidence = Math.min(1, (positiveCount - negativeCount) / 5)
    } else if (negativeCount > positiveCount) {
      sentiment = "negative"
      score = Math.max(0, 50 - negativeCount * 10)
      confidence = Math.min(1, (negativeCount - positiveCount) / 5)
    } else {
      sentiment = "neutral"
      score = 50
      confidence = 0.5
    }

    return {
      sentiment,
      score,
      confidence,
      keywords,
    }
  }

  /**
   * 满意度评分
   */
  async scoreSatisfaction(content: string, sentimentResult: SentimentScore): Promise<SatisfactionScore> {
    // 基于情绪评分计算满意度
    let score = sentimentResult.score

    // 调整因素
    const factors: string[] = []

    // 服务质量
    if (content.includes("服务") || content.includes("态度")) {
      factors.push("服务质量")
      if (sentimentResult.sentiment === "positive") {
        score += 5
      } else if (sentimentResult.sentiment === "negative") {
        score -= 5
      }
    }

    // 产品质量
    if (content.includes("产品") || content.includes("质量") || content.includes("设备")) {
      factors.push("产品质量")
      if (sentimentResult.sentiment === "positive") {
        score += 5
      } else if (sentimentResult.sentiment === "negative") {
        score -= 5
      }
    }

    // 价格
    if (content.includes("价格") || content.includes("贵") || content.includes("便宜")) {
      factors.push("价格")
      if (content.includes("贵") || content.includes("太贵")) {
        score -= 5
      }
    }

    // 环境
    if (content.includes("环境") || content.includes("氛围") || content.includes("装修")) {
      factors.push("环境")
      if (sentimentResult.sentiment === "positive") {
        score += 5
      } else if (sentimentResult.sentiment === "negative") {
        score -= 5
      }
    }

    // 限制分数范围
    score = Math.max(0, Math.min(100, score))

    // 确定满意度等级
    let level: SatisfactionScore["level"]
    if (score >= 80) {
      level = "very_satisfied"
    } else if (score >= 60) {
      level = "satisfied"
    } else if (score >= 40) {
      level = "neutral"
    } else if (score >= 20) {
      level = "dissatisfied"
    } else {
      level = "very_dissatisfied"
    }

    return {
      score,
      level,
      factors,
    }
  }

  /**
   * 确定优先级
   */
  private determinePriority(
    category: FeedbackCategory,
    sentimentResult: SentimentScore,
    satisfactionResult: SatisfactionScore,
  ): Priority {
    // 投诉且满意度很低 -> 高优先级
    if (category === "complaint" && satisfactionResult.score < 30) {
      return "high"
    }

    // 投诉或负面情绪 -> 中优先级
    if (category === "complaint" || sentimentResult.sentiment === "negative") {
      return "medium"
    }

    // 其他 -> 低优先级
    return "low"
  }

  /**
   * 分配处理人
   */
  async assignHandler(feedback: Feedback): Promise<Assignment> {
    // 根据反馈类型和分类选择处理人
    let assignedTo: string

    if (feedback.type === "customer") {
      if (feedback.category === "complaint") {
        // 投诉分配给客服主管
        assignedTo = await this.getAvailableHandler("customer_service_manager")
      } else if (feedback.category === "suggestion") {
        // 建议分配给产品经理
        assignedTo = await this.getAvailableHandler("product_manager")
      } else {
        // 咨询分配给客服
        assignedTo = await this.getAvailableHandler("customer_service")
      }
    } else {
      // 内部反馈分配给人力资源
      assignedTo = await this.getAvailableHandler("hr_manager")
    }

    // 计算预期解决时间
    const expectedResolutionTime = new Date()
    if (feedback.priority === "high") {
      expectedResolutionTime.setHours(expectedResolutionTime.getHours() + 4) // 4小时
    } else if (feedback.priority === "medium") {
      expectedResolutionTime.setHours(expectedResolutionTime.getHours() + 24) // 1天
    } else {
      expectedResolutionTime.setHours(expectedResolutionTime.getHours() + 72) // 3天
    }

    const assignment: Assignment = {
      feedbackId: feedback.id,
      assignedTo,
      assignedBy: "system",
      assignedAt: new Date(),
      expectedResolutionTime,
    }

    // 更新反馈状态
    await db.query("UPDATE feedbacks SET assigned_to = ?, status = ?, updated_at = NOW() WHERE id = ?", [
      assignedTo,
      "processing",
      feedback.id,
    ])

    // 保存分配记录
    await db.query(
      `INSERT INTO feedback_assignments (feedback_id, assigned_to, assigned_by, assigned_at, expected_resolution_time, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        assignment.feedbackId,
        assignment.assignedTo,
        assignment.assignedBy,
        assignment.assignedAt,
        assignment.expectedResolutionTime,
      ],
    )

    return assignment
  }

  /**
   * 生成洞察
   */
  async generateInsights(timeRange: TimeRange): Promise<FeedbackInsights> {
    // 获取反馈统计
    const statsQuery = `
      SELECT 
        COUNT(*) as totalCount,
        category,
        sentiment,
        AVG(satisfaction_score) as avgSatisfaction
      FROM feedbacks
      WHERE created_at BETWEEN ? AND ?
      GROUP BY category, sentiment
    `

    const [statsResults] = await db.query(statsQuery, [timeRange.startDate, timeRange.endDate])

    // 计算分布
    const categoryDistribution: Record<string, number> = {}
    const sentimentDistribution: Record<string, number> = {}
    let totalCount = 0
    let totalSatisfaction = 0

    statsResults.forEach((row: any) => {
      totalCount += row.totalCount
      totalSatisfaction += row.avgSatisfaction * row.totalCount

      categoryDistribution[row.category] = (categoryDistribution[row.category] || 0) + row.totalCount
      sentimentDistribution[row.sentiment] = (sentimentDistribution[row.sentiment] || 0) + row.totalCount
    })

    const avgSatisfactionScore = totalCount > 0 ? totalSatisfaction / totalCount : 0

    // 提取热点话题
    const hotTopics = await this.extractHotTopics(timeRange)

    // 生成改进建议
    const improvementSuggestions = await this.generateImprovementSuggestions(
      categoryDistribution,
      sentimentDistribution,
      avgSatisfactionScore,
    )

    // 趋势分析
    const trendAnalysis = await this.analyzeTrend(timeRange)

    return {
      totalCount,
      categoryDistribution,
      sentimentDistribution,
      avgSatisfactionScore,
      hotTopics,
      improvementSuggestions,
      trendAnalysis,
    }
  }

  // 辅助方法

  private async saveFeedback(feedback: Feedback): Promise<void> {
    await db.query(
      `INSERT INTO feedbacks (
        id, type, source, category, content, sentiment, satisfaction_score, 
        priority, status, customer_id, employee_id, is_anonymous, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        feedback.id,
        feedback.type,
        feedback.source,
        feedback.category,
        feedback.content,
        feedback.sentiment,
        feedback.satisfactionScore,
        feedback.priority,
        feedback.status,
        feedback.customerId,
        feedback.employeeId,
        feedback.isAnonymous,
        feedback.createdAt,
        feedback.updatedAt,
      ],
    )
  }

  private async getAvailableHandler(role: string): Promise<string> {
    // 查找该角色中工作负载最少的员工
    const query = `
      SELECT e.id
      FROM employees e
      LEFT JOIN feedback_assignments fa ON e.id = fa.assigned_to 
        AND fa.created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
      WHERE e.role = ?
        AND e.status = 'active'
      GROUP BY e.id
      ORDER BY COUNT(fa.id) ASC
      LIMIT 1
    `

    const [results] = await db.query(query, [role])

    if (results && results.length > 0) {
      return results[0].id
    }

    // 如果没有找到，返回默认处理人
    return "default_handler"
  }

  private async extractHotTopics(timeRange: TimeRange): Promise<string[]> {
    // 提取高频关键词
    const query = `
      SELECT content
      FROM feedbacks
      WHERE created_at BETWEEN ? AND ?
    `

    const [results] = await db.query(query, [timeRange.startDate, timeRange.endDate])

    // 简单的关键词提取（实际应使用NLP）
    const keywords = new Map<string, number>()
    const commonWords = ["的", "了", "是", "在", "我", "有", "和", "就", "不", "人", "都", "一", "个"]

    results.forEach((row: any) => {
      const words = row.content.match(/[\u4e00-\u9fa5]+/g) || []
      words.forEach((word: string) => {
        if (word.length >= 2 && !commonWords.includes(word)) {
          keywords.set(word, (keywords.get(word) || 0) + 1)
        }
      })
    })

    // 排序并返回前10个
    return Array.from(keywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map((entry) => entry[0])
  }

  private async generateImprovementSuggestions(
    categoryDistribution: Record<string, number>,
    sentimentDistribution: Record<string, number>,
    avgSatisfactionScore: number,
  ): Promise<string[]> {
    const suggestions: string[] = []

    // 投诉过多
    const complaintRate =
      (categoryDistribution["complaint"] || 0) / Object.values(categoryDistribution).reduce((a, b) => a + b, 0)
    if (complaintRate > 0.3) {
      suggestions.push("投诉率较高(>30%)，建议加强服务质量管理和员工培训")
    }

    // 负面情绪过多
    const negativeRate =
      (sentimentDistribution["negative"] || 0) / Object.values(sentimentDistribution).reduce((a, b) => a + b, 0)
    if (negativeRate > 0.4) {
      suggestions.push("负面情绪占比较高(>40%)，建议分析主要问题并制定改进计划")
    }

    // 满意度低
    if (avgSatisfactionScore < 60) {
      suggestions.push("整体满意度偏低(<60分)，建议全面审查服务流程和产品质量")
    }

    // 建议多
    const suggestionRate =
      (categoryDistribution["suggestion"] || 0) / Object.values(categoryDistribution).reduce((a, b) => a + b, 0)
    if (suggestionRate > 0.3) {
      suggestions.push("客户建议较多，建议整理分析并优先实施高价值建议")
    }

    if (suggestions.length === 0) {
      suggestions.push("整体反馈良好，继续保持并持续优化")
    }

    return suggestions
  }

  private async analyzeTrend(timeRange: TimeRange): Promise<TrendData[]> {
    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        AVG(satisfaction_score) as avgSatisfaction,
        SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END) as positive,
        SUM(CASE WHEN sentiment = 'negative' THEN 1 ELSE 0 END) as negative,
        SUM(CASE WHEN sentiment = 'neutral' THEN 1 ELSE 0 END) as neutral
      FROM feedbacks
      WHERE created_at BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    const [results] = await db.query(query, [timeRange.startDate, timeRange.endDate])

    return results.map((row: any) => ({
      date: row.date,
      count: row.count,
      avgSatisfaction: row.avgSatisfaction,
      sentiment: {
        positive: row.positive,
        negative: row.negative,
        neutral: row.neutral,
      },
    }))
  }
}

export const feedbackIntelligenceSystem = new FeedbackIntelligenceSystem()
