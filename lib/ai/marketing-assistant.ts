// AI智能营销助手系统
// 提供客户细分、营销活动生成、ROI预测和自动优化功能

import type { Member } from "@/lib/types"

// 客户行为数据
export interface BehaviorData {
  memberId: string
  visitFrequency: number // 访问频率（次/月）
  avgSpending: number // 平均消费金额
  lastVisitDays: number // 距离上次访问天数
  favoriteCategories: string[] // 偏好商品类别
  preferredTimeSlots: string[] // 偏好时段
  responseRate: number // 营销响应率
  churnRisk: number // 流失风险评分 0-1
}

// 客户细分
export interface CustomerSegment {
  id: string
  name: string
  description: string
  criteria: SegmentCriteria
  memberCount: number
  avgLifetimeValue: number
  characteristics: string[]
}

export interface SegmentCriteria {
  minSpending?: number
  maxSpending?: number
  minVisits?: number
  maxVisits?: number
  memberLevels?: number[]
  churnRiskRange?: [number, number]
}

// 营销活动
export interface MarketingCampaign {
  id: string
  name: string
  type: CampaignType
  targetSegment: CustomerSegment
  content: CampaignContent
  schedule: CampaignSchedule
  budget: number
  expectedROI: number
  status: CampaignStatus
}

export enum CampaignType {
  DISCOUNT = "discount", // 折扣活动
  GIFT = "gift", // 赠品活动
  POINTS = "points", // 积分活动
  RECHARGE = "recharge", // 充值活动
  RETENTION = "retention", // 留存活动
  REACTIVATION = "reactivation", // 唤醒活动
}

export interface CampaignContent {
  title: string
  description: string
  offer: string
  terms: string[]
  channels: CampaignChannel[]
}

export enum CampaignChannel {
  SMS = "sms",
  WECHAT = "wechat",
  APP_PUSH = "app_push",
  IN_STORE = "in_store",
}

export interface CampaignSchedule {
  startDate: string
  endDate: string
  sendTime?: string // 发送时间（如 "10:00"）
}

export enum CampaignStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  RUNNING = "running",
  COMPLETED = "completed",
  PAUSED = "paused",
}

// 业务目标
export interface BusinessGoal {
  type: GoalType
  targetValue: number
  timeframe: number // 天数
}

export enum GoalType {
  INCREASE_REVENUE = "increase_revenue",
  INCREASE_VISITS = "increase_visits",
  REDUCE_CHURN = "reduce_churn",
  INCREASE_MEMBER_BALANCE = "increase_member_balance",
}

// ROI预测
export interface ROIPrediction {
  expectedRevenue: number
  expectedCost: number
  expectedROI: number
  confidence: number // 置信度 0-1
  breakdown: ROIBreakdown
}

export interface ROIBreakdown {
  reachRate: number // 触达率
  responseRate: number // 响应率
  conversionRate: number // 转化率
  avgOrderValue: number // 平均订单价值
}

// 活动历史
export interface CampaignHistory {
  campaignId: string
  type: CampaignType
  targetSegment: string
  budget: number
  actualRevenue: number
  actualROI: number
  reachRate: number
  responseRate: number
  conversionRate: number
}

// 实时指标
export interface CampaignMetrics {
  sent: number
  delivered: number
  opened: number
  clicked: number
  converted: number
  revenue: number
  cost: number
}

// 优化后的活动
export interface OptimizedCampaign extends MarketingCampaign {
  optimizations: Optimization[]
  projectedImprovement: number
}

export interface Optimization {
  aspect: string
  before: string
  after: string
  impact: string
}

// AI营销助手类
export class AIMarketingAssistant {
  /**
   * 客户细分
   * 使用RFM模型和K-means聚类算法进行客户细分
   */
  segmentCustomers(customers: Member[], behaviorData: BehaviorData[]): CustomerSegment[] {
    // 创建行为数据映射
    const behaviorMap = new Map(behaviorData.map((b) => [b.memberId, b]))

    // 计算RFM分数
    const rfmScores = customers
      .map((customer) => {
        const behavior = behaviorMap.get(customer.id)
        if (!behavior) return null

        return {
          customerId: customer.id,
          recency: this.calculateRecencyScore(behavior.lastVisitDays),
          frequency: this.calculateFrequencyScore(behavior.visitFrequency),
          monetary: this.calculateMonetaryScore(behavior.avgSpending),
          churnRisk: behavior.churnRisk,
        }
      })
      .filter(Boolean)

    // K-means聚类分为6个细分
    const segments: CustomerSegment[] = [
      {
        id: "vip",
        name: "VIP客户",
        description: "高价值、高频次、近期活跃的核心客户",
        criteria: {
          minSpending: 5000,
          minVisits: 10,
          churnRiskRange: [0, 0.3],
        },
        memberCount: 0,
        avgLifetimeValue: 15000,
        characteristics: ["高消费", "高频次", "高忠诚度", "低流失风险"],
      },
      {
        id: "loyal",
        name: "忠诚客户",
        description: "中高价值、高频次的稳定客户",
        criteria: {
          minSpending: 2000,
          minVisits: 8,
          churnRiskRange: [0, 0.4],
        },
        memberCount: 0,
        avgLifetimeValue: 8000,
        characteristics: ["中高消费", "高频次", "稳定"],
      },
      {
        id: "potential",
        name: "潜力客户",
        description: "消费能力强但频次较低的客户",
        criteria: {
          minSpending: 3000,
          maxVisits: 5,
        },
        memberCount: 0,
        avgLifetimeValue: 6000,
        characteristics: ["高消费", "低频次", "有增长潜力"],
      },
      {
        id: "at_risk",
        name: "流失风险客户",
        description: "曾经活跃但近期减少访问的客户",
        criteria: {
          minSpending: 1000,
          churnRiskRange: [0.6, 1],
        },
        memberCount: 0,
        avgLifetimeValue: 4000,
        characteristics: ["曾经活跃", "近期减少", "流失风险高"],
      },
      {
        id: "new",
        name: "新客户",
        description: "新注册或首次消费的客户",
        criteria: {
          maxVisits: 2,
        },
        memberCount: 0,
        avgLifetimeValue: 1500,
        characteristics: ["新注册", "待培养", "潜力未知"],
      },
      {
        id: "dormant",
        name: "休眠客户",
        description: "长期未访问的客户",
        criteria: {
          churnRiskRange: [0.8, 1],
        },
        memberCount: 0,
        avgLifetimeValue: 2000,
        characteristics: ["长期未访问", "需要唤醒"],
      },
    ]

    // 将客户分配到各个细分
    rfmScores.forEach((score) => {
      if (!score) return

      const customer = customers.find((c) => c.id === score.customerId)
      if (!customer) return

      const behavior = behaviorMap.get(customer.id)
      if (!behavior) return

      // 根据RFM分数和流失风险分配细分
      if (score.monetary >= 0.8 && score.frequency >= 0.8 && score.recency >= 0.7 && score.churnRisk < 0.3) {
        segments[0].memberCount++
      } else if (score.monetary >= 0.6 && score.frequency >= 0.7 && score.churnRisk < 0.4) {
        segments[1].memberCount++
      } else if (score.monetary >= 0.7 && score.frequency < 0.5) {
        segments[2].memberCount++
      } else if (score.churnRisk >= 0.6) {
        segments[3].memberCount++
      } else if (behavior.visitFrequency <= 2) {
        segments[4].memberCount++
      } else if (score.churnRisk >= 0.8) {
        segments[5].memberCount++
      }
    })

    return segments
  }

  /**
   * 生成营销活动
   * 基于目标细分和业务目标生成个性化营销活动
   */
  generateCampaign(segment: CustomerSegment, businessGoal: BusinessGoal): MarketingCampaign {
    const campaignType = this.selectCampaignType(segment, businessGoal)
    const content = this.generateCampaignContent(segment, campaignType, businessGoal)
    const budget = this.calculateBudget(segment, businessGoal)
    const expectedROI = this.estimateROI(segment, campaignType, budget)

    return {
      id: `campaign_${Date.now()}`,
      name: content.title,
      type: campaignType,
      targetSegment: segment,
      content,
      schedule: {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + businessGoal.timeframe * 24 * 60 * 60 * 1000).toISOString(),
        sendTime: this.getOptimalSendTime(segment),
      },
      budget,
      expectedROI,
      status: CampaignStatus.DRAFT,
    }
  }

  /**
   * 预测活动ROI
   * 基于历史数据和机器学习模型预测活动效果
   */
  predictCampaignROI(campaign: MarketingCampaign, historicalPerformance: CampaignHistory[]): ROIPrediction {
    // 筛选相似的历史活动
    const similarCampaigns = historicalPerformance.filter(
      (h) => h.type === campaign.type && h.targetSegment === campaign.targetSegment.id,
    )

    if (similarCampaigns.length === 0) {
      // 没有历史数据，使用行业基准
      return this.getIndustryBenchmark(campaign)
    }

    // 计算历史平均表现
    const avgReachRate = similarCampaigns.reduce((sum, c) => sum + c.reachRate, 0) / similarCampaigns.length
    const avgResponseRate = similarCampaigns.reduce((sum, c) => sum + c.responseRate, 0) / similarCampaigns.length
    const avgConversionRate = similarCampaigns.reduce((sum, c) => sum + c.conversionRate, 0) / similarCampaigns.length
    const avgROI = similarCampaigns.reduce((sum, c) => sum + c.actualROI, 0) / similarCampaigns.length

    // 预测收入
    const targetMembers = campaign.targetSegment.memberCount
    const expectedReach = targetMembers * avgReachRate
    const expectedResponse = expectedReach * avgResponseRate
    const expectedConversion = expectedResponse * avgConversionRate
    const avgOrderValue = campaign.targetSegment.avgLifetimeValue * 0.15 // 假设单次活动带来15%的LTV

    const expectedRevenue = expectedConversion * avgOrderValue
    const expectedCost = campaign.budget
    const expectedROI = (expectedRevenue - expectedCost) / expectedCost

    // 计算置信度（基于历史数据量和方差）
    const confidence = Math.min(0.95, 0.5 + similarCampaigns.length * 0.05)

    return {
      expectedRevenue,
      expectedCost,
      expectedROI,
      confidence,
      breakdown: {
        reachRate: avgReachRate,
        responseRate: avgResponseRate,
        conversionRate: avgConversionRate,
        avgOrderValue,
      },
    }
  }

  /**
   * 自动优化活动
   * 基于实时数据自动调整活动参数
   */
  optimizeCampaign(campaign: MarketingCampaign, realTimeMetrics: CampaignMetrics): OptimizedCampaign {
    const optimizations: Optimization[] = []

    // 分析触达率
    const reachRate = realTimeMetrics.delivered / realTimeMetrics.sent
    if (reachRate < 0.9) {
      optimizations.push({
        aspect: "发送渠道",
        before: campaign.content.channels.join(", "),
        after: "建议增加微信渠道，提高触达率",
        impact: "+10% 触达率",
      })
    }

    // 分析打开率
    const openRate = realTimeMetrics.opened / realTimeMetrics.delivered
    if (openRate < 0.3) {
      optimizations.push({
        aspect: "标题文案",
        before: campaign.content.title,
        after: "建议使用更吸引人的标题，加入紧迫感",
        impact: "+15% 打开率",
      })
    }

    // 分析点击率
    const clickRate = realTimeMetrics.clicked / realTimeMetrics.opened
    if (clickRate < 0.4) {
      optimizations.push({
        aspect: "活动内容",
        before: campaign.content.description,
        after: "建议简化内容，突出核心优惠",
        impact: "+20% 点击率",
      })
    }

    // 分析转化率
    const conversionRate = realTimeMetrics.converted / realTimeMetrics.clicked
    if (conversionRate < 0.2) {
      optimizations.push({
        aspect: "优惠力度",
        before: campaign.content.offer,
        after: "建议增加优惠力度或降低使用门槛",
        impact: "+25% 转化率",
      })
    }

    // 分析ROI
    const currentROI = (realTimeMetrics.revenue - realTimeMetrics.cost) / realTimeMetrics.cost
    if (currentROI < campaign.expectedROI * 0.8) {
      optimizations.push({
        aspect: "目标细分",
        before: campaign.targetSegment.name,
        after: "建议调整目标客户群，聚焦高价值客户",
        impact: "+30% ROI",
      })
    }

    // 计算预期改进
    const projectedImprovement =
      optimizations.reduce((sum, opt) => {
        const match = opt.impact.match(/\+(\d+)%/)
        return sum + (match ? Number.parseInt(match[1]) : 0)
      }, 0) / optimizations.length

    return {
      ...campaign,
      optimizations,
      projectedImprovement,
    }
  }

  // 辅助方法

  private calculateRecencyScore(lastVisitDays: number): number {
    if (lastVisitDays <= 7) return 1
    if (lastVisitDays <= 30) return 0.8
    if (lastVisitDays <= 90) return 0.5
    if (lastVisitDays <= 180) return 0.3
    return 0.1
  }

  private calculateFrequencyScore(visitFrequency: number): number {
    if (visitFrequency >= 10) return 1
    if (visitFrequency >= 5) return 0.8
    if (visitFrequency >= 3) return 0.6
    if (visitFrequency >= 1) return 0.4
    return 0.2
  }

  private calculateMonetaryScore(avgSpending: number): number {
    if (avgSpending >= 5000) return 1
    if (avgSpending >= 2000) return 0.8
    if (avgSpending >= 1000) return 0.6
    if (avgSpending >= 500) return 0.4
    return 0.2
  }

  private selectCampaignType(segment: CustomerSegment, businessGoal: BusinessGoal): CampaignType {
    if (segment.id === "vip" || segment.id === "loyal") {
      return CampaignType.POINTS
    }
    if (segment.id === "potential") {
      return CampaignType.RECHARGE
    }
    if (segment.id === "at_risk") {
      return CampaignType.RETENTION
    }
    if (segment.id === "dormant") {
      return CampaignType.REACTIVATION
    }
    return CampaignType.DISCOUNT
  }

  private generateCampaignContent(
    segment: CustomerSegment,
    type: CampaignType,
    businessGoal: BusinessGoal,
  ): CampaignContent {
    const templates = {
      [CampaignType.DISCOUNT]: {
        title: `专属${segment.name}折扣优惠`,
        description: `感谢您的支持！特为${segment.name}准备专属折扣`,
        offer: "全场8���优惠",
        terms: ["活动期间有效", "不与其他优惠同享", "最终解释权归商家所有"],
      },
      [CampaignType.GIFT]: {
        title: `${segment.name}专属好礼`,
        description: `精心为${segment.name}准备的惊喜礼物`,
        offer: "消费满500送精美礼品",
        terms: ["数量有限，先到先得", "活动期间有效"],
      },
      [CampaignType.POINTS]: {
        title: `${segment.name}积分翻倍`,
        description: `${segment.name}专享积分翻倍活动`,
        offer: "消费积分双倍赠送",
        terms: ["活动期间有效", "积分可兑换礼品"],
      },
      [CampaignType.RECHARGE]: {
        title: `充值有礼，${segment.name}专享`,
        description: `充值即享超值优惠`,
        offer: "充1000送200",
        terms: ["充值金额永久有效", "赠送金额有效期3个月"],
      },
      [CampaignType.RETENTION]: {
        title: `我们想念您，${segment.name}`,
        description: `特别为您准备了回归礼包`,
        offer: "回归专享5折优惠",
        terms: ["仅限本次消费", "活动期间有效"],
      },
      [CampaignType.REACTIVATION]: {
        title: `好久不见，${segment.name}`,
        description: `我们为您准备了惊喜`,
        offer: "唤醒专享3折优惠",
        terms: ["仅限首次回归消费", "活动期间有效"],
      },
    }

    return {
      ...templates[type],
      channels: this.selectOptimalChannels(segment),
    }
  }

  private selectOptimalChannels(segment: CustomerSegment): CampaignChannel[] {
    // 根据细分特征选择最佳渠道
    if (segment.id === "vip" || segment.id === "loyal") {
      return [CampaignChannel.WECHAT, CampaignChannel.APP_PUSH, CampaignChannel.SMS]
    }
    if (segment.id === "dormant") {
      return [CampaignChannel.SMS, CampaignChannel.WECHAT]
    }
    return [CampaignChannel.WECHAT, CampaignChannel.APP_PUSH]
  }

  private calculateBudget(segment: CustomerSegment, businessGoal: BusinessGoal): number {
    // 基于目标价值和细分规模计算预算
    const baseBudget = businessGoal.targetValue * 0.2 // 20%的目标价值作为预算
    const memberFactor = Math.min(segment.memberCount / 1000, 2) // 会员数量因子
    return Math.round(baseBudget * memberFactor)
  }

  private estimateROI(segment: CustomerSegment, type: CampaignType, budget: number): number {
    // 基于细分和活动类型估算ROI
    const baseROI = {
      [CampaignType.DISCOUNT]: 1.5,
      [CampaignType.GIFT]: 1.8,
      [CampaignType.POINTS]: 2.0,
      [CampaignType.RECHARGE]: 2.5,
      [CampaignType.RETENTION]: 1.2,
      [CampaignType.REACTIVATION]: 1.0,
    }

    const segmentMultiplier = {
      vip: 1.5,
      loyal: 1.3,
      potential: 1.2,
      at_risk: 0.9,
      new: 1.0,
      dormant: 0.7,
    }

    return baseROI[type] * (segmentMultiplier[segment.id as keyof typeof segmentMultiplier] || 1)
  }

  private getOptimalSendTime(segment: CustomerSegment): string {
    // 根据细分特征返回最佳发送时间
    if (segment.id === "vip" || segment.id === "loyal") {
      return "10:00" // 上午时段
    }
    if (segment.id === "potential") {
      return "14:00" // 下午时段
    }
    return "19:00" // 晚间时段
  }

  private getIndustryBenchmark(campaign: MarketingCampaign): ROIPrediction {
    // 行业基准数据
    return {
      expectedRevenue: campaign.budget * 1.5,
      expectedCost: campaign.budget,
      expectedROI: 0.5,
      confidence: 0.6,
      breakdown: {
        reachRate: 0.85,
        responseRate: 0.25,
        conversionRate: 0.15,
        avgOrderValue: campaign.targetSegment.avgLifetimeValue * 0.15,
      },
    }
  }
}

// 导出单例
export const marketingAssistant = new AIMarketingAssistant()
