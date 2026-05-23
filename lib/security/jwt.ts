/**
 * @file jwt.ts
 * @description JWT Token 生成与验证工具 - 基于 jose 库（Edge Runtime 兼容）
 * @module security/jwt
 * @author YYC³
 * @version 1.0.0
 * @created 2026-05-23
 * @updated 2026-05-23
 */

import { SignJWT, jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "yyc3-default-dev-secret-change-in-production"
)

const ISSUER = "yyc3-admin-system"
const AUDIENCE = "yyc3-admin-api"

export interface TokenPayload {
  userId: string
  role: string
  storeId: string
  permissions: string[]
}

export interface VerifiedToken extends TokenPayload {
  iat: number
  exp: number
}

export async function generateToken(payload: TokenPayload, expiresIn = "8h"): Promise<string> {
  const token = await new SignJWT({
    userId: payload.userId,
    role: payload.role,
    storeId: payload.storeId,
    permissions: payload.permissions,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .setSubject(payload.userId)
    .sign(SECRET)

  return token
}

export async function verifyToken(token: string): Promise<VerifiedToken | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    })

    return {
      userId: payload.userId as string,
      role: payload.role as string,
      storeId: payload.storeId as string,
      permissions: payload.permissions as string[],
      iat: payload.iat as number,
      exp: payload.exp as number,
    }
  } catch {
    return null
  }
}

export async function getTokenRemainingTime(token: string): Promise<number> {
  const verified = await verifyToken(token)
  if (!verified) return 0
  const now = Math.floor(Date.now() / 1000)
  return Math.max(0, verified.exp - now)
}
