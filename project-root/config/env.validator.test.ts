import { env } from "./env.test"

describe("环境变量测试注入校验", () => {
  it("应包含关键字段", () => {
    expect(env.NODE_ENV).toBe("test")
    expect(env.NEXT_PUBLIC_API_BASE_URL).toMatch(/^http/)
    expect(env.JWT_SECRET).toBeDefined()
    expect(env.YYC3_YY_DB_HOST).toBeDefined()
    expect(env.EMAIL_HOST).toBeDefined()
    expect(env.BI_HOST).toBeDefined()
    expect(env.OLAP_HOST).toBeDefined()
    expect(env.REDIS_URL).toMatch(/^redis/)
  })

  it("应符合类型要求", () => {
    expect(typeof env.API_TIMEOUT).toBe("number")
    expect(typeof env.NEXT_PUBLIC_ENABLE_DARK_MODE).toBe("boolean")
    expect(typeof env.EMAIL_PORT).toBe("number")
    expect(typeof env.ENABLE_METRICS).toBe("boolean")
    expect(typeof env.WEBRTC_BITRATE_MIN).toBe("number")
    expect(typeof env.ALERT_THRESHOLD_SALES_DROP).toBe("number")
  })
})
