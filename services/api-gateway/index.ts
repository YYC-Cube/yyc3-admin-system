// API网关 - 微服务架构的统一入口

import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
import rateLimit from "express-rate-limit"
import helmet from "helmet"

const app = express()

// 安全中间件
app.use(helmet())

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制100个请求
})
app.use(limiter)

// 微服务路由配置
const services = {
  products: "http://localhost:3001",
  orders: "http://localhost:3002",
  members: "http://localhost:3003",
  warehouse: "http://localhost:3004",
  reports: "http://localhost:3005",
}

// 代理配置
Object.entries(services).forEach(([service, target]) => {
  app.use(
    `/api/${service}`,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^/api/${service}`]: "",
      },
      onProxyReq: (proxyReq, req) => {
        // 添加请求头
        proxyReq.setHeader("X-Gateway-Request", "true")
        proxyReq.setHeader("X-Request-ID", generateRequestId())
      },
      onProxyRes: (proxyRes, req, res) => {
        // 添加响应头
        proxyRes.headers["X-Gateway-Response"] = "true"
      },
      onError: (err, req, res) => {
        console.error(`[Gateway] 代理错误 - ${service}:`, err)
        res.status(503).json({
          error: "Service Unavailable",
          message: `${service}服务暂时不可用`,
        })
      },
    }),
  )
})

// 健康检查
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// 生成请求ID
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const PORT = process.env.GATEWAY_PORT || 3000
app.listen(PORT, () => {
  console.log(`[Gateway] API网关运行在端口 ${PORT}`)
})
