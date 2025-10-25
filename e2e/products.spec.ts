import { test, expect } from "@playwright/test"

test.describe("商品管理", () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto("/")
    await page.getByPlaceholder("请输入用户名").fill("admin")
    await page.getByPlaceholder("请输入密码").fill("admin123")
    await page.getByRole("button", { name: "登录" }).click()
    await expect(page).toHaveURL("/dashboard")

    // 导航到商品列表
    await page.getByRole("link", { name: "商品管理" }).click()
    await page.getByRole("link", { name: "商品列表" }).click()
  })

  test("应该显示商品列表", async ({ page }) => {
    await expect(page.getByText("商品列表")).toBeVisible()
    await expect(page.getByRole("table")).toBeVisible()
  })

  test("应该能够创建新商品", async ({ page }) => {
    await page.getByRole("button", { name: "新增商品" }).click()

    await page.getByLabel("商品名称").fill("测试商品")
    await page.getByLabel("优惠价").fill("99")
    await page.getByRole("button", { name: "保存" }).click()

    await expect(page.getByText("商品创建成功")).toBeVisible()
    await expect(page.getByText("测试商品")).toBeVisible()
  })

  test("应该能够搜索商品", async ({ page }) => {
    await page.getByPlaceholder("搜索商品名称").fill("青岛")
    await page.getByRole("button", { name: "查询" }).click()

    await expect(page.getByText("青岛")).toBeVisible()
  })
})
