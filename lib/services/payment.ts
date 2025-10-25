// 支付服务

import { type Payment, PaymentType, PaymentStatus, type PaymentCallback } from "@/lib/types"

// 微信支付配置
const WECHAT_PAY_CONFIG = {
  appId: process.env.NEXT_PUBLIC_WECHAT_APP_ID || "wx_demo_app_id",
  mchId: process.env.WECHAT_MCH_ID || "mch_demo_id",
  apiKey: process.env.WECHAT_API_KEY || "demo_api_key",
}

// 支付宝支付配置
const ALIPAY_CONFIG = {
  appId: process.env.NEXT_PUBLIC_ALIPAY_APP_ID || "alipay_demo_app_id",
  privateKey: process.env.ALIPAY_PRIVATE_KEY || "demo_private_key",
  publicKey: process.env.ALIPAY_PUBLIC_KEY || "demo_public_key",
}

// 创建支付订单
export async function createPayment(orderId: string, amount: number, paymentType: PaymentType): Promise<Payment> {
  const payment: Payment = {
    id: `PAY${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    orderId,
    amount,
    paymentType,
    paymentStatus: PaymentStatus.PENDING,
    transactionId: `TXN${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // 根据支付类型生成支付参数
  if (paymentType === PaymentType.WECHAT) {
    payment.qrCode = await generateWechatQRCode(payment)
    payment.expireAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5分钟过期
  } else if (paymentType === PaymentType.ALIPAY) {
    payment.qrCode = await generateAlipayQRCode(payment)
    payment.expireAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
  }

  return payment
}

// 生成微信支付二维码
async function generateWechatQRCode(payment: Payment): Promise<string> {
  // 模拟生成微信支付二维码
  const qrData = {
    appId: WECHAT_PAY_CONFIG.appId,
    mchId: WECHAT_PAY_CONFIG.mchId,
    orderId: payment.orderId,
    amount: payment.amount,
    timestamp: Date.now(),
  }

  // 实际应用中应该调用微信支付API
  return `weixin://wxpay/bizpayurl?pr=${btoa(JSON.stringify(qrData))}`
}

// 生成支付宝支付二维码
async function generateAlipayQRCode(payment: Payment): Promise<string> {
  // 模拟生成支付宝支付二维码
  const qrData = {
    appId: ALIPAY_CONFIG.appId,
    orderId: payment.orderId,
    amount: payment.amount,
    timestamp: Date.now(),
  }

  // 实际应用中应该调用支付宝API
  return `alipays://platformapi/startapp?${new URLSearchParams(qrData as any).toString()}`
}

// 查询支付状态
export async function queryPaymentStatus(paymentId: string): Promise<PaymentStatus> {
  // 模拟查询支付状态
  // 实际应用中应该调用支付平台API查询
  return PaymentStatus.PENDING
}

// 处理支付回调
export async function handlePaymentCallback(callback: PaymentCallback): Promise<boolean> {
  try {
    // 验证回调签名
    if (!verifyCallbackSignature(callback)) {
      throw new Error("Invalid callback signature")
    }

    // 更新支付状态
    // 实际应用中应该更新数据库中的支付记录
    console.log("[v0] Payment callback processed:", callback)

    return true
  } catch (error) {
    console.error("[v0] Payment callback error:", error)
    return false
  }
}

// 验证回调签名
function verifyCallbackSignature(callback: PaymentCallback): boolean {
  // 模拟签名验证
  // 实际应用中应该使用真实的签名验证逻辑
  return true
}

// 申请退款
export async function refundPayment(paymentId: string, amount: number, reason: string): Promise<boolean> {
  try {
    // 模拟退款操作
    // 实际应用中应该调用支付平台退款API
    console.log("[v0] Refund requested:", { paymentId, amount, reason })

    return true
  } catch (error) {
    console.error("[v0] Refund error:", error)
    return false
  }
}
