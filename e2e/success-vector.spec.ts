import path from 'node:path'

import { test, expect } from '@playwright/test'

const enabled = process.env.CI_TOOLS_ENABLED === 'true'
if (!enabled) test.skip(true, 'CI 工具未启用，跳过成功路径测试')

test('EPS 成功路径：预览与下载按钮', async ({ page }) => {
  await page.goto('/convert/vector')
  const eps = path.join(process.cwd(), 'e2e', 'samples', 'min.eps')
  await page.locator('input[type="file"]').setInputFiles(eps)
  await page.selectOption('select', 'svg')

  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/convert/vector')),
    page.getByRole('button', { name: /开始转换/ }).click(),
  ])

  expect(resp.status()).toBe(200)
  await expect(page.locator('iframe')).toBeVisible()
  await expect(page.getByRole('link', { name: /下载/i })).toBeVisible()
})

test('AI 成功路径：预览与下载按钮', async ({ page }) => {
  await page.goto('/convert/vector')
  const ai = path.join(process.cwd(), 'e2e', 'samples', 'min.ai')
  await page.locator('input[type="file"]').setInputFiles(ai)
  await page.selectOption('select', 'svg')

  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/convert/vector')),
    page.getByRole('button', { name: /开始转换/ }).click(),
  ])

  expect(resp.status()).toBe(200)
  await expect(page.locator('iframe')).toBeVisible()
  await expect(page.getByRole('link', { name: /下载/i })).toBeVisible()
})
