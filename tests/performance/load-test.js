import http from "k6/http"
import { check, sleep } from "k6"
import { Rate } from "k6/metrics"

const errorRate = new Rate("errors")

export const options = {
  stages: [
    { duration: "30s", target: 20 }, // 预热阶段
    { duration: "1m", target: 50 }, // 正常负载
    { duration: "30s", target: 100 }, // 高负载
    { duration: "1m", target: 100 }, // 持续高负载
    { duration: "30s", target: 0 }, // 降负载
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95%的请求应在500ms内完成
    errors: ["rate<0.1"], // 错误率应低于10%
  },
}

const BASE_URL = "http://localhost:3000"

export default function () {
  // 测试首页加载
  let res = http.get(`${BASE_URL}/`)
  check(res, {
    首页状态码为200: (r) => r.status === 200,
    "首页加载时间<2s": (r) => r.timings.duration < 2000,
  }) || errorRate.add(1)

  sleep(1)

  // 测试API性能
  res = http.get(`${BASE_URL}/api/products?page=1&pageSize=20`)
  check(res, {
    API状态码为200: (r) => r.status === 200,
    "API响应时间<500ms": (r) => r.timings.duration < 500,
    API返回数据正确: (r) => {
      const body = JSON.parse(r.body)
      return body.data && Array.isArray(body.data)
    },
  }) || errorRate.add(1)

  sleep(1)

  // 测试并发创建
  const payload = JSON.stringify({
    name: `测试商品${Date.now()}`,
    category: "测试",
    unit: "个",
    price: 10,
    stock: 100,
  })

  res = http.post(`${BASE_URL}/api/products`, payload, {
    headers: { "Content-Type": "application/json" },
  })
  check(res, {
    创建商品状态码为201: (r) => r.status === 201,
    "创建商品响应时间<1s": (r) => r.timings.duration < 1000,
  }) || errorRate.add(1)

  sleep(2)
}
