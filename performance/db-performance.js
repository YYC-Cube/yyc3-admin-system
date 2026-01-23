/**
 * K6 数据库查询性能测试
 * Phase 5.2 - 性能与压力测试
 *
 * 测试目标: 验证数据库查询性能和连接池管理
 */

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// 自定义指标
const dbQueryTime = new Trend('db_query_time')
const slowQueryRate = new Rate('slow_queries')
const dbErrorRate = new Rate('db_errors')

// 测试配置 - 模拟高并发数据库查询
export const options = {
  scenarios: {
    // 场景1: 简单查询 (高并发)
    simple_queries: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 50 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
      exec: 'simpleQueries',
    },
    // 场景2: 复杂查询 (中等并发)
    complex_queries: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
      exec: 'complexQueries',
      startTime: '30s', // 30秒后开始
    },
    // 场景3: 批量插入 (低并发)
    batch_inserts: {
      executor: 'constant-vus',
      vus: 10,
      duration: '1m',
      exec: 'batchInserts',
      startTime: '1m', // 1分钟后开始
    },
  },
  thresholds: {
    db_query_time: ['p(95)<100', 'p(99)<200'],
    slow_queries: ['rate<0.05'],
    db_errors: ['rate<0.01'],
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

// 场景1: 简单查询测试
export function simpleQueries() {
  const headers = getHeaders()

  // 查询单个商品
  const start1 = Date.now()
  const res1 = http.get(`${BASE_URL}/api/products/prod-001`, { headers })
  const duration1 = Date.now() - start1

  check(res1, {
    'product query status 200': r => r.status === 200,
    'product query < 50ms': () => duration1 < 50,
  }) || dbErrorRate.add(1)

  dbQueryTime.add(duration1)
  slowQueryRate.add(duration1 > 100 ? 1 : 0)

  sleep(0.5)

  // 查询会员信息
  const start2 = Date.now()
  const res2 = http.get(`${BASE_URL}/api/members/mem-001`, { headers })
  const duration2 = Date.now() - start2

  check(res2, {
    'member query status 200': r => r.status === 200,
    'member query < 50ms': () => duration2 < 50,
  }) || dbErrorRate.add(1)

  dbQueryTime.add(duration2)
  slowQueryRate.add(duration2 > 100 ? 1 : 0)

  sleep(0.5)
}

// 场景2: 复杂查询测试
export function complexQueries() {
  const headers = getHeaders()

  // 复杂聚合查询: 销售统计
  const start1 = Date.now()
  const res1 = http.get(
    `${BASE_URL}/api/reports/sales-summary?startDate=2025-01-01&endDate=2025-11-26`,
    { headers }
  )
  const duration1 = Date.now() - start1

  check(res1, {
    'sales summary status 200': r => r.status === 200,
    'sales summary < 500ms': () => duration1 < 500,
  }) || dbErrorRate.add(1)

  dbQueryTime.add(duration1)
  slowQueryRate.add(duration1 > 500 ? 1 : 0)

  sleep(1)

  // JOIN查询: 订单详情(包含商品、会员、支付信息)
  const start2 = Date.now()
  const res2 = http.get(`${BASE_URL}/api/orders/ord-001/details`, { headers })
  const duration2 = Date.now() - start2

  check(res2, {
    'order details status 200': r => r.status === 200,
    'order details < 200ms': () => duration2 < 200,
  }) || dbErrorRate.add(1)

  dbQueryTime.add(duration2)
  slowQueryRate.add(duration2 > 200 ? 1 : 0)

  sleep(1)

  // 分页查询: 大数据集
  const start3 = Date.now()
  const res3 = http.get(`${BASE_URL}/api/products?page=100&pageSize=50&sortBy=sales`, { headers })
  const duration3 = Date.now() - start3

  check(res3, {
    'large pagination status 200': r => r.status === 200,
    'large pagination < 300ms': () => duration3 < 300,
  }) || dbErrorRate.add(1)

  dbQueryTime.add(duration3)
  slowQueryRate.add(duration3 > 300 ? 1 : 0)

  sleep(2)
}

// 场景3: 批量插入测试
export function batchInserts() {
  const headers = getHeaders()

  // 批量创建订单
  const orders = []
  for (let i = 0; i < 10; i++) {
    orders.push({
      memberId: `mem-${Math.floor(Math.random() * 1000)}`,
      products: [
        { productId: 'prod-001', quantity: 2 },
        { productId: 'prod-002', quantity: 1 },
      ],
      totalAmount: 150.0,
    })
  }

  const start = Date.now()
  const res = http.post(`${BASE_URL}/api/orders/batch`, JSON.stringify({ orders }), { headers })
  const duration = Date.now() - start

  check(res, {
    'batch insert status 200': r => r.status === 200,
    'batch insert < 1000ms': () => duration < 1000,
    'all orders created': r => r.json('data.successCount') === orders.length,
  }) || dbErrorRate.add(1)

  dbQueryTime.add(duration)
  slowQueryRate.add(duration > 1000 ? 1 : 0)

  sleep(5)
}

export function handleSummary(data) {
  const metrics = data.metrics

  console.log('\n数据库查询性能测试结果')
  console.log('='.repeat(50))
  console.log('\n查询性能:')
  console.log(`  平均查询时间: ${(metrics.db_query_time?.values?.avg || 0).toFixed(2)}ms`)
  console.log(`  P95: ${(metrics.db_query_time?.values?.['p(95)'] || 0).toFixed(2)}ms`)
  console.log(`  P99: ${(metrics.db_query_time?.values?.['p(99)'] || 0).toFixed(2)}ms`)
  console.log(`  慢查询率: ${((metrics.slow_queries?.values?.rate || 0) * 100).toFixed(2)}%`)
  console.log(`  错误率: ${((metrics.db_errors?.values?.rate || 0) * 100).toFixed(2)}%\n`)

  return {
    'performance/results/db-performance-summary.json': JSON.stringify(data, null, 2),
  }
}
