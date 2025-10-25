import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { edgeCacheSystem } from "./lib/edge/cache-system"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API路由缓存
  if (pathname.startsWith("/api/")) {
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
