// CSRF保护中间件
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const CSRF_TOKEN_HEADER = "X-CSRF-Token"
const CSRF_TOKEN_COOKIE = "csrf-token"

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get(CSRF_TOKEN_HEADER)
  const cookieToken = request.cookies.get(CSRF_TOKEN_COOKIE)?.value

  if (!token || !cookieToken) {
    return false
  }

  return token === cookieToken
}

export function csrfProtection(handler: Function) {
  return async (request: NextRequest) => {
    // GET请求不需要CSRF保护
    if (request.method === "GET") {
      return handler(request)
    }

    // 验证CSRF token
    if (!validateCSRFToken(request)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
    }

    return handler(request)
  }
}
