import { type NextRequest, NextResponse } from "next/server"

// CSRF Token管理
class CSRFProtection {
  private tokenStore = new Map<string, { token: string; expires: number }>()
  private readonly TOKEN_EXPIRY = 3600000 // 1小时

  // 生成CSRF Token
  async generateToken(sessionId: string): Promise<string> {
    // 使用Web Crypto API生成随机token
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    
    const expires = Date.now() + this.TOKEN_EXPIRY

    this.tokenStore.set(sessionId, { token, expires })

    // 清理过期token
    this.cleanExpiredTokens()

    return token
  }

  // 验证CSRF Token
  async validateToken(sessionId: string, token: string): Promise<boolean> {
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
    return async (request: NextRequest) => {
      // 使用Web Crypto API生成sessionId
      const generateSessionId = () => {
        const array = new Uint8Array(16)
        crypto.getRandomValues(array)
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
      }
      
      const sessionId = request.cookies.get("session_id")?.value || generateSessionId()
      const csrfToken = await this.generateToken(sessionId)

      const response = NextResponse.next()
      response.cookies.set("csrf_token", csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: this.TOKEN_EXPIRY / 1000,
      })
      
      // 如果没有session_id，则设置一个
      if (!request.cookies.get("session_id")?.value) {
        response.cookies.set("session_id", sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: this.TOKEN_EXPIRY / 1000,
        })
      }

      return response
    }
  }

  // 中间件：验证CSRF Token
  validateTokenMiddleware() {
    return async (request: NextRequest) => {
      // 只对修改数据的请求进行CSRF验证
      if (!["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
        return NextResponse.next()
      }

      const sessionId = request.cookies.get("session_id")?.value
      const csrfToken = request.headers.get("x-csrf-token") || request.cookies.get("csrf_token")?.value

      if (!sessionId || !csrfToken) {
        return NextResponse.json({ error: "CSRF token missing" }, { status: 403 })
      }

      try {
        if (!(await this.validateToken(sessionId, csrfToken))) {
          return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
        }
      } catch (error) {
        console.error("CSRF validation error:", error)
        return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 })
      }

      return NextResponse.next()
    }
  }
}

export const csrfProtection = new CSRFProtection()
