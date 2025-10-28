import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { edgeCacheSystem } from "./lib/edge/cache-system"
import { csrfProtection } from "./lib/security/csrf-protection"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api/")) {
    // 生成CSRF token（GET请求）
    if (request.method === "GET") {
      const tokenResponse = csrfProtection.generateTokenMiddleware()(request)
      if (tokenResponse) return tokenResponse
    }

    // 验证CSRF token（POST/PUT/DELETE/PATCH请求）
    if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
      const validationResponse = csrfProtection.validateTokenMiddleware()(request)
      if (validationResponse.status === 403) {
        return validationResponse
      }
    }

    // API路由缓存
    const cacheKey = `api:${pathname}:${request.nextUrl.search}`

    // 尝试从边缘缓存获取
    const cached = await edgeCacheSystem.getData(cacheKey)
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "X-Cache": "HIT",
          "X-Cache-Time": new Date().toISOString(),
        },
      })
    }

    // 继续处理请求
    const response = NextResponse.next()
    response.headers.set("X-Cache", "MISS")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
