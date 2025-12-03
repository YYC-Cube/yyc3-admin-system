/**
 * 完整用户流程E2E测试
 * Phase 5.1 - 端到端测试
 *
 * 测试场景: 用户登录 → 浏览商品 → 下单 → 支付 → 订单完成
 */

import { test, expect, Page } from '@playwright/test'

// 测试数据
const TEST_USER = {
  username: 'admin',
  password: 'admin123',
}

const TEST_PRODUCT = {
  name: '青岛啤酒',
  quantity: 2,
  expectedPrice: 10.0,
}

// 辅助函数
async function login(page: Page) {
  await page.goto('/')
  await page.getByPlaceholder('请输入用户名').fill(TEST_USER.username)
  await page.getByPlaceholder('请输入密码').fill(TEST_USER.password)
  await page.getByRole('button', { name: '登录' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}

async function navigateToProducts(page: Page) {
  await page.click('text=销售管理')
  await page.click('text=商品管理')
  await expect(page).toHaveURL(/\/dashboard\/products/)
}

async function addProductToCart(page: Page, productName: string, quantity: number) {
  // 搜索商品
  await page.getByPlaceholder(/搜索/).fill(productName)
  await page.getByRole('button', { name: '查询' }).click()

  // 等待搜索结果
  await page.waitForTimeout(500)

  // 添加到购物车
  const productRow = page.locator(`tr:has-text("${productName}")`).first()
  await productRow.locator('button:has-text("添加")').click()

  // 设置数量
  const quantityInput = page.locator('input[type="number"]').first()
  await quantityInput.clear()
  await quantityInput.fill(quantity.toString())

  // 确认添加
  await page.getByRole('button', { name: '确认' }).click()

  // 验证成功提示
  await expect(page.locator('text=添加成功')).toBeVisible({ timeout: 3000 })
}

async function proceedToCheckout(page: Page) {
  // 进入购物车
  await page.click('button[aria-label="购物车"]')
  await expect(page.locator('text=购物车')).toBeVisible()

  // 结算
  await page.getByRole('button', { name: '结算' }).click()
  await expect(page).toHaveURL(/\/checkout/)
}

async function fillCheckoutForm(page: Page) {
  // 填写收货信息
  await page.getByLabel('收货人').fill('张三')
  await page.getByLabel('联系电话').fill('13800138000')
  await page.getByLabel('收货地址').fill('北京市朝阳区xxx街道xxx号')

  // 选择支付方式
  await page.getByLabel('支付方式').selectOption('alipay')

  // 填写备注
  await page.getByLabel('订单备注').fill('尽快配送')
}

async function completePayment(page: Page) {
  // 提交订单
  await page.getByRole('button', { name: '提交订单' }).click()

  // 等待订单创建
  await expect(page.locator('text=订单创建成功')).toBeVisible({ timeout: 5000 })

  // 模拟支付
  await page.getByRole('button', { name: '去支付' }).click()

  // 等待支付页面
  await expect(page.locator('text=支付确认')).toBeVisible()

  // 确认支付
  await page.getByRole('button', { name: '确认支付' }).click()

  // 验证支付成功
  await expect(page.locator('text=支付成功')).toBeVisible({ timeout: 5000 })
}

test.describe('完整用户流程测试', () => {
  test.beforeEach(async ({ page }) => {
    // 设置较长的超时时间
    test.setTimeout(120000)

    // 清除存储
    await page.context().clearCookies()
    await page.context().clearPermissions()
  })

  test('场景1: 完整购物流程 - 从登录到支付完成', async ({ page }) => {
    // Step 1: 用户登录
    await login(page)
    await expect(page.locator('text=欢迎回来')).toBeVisible()

    // Step 2: 浏览商品
    await navigateToProducts(page)
    await expect(page.locator('h1')).toContainText('商品管理')

    // Step 3: 添加商品到购物车
    await addProductToCart(page, TEST_PRODUCT.name, TEST_PRODUCT.quantity)

    // 验证购物车图标显示数量
    const cartBadge = page.locator('button[aria-label="购物车"] span.badge')
    await expect(cartBadge).toContainText(TEST_PRODUCT.quantity.toString())

    // Step 4: 进入结算页面
    await proceedToCheckout(page)

    // 验证商品信息
    await expect(page.locator(`text=${TEST_PRODUCT.name}`)).toBeVisible()
    const totalPrice = TEST_PRODUCT.expectedPrice * TEST_PRODUCT.quantity
    await expect(page.locator(`text=¥${totalPrice}`)).toBeVisible()

    // Step 5: 填写订单信息
    await fillCheckoutForm(page)

    // Step 6: 完成支付
    await completePayment(page)

    // Step 7: 验证订单完成
    await expect(page).toHaveURL(/\/order-success/)
    await expect(page.locator('text=订单完成')).toBeVisible()

    // 验证可以查看订单详情
    const orderNumber = await page.locator('[data-testid="order-number"]').textContent()
    expect(orderNumber).toMatch(/^ORD-\d+/)
  })

  test('场景2: 多商品购物流程', async ({ page }) => {
    // 登录
    await login(page)

    // 添加多个商品
    await navigateToProducts(page)

    await addProductToCart(page, '青岛啤酒', 2)
    await page.waitForTimeout(1000)

    await addProductToCart(page, '雪花啤酒', 3)
    await page.waitForTimeout(1000)

    // 验证购物车总数
    const cartBadge = page.locator('button[aria-label="购物车"] span.badge')
    await expect(cartBadge).toContainText('5')

    // 结算
    await proceedToCheckout(page)

    // 验证商品列表
    await expect(page.locator('text=青岛啤酒')).toBeVisible()
    await expect(page.locator('text=雪花啤酒')).toBeVisible()
  })

  test('场景3: 购物车修改流程', async ({ page }) => {
    // 登录并添加商品
    await login(page)
    await navigateToProducts(page)
    await addProductToCart(page, TEST_PRODUCT.name, 5)

    // 打开购物车
    await page.click('button[aria-label="购物车"]')

    // 修改数量
    const quantityInput = page.locator('input[type="number"]').first()
    await quantityInput.clear()
    await quantityInput.fill('3')
    await page.getByRole('button', { name: '更新' }).click()

    // 验证数量更新
    await expect(page.locator('button[aria-label="购物车"] span.badge')).toContainText('3')

    // 删除商品
    await page.locator('button[aria-label="删除"]').first().click()
    await page.getByRole('button', { name: '确认删除' }).click()

    // 验证购物车为空
    await expect(page.locator('text=购物车为空')).toBeVisible()
  })

  test('场景4: 支付失败重试流程', async ({ page }) => {
    // 登录并创建订单
    await login(page)
    await navigateToProducts(page)
    await addProductToCart(page, TEST_PRODUCT.name, 1)
    await proceedToCheckout(page)
    await fillCheckoutForm(page)

    // 提交订单
    await page.getByRole('button', { name: '提交订单' }).click()
    await expect(page.locator('text=订单创建成功')).toBeVisible({ timeout: 5000 })

    // 模拟支付失败
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByRole('button', { name: '取消支付' }).click()

    // 验证返回订单详情页
    await expect(page.locator('text=支付已取消')).toBeVisible()

    // 重新支付
    await page.getByRole('button', { name: '重新支付' }).click()
    await page.getByRole('button', { name: '确认支付' }).click()

    // 验证支付成功
    await expect(page.locator('text=支付成功')).toBeVisible({ timeout: 5000 })
  })

  test('场景5: 会员积分使用流程', async ({ page }) => {
    // 登录
    await login(page)

    // 查看会员积分
    await page.click('text=会员中心')
    const pointsText = await page.locator('[data-testid="member-points"]').textContent()
    const currentPoints = parseInt(pointsText?.match(/\d+/)?.[0] || '0')
    expect(currentPoints).toBeGreaterThan(0)

    // 添加商品
    await navigateToProducts(page)
    await addProductToCart(page, TEST_PRODUCT.name, 1)
    await proceedToCheckout(page)

    // 使用积分
    await page.getByLabel('使用积分').check()
    const pointsToUse = Math.min(currentPoints, 100)
    await page.getByLabel('积分数量').fill(pointsToUse.toString())

    // 验证折扣金额
    const discount = pointsToUse * 0.01 // 假设1积分=0.01元
    await expect(page.locator(`text=-¥${discount.toFixed(2)}`)).toBeVisible()

    // 完成支付
    await fillCheckoutForm(page)
    await completePayment(page)

    // 验证积分扣减
    await page.click('text=会员中心')
    const newPointsText = await page.locator('[data-testid="member-points"]').textContent()
    const newPoints = parseInt(newPointsText?.match(/\d+/)?.[0] || '0')
    expect(newPoints).toBe(currentPoints - pointsToUse)
  })

  test('场景6: 订单查询与详情查看', async ({ page }) => {
    // 登录
    await login(page)

    // 进入订单列表
    await page.click('text=销售管理')
    await page.click('text=订单列表')
    await expect(page).toHaveURL(/\/dashboard\/sales\/orders/)

    // 查看第一个订单详情
    await page.locator('table tbody tr').first().locator('button:has-text("详情")').click()

    // 验证订单详情页面
    await expect(page.locator('text=订单详情')).toBeVisible()
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible()
    await expect(page.locator('[data-testid="order-status"]')).toBeVisible()
    await expect(page.locator('[data-testid="order-items"]')).toBeVisible()
    await expect(page.locator('[data-testid="order-total"]')).toBeVisible()

    // 验证可以打印订单
    await page.getByRole('button', { name: '打印订单' }).click()
    await expect(page.locator('text=打印预览')).toBeVisible()
  })

  test('场景7: 订单状态流转', async ({ page }) => {
    // 登录
    await login(page)

    // 创建新订单
    await navigateToProducts(page)
    await addProductToCart(page, TEST_PRODUCT.name, 1)
    await proceedToCheckout(page)
    await fillCheckoutForm(page)
    await completePayment(page)

    // 获取订单号
    const orderNumber = await page.locator('[data-testid="order-number"]').textContent()

    // 返回订单列表
    await page.click('text=返回订单列表')

    // 搜索刚创建的订单
    await page.getByPlaceholder(/搜索/).fill(orderNumber || '')
    await page.getByRole('button', { name: '查询' }).click()

    // 验证订单状态为"已支付"
    const orderRow = page.locator(`tr:has-text("${orderNumber}")`)
    await expect(orderRow.locator('text=已支付')).toBeVisible()

    // 处理订单
    await orderRow.locator('button:has-text("处理")').click()
    await page.getByRole('button', { name: '确认处理' }).click()

    // 验证状态更新为"处理中"
    await page.waitForTimeout(1000)
    await expect(orderRow.locator('text=处理中')).toBeVisible()
  })

  test('场景8: 订单取消与退款', async ({ page }) => {
    // 登录
    await login(page)

    // 创建订单但不支付
    await navigateToProducts(page)
    await addProductToCart(page, TEST_PRODUCT.name, 1)
    await proceedToCheckout(page)
    await fillCheckoutForm(page)

    // 提交订单
    await page.getByRole('button', { name: '提交订单' }).click()
    await expect(page.locator('text=订单创建成功')).toBeVisible({ timeout: 5000 })

    // 取消订单
    await page.getByRole('button', { name: '取消订单' }).click()
    await page.getByLabel('取消原因').fill('不想要了')
    await page.getByRole('button', { name: '确认取消' }).click()

    // 验证订单已取消
    await expect(page.locator('text=订单已取消')).toBeVisible()
  })
})

test.describe('用户认证流程', () => {
  test('场景9: 未登录访问受保护页面应重定向到登录', async ({ page }) => {
    // 直接访问受保护页面
    await page.goto('/dashboard/products')

    // 应该重定向到登录页
    await expect(page).toHaveURL(/\/login/)
    await expect(page.locator('text=请先登录')).toBeVisible()
  })

  test('场景10: 登录后访问之前的页面', async ({ page }) => {
    // 尝试访问受保护页面
    await page.goto('/dashboard/products')
    await expect(page).toHaveURL(/\/login/)

    // 登录
    await page.getByPlaceholder('请输入用户名').fill(TEST_USER.username)
    await page.getByPlaceholder('请输入密码').fill(TEST_USER.password)
    await page.getByRole('button', { name: '登录' }).click()

    // 应该重定向回原页面
    await expect(page).toHaveURL(/\/dashboard\/products/)
  })

  test('场景11: 登出后清除会话', async ({ page }) => {
    // 登录
    await login(page)
    await expect(page).toHaveURL(/\/dashboard/)

    // 登出
    await page.click('button[aria-label="用户菜单"]')
    await page.click('text=退出登录')

    // 验证返回登录页
    await expect(page).toHaveURL(/\/login/)

    // 尝试访问受保护页面应被拒绝
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('错误处理', () => {
  test('场景12: 网络错误处理', async ({ page }) => {
    // 登录
    await login(page)

    // 模拟离线
    await page.context().setOffline(true)

    // 尝试加载商品
    await page.click('text=商品管理')

    // 应该显示错误提示
    await expect(page.locator('text=网络连接失败')).toBeVisible({ timeout: 5000 })

    // 恢复在线
    await page.context().setOffline(false)

    // 重试加载
    await page.getByRole('button', { name: '重试' }).click()
    await expect(page.locator('h1')).toContainText('商品管理')
  })

  test('场景13: 表单验证错误', async ({ page }) => {
    await login(page)
    await navigateToProducts(page)
    await addProductToCart(page, TEST_PRODUCT.name, 1)
    await proceedToCheckout(page)

    // 不填写必填信息直接提交
    await page.getByRole('button', { name: '提交订单' }).click()

    // 应该显示验证错误
    await expect(page.locator('text=请填写收货人')).toBeVisible()
    await expect(page.locator('text=请填写联系电话')).toBeVisible()
    await expect(page.locator('text=请填写收货地址')).toBeVisible()
  })
})
