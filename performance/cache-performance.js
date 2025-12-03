/**
 * K6 缓存性能测试
 * Phase 5.2 - 性能与压力测试
 *
 * 测试目标: 验证Redis缓存命中率和性能
 */

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend, Counter } from 'k6/metrics'

// 自定义指标
const cacheHitRate = new Rate('cache_hit_rate')
const cacheMissRate = new Rate('cache_miss_rate')
const cacheResponseTime = new Trend('cache_response_time')
const dbResponseTime = new Trend('db_response_time')

// 测试配置
export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    cache_hit_rate: ['rate>0.80'], // 缓存命中率 > 80%
    cache_response_time: ['p(95)<50'], // 缓存响应 < 50ms
    db_response_time: ['p(95)<200'], // DB响应 < 200ms
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

// 热门商品ID列表 (模拟高频访问的数据)
const HOT_PRODUCTS = [
  'prod-001',
  'prod-002',
  'prod-003',
  'prod-004',
  'prod-005',
  'prod-006',
  'prod-007',
  'prod-008',
  'prod-009',
  'prod-010',
]

// 普通商品ID列表 (模拟低频访问的数据)
const NORMAL_PRODUCTS = Array.from(
  { length: 100 },
  (_, i) => `prod-${String(i + 11).padStart(3, '0')}`
)

export default function () {
  const headers = getHeaders()

  // 80%概率访问热门商品(应该命中缓存)
  // 20%概率访问普通商品(可能未缓存)
  const isHotProduct = Math.random() < 0.8
  const productId = isHotProduct
    ? HOT_PRODUCTS[Math.floor(Math.random() * HOT_PRODUCTS.length)]
    : NORMAL_PRODUCTS[Math.floor(Math.random() * NORMAL_PRODUCTS.length)]

  // 请求商品详情
  const start = Date.now()
  const res = http.get(`${BASE_URL}/api/products/${productId}`, {
    headers,
    tags: { cached: isHotProduct ? 'expected' : 'maybe' },
  })
  const duration = Date.now() - start

  // 检查响应
  const isSuccess = check(res, {
    'status is 200': r => r.status === 200,
    'has data': r => r.json('data') !== undefined,
  })

  if (!isSuccess) {
    return
  }

  // 判断是否命中缓存 (通过响应头或响应时间判断)
  const cacheHeader = res.headers['X-Cache-Status']
  const isCacheHit = cacheHeader === 'HIT' || duration < 50

  if (isCacheHit) {
    cacheHitRate.add(1)
    cacheMissRate.add(0)
    cacheResponseTime.add(duration)
  } else {
    cacheHitRate.add(0)
    cacheMissRate.add(1)
    dbResponseTime.add(duration)
  }

  check(res, {
    'cache hit for hot product': () => !isHotProduct || isCacheHit,
    'response time reasonable': () => duration < (isCacheHit ? 50 : 200),
  })

  sleep(0.5)

  // 测试列表缓存
  const listStart = Date.now()
  const listRes = http.get(`${BASE_URL}/api/products?page=1&pageSize=20`, {
    headers,
  })
  const listDuration = Date.now() - listStart

  const listCacheHit = listRes.headers['X-Cache-Status'] === 'HIT' || listDuration < 50

  if (listCacheHit) {
    cacheHitRate.add(1)
    cacheResponseTime.add(listDuration)
  } else {
    cacheMissRate.add(1)
    dbResponseTime.add(listDuration)
  }

  check(listRes, {
    'list status 200': r => r.status === 200,
  })

  sleep(1)
}

export function handleSummary(data) {
  const metrics = data.metrics

  const cacheHit = (metrics.cache_hit_rate?.values?.rate || 0) * 100
  const cacheMiss = (metrics.cache_miss_rate?.values?.rate || 0) * 100
  const avgCacheTime = metrics.cache_response_time?.values?.avg || 0
  const avgDbTime = metrics.db_response_time?.values?.avg || 0

  console.log('\n缓存性能测试结果')
  console.log('='.repeat(50))
  console.log('\n缓存命中率:')
  console.log(`  命中率: ${cacheHit.toFixed(2)}%`)
  console.log(`  未命中率: ${cacheMiss.toFixed(2)}%`)

  console.log('\n响应时间对比:')
  console.log(`  缓存命中: ${avgCacheTime.toFixed(2)}ms`)
  console.log(`  缓存未命中(查DB): ${avgDbTime.toFixed(2)}ms`)
  console.log(`  性能提升: ${(((avgDbTime - avgCacheTime) / avgDbTime) * 100).toFixed(2)}%`)

  console.log('\n缓存效率分析:')
  const totalRequests = metrics.http_reqs?.values?.count || 0
  const hitCount = Math.round(totalRequests * (metrics.cache_hit_rate?.values?.rate || 0))
  const missCount = totalRequests - hitCount
  console.log(`  总请求数: ${totalRequests}`)
  console.log(`  缓存命中: ${hitCount}次`)
  console.log(`  缓存未命中: ${missCount}次\n`)

  return {
    'performance/results/cache-performance-summary.json': JSON.stringify(data, null, 2),
  }
}
