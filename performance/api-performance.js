/**
 * K6 API性能测试
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 5,
    duration: '30s',
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        http_req_failed: ['rate<0.3'],
    },
};

export let BASE_URL = __ENV.BASE_URL || 'http://api.0379.email';

export default function () {
    let response = http.post(`${BASE_URL}/api/auth/login`,
        JSON.stringify({ email: 'test@example.com', password: 'test123' }),
        {
            headers: { 'Content-Type': 'application/json' },
            timeout: '10s'
        }
    );

    check(response, {
      'login status is success': (r) => r.status >= 200 && r.status < 500,
      'response time < 2s': (r) => r.timings.duration < 2000,
      'has response body': (r) => r.body && r.body.length > 0,
    });

    sleep(1);
}
 *
 * 测试目标: 验证API端点响应时间和吞吐量
 */

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend, Counter } from 'k6/metrics'

// 自定义指标
const errorRate = new Rate('errors')
const apiResponseTime = new Trend('api_response_time')
const requestCount = new Counter('request_count')

// 测试配置
export const options = {
  stages: [
    { duration: '30s', target: 20 }, // 预热: 30秒达到20个用户
    { duration: '1m', target: 50 }, // 增长: 1分钟达到50个用户
    { duration: '2m', target: 100 }, // 压力: 2分钟达到100个用户
    { duration: '1m', target: 50 }, // 降低: 1分钟降到50个用户
    { duration: '30s', target: 0 }, // 冷却: 30秒降到0
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95%的请求在200ms内
    http_req_failed: ['rate<0.01'], // 错误率低于1%
    errors: ['rate<0.05'], // 业务错误率低于5%
    api_response_time: ['p(99)<500'], // 99%的API响应在500ms内
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

// 测试用户凭证
const TEST_USER = {
  username: 'admin',
  password: 'admin123',
}

// 登录并获取token
function login() {
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      username: TEST_USER.username,
      password: TEST_USER.password,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  )

  check(loginRes, {
    'login status is 200': r => r.status === 200,
    'login returns token': r => r.json('data.token') !== undefined,
  })

  const token = loginRes.json('data.token')
  return token
}

// 获取授权headers
function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export default function () {
  // 登录
  const token = login()
  if (!token) {
    errorRate.add(1)
    return
  }

  const headers = getAuthHeaders(token)

  // 场景1: 获取商品列表
  const productsStart = Date.now()
  const productsRes = http.get(`${BASE_URL}/api/products?page=1&pageSize=10`, {
    headers,
  })
  const productsDuration = Date.now() - productsStart

  check(productsRes, {
    'products status is 200': r => r.status === 200,
    'products has data': r => r.json('data') !== undefined,
    'products response time < 200ms': () => productsDuration < 200,
  }) || errorRate.add(1)

  apiResponseTime.add(productsDuration)
  requestCount.add(1)

  sleep(1)

  // 场景2: 搜索商品
  const searchStart = Date.now()
  const searchRes = http.get(`${BASE_URL}/api/products?keyword=啤酒`, {
    headers,
  })
  const searchDuration = Date.now() - searchStart

  check(searchRes, {
    'search status is 200': r => r.status === 200,
    'search response time < 300ms': () => searchDuration < 300,
  }) || errorRate.add(1)

  apiResponseTime.add(searchDuration)
  requestCount.add(1)

  sleep(1)

  // 场景3: 获取订单列表
  const ordersStart = Date.now()
  const ordersRes = http.get(`${BASE_URL}/api/orders?page=1&pageSize=10`, {
    headers,
  })
  const ordersDuration = Date.now() - ordersStart

  check(ordersRes, {
    'orders status is 200': r => r.status === 200,
    'orders has data': r => r.json('data') !== undefined,
    'orders response time < 200ms': () => ordersDuration < 200,
  }) || errorRate.add(1)

  apiResponseTime.add(ordersDuration)
  requestCount.add(1)

  sleep(1)

  // 场景4: 获取会员列表
  const membersStart = Date.now()
  const membersRes = http.get(`${BASE_URL}/api/members?page=1&pageSize=10`, {
    headers,
  })
  const membersDuration = Date.now() - membersStart

  check(membersRes, {
    'members status is 200': r => r.status === 200,
    'members response time < 200ms': () => membersDuration < 200,
  }) || errorRate.add(1)

  apiResponseTime.add(membersDuration)
  requestCount.add(1)

  sleep(1)

  // 场景5: 获取统计数据
  const statsStart = Date.now()
  const statsRes = http.get(`${BASE_URL}/api/dashboard/stats`, {
    headers,
  })
  const statsDuration = Date.now() - statsStart

  check(statsRes, {
    'stats status is 200': r => r.status === 200,
    'stats response time < 500ms': () => statsDuration < 500,
  }) || errorRate.add(1)

  apiResponseTime.add(statsDuration)
  requestCount.add(1)

  sleep(2)
}

// 测试结束后的报告
export function handleSummary(data) {
  return {
    'performance/results/api-performance-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}

function textSummary(data, options) {
  const indent = options?.indent || ''
  const colors = options?.enableColors

  let summary = `\n${indent}API性能测试结果\n`
  summary += `${indent}${'='.repeat(50)}\n\n`

  const metrics = data.metrics

  summary += `${indent}请求统计:\n`
  summary += `${indent}  总请求数: ${metrics.http_reqs?.values?.count || 0}\n`
  summary += `${indent}  成功率: ${(
    (1 - (metrics.http_req_failed?.values?.rate || 0)) *
    100
  ).toFixed(2)}%\n`
  summary += `${indent}  业务错误率: ${((metrics.errors?.values?.rate || 0) * 100).toFixed(2)}%\n\n`

  summary += `${indent}响应时间:\n`
  summary += `${indent}  平均: ${(metrics.http_req_duration?.values?.avg || 0).toFixed(2)}ms\n`
  summary += `${indent}  最小: ${(metrics.http_req_duration?.values?.min || 0).toFixed(2)}ms\n`
  summary += `${indent}  最大: ${(metrics.http_req_duration?.values?.max || 0).toFixed(2)}ms\n`
  summary += `${indent}  P95: ${(metrics.http_req_duration?.values?.['p(95)'] || 0).toFixed(2)}ms\n`
  summary += `${indent}  P99: ${(metrics.http_req_duration?.values?.['p(99)'] || 0).toFixed(
    2
  )}ms\n\n`

  summary += `${indent}吞吐量:\n`
  summary += `${indent}  RPS: ${(metrics.http_reqs?.values?.rate || 0).toFixed(2)}\n`

  return summary
}
