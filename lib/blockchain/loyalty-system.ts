import { ethers } from "ethers"

// 区块链积分系统接口
export interface BlockchainLoyaltySystem {
  issuePoints(memberId: string, points: number, reason: string): Promise<Transaction>
  transferPoints(fromMember: string, toMember: string, points: number): Promise<Transaction>
  redeemPoints(memberId: string, points: number, reward: Reward): Promise<Transaction>
  getPointsHistory(memberId: string): Promise<Transaction[]>
  verifyTransaction(transactionId: string): Promise<VerificationResult>
}

// 交易记录
export interface Transaction {
  id: string
  type: "issue" | "transfer" | "redeem"
  from: string
  to: string
  amount: number
  reason: string
  timestamp: number
  blockNumber: number
  transactionHash: string
  status: "pending" | "confirmed" | "failed"
  gasUsed?: number
  gasFee?: number
}

// 奖励信息
export interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
  type: "product" | "discount" | "service"
}

// 验证结果
export interface VerificationResult {
  valid: boolean
  transaction: Transaction
  confirmations: number
  blockTimestamp: number
  message: string
}

// 会员积分余额
export interface MemberBalance {
  memberId: string
  balance: number
  lockedBalance: number
  totalEarned: number
  totalSpent: number
  lastUpdated: number
}

/**
 * 区块链积分系统实现
 * 支持Ethereum、Polygon等EVM兼容链
 */
export class LoyaltyBlockchainSystem implements BlockchainLoyaltySystem {
  private provider: ethers.Provider
  private contract: ethers.Contract
  private signer: ethers.Signer

  // 智能合约ABI
  private readonly contractABI = [
    "function issuePoints(address member, uint256 points, string reason) public returns (bytes32)",
    "function transferPoints(address from, address to, uint256 points) public returns (bytes32)",
    "function redeemPoints(address member, uint256 points, string rewardId) public returns (bytes32)",
    "function balanceOf(address member) public view returns (uint256)",
    "function getTransactionHistory(address member) public view returns (tuple(bytes32 id, uint8 txType, address from, address to, uint256 amount, string reason, uint256 timestamp)[])",
    "function verifyTransaction(bytes32 txId) public view returns (bool, uint256, uint256)",
    "event PointsIssued(address indexed member, uint256 points, string reason, bytes32 txId)",
    "event PointsTransferred(address indexed from, address indexed to, uint256 points, bytes32 txId)",
    "event PointsRedeemed(address indexed member, uint256 points, string rewardId, bytes32 txId)",
  ]

  constructor(providerUrl: string, contractAddress: string, privateKey: string) {
    // 初始化provider
    this.provider = new ethers.JsonRpcProvider(providerUrl)

    // 初始化signer
    this.signer = new ethers.Wallet(privateKey, this.provider)

    // 初始化合约实例
    this.contract = new ethers.Contract(contractAddress, this.contractABI, this.signer)
  }

  /**
   * 发放积分
   */
  async issuePoints(memberId: string, points: number, reason: string): Promise<Transaction> {
    try {
      // 将memberId转换为以太坊地址
      const memberAddress = this.memberIdToAddress(memberId)

      // 调用智能合约
      const tx = await this.contract.issuePoints(memberAddress, ethers.parseUnits(points.toString(), 0), reason)

      // 等待交易确认
      const receipt = await tx.wait()

      // 构建交易记录
      const transaction: Transaction = {
        id: receipt.hash,
        type: "issue",
        from: "system",
        to: memberId,
        amount: points,
        reason,
        timestamp: Date.now(),
        blockNumber: receipt.blockNumber,
        transactionHash: receipt.hash,
        status: "confirmed",
        gasUsed: Number(receipt.gasUsed),
        gasFee: Number(receipt.gasPrice) * Number(receipt.gasUsed),
      }

      // 记录到本地数据库
      await this.saveTransactionToDatabase(transaction)

      return transaction
    } catch (error) {
      console.error("[Blockchain] Issue points failed:", error)
      throw new Error(`积分发放失败: ${error.message}`)
    }
  }

  /**
   * 积分转账
   */
  async transferPoints(fromMember: string, toMember: string, points: number): Promise<Transaction> {
    try {
      const fromAddress = this.memberIdToAddress(fromMember)
      const toAddress = this.memberIdToAddress(toMember)

      // 检查余额
      const balance = await this.getBalance(fromMember)
      if (balance < points) {
        throw new Error("积分余额不足")
      }

      // 调用智能合约
      const tx = await this.contract.transferPoints(fromAddress, toAddress, ethers.parseUnits(points.toString(), 0))

      const receipt = await tx.wait()

      const transaction: Transaction = {
        id: receipt.hash,
        type: "transfer",
        from: fromMember,
        to: toMember,
        amount: points,
        reason: "积分转账",
        timestamp: Date.now(),
        blockNumber: receipt.blockNumber,
        transactionHash: receipt.hash,
        status: "confirmed",
        gasUsed: Number(receipt.gasUsed),
        gasFee: Number(receipt.gasPrice) * Number(receipt.gasUsed),
      }

      await this.saveTransactionToDatabase(transaction)

      return transaction
    } catch (error) {
      console.error("[Blockchain] Transfer points failed:", error)
      throw new Error(`积分转账失败: ${error.message}`)
    }
  }

  /**
   * 积分兑换
   */
  async redeemPoints(memberId: string, points: number, reward: Reward): Promise<Transaction> {
    try {
      const memberAddress = this.memberIdToAddress(memberId)

      // 检查余额
      const balance = await this.getBalance(memberId)
      if (balance < points) {
        throw new Error("积分余额不足")
      }

      // 验证兑换金额
      if (points !== reward.pointsCost) {
        throw new Error("兑换积分数量不匹配")
      }

      // 调用智能合约
      const tx = await this.contract.redeemPoints(memberAddress, ethers.parseUnits(points.toString(), 0), reward.id)

      const receipt = await tx.wait()

      const transaction: Transaction = {
        id: receipt.hash,
        type: "redeem",
        from: memberId,
        to: "system",
        amount: points,
        reason: `兑换: ${reward.name}`,
        timestamp: Date.now(),
        blockNumber: receipt.blockNumber,
        transactionHash: receipt.hash,
        status: "confirmed",
        gasUsed: Number(receipt.gasUsed),
        gasFee: Number(receipt.gasPrice) * Number(receipt.gasUsed),
      }

      await this.saveTransactionToDatabase(transaction)

      return transaction
    } catch (error) {
      console.error("[Blockchain] Redeem points failed:", error)
      throw new Error(`积分兑换失败: ${error.message}`)
    }
  }

  /**
   * 查询积分历史
   */
  async getPointsHistory(memberId: string): Promise<Transaction[]> {
    try {
      const memberAddress = this.memberIdToAddress(memberId)

      // 从智能合约查询
      const history = await this.contract.getTransactionHistory(memberAddress)

      // 转换为Transaction格式
      const transactions: Transaction[] = history.map((item: any) => ({
        id: item.id,
        type: this.mapTransactionType(item.txType),
        from: item.from === ethers.ZeroAddress ? "system" : this.addressToMemberId(item.from),
        to: item.to === ethers.ZeroAddress ? "system" : this.addressToMemberId(item.to),
        amount: Number(item.amount),
        reason: item.reason,
        timestamp: Number(item.timestamp) * 1000,
        blockNumber: 0, // 需要从receipt获取
        transactionHash: item.id,
        status: "confirmed",
      }))

      return transactions
    } catch (error) {
      console.error("[Blockchain] Get points history failed:", error)
      // 降级到本地数据库查询
      return this.getTransactionHistoryFromDatabase(memberId)
    }
  }

  /**
   * 验证交易
   */
  async verifyTransaction(transactionId: string): Promise<VerificationResult> {
    try {
      // 从区块链查询交易
      const tx = await this.provider.getTransaction(transactionId)

      if (!tx) {
        return {
          valid: false,
          transaction: null as any,
          confirmations: 0,
          blockTimestamp: 0,
          message: "交易不存在",
        }
      }

      // 获取交易收据
      const receipt = await this.provider.getTransactionReceipt(transactionId)

      if (!receipt) {
        return {
          valid: false,
          transaction: null as any,
          confirmations: 0,
          blockTimestamp: 0,
          message: "交易未确认",
        }
      }

      // 获取区块信息
      const block = await this.provider.getBlock(receipt.blockNumber)

      // 计算确认数
      const currentBlock = await this.provider.getBlockNumber()
      const confirmations = currentBlock - receipt.blockNumber + 1

      // 从本地数据库获取交易详情
      const transaction = await this.getTransactionFromDatabase(transactionId)

      return {
        valid: receipt.status === 1,
        transaction,
        confirmations,
        blockTimestamp: block?.timestamp || 0,
        message: receipt.status === 1 ? "交易有效" : "交易失败",
      }
    } catch (error) {
      console.error("[Blockchain] Verify transaction failed:", error)
      return {
        valid: false,
        transaction: null as any,
        confirmations: 0,
        blockTimestamp: 0,
        message: `验证失败: ${error.message}`,
      }
    }
  }

  /**
   * 查询积分余额
   */
  async getBalance(memberId: string): Promise<number> {
    try {
      const memberAddress = this.memberIdToAddress(memberId)
      const balance = await this.contract.balanceOf(memberAddress)
      return Number(balance)
    } catch (error) {
      console.error("[Blockchain] Get balance failed:", error)
      return 0
    }
  }

  /**
   * 获取会员完整余额信息
   */
  async getMemberBalance(memberId: string): Promise<MemberBalance> {
    const balance = await this.getBalance(memberId)
    const history = await this.getPointsHistory(memberId)

    const totalEarned = history
      .filter((tx) => tx.type === "issue" && tx.to === memberId)
      .reduce((sum, tx) => sum + tx.amount, 0)

    const totalSpent = history
      .filter((tx) => (tx.type === "redeem" || tx.type === "transfer") && tx.from === memberId)
      .reduce((sum, tx) => sum + tx.amount, 0)

    return {
      memberId,
      balance,
      lockedBalance: 0, // 可以从合约查询锁定余额
      totalEarned,
      totalSpent,
      lastUpdated: Date.now(),
    }
  }

  // 辅助方法
  private memberIdToAddress(memberId: string): string {
    // 简单实现：使用memberId的哈希作为地址
    // 生产环境应该维护memberId到address的映射表
    return ethers.keccak256(ethers.toUtf8Bytes(memberId)).slice(0, 42)
  }

  private addressToMemberId(address: string): string {
    // 从映射表查询
    // 这里简化处理，返回地址的短格式
    return address.slice(0, 10)
  }

  private mapTransactionType(txType: number): "issue" | "transfer" | "redeem" {
    switch (txType) {
      case 0:
        return "issue"
      case 1:
        return "transfer"
      case 2:
        return "redeem"
      default:
        return "issue"
    }
  }

  private async saveTransactionToDatabase(transaction: Transaction): Promise<void> {
    // 保存到本地数据库，用于快速查询
    // 实际实现应该调用数据库API
    console.log("[Blockchain] Save transaction to database:", transaction.id)
  }

  private async getTransactionFromDatabase(transactionId: string): Promise<Transaction> {
    // 从本地数据库查询
    // 这里返回模拟数据
    return {
      id: transactionId,
      type: "issue",
      from: "system",
      to: "member001",
      amount: 100,
      reason: "消费赠送",
      timestamp: Date.now(),
      blockNumber: 12345,
      transactionHash: transactionId,
      status: "confirmed",
    }
  }

  private async getTransactionHistoryFromDatabase(memberId: string): Promise<Transaction[]> {
    // 从本地数据库查询
    // 这里返回模拟数据
    return []
  }
}

let _loyaltyBlockchainInstance: LoyaltyBlockchainSystem | null = null

/**
 * 创建区块链积分系统实例
 * 使用懒加载模式，只在实际需要时创建实例
 */
export function createLoyaltyBlockchainSystem(): BlockchainLoyaltySystem {
  if (!_loyaltyBlockchainInstance) {
    const providerUrl = process.env.BLOCKCHAIN_PROVIDER_URL || "https://polygon-mumbai.g.alchemy.com/v2/your-api-key"
    const contractAddress = process.env.LOYALTY_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000"
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY

    if (!privateKey || privateKey === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      throw new Error("BLOCKCHAIN_PRIVATE_KEY environment variable is not configured. Please set a valid private key.")
    }

    _loyaltyBlockchainInstance = new LoyaltyBlockchainSystem(providerUrl, contractAddress, privateKey)
  }

  return _loyaltyBlockchainInstance
}

export const loyaltyBlockchain = {
  getInstance: createLoyaltyBlockchainSystem,
}
