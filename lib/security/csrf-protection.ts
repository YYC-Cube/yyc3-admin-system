import { type NextRequest, NextResponse } from "next/server"

// CSRF Token管理
class CSRFProtection {
  private tokenStore = new Map<string, { token: string; expires: number }>()
  private readonly TOKEN_EXPIRY = 3600000 // 1小时

  private generateRandomToken(): string {
    // Edge Runtime 下使用 Web Crypto，而不是 Node.js crypto
    if (typeof globalThis.crypto !== "undefined" && "getRandomValues" in globalThis.crypto) {
      const array = new Uint8Array(32)
      globalThis.crypto.getRandomValues(array)
      return Array.from(array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    }

    // 兜底实现：退化为不安全的随机，保证不会在运行时崩溃
    return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
  }

  // 生成CSRF Token
  generateToken(sessionId: string): string {
    const token = this.generateRandomToken()
    const expires = Date.now() + this.TOKEN_EXPIRY

    this.tokenStore.set(sessionId, { token, expires })

    // 清理过期token
    this.cleanExpiredTokens()

    return token
  }

  // 验证CSRF Token
  validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokenStore.get(sessionId)

    if (!stored) {
      return false
    }

    if (Date.now() > stored.expires) {
      this.tokenStore.delete(sessionId)
      return false
    }

    return stored.token === token
  }

  // 清理过期token
  private cleanExpiredTokens() {
    const now = Date.now()
    for (const [sessionId, data] of this.tokenStore.entries()) {
      if (now > data.expires) {
        this.tokenStore.delete(sessionId)
      }
    }
  }

  // 中间件：生成CSRF Token
  generateTokenMiddleware() {
    return (request: NextRequest) => {
      const sessionId =
        request.cookies.get("session_id")?.value ||
        (typeof globalThis.crypto !== "undefined" && "randomUUID" in globalThis.crypto
          ? globalThis.crypto.randomUUID()
          : `${Date.now()}_${Math.random().toString(36).slice(2)}`)
      const csrfToken = this.generateToken(sessionId)

      const response = NextResponse.next()
      response.cookies.set("csrf_token", csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: this.TOKEN_EXPIRY / 1000,
      })
      response.cookies.set("session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: this.TOKEN_EXPIRY / 1000,
      })

      return response
    }
  }

  // 中间件：验证CSRF Token
  validateTokenMiddleware() {
    return (request: NextRequest) => {
      // 只对修改数据的请求进行CSRF验证
      if (!["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
        return NextResponse.next()
      }

      const sessionId = request.cookies.get("session_id")?.value
      const csrfToken = request.headers.get("x-csrf-token") || request.cookies.get("csrf_token")?.value

      if (!sessionId || !csrfToken) {
        return NextResponse.json({ error: "CSRF token missing" }, { status: 403 })
      }

      if (!this.validateToken(sessionId, csrfToken)) {
        return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
      }

      return NextResponse.next()
    }
  }
}

export const csrfProtection = new CSRFProtection()
