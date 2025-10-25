import { db } from "@/lib/db/mysql"
import type { Member } from "@/lib/types"

// 回访上下文
export interface FollowUpContext {
  reason: FollowUpReason
  lastVisitDays: number
  lastOrderAmount: number
  customerSegment: string
  preferredChannel: CommunicationChannel
}

export enum FollowUpReason {
  POST_VISIT = "post_visit", // 消费后回访
  INACTIVE = "inactive", // 长期未访问
  BIRTHDAY = "birthday", // 生日关怀
  COMPLAINT = "complaint", // 投诉跟进
  PROMOTION = "promotion", // 活动邀约
}

export enum CommunicationChannel {
  SMS = "sms",
  CALL = "call",
  WECHAT = "wechat",
  EMAIL = "email",
}

// 话术脚本
export interface Script {
  id: string
  type: ScriptType
  content: string
  variables: Record<string, string>
  tone: ScriptTone
  estimatedDuration: number // 秒
}

export enum ScriptType {
  GREETING = "greeting",
  FOLLOW_UP = "follow_up",
  INVITATION = "invitation",
  FEEDBACK = "feedback",
  CLOSING = "closing",
}

export enum ScriptTone {
  FORMAL = "formal",
  FRIENDLY = "friendly",
  ENTHUSIASTIC = "enthusiastic",
  APOLOGETIC = "apologetic",
}

// 短信模板
export interface SMSTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  category: SMSCategory
  signName: string
}

export enum SMSCategory {
  MARKETING = "marketing",
  NOTIFICATION = "notification",
  VERIFICATION = "verification",
  REMINDER = "reminder",
}

// 短信结果
export interface SMSResult {
  success: boolean
  messageId: string
  phoneNumber: string
  status: SMSStatus
  sentAt: string
  deliveredAt?: string
  errorMessage?: string
}

export enum SMSStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  FAILED = "failed",
}

// 呼叫结果
export interface CallResult {
  success: boolean
  callId: string
  phoneNumber: string
  status: CallStatus
  duration: number // 秒
  recordingUrl?: string
  startedAt: string
  endedAt?: string
  errorMessage?: string
}

export enum CallStatus {
  INITIATED = "initiated",
  RINGING = "ringing",
  ANSWERED = "answered",
  BUSY = "busy",
  NO_ANSWER = "no_answer",
  FAILED = "failed",
  COMPLETED = "completed",
}

// 客户反馈
export interface Feedback {
  customerId: string
  contactId: string
  type: FeedbackType
  rating?: number // 1-5
  content: string
  sentiment: SentimentScore
  tags: string[]
  followUpRequired: boolean
  createdAt: string
}

export enum FeedbackType {
  SATISFACTION = "satisfaction",
  COMPLAINT = "complaint",
  SUGGESTION = "suggestion",
  INQUIRY = "inquiry",
}

export interface SentimentScore {
  positive: number // 0-1
  negative: number // 0-1
  neutral: number // 0-1
}

// 邀约
export interface Invitation {
  id: string
  customerId: string
  eventId: string
  eventName: string
  eventDate: string
  content: string
  incentive?: string
  channel: CommunicationChannel
  status: InvitationStatus
  sentAt: string
  respondedAt?: string
  response?: InvitationResponse
}

export enum InvitationStatus {
  DRAFT = "draft",
  SENT = "sent",
  OPENED = "opened",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  EXPIRED = "expired",
}

export enum InvitationResponse {
  INTERESTED = "interested",
  MAYBE = "maybe",
  NOT_INTERESTED = "not_interested",
}

// 联系历史
export interface ContactHistory {
  id: string
  customerId: string
  channel: CommunicationChannel
  type: ContactType
  content: string
  status: string
  result?: string
  feedback?: Feedback
  createdAt: string
  createdBy: string
}

export enum ContactType {
  FOLLOW_UP = "follow_up",
  INVITATION = "invitation",
  REMINDER = "reminder",
  SURVEY = "survey",
}

export class OutreachAutomationEngine {
  /**
   * 生成回访话术
   * 基于客户信息和回访上下文生成个性化话术
   */
  async generateFollowUpScript(customer: Member, context: FollowUpContext): Promise<Script> {
    const variables = {
      customerName: customer.name,
      lastVisitDays: context.lastVisitDays.toString(),
      lastOrderAmount: context.lastOrderAmount.toString(),
      segment: context.customerSegment,
    }

    let content = ""
    let tone = ScriptTone.FRIENDLY

    switch (context.reason) {
      case FollowUpReason.POST_VISIT:
        content = `您好${variables.customerName}，感谢您${variables.lastVisitDays}天前光临我们店。我们想了解一下您对我们的服务是否满意？有什么建议或意见吗？`
        tone = ScriptTone.FRIENDLY
        break

      case FollowUpReason.INACTIVE:
        content = `${variables.customerName}您好，我们注意到您已经${variables.lastVisitDays}天没有来店了。我们很想念您！最近有很多新的优惠活动，您有时间来看看吗？`
        tone = ScriptTone.ENTHUSIASTIC
        break

      case FollowUpReason.BIRTHDAY:
        content = `${variables.customerName}您好，祝您生日快乐！我们为您准备了生日专属优惠，欢迎您来店庆祝！`
        tone = ScriptTone.ENTHUSIASTIC
        break

      case FollowUpReason.COMPLAINT:
        content = `${variables.customerName}您好，关于您上次反馈的问题，我们已经认真处理并改进。非常感谢您的宝贵意见，希望能再次为您服务。`
        tone = ScriptTone.APOLOGETIC
        break

      case FollowUpReason.PROMOTION:
        content = `${variables.customerName}您好，我们即将举办一场特别活动，作为我们的${variables.segment}，特别邀请您参加。活动期间有专属优惠哦！`
        tone = ScriptTone.ENTHUSIASTIC
        break
    }

    return {
      id: `script_${Date.now()}`,
      type: ScriptType.FOLLOW_UP,
      content,
      variables,
      tone,
      estimatedDuration: Math.ceil(content.length / 3), // 估算阅读时间
    }
  }

  /**
   * 发送短信
   * 通过短信网关发送短信
   */
  async sendSMS(phoneNumber: string, message: string, template?: SMSTemplate): Promise<SMSResult> {
    try {
      // 验证手机号
      if (!this.validatePhoneNumber(phoneNumber)) {
        throw new Error("Invalid phone number")
      }

      // 使用模板或直接发送
      const finalMessage = template ? this.renderTemplate(template, message) : message

      // 调用短信网关 API（这里使用模拟实现）
      const messageId = `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // 记录到数据库
      await db.query(
        `INSERT INTO sms_logs (message_id, phone_number, content, template_id, status, sent_at, created_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [messageId, phoneNumber, finalMessage, template?.id || null, SMSStatus.SENT],
      )

      // 模拟短信发送（实际应调用阿里云/腾讯云短信API）
      console.log(`[v0] Sending SMS to ${phoneNumber}: ${finalMessage}`)

      return {
        success: true,
        messageId,
        phoneNumber,
        status: SMSStatus.SENT,
        sentAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error("[v0] SMS sending failed:", error)
      return {
        success: false,
        messageId: "",
        phoneNumber,
        status: SMSStatus.FAILED,
        sentAt: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * 批量发送短信
   */
  async sendBatchSMS(phoneNumbers: string[], message: string, template?: SMSTemplate): Promise<SMSResult[]> {
    const results: SMSResult[] = []

    for (const phoneNumber of phoneNumbers) {
      const result = await this.sendSMS(phoneNumber, message, template)
      results.push(result)

      // 添加延迟避免频率限制
      await this.delay(100)
    }

    return results
  }

  /**
   * 发起呼叫
   * 通过语音网关发起呼叫
   */
  async makeCall(phoneNumber: string, script: Script): Promise<CallResult> {
    try {
      // 验证手机号
      if (!this.validatePhoneNumber(phoneNumber)) {
        throw new Error("Invalid phone number")
      }

      // 调用语音网关 API（这里使用模拟实现）
      const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // 记录到数据库
      await db.query(
        `INSERT INTO call_logs (call_id, phone_number, script_id, status, started_at, created_at)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [callId, phoneNumber, script.id, CallStatus.INITIATED],
      )

      // 模拟呼叫（实际应调用阿里云/腾讯云语音API）
      console.log(`[v0] Making call to ${phoneNumber} with script: ${script.content}`)

      return {
        success: true,
        callId,
        phoneNumber,
        status: CallStatus.INITIATED,
        duration: 0,
        startedAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error("[v0] Call initiation failed:", error)
      return {
        success: false,
        callId: "",
        phoneNumber,
        status: CallStatus.FAILED,
        duration: 0,
        startedAt: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * 记录反馈
   * 记录客户反馈并分析情感
   */
  async recordFeedback(customerId: string, contactId: string, feedbackData: Partial<Feedback>): Promise<void> {
    // 分析情感
    const sentiment = this.analyzeSentiment(feedbackData.content || "")

    // 提取标签
    const tags = this.extractTags(feedbackData.content || "")

    // 判断是否需要跟进
    const followUpRequired = sentiment.negative > 0.6 || feedbackData.type === FeedbackType.COMPLAINT

    const feedback: Feedback = {
      customerId,
      contactId,
      type: feedbackData.type || FeedbackType.SATISFACTION,
      rating: feedbackData.rating,
      content: feedbackData.content || "",
      sentiment,
      tags,
      followUpRequired,
      createdAt: new Date().toISOString(),
    }

    // 保存到数据库
    await db.query(
      `INSERT INTO customer_feedback (customer_id, contact_id, type, rating, content, sentiment, tags, follow_up_required, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        feedback.customerId,
        feedback.contactId,
        feedback.type,
        feedback.rating || null,
        feedback.content,
        JSON.stringify(feedback.sentiment),
        JSON.stringify(feedback.tags),
        feedback.followUpRequired,
      ],
    )

    // 如果需要跟进，创建跟进任务
    if (followUpRequired) {
      await this.createFollowUpTask(customerId, feedback)
    }
  }

  /**
   * 生成邀约
   * 为客户生成个性化活动邀约
   */
  async generateInvitation(customer: Member, event: any): Promise<Invitation> {
    // 获取客户偏好渠道
    const preferredChannel = await this.getPreferredChannel(customer.id)

    // 生成个性化邀约内容
    const content = this.generateInvitationContent(customer, event)

    // 生成激励措施
    const incentive = this.generateIncentive(customer, event)

    const invitation: Invitation = {
      id: `inv_${Date.now()}`,
      customerId: customer.id,
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      content,
      incentive,
      channel: preferredChannel,
      status: InvitationStatus.DRAFT,
      sentAt: new Date().toISOString(),
    }

    // 保存到数据库
    await db.query(
      `INSERT INTO invitations (id, customer_id, event_id, event_name, event_date, content, incentive, channel, status, sent_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        invitation.id,
        invitation.customerId,
        invitation.eventId,
        invitation.eventName,
        invitation.eventDate,
        invitation.content,
        invitation.incentive,
        invitation.channel,
        invitation.status,
      ],
    )

    return invitation
  }

  /**
   * 发送邀约
   */
  async sendInvitation(invitation: Invitation): Promise<boolean> {
    try {
      // 根据渠道发送邀约
      if (invitation.channel === CommunicationChannel.SMS) {
        const result = await this.sendSMS(await this.getCustomerPhone(invitation.customerId), invitation.content)
        if (!result.success) throw new Error("SMS sending failed")
      } else if (invitation.channel === CommunicationChannel.CALL) {
        const script: Script = {
          id: `script_${Date.now()}`,
          type: ScriptType.INVITATION,
          content: invitation.content,
          variables: {},
          tone: ScriptTone.ENTHUSIASTIC,
          estimatedDuration: 60,
        }
        const result = await this.makeCall(await this.getCustomerPhone(invitation.customerId), script)
        if (!result.success) throw new Error("Call initiation failed")
      }

      // 更新邀约状态
      await db.query("UPDATE invitations SET status = ?, sent_at = NOW() WHERE id = ?", [
        InvitationStatus.SENT,
        invitation.id,
      ])

      // 记录联系历史
      await this.recordContactHistory({
        customerId: invitation.customerId,
        channel: invitation.channel,
        type: ContactType.INVITATION,
        content: invitation.content,
        status: "sent",
      })

      return true
    } catch (error) {
      console.error("[v0] Invitation sending failed:", error)
      return false
    }
  }

  /**
   * 获取联系历史
   */
  async getContactHistory(customerId: string, limit = 20): Promise<ContactHistory[]> {
    const query = `
      SELECT id, customer_id as customerId, channel, type, content, status, result, created_at as createdAt, created_by as createdBy
      FROM contact_history
      WHERE customer_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `

    const [results] = await db.query(query, [customerId, limit])
    return results
  }

  /**
   * 获取待跟进客户
   */
  async getPendingFollowUps(): Promise<any[]> {
    const query = `
      SELECT 
        m.id,
        m.name,
        m.phone,
        m.level,
        DATEDIFF(NOW(), m.last_visit_date) as lastVisitDays,
        ft.reason,
        ft.priority,
        ft.due_date as dueDate
      FROM members m
      INNER JOIN follow_up_tasks ft ON m.id = ft.customer_id
      WHERE ft.status = 'pending'
        AND ft.due_date <= DATE_ADD(NOW(), INTERVAL 3 DAY)
      ORDER BY ft.priority DESC, ft.due_date ASC
      LIMIT 50
    `

    const [results] = await db.query(query)
    return results
  }

  // 辅助方法

  private validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phoneNumber)
  }

  private renderTemplate(template: SMSTemplate, data: string): string {
    let content = template.content
    // 简单的变量替换
    template.variables.forEach((variable) => {
      content = content.replace(`{${variable}}`, data)
    })
    return `【${template.signName}】${content}`
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private analyzeSentiment(content: string): SentimentScore {
    // 简单的情感分析（实际应使用NLP模型）
    const positiveWords = ["满意", "好", "不错", "喜欢", "推荐", "优秀"]
    const negativeWords = ["不满意", "差", "失望", "投诉", "问题", "糟糕"]

    let positive = 0
    let negative = 0

    positiveWords.forEach((word) => {
      if (content.includes(word)) positive++
    })

    negativeWords.forEach((word) => {
      if (content.includes(word)) negative++
    })

    const total = positive + negative || 1
    return {
      positive: positive / total,
      negative: negative / total,
      neutral: 1 - (positive + negative) / total,
    }
  }

  private extractTags(content: string): string[] {
    const tags: string[] = []

    // 简单的关键词提取
    const keywords = ["服务", "环境", "价格", "质量", "态度", "卫生", "音响", "设备"]

    keywords.forEach((keyword) => {
      if (content.includes(keyword)) {
        tags.push(keyword)
      }
    })

    return tags
  }

  private async createFollowUpTask(customerId: string, feedback: Feedback): Promise<void> {
    await db.query(
      `INSERT INTO follow_up_tasks (customer_id, reason, priority, due_date, status, created_at)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY), 'pending', NOW())`,
      [customerId, "feedback_follow_up", feedback.type === FeedbackType.COMPLAINT ? "high" : "medium"],
    )
  }

  private async getPreferredChannel(customerId: string): Promise<CommunicationChannel> {
    const query = `
      SELECT preferred_channel
      FROM member_preferences
      WHERE member_id = ?
    `

    const [results] = await db.query(query, [customerId])
    return results[0]?.preferred_channel || CommunicationChannel.SMS
  }

  private generateInvitationContent(customer: Member, event: any): string {
    return `尊敬的${customer.name}，我们诚挚邀请您参加${event.name}活动。活动时间：${event.date}。期待您的光临！`
  }

  private generateIncentive(customer: Member, event: any): string {
    // 根据客户等级生成不同的激励
    if (customer.level === "vip") {
      return "VIP专属：活动期间享受8折优惠+赠送精美礼品"
    } else if (customer.level === "loyal") {
      return "忠诚客户专享：活动期间享受9折优惠"
    }
    return "活动期间享受特别优惠"
  }

  private async getCustomerPhone(customerId: string): Promise<string> {
    const query = "SELECT phone FROM members WHERE id = ?"
    const [results] = await db.query(query, [customerId])
    return results[0]?.phone || ""
  }

  private async recordContactHistory(data: Partial<ContactHistory>): Promise<void> {
    await db.query(
      `INSERT INTO contact_history (customer_id, channel, type, content, status, created_at, created_by)
       VALUES (?, ?, ?, ?, ?, NOW(), 'system')`,
      [data.customerId, data.channel, data.type, data.content, data.status],
    )
  }
}

export const outreachAutomationEngine = new OutreachAutomationEngine()
