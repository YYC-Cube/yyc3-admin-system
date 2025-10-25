import { test, expect } from "@playwright/test"

test.describe("登录流程", () => {
  test("应该显示登录页面", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByText("启智商家后台管理系统")).toBeVisible()
    await expect(page.getByPlaceholder("请输入用户名")).toBeVisible()
    await expect(page.getByPlaceholder("请输入密码")).toBeVisible()
  })

  test("应该能够成功登录", async ({ page }) => {
    await page.goto("/")

    await page.getByPlaceholder("请输入用户名").fill("admin")
    await page.getByPlaceholder("请输入密码").fill("admin123")
    await page.getByRole("button", { name: "登录" }).click()

    await expect(page).toHaveURL("/dashboard")
    await expect(page.getByText("欢迎回来")).toBeVisible()
  })

  test("应该显示错误信息当凭证无效时", async ({ page }) => {
    await page.goto("/")

    await page.getByPlaceholder("请输入用户名").fill("wrong")
    await page.getByPlaceholder("请输入密码").fill("wrong")
    await page.getByRole("button", { name: "登录" }).click()

    await expect(page.getByText(/用户名或密码错误/i)).toBeVisible()
  })
})
