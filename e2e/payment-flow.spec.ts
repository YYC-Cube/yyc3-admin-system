/**
 * 支付流程E2E测试
 * Phase 5.1 - 端到端测试
 *
 * 测试不同支付方式和支付场景
 */

import { test, expect, Page } from '@playwright/test'

const TEST_USER = {
  username: 'admin',
  password: 'admin123',
}

async function login(page: Page) {
  await page.goto('/')
  await page.getByPlaceholder('请输入用户名').fill(TEST_USER.username)
  await page.getByPlaceholder('请输入密码').fill(TEST_USER.password)
  await page.getByRole('button', { name: '登录' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}

async function createTestOrder(page: Page, amount: number = 100) {
  // 导航到订单创建页面
  await page.click('text=销售管理')
  await page.click('text=创建订单')

  // 填写订单信息
  await page.getByLabel('商品名称').fill('测试商品')
  await page.getByLabel('数量').fill('1')
  await page.getByLabel('金额').fill(amount.toString())

  // 提交订单
  await page.getByRole('button', { name: '创建' }).click()
  await expect(page.locator('text=订单创建成功')).toBeVisible({ timeout: 5000 })

  // 获取订单号
  const orderNumber = await page.locator('[data-testid="order-number"]').textContent()
  return orderNumber || ''
}

test.describe('支付宝支付流程', () => {
  test('应该成功完成支付宝支付', async ({ page }) => {
    await login(page)

    // 创建订单
    const orderNumber = await createTestOrder(page, 100)

    // 选择支付宝支付
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('alipay')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 模拟支付宝支付页面
    await expect(page.locator('text=支付宝支付')).toBeVisible()
    await expect(page.locator('text=订单号')).toContainText(orderNumber)

    // 确认支付
    await page.getByRole('button', { name: '确认支付' }).click()

    // 验证支付成功
    await expect(page.locator('text=支付成功')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="payment-status"]')).toContainText('已支付')
  })

  test('应该处理支付宝支付超时', async ({ page }) => {
    test.setTimeout(60000)

    await login(page)
    const orderNumber = await createTestOrder(page, 100)

    // 选择支付宝支付
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('alipay')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 等待超时(模拟用户未完成支付)
    await page.waitForTimeout(30000)

    // 应该显示超时提示
    await expect(page.locator('text=支付超时')).toBeVisible()
    await expect(page.getByRole('button', { name: '重新支付' })).toBeVisible()
  })
})

test.describe('微信支付流程', () => {
  test('应该成功完成微信支付', async ({ page }) => {
    await login(page)

    // 创建订单
    const orderNumber = await createTestOrder(page, 200)

    // 选择微信支付
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('wechat')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 验证二维码显示
    await expect(page.locator('text=微信支付')).toBeVisible()
    await expect(page.locator('[data-testid="qr-code"]')).toBeVisible()

    // 模拟扫码支付
    await page.evaluate(() => {
      // 触发支付完成回调
      window.dispatchEvent(new CustomEvent('wechat-payment-success'))
    })

    // 验证支付成功
    await expect(page.locator('text=支付成功')).toBeVisible({ timeout: 10000 })
  })

  test('应该处理微信支付取消', async ({ page }) => {
    await login(page)
    const orderNumber = await createTestOrder(page, 150)

    // 选择微信支付
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('wechat')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 取消支付
    await page.getByRole('button', { name: '取消支付' }).click()
    await page.getByRole('button', { name: '确认取消' }).click()

    // 验证返回订单页
    await expect(page.locator('text=支付已取消')).toBeVisible()
    await expect(page.getByRole('button', { name: '重新支付' })).toBeVisible()
  })
})

test.describe('银联支付流程', () => {
  test('应该成功完成银联支付', async ({ page }) => {
    await login(page)

    // 创建订单
    const orderNumber = await createTestOrder(page, 300)

    // 选择银联支付
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('unionpay')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 填写银行卡信息
    await expect(page.locator('text=银联支付')).toBeVisible()
    await page.getByLabel('卡号').fill('6222021234567890')
    await page.getByLabel('持卡人').fill('张三')
    await page.getByLabel('有效期').fill('12/25')
    await page.getByLabel('CVV').fill('123')

    // 确认支付
    await page.getByRole('button', { name: '确认支付' }).click()

    // 验证支付成功
    await expect(page.locator('text=支付成功')).toBeVisible({ timeout: 10000 })
  })

  test('应该验证银行卡信息', async ({ page }) => {
    await login(page)
    const orderNumber = await createTestOrder(page, 250)

    // 选择银联支付
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('unionpay')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 输入无效卡号
    await page.getByLabel('卡号').fill('1234567890')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 应该显示验证错误
    await expect(page.locator('text=请输入有效的银行卡号')).toBeVisible()
  })
})

test.describe('混合支付流程', () => {
  test('应该支持积分+现金混合支付', async ({ page }) => {
    await login(page)

    // 创建订单
    const orderNumber = await createTestOrder(page, 200)

    // 选择混合支付
    await page.getByRole('button', { name: '去支付' }).click()

    // 使用积分
    await page.getByLabel('使用积分').check()
    await page.getByLabel('积分数量').fill('100') // 100积分=10元

    // 验证应付金额减少
    await expect(page.locator('text=应付金额')).toContainText('¥190')

    // 选择支付方式支付剩余金额
    await page.getByLabel('支付方式').selectOption('alipay')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 验证支付成功
    await expect(page.locator('text=支付成功')).toBeVisible({ timeout: 10000 })

    // 验证支付明细
    await expect(page.locator('text=积分抵扣: ¥10')).toBeVisible()
    await expect(page.locator('text=支付宝支付: ¥190')).toBeVisible()
  })

  test('应该支持优惠券+现金混合支付', async ({ page }) => {
    await login(page)

    // 创建订单
    const orderNumber = await createTestOrder(page, 300)

    // 选择混合支付
    await page.getByRole('button', { name: '去支付' }).click()

    // 使用优惠券
    await page.getByRole('button', { name: '选择优惠券' }).click()
    await page.locator('[data-testid="coupon-item"]').first().click()

    // 验证折扣应用
    await expect(page.locator('text=优惠券抵扣')).toBeVisible()

    // 完成支付
    await page.getByLabel('支付方式').selectOption('wechat')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 验证支付成功
    await expect(page.locator('text=支付成功')).toBeVisible({ timeout: 10000 })
  })
})

test.describe('支付异常处理', () => {
  test('应该处理余额不足', async ({ page }) => {
    await login(page)

    // 创建大额订单
    const orderNumber = await createTestOrder(page, 10000)

    // 选择余额支付
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('balance')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 应该显示余额不足提示
    await expect(page.locator('text=账户余额不足')).toBeVisible()
    await expect(page.getByRole('button', { name: '充值' })).toBeVisible()
  })

  test('应该处理支付网关超时', async ({ page }) => {
    test.setTimeout(90000)

    await login(page)
    const orderNumber = await createTestOrder(page, 100)

    // 选择支付方式
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('alipay')

    // 模拟网关超时
    await page.route('**/api/payment/**', route => {
      setTimeout(() => route.abort(), 30000)
    })

    await page.getByRole('button', { name: '确认支付' }).click()

    // 应该显示超时错误
    await expect(page.locator('text=支付超时，请稍后重试')).toBeVisible({ timeout: 35000 })
    await expect(page.getByRole('button', { name: '重试' })).toBeVisible()
  })

  test('应该处理重复支付', async ({ page }) => {
    await login(page)
    const orderNumber = await createTestOrder(page, 100)

    // 完成第一次支付
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('alipay')
    await page.getByRole('button', { name: '确认支付' }).click()
    await expect(page.locator('text=支付成功')).toBeVisible({ timeout: 10000 })

    // 尝试再次支付
    await page.goto(`/payment/${orderNumber}`)

    // 应该显示已支付提示
    await expect(page.locator('text=该订单已支付')).toBeVisible()
    await expect(page.getByRole('button', { name: '确认支付' })).toBeDisabled()
  })
})

test.describe('支付安全验证', () => {
  test('应该要求短信验证码', async ({ page }) => {
    await login(page)

    // 创建大额订单
    const orderNumber = await createTestOrder(page, 5000)

    // 选择支付方式
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('alipay')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 应该要求短信验证
    await expect(page.locator('text=请输入短信验证码')).toBeVisible()
    await page.getByLabel('验证码').fill('123456')
    await page.getByRole('button', { name: '提交' }).click()

    // 验证支付成功
    await expect(page.locator('text=支付成功')).toBeVisible({ timeout: 10000 })
  })

  test('应该限制支付频率', async ({ page }) => {
    await login(page)

    // 快速创建多个订单并尝试支付
    for (let i = 0; i < 5; i++) {
      const orderNumber = await createTestOrder(page, 50)
      await page.getByRole('button', { name: '去支付' }).click()
      await page.getByLabel('支付方式').selectOption('alipay')
      await page.getByRole('button', { name: '确认支付' }).click()
      await page.waitForTimeout(500)
    }

    // 第6次应该被限制
    const orderNumber = await createTestOrder(page, 50)
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('alipay')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 应该显示频率限制提示
    await expect(page.locator('text=操作过于频繁，请稍后再试')).toBeVisible()
  })
})

test.describe('支付回调处理', () => {
  test('应该正确处理支付成功回调', async ({ page }) => {
    await login(page)
    const orderNumber = await createTestOrder(page, 100)

    // 发起支付
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('alipay')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 模拟支付平台回调
    await page.evaluate(orderId => {
      fetch('/api/payment/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: 'success',
          transactionId: 'TXN-123456',
          amount: 100,
        }),
      })
    }, orderNumber)

    // 验证订单状态更新
    await page.waitForTimeout(2000)
    await page.reload()
    await expect(page.locator('[data-testid="payment-status"]')).toContainText('已支付')
  })

  test('应该正确处理支付失败回调', async ({ page }) => {
    await login(page)
    const orderNumber = await createTestOrder(page, 100)

    // 发起支付
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('alipay')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 模拟支付失败回调
    await page.evaluate(orderId => {
      fetch('/api/payment/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: 'failed',
          reason: '余额不足',
        }),
      })
    }, orderNumber)

    // 验证显示失败信息
    await page.waitForTimeout(2000)
    await expect(page.locator('text=支付失败')).toBeVisible()
    await expect(page.locator('text=余额不足')).toBeVisible()
  })
})
