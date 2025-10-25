import { test, expect } from "@playwright/test"

test.describe("订单管理", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000")
    await page.fill('input[type="text"]', "admin")
    await page.fill('input[type="password"]', "admin123")
    await page.click('button[type="submit"]')
    await page.waitForURL("**/dashboard")
  })

  test("应该显示订单列表", async ({ page }) => {
    await page.click("text=销售管理")
    await page.click("text=订单列表")

    await expect(page.locator("h1")).toContainText("订单列表")
    await expect(page.locator("table")).toBeVisible()
  })

  test("应该能够搜索订单", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/sales/orders")

    await page.fill('input[placeholder*="搜索"]', "CC")
    await page.click('button:has-text("查询")')

    await page.waitForTimeout(1000)

    const rows = page.locator("table tbody tr")
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test("应该能够查看订单详情", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/sales/orders")

    await page.click('table tbody tr:first-child button:has-text("详情")')

    await expect(page.locator("text=订单详情")).toBeVisible()
  })

  test("应该能够导出订单数据", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/sales/orders")

    const downloadPromise = page.waitForEvent("download")
    await page.click('button:has-text("导出")')
    const download = await downloadPromise

    expect(download.suggestedFilename()).toContain("orders")
  })
})
