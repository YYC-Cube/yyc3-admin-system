import { NextResponse } from "next/server"

// 暂时精简中间件逻辑，避免 Edge Runtime 与 Node.js crypto 不兼容导致接口 500/白屏。
// 后续如需恢复 CSRF 与边缘缓存，可在确保所有依赖都兼容 Edge Runtime 后再启用。

export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
