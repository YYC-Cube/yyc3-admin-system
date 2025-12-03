import '@testing-library/jest-dom'
import { jest } from '@jest/globals'
import 'whatwg-fetch' // 修复fetch未定义

// Mock完整的Response类
class MockResponse {
  public status: number
  public statusText: string
  public headers: Map<string, string>
  public ok: boolean
  private _body: any
  private _bodyUsed: boolean = false

  constructor(body?: any, init?: { status?: number; statusText?: string; headers?: any }) {
    this._body = body
    this.status = init?.status || 200
    this.statusText = init?.statusText || 'OK'
    this.ok = this.status >= 200 && this.status < 300
    this.headers = new Map(Object.entries(init?.headers || {}))
  }

  static json(data: any, init?: any) {
    // 直接存储数据对象而非字符串
    const response = new MockResponse(data, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    })
    return response
  }

  async json() {
    if (this._bodyUsed) {
      throw new Error('Body已经被读取')
    }
    this._bodyUsed = true

    // 如果_body已经是对象,直接返回
    if (typeof this._body === 'object' && this._body !== null) {
      return this._body
    }

    // 如果是字符串,解析为JSON
    if (typeof this._body === 'string') {
      return JSON.parse(this._body || '{}')
    }

    return {}
  }

  async text() {
    if (this._bodyUsed) {
      throw new Error('Body已经被读取')
    }
    this._bodyUsed = true

    if (typeof this._body === 'string') {
      return this._body
    }

    if (typeof this._body === 'object' && this._body !== null) {
      return JSON.stringify(this._body)
    }

    return ''
  }

  clone() {
    return new MockResponse(this._body, {
      status: this.status,
      statusText: this.statusText,
      headers: Object.fromEntries(this.headers),
    })
  }
}

// 将MockResponse设为全局,Next.js会使用它
global.Response = MockResponse as any
global.Headers = class Headers extends Map {
  constructor(init?: any) {
    super(Object.entries(init || {}))
  }
  get(name: string) {
    return super.get(name.toLowerCase())
  }
  set(name: string, value: string) {
    return super.set(name.toLowerCase(), value)
  }
  has(name: string) {
    return super.has(name.toLowerCase())
  }
} as any

// 注意: 移除MockRequest,使用真实Request类(从whatwg-fetch)

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(() => undefined),
    set: jest.fn(),
    delete: jest.fn(),
    has: jest.fn(() => false),
    clear: jest.fn(),
    getAll: jest.fn(() => []),
  }),
}))

// Mock环境变量
process.env.DATABASE_URL = process.env.DATABASE_URL || 'mysql://test:test@localhost:3306/test'
process.env.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock console方法 (减少测试输出噪音)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
} as any
