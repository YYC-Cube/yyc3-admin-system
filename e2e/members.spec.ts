import { test, expect } from "@playwright/test"

test.describe("会员管理", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000")
    await page.fill('input[type="text"]', "admin")
    await page.fill('input[type="password"]', "admin123")
    await page.click('button[type="submit"]')
    await page.waitForURL("**/dashboard")
  })

  test("应该显示会员列表", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/members")

    await expect(page.locator("h1")).toContainText("会员管理")
    await expect(page.locator("table")).toBeVisible()
  })

  test("应该能够新增会员", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/members")

    await page.click('button:has-text("新增会员")')

    await page.fill('input[name="name"]', "测试会员")
    await page.fill('input[name="phone"]', "13800138000")
    await page.fill('input[name="cardNumber"]', "TEST001")

    await page.click('button:has-text("保存")')

    await expect(page.locator("text=创建成功")).toBeVisible()
  })

  test("应该能够编辑会员信息", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/members")

    await page.click('table tbody tr:first-child button:has-text("编辑")')

    await page.fill('input[name="name"]', "更新后的会员")
    await page.click('button:has-text("保存")')

    await expect(page.locator("text=更新成功")).toBeVisible()
  })

  test("应该能够会员充值", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/members")

    await page.click('table tbody tr:first-child button:has-text("充值")')

    await page.fill('input[name="amount"]', "100")
    await page.click('button:has-text("确认充值")')

    await expect(page.locator("text=充值成功")).toBeVisible()
  })
})
