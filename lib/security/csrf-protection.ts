import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// CSRF Token管理
class CSRFProtection {
  private tokenStore = new Map<string, { token: string; expires: number }>()
  private readonly TOKEN_EXPIRY = 3600000 // 1小时

  // 生成CSRF Token
  generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString("hex")
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
      const sessionId = request.cookies.get("session_id")?.value || crypto.randomUUID()
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
