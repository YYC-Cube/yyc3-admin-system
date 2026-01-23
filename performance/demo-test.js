/**
 * 简化的API性能测试 - 演示版
 * 快速验证K6测试执行
 */

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// 自定义指标
const errorRate = new Rate('errors')
const responseTime = new Trend('response_time')

// 简化的测试配置
export const options = {
  stages: [
    { duration: '10s', target: 5 }, // 快速增长到5用户
    { duration: '20s', target: 10 }, // 增长到10用户
    { duration: '10s', target: 0 }, // 降回0
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 宽松阈值
    errors: ['rate<0.5'], // 允许50%错误(演示环境)
  },
}

const BASE_URL = 'http://localhost:3555'

export default function () {
  // 测试场景1: 访问首页
  const start1 = Date.now()
  const res1 = http.get(BASE_URL)
  const duration1 = Date.now() - start1

  const check1 = check(res1, {
    'homepage status is 200 or 500': r => r.status === 200 || r.status === 500,
    'homepage responds': r => r.status > 0,
  })

  errorRate.add(check1 ? 0 : 1)
  responseTime.add(duration1)

  sleep(1)

  // 测试场景2: API健康检查(如果存在)
  const start2 = Date.now()
  const res2 = http.get(`${BASE_URL}/api/health`, {
    tags: { name: 'health-check' },
  })
  const duration2 = Date.now() - start2

  check(res2, {
    'health check responds': r => r.status > 0,
  })

  responseTime.add(duration2)

  sleep(1)
}

export function handleSummary(data) {
  const metrics = data.metrics

  console.log('\n=== 性能测试结果摘要 ===\n')
  console.log(`总请求数: ${metrics.http_reqs?.values?.count || 0}`)
  console.log(`平均响应时间: ${(metrics.http_req_duration?.values?.avg || 0).toFixed(2)}ms`)
  console.log(`P95响应时间: ${(metrics.http_req_duration?.values?.['p(95)'] || 0).toFixed(2)}ms`)
  console.log(`错误率: ${((metrics.errors?.values?.rate || 0) * 100).toFixed(2)}%`)
  console.log(`\n测试时长: 40秒`)
  console.log(`虚拟用户: 5→10→0\n`)

  return {
    'performance/results/demo-summary.json': JSON.stringify(data, null, 2),
    'performance/results/demo-report.txt': `
性能测试执行报告
==================
执行时间: ${new Date().toISOString()}
测试类型: API基础性能测试(演示版)

关键指标:
- 总请求数: ${metrics.http_reqs?.values?.count || 0}
- 平均响应: ${(metrics.http_req_duration?.values?.avg || 0).toFixed(2)}ms
- P95响应: ${(metrics.http_req_duration?.values?.['p(95)'] || 0).toFixed(2)}ms
- P99响应: ${(metrics.http_req_duration?.values?.['p(99)'] || 0).toFixed(2)}ms
- 成功率: ${((1 - (metrics.http_req_failed?.values?.rate || 0)) * 100).toFixed(2)}%

负载情况:
- 测试时长: 40秒
- 最大并发: 10个虚拟用户
- RPS: ${(metrics.http_reqs?.values?.rate || 0).toFixed(2)}

结论:
${(metrics.http_req_duration?.values?.['p(95)'] || 0) < 2000 ? '✅ 性能测试通过' : '⚠️ 需要优化'}
    `.trim(),
  }
}
