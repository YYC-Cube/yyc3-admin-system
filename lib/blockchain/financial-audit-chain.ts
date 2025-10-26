import { ethers } from "ethers"

// 财务交易类型定义
export interface FinancialTransaction {
  id: string
  type: TransactionType
  amount: number
  currency: string
  fromAccount: string
  toAccount: string
  orderId?: string
  description: string
  operator: string
  timestamp: number
  metadata?: Record<string, any>
}

export enum TransactionType {
  REVENUE = "revenue", // 营业收入
  REFUND = "refund", // 退款
  PURCHASE = "purchase", // 采购支出
  SALARY = "salary", // 工资支出
  RENT = "rent", // 租金支出
  UTILITY = "utility", // 水电费
  MEMBER_RECHARGE = "member_recharge", // 会员充值
  MEMBER_CONSUME = "member_consume", // 会员消费
  OTHER = "other", // 其他
}

export interface BlockchainRecord {
  transactionHash: string
  blockNumber: number
  timestamp: number
  dataHash: string
  confirmed: boolean
}

export interface AuditReport {
  startDate: Date
  endDate: Date
  totalTransactions: number
  totalRevenue: number
  totalExpense: number
  netProfit: number
  transactionsByType: Record<TransactionType, number>
  dailyBreakdown: DailyFinancial[]
  verificationStatus: "verified" | "unverified" | "tampered"
  generatedAt: Date
}

export interface DailyFinancial {
  date: string
  revenue: number
  expense: number
  netProfit: number
  transactionCount: number
}

export interface IntegrityCheck {
  recordId: string
  isValid: boolean
  onChainHash: string
  localHash: string
  blockNumber: number
  timestamp: number
  message: string
}

/**
 * 财务审计链系统
 * 实现关键财务数据的区块链存储和验证
 */
export class FinancialAuditChain {
  private provider: ethers.JsonRpcProvider
  private contract: ethers.Contract
  private signer: ethers.Wallet

  constructor(providerUrl: string, contractAddress: string, privateKey: string) {
    this.provider = new ethers.JsonRpcProvider(providerUrl)
    this.signer = new ethers.Wallet(privateKey, this.provider)

    // 智能合约ABI
    const abi = [
      "function recordTransaction(string memory transactionId, bytes32 dataHash, string memory transactionType, uint256 amount) public returns (bool)",
      "function getTransaction(string memory transactionId) public view returns (bytes32, string memory, uint256, uint256, address)",
      "function verifyTransaction(string memory transactionId, bytes32 dataHash) public view returns (bool)",
      "function getTransactionCount() public view returns (uint256)",
      "event TransactionRecorded(string indexed transactionId, bytes32 dataHash, string transactionType, uint256 amount, uint256 timestamp)",
    ]

    this.contract = new ethers.Contract(contractAddress, abi, this.signer)
  }

  /**
   * 记录财务交易到区块链
   */
  async recordTransaction(transaction: FinancialTransaction): Promise<BlockchainRecord> {
    try {
      // 计算交易数据哈希
      const dataHash = this.calculateHash(transaction)

      // 调用智能合约记录交易
      const tx = await this.contract.recordTransaction(
        transaction.id,
        dataHash,
        transaction.type,
        ethers.parseEther(transaction.amount.toString()),
      )

      // 等待交易确认
      const receipt = await tx.wait()

      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        timestamp: Date.now(),
        dataHash,
        confirmed: true,
      }
    } catch (error) {
      console.error("[v0] 记录交易失败:", error)
      throw new Error(`记录交易失败: ${error.message}`)
    }
  }

  /**
   * 生成审计报告
   */
  async generateAuditReport(startDate: Date, endDate: Date): Promise<AuditReport> {
    try {
      // 从数据库获取时间范围内的所有交易
      const transactions = await this.getTransactionsFromDB(startDate, endDate)

      // 统计数据
      let totalRevenue = 0
      let totalExpense = 0
      const transactionsByType: Record<TransactionType, number> = {} as any
      const dailyMap = new Map<string, DailyFinancial>()

      for (const tx of transactions) {
        // 按类型统计
        transactionsByType[tx.type] = (transactionsByType[tx.type] || 0) + 1

        // 收入支出统计
        if (this.isRevenue(tx.type)) {
          totalRevenue += tx.amount
        } else {
          totalExpense += tx.amount
        }

        // 按日统计
        const dateKey = new Date(tx.timestamp).toISOString().split("T")[0]
        if (!dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, {
            date: dateKey,
            revenue: 0,
            expense: 0,
            netProfit: 0,
            transactionCount: 0,
          })
        }

        const daily = dailyMap.get(dateKey)!
        daily.transactionCount++
        if (this.isRevenue(tx.type)) {
          daily.revenue += tx.amount
        } else {
          daily.expense += tx.amount
        }
        daily.netProfit = daily.revenue - daily.expense
      }

      // 验证数据完整性
      const verificationStatus = await this.verifyReportIntegrity(transactions)

      return {
        startDate,
        endDate,
        totalTransactions: transactions.length,
        totalRevenue,
        totalExpense,
        netProfit: totalRevenue - totalExpense,
        transactionsByType,
        dailyBreakdown: Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
        verificationStatus,
        generatedAt: new Date(),
      }
    } catch (error) {
      console.error("[v0] 生成审计报告失败:", error)
      throw new Error(`生成审计报告失败: ${error.message}`)
    }
  }

  /**
   * 验证数据完整性
   */
  async verifyDataIntegrity(recordId: string): Promise<IntegrityCheck> {
    try {
      // 从数据库获取交易记录
      const transaction = await this.getTransactionFromDB(recordId)
      if (!transaction) {
        return {
          recordId,
          isValid: false,
          onChainHash: "",
          localHash: "",
          blockNumber: 0,
          timestamp: 0,
          message: "交易记录不存在",
        }
      }

      // 计算本地数据哈希
      const localHash = this.calculateHash(transaction)

      // 从区块链获取记录
      const [onChainHash, txType, amount, timestamp, recorder] = await this.contract.getTransaction(recordId)

      // 验证哈希是否匹配
      const isValid = onChainHash === localHash

      return {
        recordId,
        isValid,
        onChainHash,
        localHash,
        blockNumber: 0, // 需要从receipt获取
        timestamp: Number(timestamp),
        message: isValid ? "数据完整，未被篡改" : "数据已被篡改！",
      }
    } catch (error) {
      console.error("[v0] 验证数据完整性失败:", error)
      throw new Error(`验证数据完整性失败: ${error.message}`)
    }
  }

  /**
   * 批量验证交易完整性
   */
  private async verifyReportIntegrity(
    transactions: FinancialTransaction[],
  ): Promise<"verified" | "unverified" | "tampered"> {
    try {
      let verifiedCount = 0
      let tamperedCount = 0

      for (const tx of transactions) {
        const check = await this.verifyDataIntegrity(tx.id)
        if (check.isValid) {
          verifiedCount++
        } else {
          tamperedCount++
        }
      }

      if (tamperedCount > 0) {
        return "tampered"
      } else if (verifiedCount === transactions.length) {
        return "verified"
      } else {
        return "unverified"
      }
    } catch (error) {
      console.error("[v0] 验证报告完整性失败:", error)
      return "unverified"
    }
  }

  /**
   * 计算交易数据哈希
   */
  private calculateHash(transaction: FinancialTransaction): string {
    const data = JSON.stringify({
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      fromAccount: transaction.fromAccount,
      toAccount: transaction.toAccount,
      timestamp: transaction.timestamp,
    })
    return ethers.keccak256(ethers.toUtf8Bytes(data))
  }

  /**
   * 判断是否为收入类型
   */
  private isRevenue(type: TransactionType): boolean {
    return [TransactionType.REVENUE, TransactionType.MEMBER_RECHARGE].includes(type)
  }

  /**
   * 从数据库获取交易记录（模拟）
   */
  private async getTransactionFromDB(id: string): Promise<FinancialTransaction | null> {
    // 实际应该从数据库查询
    // 这里返回模拟数据
    return null
  }

  /**
   * 从数据库获取时间范围内的交易（模拟）
   */
  private async getTransactionsFromDB(startDate: Date, endDate: Date): Promise<FinancialTransaction[]> {
    // 实际应该从数据库查询
    // 这里返回模拟数据
    return []
  }

  /**
   * 自动上链机制
   * 监听财务交易事件，自动记录到区块链
   */
  async startAutoRecording(): Promise<void> {
    console.log("[v0] 启动自动上链机制")

    // 监听数据库变更事件
    // 实际实现需要集成数据库触发器或消息队列

    // 示例：每分钟检查一次未上链的交易
    setInterval(async () => {
      try {
        const pendingTransactions = await this.getPendingTransactions()

        for (const tx of pendingTransactions) {
          await this.recordTransaction(tx)
          await this.markAsRecorded(tx.id)
          console.log(`[v0] 交易 ${tx.id} 已自动上链`)
        }
      } catch (error) {
        console.error("[v0] 自动上链失败:", error)
      }
    }, 60000) // 每分钟执行一次
  }

  /**
   * 获取待上链的交易
   */
  private async getPendingTransactions(): Promise<FinancialTransaction[]> {
    // 实际应该从数据库查询未上链的交易
    return []
  }

  /**
   * 标记交易为已上链
   */
  private async markAsRecorded(transactionId: string): Promise<void> {
    // 实际应该更新数据库记录
  }
}

let _financialAuditChainInstance: FinancialAuditChain | null = null

/**
 * 获取财务审计链单例实例
 * 使用懒加载模式，只在实际需要时创建实例
 */
export function getFinancialAuditChain(): FinancialAuditChain {
  if (!_financialAuditChainInstance) {
    const providerUrl = process.env.BLOCKCHAIN_PROVIDER_URL || "https://polygon-mumbai.g.alchemy.com/v2/demo"
    const contractAddress = process.env.FINANCIAL_AUDIT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000"
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY

    if (!privateKey || privateKey === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      throw new Error("BLOCKCHAIN_PRIVATE_KEY environment variable is not configured. Please set a valid private key.")
    }

    _financialAuditChainInstance = new FinancialAuditChain(providerUrl, contractAddress, privateKey)
  }

  return _financialAuditChainInstance
}

export const financialAuditChain = {
  getInstance: getFinancialAuditChain,
}
