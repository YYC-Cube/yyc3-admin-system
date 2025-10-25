// AI智能客服系统
export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  userId: string
  messages: Message[]
  context: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export class AIChatbot {
  private sessions = new Map<string, ChatSession>()
  private knowledgeBase: Map<string, string[]> = new Map()

  constructor() {
    this.initializeKnowledgeBase()
  }

  // 初始化知识库
  private initializeKnowledgeBase() {
    this.knowledgeBase.set("商品管理", [
      "如何添加新商品？",
      "如何设置商品价格？",
      "如何管理商品库存？",
      "如何设置商品套餐？",
    ])

    this.knowledgeBase.set("订单管理", [
      "如何查看订单列表？",
      "如何处理退款？",
      "如何导出订单数据？",
      "如何查看订单详情？",
    ])

    this.knowledgeBase.set("会员管理", [
      "如何添加新会员？",
      "如何给会员充值？",
      "如何查看会员消费记录？",
      "如何设置会员等级？",
    ])
  }

  // 创建会话
  createSession(userId: string): ChatSession {
    const session: ChatSession = {
      id: `session_${Date.now()}`,
      userId,
      messages: [],
      context: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.sessions.set(session.id, session)
    return session
  }

  // 发送消息
  async sendMessage(sessionId: string, content: string): Promise<Message> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error("会话不存在")
    }

    // 添加用户消息
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }
    session.messages.push(userMessage)

    // 生成AI回复
    const response = await this.generateResponse(content, session)

    const assistantMessage: Message = {
      id: `msg_${Date.now() + 1}`,
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }
    session.messages.push(assistantMessage)

    session.updatedAt = new Date()
    return assistantMessage
  }

  // 生成回复
  private async generateResponse(userMessage: string, session: ChatSession): Promise<string> {
    // 简单的关键词匹配（实际应用中应使用真实的AI模型）
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("商品") || lowerMessage.includes("产品")) {
      return this.getKnowledgeResponse("商品管理")
    }

    if (lowerMessage.includes("订单")) {
      return this.getKnowledgeResponse("订单管理")
    }

    if (lowerMessage.includes("会员")) {
      return this.getKnowledgeResponse("会员管理")
    }

    if (lowerMessage.includes("帮助") || lowerMessage.includes("功能")) {
      return (
        "我可以帮您解答以下问题：\n\n" +
        "1. 商品管理相关问题\n" +
        "2. 订单管理相关问题\n" +
        "3. 会员管理相关问题\n" +
        "4. 系统使用指南\n\n" +
        "请告诉我您需要了解哪方面的内容？"
      )
    }

    return (
      "抱歉，我没有理解您的问题。您可以尝试：\n\n" +
      "• 询问商品、订单或会员相关问题\n" +
      '• 输入"帮助"查看我能做什么\n' +
      "• 使用更具体的关键词描述您的问题"
    )
  }

  private getKnowledgeResponse(category: string): string {
    const questions = this.knowledgeBase.get(category) || []
    return (
      `关于${category}，我可以帮您解答以下问题：\n\n` +
      questions.map((q, i) => `${i + 1}. ${q}`).join("\n") +
      "\n\n请告诉我您具体想了解哪个问题？"
    )
  }

  // 获取会话历史
  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId)
  }

  // 清除会话
  clearSession(sessionId: string) {
    this.sessions.delete(sessionId)
  }
}

// 全局AI客服实例
export const aiChatbot = new AIChatbot()
