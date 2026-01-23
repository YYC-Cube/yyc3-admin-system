/**
 * K6 并发用户测试
 * Phase 5.2 - 性能与压力测试
 *
 * 测试目标: 模拟真实用户并发访问场景
 */

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Rate, Trend, Counter } from 'k6/metrics'

// 自定义指标
const userLoginSuccess = new Rate('user_login_success')
const checkoutSuccess = new Rate('checkout_success')
const sessionDuration = new Trend('session_duration')
const errorCount = new Counter('errors')

// 测试配置 - 模拟不同负载级别
export const options = {
  scenarios: {
    // 低负载: 100个并发用户
    low_load: {
      executor: 'constant-vus',
      vus: 100,
      duration: '2m',
      tags: { load_level: 'low' },
    },
    // 中负载: 500个并发用户
    medium_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 500 },
        { duration: '3m', target: 500 },
        { duration: '1m', target: 0 },
      ],
      startTime: '3m',
      tags: { load_level: 'medium' },
    },
    // 高负载: 1000个并发用户
    high_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 1000 },
        { duration: '3m', target: 1000 },
        { duration: '2m', target: 0 },
      ],
      startTime: '8m',
      tags: { load_level: 'high' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<1000'],
    http_req_failed: ['rate<0.02'],
    user_login_success: ['rate>0.99'],
    checkout_success: ['rate>0.95'],
    errors: ['count<100'],
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

// 生成随机用户数据
function generateUser() {
  const id = Math.floor(Math.random() * 10000)
  return {
    username: `testuser${id}`,
    password: 'test123',
    phone: `138${String(id).padStart(8, '0')}`,
  }
}

// 模拟用户完整会话
export default function () {
  const sessionStart = Date.now()
  const user = generateUser()
  let token = null

  // 1. 用户登录
  group('用户登录', function () {
    const loginRes = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify({
        username: 'admin',
        password: 'admin123',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    const loginOk = check(loginRes, {
      'login status 200': r => r.status === 200,
      'login has token': r => r.json('data.token') !== undefined,
    })

    userLoginSuccess.add(loginOk ? 1 : 0)

    if (!loginOk) {
      errorCount.add(1)
      return
    }

    token = loginRes.json('data.token')
  })

  if (!token) return

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  sleep(1)

  // 2. 浏览商品
  group('浏览商品', function () {
    // 查看商品列表
    const listRes = http.get(`${BASE_URL}/api/products?page=1&pageSize=20`, {
      headers,
    })

    check(listRes, {
      'product list status 200': r => r.status === 200,
    }) || errorCount.add(1)

    sleep(2)

    // 搜索商品
    const searchRes = http.get(`${BASE_URL}/api/products?keyword=啤酒`, {
      headers,
    })

    check(searchRes, {
      'search status 200': r => r.status === 200,
    }) || errorCount.add(1)

    sleep(1)

    // 查看商品详情
    const detailRes = http.get(`${BASE_URL}/api/products/prod-001`, {
      headers,
    })

    check(detailRes, {
      'product detail status 200': r => r.status === 200,
    }) || errorCount.add(1)
  })

  sleep(2)

  // 3. 添加到购物车
  group('购物车操作', function () {
    const cartRes = http.post(
      `${BASE_URL}/api/cart`,
      JSON.stringify({
        productId: 'prod-001',
        quantity: 2,
      }),
      { headers }
    )

    check(cartRes, {
      'add to cart status 200': r => r.status === 200,
    }) || errorCount.add(1)

    sleep(1)

    // 查看购物车
    const viewCartRes = http.get(`${BASE_URL}/api/cart`, { headers })

    check(viewCartRes, {
      'view cart status 200': r => r.status === 200,
    }) || errorCount.add(1)
  })

  sleep(2)

  // 4. 创建订单
  group('订单创建', function () {
    const orderRes = http.post(
      `${BASE_URL}/api/orders`,
      JSON.stringify({
        items: [{ productId: 'prod-001', quantity: 2, price: 10.0 }],
        totalAmount: 20.0,
        shippingAddress: {
          name: '测试用户',
          phone: '13800138000',
          address: '北京市朝阳区xxx街道xxx号',
        },
      }),
      { headers }
    )

    check(orderRes, {
      'create order status 200': r => r.status === 200,
    }) || errorCount.add(1)
  })

  sleep(2)

  // 5. 支付
  group('订单支付', function () {
    const paymentRes = http.post(
      `${BASE_URL}/api/payment`,
      JSON.stringify({
        orderId: 'ord-test-123',
        paymentMethod: 'alipay',
        amount: 20.0,
      }),
      { headers }
    )

    const paymentOk = check(paymentRes, {
      'payment status 200': r => r.status === 200,
    })

    checkoutSuccess.add(paymentOk ? 1 : 0)

    if (!paymentOk) {
      errorCount.add(1)
    }
  })

  sleep(1)

  // 6. 查看订单
  group('查看订单', function () {
    const ordersRes = http.get(`${BASE_URL}/api/orders?page=1&pageSize=10`, {
      headers,
    })

    check(ordersRes, {
      'view orders status 200': r => r.status === 200,
    }) || errorCount.add(1)
  })

  // 记录会话时长
  const sessionEnd = Date.now()
  sessionDuration.add(sessionEnd - sessionStart)

  sleep(3)
}

export function handleSummary(data) {
  const metrics = data.metrics

  console.log('\n并发用户测试结果')
  console.log('='.repeat(60))

  console.log('\n用户行为指标:')
  console.log(
    `  登录成功率: ${((metrics.user_login_success?.values?.rate || 0) * 100).toFixed(2)}%`
  )
  console.log(`  结账成功率: ${((metrics.checkout_success?.values?.rate || 0) * 100).toFixed(2)}%`)
  console.log(
    `  平均会话时长: ${((metrics.session_duration?.values?.avg || 0) / 1000).toFixed(2)}s`
  )

  console.log('\n系统性能指标:')
  console.log(`  总请求数: ${metrics.http_reqs?.values?.count || 0}`)
  console.log(
    `  请求成功率: ${((1 - (metrics.http_req_failed?.values?.rate || 0)) * 100).toFixed(2)}%`
  )
  console.log(`  平均响应时间: ${(metrics.http_req_duration?.values?.avg || 0).toFixed(2)}ms`)
  console.log(`  P95响应时间: ${(metrics.http_req_duration?.values?.['p(95)'] || 0).toFixed(2)}ms`)
  console.log(`  P99响应时间: ${(metrics.http_req_duration?.values?.['p(99)'] || 0).toFixed(2)}ms`)
  console.log(`  RPS: ${(metrics.http_reqs?.values?.rate || 0).toFixed(2)}`)
  console.log(`  总错误数: ${metrics.errors?.values?.count || 0}\n`)

  // 按负载级别分组统计
  const stages = ['low', 'medium', 'high']
  console.log('负载级别分析:')
  stages.forEach(stage => {
    const stageData = data.root_group?.groups?.[stage]
    if (stageData) {
      console.log(`  ${stage.toUpperCase()}负载:`)
      console.log(
        `    - 平均响应时间: ${(stageData.metrics?.http_req_duration?.avg || 0).toFixed(2)}ms`
      )
      console.log(
        `    - 失败率: ${((stageData.metrics?.http_req_failed?.rate || 0) * 100).toFixed(2)}%`
      )
    }
  })

  return {
    'performance/results/concurrent-users-summary.json': JSON.stringify(data, null, 2),
  }
}
