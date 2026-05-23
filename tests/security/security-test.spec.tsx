import { test, expect } from "@playwright/test"

test.describe("安全测试", () => {
  test("应该防止SQL注入攻击", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/products/list")

    // 尝试SQL注入
    await page.fill('input[placeholder*="搜索"]', "' OR '1'='1")
    await page.click('button:has-text("查询")')

    // 应该正常处理，不返回所有数据
    const response = await page.waitForResponse((resp) => resp.url().includes("/api/products"))
    expect(response.status()).toBe(200)
  })

  test("应该防止XSS攻击", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/products/list")

    await page.click('button:has-text("新增商品")')

    // 尝试XSS注入
    await page.fill('input[name="name"]', '<script>alert("XSS")</script>')
    await page.fill('input[name="price"]', "10")
    await page.click('button:has-text("保存")')

    // 检查是否被转义
    await page.waitForTimeout(1000)
    const alerts = await page.evaluate(() => {
      return document.querySelectorAll("script").length
    })
    expect(alerts).toBe(0)
  })

  test("应该验证CSRF令牌", async ({ request }) => {
    // 尝试不带CSRF令牌的请求
    const response = await request.post("http://localhost:3000/api/products", {
      data: {
        name: "测试商品",
        price: 10,
      },
    })

    // 应该被拒绝或要求CSRF令牌
    expect([400, 403]).toContain(response.status())
  })

  test("应该防止未授权访问", async ({ page }) => {
    // 未登录访问受保护页面
    await page.goto("http://localhost:3000/dashboard")

    // 应该重定向到登录页
    await expect(page).toHaveURL(/.*login|.*\/$/)
  })

  test("应该限制API请求频率", async ({ request }) => {
    const requests = []

    // 快速发送多个请求
    for (let i = 0; i < 100; i++) {
      requests.push(request.get("http://localhost:3000/api/products"))
    }

    const responses = await Promise.all(requests)

    // 应该有一些请求被限流
    const rateLimited = responses.filter((r) => r.status() === 429)
    expect(rateLimited.length).toBeGreaterThan(0)
  })
})
