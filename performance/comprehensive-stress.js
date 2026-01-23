/**
 * K6 综合压力测试
 * Phase 5.2 - 性能与压力测试
 *
 * 测试目标: 模拟真实生产环境的综合压力场景
 */

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Rate, Trend, Counter } from 'k6/metrics'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'

// 自定义指标
const overallSuccess = new Rate('overall_success_rate')
const criticalErrors = new Counter('critical_errors')
const businessTransactions = new Counter('business_transactions')
const systemLoad = new Trend('system_load')

// 测试配置 - 模拟黑色星期五等高负载场景
export const options = {
  scenarios: {
    // 商品浏览流量 (持续高并发)
    product_browsing: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 500 },
        { duration: '5m', target: 1000 },
        { duration: '2m', target: 500 },
        { duration: '1m', target: 0 },
      ],
      exec: 'browseProducts',
    },
    // 下单流量 (波动较大)
    order_creation: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 200,
      maxVUs: 500,
      stages: [
        { duration: '2m', target: 50 },
        { duration: '3m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '2m', target: 50 },
        { duration: '1m', target: 10 },
      ],
      exec: 'createOrder',
    },
    // 支付流量 (中等并发)
    payment_flow: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '10m',
      preAllocatedVUs: 200,
      maxVUs: 400,
      exec: 'processPayment',
    },
    // 后台管理操作 (低并发)
    admin_operations: {
      executor: 'constant-vus',
      vus: 20,
      duration: '10m',
      exec: 'adminOperations',
    },
    // 报表查询 (定时触发)
    report_generation: {
      executor: 'per-vu-iterations',
      vus: 10,
      iterations: 5,
      maxDuration: '10m',
      exec: 'generateReports',
    },
  },
  thresholds: {
    http_req_duration: ['p(99)<2000'],
    http_req_failed: ['rate<0.05'],
    overall_success_rate: ['rate>0.95'],
    critical_errors: ['count<50'],
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

// 场景1: 商品浏览
export function browseProducts() {
  const headers = getHeaders()

  group('商品浏览流程', function () {
    // 首页
    const homeRes = http.get(`${BASE_URL}/`, { headers })
    check(homeRes, { 'home page loaded': r => r.status === 200 }) || criticalErrors.add(1)

    sleep(1)

    // 商品列表
    const listRes = http.get(
      `${BASE_URL}/api/products?page=${Math.floor(Math.random() * 10) + 1}`,
      { headers }
    )
    check(listRes, { 'product list loaded': r => r.status === 200 }) || criticalErrors.add(1)

    sleep(2)

    // 商品详情
    const productId = `prod-${Math.floor(Math.random() * 100) + 1}`
    const detailRes = http.get(`${BASE_URL}/api/products/${productId}`, { headers })
    check(detailRes, { 'product detail loaded': r => r.status === 200 }) || criticalErrors.add(1)

    businessTransactions.add(1)
  })

  sleep(Math.random() * 3)
}

// 场景2: 创建订单
export function createOrder() {
  const headers = getHeaders()

  group('订单创建流程', function () {
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const amount = Math.floor(Math.random() * 50000) / 100

    const orderRes = http.post(
      `${BASE_URL}/api/orders`,
      JSON.stringify({
        orderId,
        items: [
          { productId: 'prod-001', quantity: Math.floor(Math.random() * 5) + 1, price: amount },
        ],
        totalAmount: amount,
        memberId: `mem-${Math.floor(Math.random() * 10000)}`,
      }),
      { headers }
    )

    const success = check(orderRes, {
      'order created': r => r.status === 200,
      'order has id': r => r.json('data.orderId') !== undefined,
    })

    overallSuccess.add(success ? 1 : 0)
    if (success) {
      businessTransactions.add(1)
    } else {
      criticalErrors.add(1)
    }
  })

  sleep(1)
}

// 场景3: 支付处理
export function processPayment() {
  const headers = getHeaders()

  group('支付处理流程', function () {
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const amount = Math.floor(Math.random() * 100000) / 100

    const paymentRes = http.post(
      `${BASE_URL}/api/payment`,
      JSON.stringify({
        orderId,
        paymentMethod: ['alipay', 'wechat', 'unionpay'][Math.floor(Math.random() * 3)],
        amount,
      }),
      {
        headers,
        timeout: '10s',
      }
    )

    const success = check(paymentRes, {
      'payment processed': r => r.status === 200,
      'payment completed': r => r.json('data.status') === 'success',
    })

    overallSuccess.add(success ? 1 : 0)
    if (success) {
      businessTransactions.add(1)
    } else {
      criticalErrors.add(1)
    }
  })

  sleep(2)
}

// 场景4: 后台管理操作
export function adminOperations() {
  const headers = getHeaders()

  group('后台管理操作', function () {
    // 查看统计数据
    const statsRes = http.get(`${BASE_URL}/api/dashboard/stats`, { headers })
    check(statsRes, { 'stats loaded': r => r.status === 200 })

    sleep(5)

    // 更新商品信息
    const updateRes = http.put(
      `${BASE_URL}/api/products/prod-001`,
      JSON.stringify({
        stock: Math.floor(Math.random() * 1000),
      }),
      { headers }
    )
    check(updateRes, { 'product updated': r => r.status === 200 })

    sleep(10)
  })
}

// 场景5: 报表生成
export function generateReports() {
  const headers = getHeaders()

  group('报表生成', function () {
    // 销售报表
    const salesRes = http.get(`${BASE_URL}/api/reports/sales?start=2025-01-01&end=2025-11-26`, {
      headers,
      timeout: '30s',
    })
    check(salesRes, { 'sales report generated': r => r.status === 200 })

    sleep(5)

    // 库存报表
    const inventoryRes = http.get(`${BASE_URL}/api/reports/inventory`, {
      headers,
      timeout: '30s',
    })
    check(inventoryRes, { 'inventory report generated': r => r.status === 200 })

    sleep(10)
  })
}

export function handleSummary(data) {
  const metrics = data.metrics

  console.log('\n综合压力测试结果')
  console.log('='.repeat(60))

  console.log('\n系统整体指标:')
  console.log(`  总请求数: ${metrics.http_reqs?.values?.count || 0}`)
  console.log(`  总业务交易: ${metrics.business_transactions?.values?.count || 0}`)
  console.log(
    `  整体成功率: ${((metrics.overall_success_rate?.values?.rate || 0) * 100).toFixed(2)}%`
  )
  console.log(`  HTTP错误率: ${((metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2)}%`)
  console.log(`  严重错误数: ${metrics.critical_errors?.values?.count || 0}`)

  console.log('\n性能指标:')
  console.log(`  平均响应时间: ${(metrics.http_req_duration?.values?.avg || 0).toFixed(2)}ms`)
  console.log(`  P95响应时间: ${(metrics.http_req_duration?.values?.['p(95)'] || 0).toFixed(2)}ms`)
  console.log(`  P99响应时间: ${(metrics.http_req_duration?.values?.['p(99)'] || 0).toFixed(2)}ms`)
  console.log(`  最大响应时间: ${(metrics.http_req_duration?.values?.max || 0).toFixed(2)}ms`)
  console.log(`  平均RPS: ${(metrics.http_reqs?.values?.rate || 0).toFixed(2)}`)

  console.log('\n各场景统计:')
  const scenarios = data.root_group?.groups || {}
  Object.keys(scenarios).forEach(scenarioName => {
    const scenario = scenarios[scenarioName]
    console.log(`  ${scenarioName}:`)
    console.log(`    - 请求数: ${scenario.checks?.passes || 0}`)
    console.log(`    - 平均响应: ${(scenario.metrics?.http_req_duration?.avg || 0).toFixed(2)}ms`)
  })

  console.log('\n系统负载评估:')
  const avgDuration = metrics.http_req_duration?.values?.avg || 0
  const p99Duration = metrics.http_req_duration?.values?.['p(99)'] || 0
  const errorRate = metrics.http_req_failed?.values?.rate || 0

  let loadLevel = '正常'
  if (p99Duration > 2000 || errorRate > 0.05) {
    loadLevel = '过载'
  } else if (p99Duration > 1000 || errorRate > 0.02) {
    loadLevel = '接近上限'
  }

  console.log(`  负载状态: ${loadLevel}`)
  console.log(`  系统健康度: ${((1 - errorRate) * 100).toFixed(2)}%\n`)

  return {
    'performance/results/comprehensive-stress-summary.json': JSON.stringify(data, null, 2),
    'performance/results/comprehensive-stress-report.html': htmlReport(data),
  }
}
