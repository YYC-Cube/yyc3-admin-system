/**
 * K6 支付网关压力测试
 * Phase 5.2 - 性能与压力测试
 *
 * 测试目标: 验证支付系统在高并发下的稳定性
 */

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Rate, Trend, Counter } from 'k6/metrics'

// 自定义指标
const paymentSuccess = new Rate('payment_success')
const paymentFailure = new Rate('payment_failure')
const paymentDuration = new Trend('payment_duration')
const timeoutRate = new Rate('payment_timeout')
const duplicatePayments = new Counter('duplicate_payments')

// 测试配置 - 模拟支付高峰
export const options = {
  scenarios: {
    // 场景1: 正常支付流量
    normal_payment_flow: {
      executor: 'constant-arrival-rate',
      rate: 50, // 每秒50笔支付
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 50,
      maxVUs: 100,
      exec: 'normalPayment',
    },
    // 场景2: 支付高峰期 (如促销活动)
    peak_payment_flow: {
      executor: 'ramping-arrival-rate',
      startRate: 50,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 300,
      stages: [
        { duration: '1m', target: 200 }, // 增长到200笔/秒
        { duration: '2m', target: 500 }, // 峰值500笔/秒
        { duration: '1m', target: 200 }, // 降回200笔/秒
        { duration: '1m', target: 50 }, // 恢复正常
      ],
      startTime: '3m',
      exec: 'peakPayment',
    },
    // 场景3: 重复支付检测
    duplicate_payment_test: {
      executor: 'per-vu-iterations',
      vus: 20,
      iterations: 5,
      maxDuration: '1m',
      startTime: '8m',
      exec: 'duplicatePaymentTest',
    },
  },
  thresholds: {
    payment_success: ['rate>0.98'], // 支付成功率 > 98%
    payment_duration: ['p(95)<3000'], // 95%支付在3秒内完成
    payment_timeout: ['rate<0.01'], // 超时率 < 1%
    duplicate_payments: ['count==0'], // 无重复支付
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'
const token = __ENV.API_TOKEN || ''

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// 生成唯一订单ID
function generateOrderId() {
  return `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 场景1: 正常支付流程
export function normalPayment() {
  const headers = getHeaders()
  const orderId = generateOrderId()
  const amount = Math.floor(Math.random() * 50000) / 100 // 0.01 - 500.00

  group('创建订单', function () {
    const orderRes = http.post(
      `${BASE_URL}/api/orders`,
      JSON.stringify({
        orderId,
        items: [{ productId: 'prod-001', quantity: 1, price: amount }],
        totalAmount: amount,
      }),
      { headers }
    )

    check(orderRes, {
      'order created': r => r.status === 200,
    })
  })

  sleep(0.5)

  // 随机选择支付方式
  const paymentMethods = ['alipay', 'wechat', 'unionpay']
  const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]

  group('执行支付', function () {
    const start = Date.now()

    const paymentRes = http.post(
      `${BASE_URL}/api/payment`,
      JSON.stringify({
        orderId,
        paymentMethod,
        amount,
      }),
      {
        headers,
        timeout: '5s',
      }
    )

    const duration = Date.now() - start
    paymentDuration.add(duration)

    const isSuccess = check(paymentRes, {
      'payment status 200': r => r.status === 200,
      'payment completed': r => r.json('data.status') === 'success',
      'payment within 3s': () => duration < 3000,
    })

    if (isSuccess) {
      paymentSuccess.add(1)
      paymentFailure.add(0)
    } else {
      paymentSuccess.add(0)
      paymentFailure.add(1)

      if (duration >= 5000) {
        timeoutRate.add(1)
      }
    }
  })

  sleep(1)
}

// 场景2: 高峰期支付
export function peakPayment() {
  const headers = getHeaders()
  const orderId = generateOrderId()
  const amount = Math.floor(Math.random() * 100000) / 100

  const start = Date.now()

  // 直接支付(跳过订单创建以模拟更高并发)
  const paymentRes = http.post(
    `${BASE_URL}/api/payment/quick`,
    JSON.stringify({
      orderId,
      paymentMethod: 'alipay',
      amount,
    }),
    {
      headers,
      timeout: '10s',
    }
  )

  const duration = Date.now() - start
  paymentDuration.add(duration)

  const isSuccess = check(paymentRes, {
    'quick payment success': r => r.status === 200,
    'quick payment fast': () => duration < 5000,
  })

  if (isSuccess) {
    paymentSuccess.add(1)
  } else {
    paymentFailure.add(1)
    if (duration >= 10000) {
      timeoutRate.add(1)
    }
  }
}

// 场景3: 重复支付检测
export function duplicatePaymentTest() {
  const headers = getHeaders()
  const orderId = `ord-duplicate-${__VU}`
  const amount = 100.0

  // 连续发起5次相同订单的支付请求
  for (let i = 0; i < 5; i++) {
    const paymentRes = http.post(
      `${BASE_URL}/api/payment`,
      JSON.stringify({
        orderId,
        paymentMethod: 'alipay',
        amount,
        requestId: `req-${orderId}-${i}`,
      }),
      { headers }
    )

    const isDuplicate = check(paymentRes, {
      'first payment success': r => (i === 0 ? r.status === 200 : true),
      'duplicate rejected': r =>
        i > 0 ? r.status === 400 || r.json('error')?.includes('duplicate') : true,
    })

    if (i > 0 && paymentRes.status === 200) {
      // 重复支付未被拦截
      duplicatePayments.add(1)
    }

    sleep(0.1)
  }
}

export function handleSummary(data) {
  const metrics = data.metrics

  console.log('\n支付网关压力测试结果')
  console.log('='.repeat(60))

  console.log('\n支付成功率:')
  console.log(`  总支付请求: ${metrics.http_reqs?.values?.count || 0}`)
  console.log(`  成功率: ${((metrics.payment_success?.values?.rate || 0) * 100).toFixed(2)}%`)
  console.log(`  失败率: ${((metrics.payment_failure?.values?.rate || 0) * 100).toFixed(2)}%`)
  console.log(`  超时率: ${((metrics.payment_timeout?.values?.rate || 0) * 100).toFixed(2)}%`)

  console.log('\n支付性能:')
  console.log(`  平均支付时长: ${(metrics.payment_duration?.values?.avg || 0).toFixed(2)}ms`)
  console.log(`  P50: ${(metrics.payment_duration?.values?.['p(50)'] || 0).toFixed(2)}ms`)
  console.log(`  P95: ${(metrics.payment_duration?.values?.['p(95)'] || 0).toFixed(2)}ms`)
  console.log(`  P99: ${(metrics.payment_duration?.values?.['p(99)'] || 0).toFixed(2)}ms`)
  console.log(`  最大时长: ${(metrics.payment_duration?.values?.max || 0).toFixed(2)}ms`)

  console.log('\n并发能力:')
  const peakRPS = metrics.http_reqs?.values?.rate || 0
  console.log(`  峰值RPS: ${peakRPS.toFixed(2)}`)
  console.log(`  预估日处理能力: ${Math.floor(peakRPS * 60 * 60 * 24)}笔`)

  console.log('\n安全性:')
  console.log(
    `  重复支付检测: ${metrics.duplicate_payments?.values?.count === 0 ? '✅ 通过' : '❌ 失败'}`
  )
  console.log(`  重复支付次数: ${metrics.duplicate_payments?.values?.count || 0}\n`)

  return {
    'performance/results/payment-stress-summary.json': JSON.stringify(data, null, 2),
  }
}
