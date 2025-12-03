/**
 * 会员系统E2E测试
 * Phase 5.1 - 端到端测试
 *
 * 测试会员注册、积分、等级、权益等功能
 */

import { test, expect, Page } from '@playwright/test'

const TEST_ADMIN = {
  username: 'admin',
  password: 'admin123',
}

async function loginAsAdmin(page: Page) {
  await page.goto('/')
  await page.getByPlaceholder('请输入用户名').fill(TEST_ADMIN.username)
  await page.getByPlaceholder('请输入密码').fill(TEST_ADMIN.password)
  await page.getByRole('button', { name: '登录' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}

test.describe('会员注册流程', () => {
  test('应该成功注册新会员', async ({ page }) => {
    await loginAsAdmin(page)

    // 进入会员管理
    await page.click('text=会员管理')
    await page.click('text=新增会员')

    // 填写会员信息
    const timestamp = Date.now()
    await page.getByLabel('姓名').fill(`测试会员${timestamp}`)
    await page.getByLabel('手机号').fill(`138${timestamp.toString().slice(-8)}`)
    await page.getByLabel('身份证号').fill('110101199001011234')
    await page.getByLabel('性别').selectOption('male')
    await page.getByLabel('生日').fill('1990-01-01')

    // 提交注册
    await page.getByRole('button', { name: '提交' }).click()

    // 验证注册成功
    await expect(page.locator('text=会员注册成功')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('[data-testid="member-id"]')).toBeVisible()

    // 验证初始积分
    const pointsText = await page.locator('[data-testid="member-points"]').textContent()
    expect(pointsText).toContain('0')
  })

  test('应该验证手机号唯一性', async ({ page }) => {
    await loginAsAdmin(page)

    // 创建第一个会员
    await page.click('text=会员管理')
    await page.click('text=新增会员')

    const phone = '13800138999'
    await page.getByLabel('姓名').fill('测试会员A')
    await page.getByLabel('手机号').fill(phone)
    await page.getByLabel('身份证号').fill('110101199001011234')
    await page.getByRole('button', { name: '提交' }).click()

    await expect(page.locator('text=会员注册成功')).toBeVisible({ timeout: 5000 })

    // 尝试用相同手机号注册
    await page.click('text=新增会员')
    await page.getByLabel('姓名').fill('测试会员B')
    await page.getByLabel('手机号').fill(phone)
    await page.getByLabel('身份证号').fill('110101199001012345')
    await page.getByRole('button', { name: '提交' }).click()

    // 应该显示错误
    await expect(page.locator('text=手机号已被注册')).toBeVisible()
  })

  test('应该发送欢迎短信', async ({ page }) => {
    await loginAsAdmin(page)

    // 注册新会员
    await page.click('text=会员管理')
    await page.click('text=新增会员')

    const phone = `138${Date.now().toString().slice(-8)}`
    await page.getByLabel('姓名').fill('测试会员')
    await page.getByLabel('手机号').fill(phone)
    await page.getByLabel('身份证号').fill('110101199001011234')
    await page.getByLabel('发送欢迎短信').check()
    await page.getByRole('button', { name: '提交' }).click()

    // 验证短信发送
    await expect(page.locator('text=欢迎短信已发送')).toBeVisible()
  })
})

test.describe('会员积分管理', () => {
  test('应该能够手动增加积分', async ({ page }) => {
    await loginAsAdmin(page)

    // 进入会员列表
    await page.click('text=会员管理')
    await page.click('text=会员列表')

    // 选择第一个会员
    const memberRow = page.locator('table tbody tr').first()
    const currentPoints = await memberRow.locator('[data-testid="points"]').textContent()

    await memberRow.locator('button:has-text("积分管理")').click()

    // 增加积分
    await page.getByLabel('操作类型').selectOption('add')
    await page.getByLabel('积分数量').fill('100')
    await page.getByLabel('备注').fill('测试增加积分')
    await page.getByRole('button', { name: '确认' }).click()

    // 验证积分更新
    await expect(page.locator('text=积分操作成功')).toBeVisible()
    const newPoints = await memberRow.locator('[data-testid="points"]').textContent()
    expect(parseInt(newPoints || '0')).toBe(parseInt(currentPoints || '0') + 100)
  })

  test('应该能够扣减积分', async ({ page }) => {
    await loginAsAdmin(page)

    // 进入会员列表
    await page.click('text=会员管理')
    await page.click('text=会员列表')

    // 选择有积分的会员
    const memberRow = page.locator('table tbody tr').first()
    await memberRow.locator('button:has-text("积分管理")').click()

    // 先增加积分
    await page.getByLabel('操作类型').selectOption('add')
    await page.getByLabel('积分数量').fill('200')
    await page.getByRole('button', { name: '确认' }).click()
    await page.waitForTimeout(1000)

    const currentPoints = await memberRow.locator('[data-testid="points"]').textContent()

    // 扣减积分
    await memberRow.locator('button:has-text("积分管理")').click()
    await page.getByLabel('操作类型').selectOption('deduct')
    await page.getByLabel('积分数量').fill('50')
    await page.getByLabel('备注').fill('测试扣减积分')
    await page.getByRole('button', { name: '确认' }).click()

    // 验证积分更新
    await expect(page.locator('text=积分操作成功')).toBeVisible()
    const newPoints = await memberRow.locator('[data-testid="points"]').textContent()
    expect(parseInt(newPoints || '0')).toBe(parseInt(currentPoints || '0') - 50)
  })

  test('应该记录积分变动历史', async ({ page }) => {
    await loginAsAdmin(page)

    // 进入会员详情
    await page.click('text=会员管理')
    await page.click('text=会员列表')
    await page.locator('table tbody tr').first().locator('button:has-text("详情")').click()

    // 查看积分历史
    await page.click('text=积分历史')

    // 验证历史记录
    await expect(page.locator('[data-testid="points-history"]')).toBeVisible()
    await expect(page.locator('table')).toBeVisible()

    // 验证记录包含必要信息
    const historyRow = page.locator('table tbody tr').first()
    await expect(historyRow.locator('td').nth(0)).toBeVisible() // 时间
    await expect(historyRow.locator('td').nth(1)).toBeVisible() // 类型
    await expect(historyRow.locator('td').nth(2)).toBeVisible() // 数量
    await expect(historyRow.locator('td').nth(3)).toBeVisible() // 余额
    await expect(historyRow.locator('td').nth(4)).toBeVisible() // 备注
  })

  test('应该支持积分过期', async ({ page }) => {
    await loginAsAdmin(page)

    // 配置积分过期规则
    await page.click('text=系统设置')
    await page.click('text=积分设置')

    await page.getByLabel('积分有效期').fill('365')
    await page.getByLabel('启用积分过期').check()
    await page.getByRole('button', { name: '保存' }).click()

    await expect(page.locator('text=设置保存成功')).toBeVisible()

    // 查看即将过期的积分
    await page.click('text=会员管理')
    await page.click('text=即将过期积分')

    // 验证列表显示
    await expect(page.locator('h1')).toContainText('即将过期积分')
    await expect(page.locator('table')).toBeVisible()
  })
})

test.describe('会员等级管理', () => {
  test('应该根据消费自动升级会员等级', async ({ page }) => {
    await loginAsAdmin(page)

    // 查看会员当前等级
    await page.click('text=会员管理')
    await page.click('text=会员列表')

    const memberRow = page.locator('table tbody tr').first()
    const memberId = await memberRow.locator('[data-testid="member-id"]').textContent()
    const currentLevel = await memberRow.locator('[data-testid="member-level"]').textContent()

    // 为会员创建订单(增加消费)
    await page.click('text=销售管理')
    await page.click('text=创建订单')

    await page.getByLabel('会员ID').fill(memberId || '')
    await page.getByLabel('金额').fill('5000') // 达到升级条件
    await page.getByRole('button', { name: '创建' }).click()

    // 完成支付
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('alipay')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 返回会员列表查看等级
    await page.click('text=会员管理')
    await page.click('text=会员列表')

    const newLevel = await memberRow.locator('[data-testid="member-level"]').textContent()

    // 验证等级提升
    expect(newLevel).not.toBe(currentLevel)
    await expect(page.locator('text=恭喜您升级到')).toBeVisible()
  })

  test('应该显示会员等级权益', async ({ page }) => {
    await loginAsAdmin(page)

    // 查看等级规则
    await page.click('text=会员管理')
    await page.click('text=等级设置')

    // 验证等级列表
    await expect(page.locator('text=普通会员')).toBeVisible()
    await expect(page.locator('text=银卡会员')).toBeVisible()
    await expect(page.locator('text=金卡会员')).toBeVisible()
    await expect(page.locator('text=钻石会员')).toBeVisible()

    // 查看等级权益详情
    await page.locator('button:has-text("银卡会员")').click()

    await expect(page.locator('text=升级条件')).toBeVisible()
    await expect(page.locator('text=会员权益')).toBeVisible()
    await expect(page.locator('text=积分倍率')).toBeVisible()
    await expect(page.locator('text=折扣率')).toBeVisible()
  })

  test('应该能够手动调整会员等级', async ({ page }) => {
    await loginAsAdmin(page)

    // 选择会员
    await page.click('text=会员管理')
    await page.click('text=会员列表')

    const memberRow = page.locator('table tbody tr').first()
    await memberRow.locator('button:has-text("等级管理")').click()

    // 调整等级
    await page.getByLabel('目标等级').selectOption('gold')
    await page.getByLabel('调整原因').fill('VIP客户特殊升级')
    await page.getByRole('button', { name: '确认调整' }).click()

    // 验证调整成功
    await expect(page.locator('text=等级调整成功')).toBeVisible()
    await expect(memberRow.locator('[data-testid="member-level"]')).toContainText('金卡')
  })
})

test.describe('会员权益使用', () => {
  test('应该应用会员折扣', async ({ page }) => {
    await loginAsAdmin(page)

    // 创建订单(选择会员)
    await page.click('text=销售管理')
    await page.click('text=创建订单')

    // 选择金卡会员(假设有8折优惠)
    await page.getByLabel('会员手机号').fill('13800138001')
    await page.getByRole('button', { name: '查询会员' }).click()

    // 添加商品
    await page.getByLabel('商品').selectOption('product-001')
    await page.getByLabel('数量').fill('1')

    // 验证折扣应用
    await expect(page.locator('text=原价')).toContainText('¥100')
    await expect(page.locator('text=会员价')).toContainText('¥80')
    await expect(page.locator('text=折扣')).toContainText('8折')
  })

  test('应该积累会员积分', async ({ page }) => {
    await loginAsAdmin(page)

    // 查看会员当前积分
    await page.click('text=会员管理')
    await page.click('text=会员列表')

    const memberRow = page.locator('table tbody tr').first()
    const memberId = await memberRow.locator('[data-testid="member-id"]').textContent()
    const currentPoints = parseInt(
      (await memberRow.locator('[data-testid="points"]').textContent()) || '0'
    )

    // 创建订单
    await page.click('text=销售管理')
    await page.click('text=创建订单')

    await page.getByLabel('会员ID').fill(memberId || '')
    await page.getByLabel('金额').fill('100')
    await page.getByRole('button', { name: '创建' }).click()

    // 完成支付
    await page.getByRole('button', { name: '去支付' }).click()
    await page.getByLabel('支付方式').selectOption('alipay')
    await page.getByRole('button', { name: '确认支付' }).click()

    // 验证积分增加(假设消费100元=10积分)
    await page.click('text=会员管理')
    await page.click('text=会员列表')

    const newPoints = parseInt(
      (await memberRow.locator('[data-testid="points"]').textContent()) || '0'
    )
    expect(newPoints).toBe(currentPoints + 10)
  })

  test('应该发送会员生日祝福', async ({ page }) => {
    await loginAsAdmin(page)

    // 设置自动发送生日祝福
    await page.click('text=系统设置')
    await page.click('text=营销设置')

    await page.getByLabel('自动发送生日祝福').check()
    await page.getByLabel('生日优惠券').selectOption('birthday-coupon')
    await page.getByRole('button', { name: '保存' }).click()

    // 查看生日会员列表
    await page.click('text=会员管理')
    await page.click('text=本月生日')

    await expect(page.locator('h1')).toContainText('本月生日会员')

    // 手动发送祝福
    await page.locator('table tbody tr').first().locator('button:has-text("发送祝福")').click()

    await expect(page.locator('text=生日祝福已发送')).toBeVisible()
  })
})

test.describe('会员数据分析', () => {
  test('应该生成会员统计报表', async ({ page }) => {
    await loginAsAdmin(page)

    // 进入会员分析
    await page.click('text=会员管理')
    await page.click('text=数据分析')

    // 验证统计数据
    await expect(page.locator('[data-testid="total-members"]')).toBeVisible()
    await expect(page.locator('[data-testid="active-members"]')).toBeVisible()
    await expect(page.locator('[data-testid="new-members-today"]')).toBeVisible()
    await expect(page.locator('[data-testid="member-growth-rate"]')).toBeVisible()

    // 查看图表
    await expect(page.locator('[data-testid="member-trend-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="level-distribution-chart"]')).toBeVisible()
  })

  test('应该分析会员消费行为', async ({ page }) => {
    await loginAsAdmin(page)

    // 查看会员详情
    await page.click('text=会员管理')
    await page.click('text=会员列表')
    await page.locator('table tbody tr').first().locator('button:has-text("详情")').click()

    // 查看消费分析
    await page.click('text=消费分析')

    // 验证分析数据
    await expect(page.locator('text=总消费金额')).toBeVisible()
    await expect(page.locator('text=平均消费')).toBeVisible()
    await expect(page.locator('text=消费频次')).toBeVisible()
    await expect(page.locator('text=最近消费')).toBeVisible()

    // 查看消费趋势图
    await expect(page.locator('[data-testid="consumption-trend"]')).toBeVisible()
  })

  test('应该识别高价值会员', async ({ page }) => {
    await loginAsAdmin(page)

    // 查看高价值会员列表
    await page.click('text=会员管理')
    await page.click('text=高价值会员')

    await expect(page.locator('h1')).toContainText('高价值会员')

    // 验证排序和筛选
    await page.getByLabel('排序方式').selectOption('consumption-desc')
    await page.getByLabel('最低消费').fill('10000')
    await page.getByRole('button', { name: '查询' }).click()

    // 验证列表显示
    const firstRow = page.locator('table tbody tr').first()
    const consumption = await firstRow.locator('[data-testid="total-consumption"]').textContent()
    expect(parseInt(consumption?.replace(/[^\d]/g, '') || '0')).toBeGreaterThanOrEqual(10000)
  })
})

test.describe('会员营销活动', () => {
  test('应该创建会员专属优惠', async ({ page }) => {
    await loginAsAdmin(page)

    // 创建优惠活动
    await page.click('text=营销管理')
    await page.click('text=创建活动')

    await page.getByLabel('活动名称').fill('金卡会员专享')
    await page.getByLabel('活动类型').selectOption('member-exclusive')
    await page.getByLabel('目标会员等级').selectOption('gold')
    await page.getByLabel('优惠方式').selectOption('discount')
    await page.getByLabel('折扣率').fill('0.85')
    await page.getByLabel('开始时间').fill('2025-12-01')
    await page.getByLabel('结束时间').fill('2025-12-31')

    await page.getByRole('button', { name: '创建' }).click()

    // 验证创建成功
    await expect(page.locator('text=活动创建成功')).toBeVisible()
  })

  test('应该群发会员通知', async ({ page }) => {
    await loginAsAdmin(page)

    // 群发通知
    await page.click('text=会员管理')
    await page.click('text=群发通知')

    await page.getByLabel('通知类型').selectOption('sms')
    await page.getByLabel('目标会员').selectOption('all-gold')
    await page.getByLabel('通知内容').fill('尊敬的金卡会员,本月专享8.5折优惠!')

    // 预览通知
    await page.getByRole('button', { name: '预览' }).click()
    await expect(page.locator('[data-testid="preview-content"]')).toContainText('尊敬的金卡会员')

    // 发送通知
    await page.getByRole('button', { name: '发送' }).click()
    await page.getByRole('button', { name: '确认发送' }).click()

    // 验证发送成功
    await expect(page.locator('text=通知发送成功')).toBeVisible()
    const sentCount = await page.locator('[data-testid="sent-count"]').textContent()
    expect(parseInt(sentCount || '0')).toBeGreaterThan(0)
  })
})
