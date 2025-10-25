import { db } from "@/lib/db/mysql"
import type { Member } from "@/lib/types"

// 客户行为数据
export interface BehaviorData {
  memberId: string
  visitFrequency: number // 访问频率（次/月）
  avgSpending: number // 平均消费金额
  lastVisitDays: number // 距离上次访问天数
  totalSpending: number // 累计消费金额
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
  customerCount: number
  avgValue: number
  characteristics: string[]
}

export interface SegmentCriteria {
  minSpending?: number
  maxSpending?: number
  minVisits?: number
  maxVisits?: number
  memberTiers?: string[]
  churnRiskRange?: [number, number]
}

// 客户标签
export interface CustomerTags {
  behavioral: string[] // 行为标签: ['high_frequency', 'night_visitor']
  preference: string[] // 偏好标签: ['beer_lover', 'package_buyer']
  value: string[] // 价值标签: ['high_value', 'potential']
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
  COUPON = "coupon", // 优惠券
  GIFT = "gift", // 赠品活动
  POINTS = "points", // 积分活动
  UPGRADE = "upgrade", // 提档活动
  RETENTION = "retention", // 留存活动
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
  EMAIL = "email",
}

export interface CampaignSchedule {
  startDate: string
  endDate: string
  sendTime?: string
}

export enum CampaignStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  RUNNING = "running",
  COMPLETED = "completed",
  PAUSED = "paused",
}

// 提档评估
export interface UpgradeEvaluation {
  currentTier: string
  nextTier: string
  progress: number // 0-100
  requirements: Requirement[]
  eligible: boolean
  estimatedDays: number
}

export interface Requirement {
  type: string
  description: string
  current: number
  required: number
  met: boolean
}

// 提档结果
export interface UpgradeResult {
  success: boolean
  memberId: string
  fromTier: string
  toTier: string
  rewards: Reward[]
  message: string
}

export interface Reward {
  type: "points" | "coupon" | "gift" | "discount"
  value: number
  description: string
}

// 营销效果
export interface CampaignPerformance {
  campaignId: string
  sent: number
  delivered: number
  opened: number
  clicked: number
  converted: number
  revenue: number
  cost: number
  roi: number
  responseRate: number
  conversionRate: number
}

export class CustomerIntelligencePromotion {
  /**
   * 客户分层
   * 使用RFM模型和多维度分析进行客户分层
   */
  async segmentCustomers(customers: Member[]): Promise<CustomerSegment[]> {
    // 获取所有客户的行为数据
    const behaviorData = await this.getBehaviorData(customers.map((c) => c.id))
    const behaviorMap = new Map(behaviorData.map((b) => [b.memberId, b]))

    // 定义客户细分
    const segments: CustomerSegment[] = [
      {
        id: "vip",
        name: "VIP客户",
        description: "高价值、高频次、高忠诚度的核心客户",
        criteria: {
          minSpending: 10000,
          minVisits: 15,
          churnRiskRange: [0, 0.2],
        },
        customerCount: 0,
        avgValue: 20000,
        characteristics: ["高消费", "高频次", "高忠诚度", "低流失风险"],
      },
      {
        id: "loyal",
        name: "忠诚客户",
        description: "中高价值、高频次的稳定客户",
        criteria: {
          minSpending: 5000,
          minVisits: 10,
          churnRiskRange: [0, 0.3],
        },
        customerCount: 0,
        avgValue: 10000,
        characteristics: ["中高消费", "高频次", "稳定"],
      },
      {
        id: "potential",
        name: "潜力客户",
        description: "消费能力强但频次较低的客户",
        criteria: {
          minSpending: 3000,
          maxVisits: 8,
        },
        customerCount: 0,
        avgValue: 6000,
        characteristics: ["高消费", "低频次", "有增长潜力"],
      },
      {
        id: "regular",
        name: "普通客户",
        description: "中等消费、中等频次的常规客户",
        criteria: {
          minSpending: 1000,
          minVisits: 5,
        },
        customerCount: 0,
        avgValue: 3000,
        characteristics: ["中等消费", "中等频次", "稳定"],
      },
      {
        id: "at_risk",
        name: "流失风险客户",
        description: "曾经活跃但近期减少访问的客户",
        criteria: {
          churnRiskRange: [0.6, 1],
        },
        customerCount: 0,
        avgValue: 4000,
        characteristics: ["曾经活跃", "近期减少", "流失风险高"],
      },
      {
        id: "new",
        name: "新客户",
        description: "新注册或首次消费的客户",
        criteria: {
          maxVisits: 3,
        },
        customerCount: 0,
        avgValue: 1500,
        characteristics: ["新注册", "待培养", "潜力未知"],
      },
    ]

    // 将客户分配到各个细分
    for (const customer of customers) {
      const behavior = behaviorMap.get(customer.id)
      if (!behavior) continue

      // 根据行为数据分配细分
      if (behavior.totalSpending >= 10000 && behavior.visitFrequency >= 15 && behavior.churnRisk < 0.2) {
        segments[0].customerCount++
      } else if (behavior.totalSpending >= 5000 && behavior.visitFrequency >= 10 && behavior.churnRisk < 0.3) {
        segments[1].customerCount++
      } else if (behavior.totalSpending >= 3000 && behavior.visitFrequency < 8) {
        segments[2].customerCount++
      } else if (behavior.totalSpending >= 1000 && behavior.visitFrequency >= 5) {
        segments[3].customerCount++
      } else if (behavior.churnRisk >= 0.6) {
        segments[4].customerCount++
      } else if (behavior.visitFrequency <= 3) {
        segments[5].customerCount++
      }
    }

    return segments
  }

  /**
   * 客户标签
   * 基于行为数据生成多维度标签
   */
  async tagCustomers(customer: Member, behaviorData: BehaviorData): Promise<CustomerTags> {
    const tags: CustomerTags = {
      behavioral: [],
      preference: [],
      value: [],
    }

    // 行为标签
    if (behaviorData.visitFrequency >= 10) {
      tags.behavioral.push("high_frequency")
    } else if (behaviorData.visitFrequency <= 2) {
      tags.behavioral.push("low_frequency")
    }

    if (behaviorData.lastVisitDays > 90) {
      tags.behavioral.push("dormant")
    } else if (behaviorData.lastVisitDays <= 7) {
      tags.behavioral.push("active")
    }

    if (behaviorData.preferredTimeSlots.includes("night")) {
      tags.behavioral.push("night_visitor")
    }

    if (behaviorData.churnRisk > 0.7) {
      tags.behavioral.push("churn_risk")
    }

    // 偏好标签
    if (behaviorData.favoriteCategories.includes("beer")) {
      tags.preference.push("beer_lover")
    }
    if (behaviorData.favoriteCategories.includes("wine")) {
      tags.preference.push("wine_lover")
    }
    if (behaviorData.favoriteCategories.includes("package")) {
      tags.preference.push("package_buyer")
    }
    if (behaviorData.favoriteCategories.includes("snacks")) {
      tags.preference.push("snack_lover")
    }

    // 价值标签
    if (behaviorData.totalSpending >= 10000) {
      tags.value.push("high_value")
    } else if (behaviorData.totalSpending >= 5000) {
      tags.value.push("medium_value")
    } else {
      tags.value.push("low_value")
    }

    if (behaviorData.avgSpending > behaviorData.totalSpending / behaviorData.visitFrequency) {
      tags.value.push("potential")
    }

    if (behaviorData.responseRate > 0.5) {
      tags.value.push("responsive")
    }

    return tags
  }

  /**
   * 个性化营销
   * 基于客户细分生成个性化营销活动
   */
  generatePersonalizedCampaign(segment: CustomerSegment): MarketingCampaign {
    const campaignType = this.selectCampaignType(segment)
    const content = this.generateCampaignContent(segment, campaignType)
    const budget = this.calculateBudget(segment)
    const expectedROI = this.estimateROI(segment, campaignType)

    return {
      id: `campaign_${Date.now()}`,
      name: content.title,
      type: campaignType,
      targetSegment: segment,
      content,
      schedule: {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        sendTime: this.getOptimalSendTime(segment),
      },
      budget,
      expectedROI,
      status: CampaignStatus.DRAFT,
    }
  }

  /**
   * 提档评估
   * 评估客户是否符合提档条件
   */
  async evaluateUpgrade(customer: Member): Promise<UpgradeEvaluation> {
    // 获取客户行为数据
    const [behaviorData] = await this.getBehaviorData([customer.id])
    if (!behaviorData) {
      throw new Error("Customer behavior data not found")
    }

    // 定义提档规则
    const tierRules = {
      regular: {
        next: "vip",
        requirements: [
          { type: "spending", description: "累计消费", required: 5000 },
          { type: "visits", description: "访问次数", required: 10 },
          { type: "churn_risk", description: "流失风险", required: 0.3, inverse: true },
        ],
      },
      vip: {
        next: "loyal",
        requirements: [
          { type: "spending", description: "累计消费", required: 10000 },
          { type: "visits", description: "访问次数", required: 15 },
          { type: "churn_risk", description: "流失风险", required: 0.2, inverse: true },
        ],
      },
    }

    const currentTier = customer.level?.toString() || "regular"
    const rule = tierRules[currentTier as keyof typeof tierRules]

    if (!rule) {
      return {
        currentTier,
        nextTier: currentTier,
        progress: 100,
        requirements: [],
        eligible: false,
        estimatedDays: 0,
      }
    }

    // 评估每个要求
    const requirements: Requirement[] = rule.requirements.map((req) => {
      let current = 0
      let met = false

      if (req.type === "spending") {
        current = behaviorData.totalSpending
        met = current >= req.required
      } else if (req.type === "visits") {
        current = behaviorData.visitFrequency
        met = current >= req.required
      } else if (req.type === "churn_risk") {
        current = behaviorData.churnRisk
        met = req.inverse ? current <= req.required : current >= req.required
      }

      return {
        type: req.type,
        description: req.description,
        current,
        required: req.required,
        met,
      }
    })

    // 计算进度
    const metCount = requirements.filter((r) => r.met).length
    const progress = (metCount / requirements.length) * 100

    // 判断是否符合提档条件
    const eligible = requirements.every((r) => r.met)

    // 估算达成天数
    const estimatedDays = this.estimateDaysToUpgrade(behaviorData, requirements)

    return {
      currentTier,
      nextTier: rule.next,
      progress,
      requirements,
      eligible,
      estimatedDays,
    }
  }

  /**
   * 自动提档
   * 自动执行客户提档并发放奖励
   */
  async autoUpgrade(customer: Member, evaluation: UpgradeEvaluation): Promise<UpgradeResult> {
    if (!evaluation.eligible) {
      return {
        success: false,
        memberId: customer.id,
        fromTier: evaluation.currentTier,
        toTier: evaluation.nextTier,
        rewards: [],
        message: "不符合提档条件",
      }
    }

    try {
      // 更新客户等级
      await db.query("UPDATE members SET level = ?, updated_at = NOW() WHERE id = ?", [
        evaluation.nextTier,
        customer.id,
      ])

      // 生成奖励
      const rewards = this.generateUpgradeRewards(evaluation.nextTier)

      // 发放奖励
      for (const reward of rewards) {
        await this.grantReward(customer.id, reward)
      }

      // 记录提档历史
      await db.query(
        "INSERT INTO upgrade_history (member_id, from_tier, to_tier, rewards, created_at) VALUES (?, ?, ?, ?, NOW())",
        [customer.id, evaluation.currentTier, evaluation.nextTier, JSON.stringify(rewards)],
      )

      return {
        success: true,
        memberId: customer.id,
        fromTier: evaluation.currentTier,
        toTier: evaluation.nextTier,
        rewards,
        message: `恭喜您成功升级为${evaluation.nextTier}客户！`,
      }
    } catch (error) {
      console.error("[v0] Auto upgrade failed:", error)
      return {
        success: false,
        memberId: customer.id,
        fromTier: evaluation.currentTier,
        toTier: evaluation.nextTier,
        rewards: [],
        message: "提档失败，请稍后重试",
      }
    }
  }

  /**
   * 营销效果追踪
   * 追踪营销活动的效果并计算ROI
   */
  async trackCampaignPerformance(campaignId: string): Promise<CampaignPerformance> {
    const query = `
      SELECT 
        COUNT(*) as sent,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN status = 'opened' THEN 1 ELSE 0 END) as opened,
        SUM(CASE WHEN status = 'clicked' THEN 1 ELSE 0 END) as clicked,
        SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted,
        SUM(revenue) as revenue,
        MAX(cost) as cost
      FROM campaign_tracking
      WHERE campaign_id = ?
    `

    const [result] = await db.query(query, [campaignId])
    const data = result[0] || {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      cost: 0,
    }

    const roi = data.cost > 0 ? ((data.revenue - data.cost) / data.cost) * 100 : 0
    const responseRate = data.delivered > 0 ? (data.opened / data.delivered) * 100 : 0
    const conversionRate = data.clicked > 0 ? (data.converted / data.clicked) * 100 : 0

    return {
      campaignId,
      ...data,
      roi,
      responseRate,
      conversionRate,
    }
  }

  // 辅助方法

  private async getBehaviorData(memberIds: string[]): Promise<BehaviorData[]> {
    const query = `
      SELECT 
        member_id as memberId,
        visit_frequency as visitFrequency,
        avg_spending as avgSpending,
        DATEDIFF(NOW(), last_visit_date) as lastVisitDays,
        total_spending as totalSpending,
        favorite_categories as favoriteCategories,
        preferred_time_slots as preferredTimeSlots,
        response_rate as responseRate,
        churn_risk as churnRisk
      FROM member_behavior
      WHERE member_id IN (?)
    `

    const [results] = await db.query(query, [memberIds])

    return results.map((row: any) => ({
      ...row,
      favoriteCategories: JSON.parse(row.favoriteCategories || "[]"),
      preferredTimeSlots: JSON.parse(row.preferredTimeSlots || "[]"),
    }))
  }

  private selectCampaignType(segment: CustomerSegment): CampaignType {
    if (segment.id === "vip" || segment.id === "loyal") {
      return CampaignType.POINTS
    }
    if (segment.id === "potential") {
      return CampaignType.UPGRADE
    }
    if (segment.id === "at_risk") {
      return CampaignType.RETENTION
    }
    if (segment.id === "new") {
      return CampaignType.COUPON
    }
    return CampaignType.DISCOUNT
  }

  private generateCampaignContent(segment: CustomerSegment, type: CampaignType): CampaignContent {
    const templates = {
      [CampaignType.DISCOUNT]: {
        title: `${segment.name}专属折扣`,
        description: `感谢您的支持！特为${segment.name}准备专属折扣`,
        offer: "全场8折优惠",
        terms: ["活动期间有效", "不与其他优惠同享"],
      },
      [CampaignType.COUPON]: {
        title: `${segment.name}专属优惠券`,
        description: `精心为${segment.name}准备的优惠券礼包`,
        offer: "满200减50优惠券",
        terms: ["有效期30天", "单笔订单限用一张"],
      },
      [CampaignType.GIFT]: {
        title: `${segment.name}专属好礼`,
        description: `精心为${segment.name}准备的惊喜礼物`,
        offer: "消费满500送精美礼品",
        terms: ["数量有限，先到先得"],
      },
      [CampaignType.POINTS]: {
        title: `${segment.name}积分翻倍`,
        description: `${segment.name}专享积分翻倍活动`,
        offer: "消费积分双倍赠送",
        terms: ["活动期间有效", "积分可兑换礼品"],
      },
      [CampaignType.UPGRADE]: {
        title: `${segment.name}升级计划`,
        description: `距离升级只差一步，完成任务即可升级`,
        offer: "完成任务升级VIP，享受更多特权",
        terms: ["升级后永久有效", "享受专属服务"],
      },
      [CampaignType.RETENTION]: {
        title: `我们想念您，${segment.name}`,
        description: `特别为您准备了回归礼包`,
        offer: "回归专享5折优惠",
        terms: ["仅限本次消费", "活动期间有效"],
      },
    }

    return {
      ...templates[type],
      channels: this.selectOptimalChannels(segment),
    }
  }

  private selectOptimalChannels(segment: CustomerSegment): CampaignChannel[] {
    if (segment.id === "vip" || segment.id === "loyal") {
      return [CampaignChannel.WECHAT, CampaignChannel.APP_PUSH, CampaignChannel.SMS]
    }
    if (segment.id === "at_risk") {
      return [CampaignChannel.SMS, CampaignChannel.WECHAT]
    }
    return [CampaignChannel.WECHAT, CampaignChannel.APP_PUSH]
  }

  private calculateBudget(segment: CustomerSegment): number {
    const baseBudget = segment.avgValue * 0.1 // 10%的平均价值作为预算
    const memberFactor = Math.min(segment.customerCount / 100, 5)
    return Math.round(baseBudget * memberFactor)
  }

  private estimateROI(segment: CustomerSegment, type: CampaignType): number {
    const baseROI = {
      [CampaignType.DISCOUNT]: 1.5,
      [CampaignType.COUPON]: 2.0,
      [CampaignType.GIFT]: 1.8,
      [CampaignType.POINTS]: 2.2,
      [CampaignType.UPGRADE]: 2.5,
      [CampaignType.RETENTION]: 1.2,
    }

    const segmentMultiplier = {
      vip: 1.5,
      loyal: 1.3,
      potential: 1.4,
      regular: 1.0,
      at_risk: 0.9,
      new: 1.1,
    }

    return baseROI[type] * (segmentMultiplier[segment.id as keyof typeof segmentMultiplier] || 1)
  }

  private getOptimalSendTime(segment: CustomerSegment): string {
    if (segment.id === "vip" || segment.id === "loyal") {
      return "10:00"
    }
    if (segment.id === "potential") {
      return "14:00"
    }
    return "19:00"
  }

  private estimateDaysToUpgrade(behaviorData: BehaviorData, requirements: Requirement[]): number {
    const unmetRequirements = requirements.filter((r) => !r.met)
    if (unmetRequirements.length === 0) return 0

    // 基于当前行为数据估算达成天数
    const avgDaysPerVisit = 30 / behaviorData.visitFrequency
    const avgSpendingPerVisit = behaviorData.avgSpending

    let maxDays = 0
    for (const req of unmetRequirements) {
      if (req.type === "spending") {
        const remaining = req.required - req.current
        const visitsNeeded = Math.ceil(remaining / avgSpendingPerVisit)
        const days = visitsNeeded * avgDaysPerVisit
        maxDays = Math.max(maxDays, days)
      } else if (req.type === "visits") {
        const remaining = req.required - req.current
        const days = remaining * avgDaysPerVisit
        maxDays = Math.max(maxDays, days)
      }
    }

    return Math.ceil(maxDays)
  }

  private generateUpgradeRewards(tier: string): Reward[] {
    const rewardTemplates = {
      vip: [
        { type: "points" as const, value: 1000, description: "升级奖励积分" },
        { type: "coupon" as const, value: 100, description: "专属优惠券" },
        { type: "discount" as const, value: 10, description: "终身9折优惠" },
      ],
      loyal: [
        { type: "points" as const, value: 2000, description: "升级奖励积分" },
        { type: "coupon" as const, value: 200, description: "专属优惠券" },
        { type: "gift" as const, value: 1, description: "专属礼品" },
        { type: "discount" as const, value: 15, description: "终身85折优惠" },
      ],
    }

    return rewardTemplates[tier as keyof typeof rewardTemplates] || []
  }

  private async grantReward(memberId: string, reward: Reward): Promise<void> {
    if (reward.type === "points") {
      await db.query("UPDATE members SET points = points + ? WHERE id = ?", [reward.value, memberId])
    } else if (reward.type === "coupon") {
      await db.query(
        "INSERT INTO member_coupons (member_id, coupon_type, value, status, created_at) VALUES (?, 'upgrade', ?, 'active', NOW())",
        [memberId, reward.value],
      )
    }
    // 其他奖励类型的处理...
  }
}

export const customerIntelligencePromotion = new CustomerIntelligencePromotion()
