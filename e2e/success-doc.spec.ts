import path from 'node:path'

import { test, expect } from '@playwright/test'

// 仅在 CI_TOOLS_ENABLED=true 时运行
const enabled = process.env.CI_TOOLS_ENABLED === 'true'
if (!enabled) test.skip(true, 'CI 工具未启用，跳过成功路径测试')

test('DOCX 成功路径：预览与下载按钮', async ({ page }) => {
  await page.goto('/convert/doc')
  const filePath = path.join(process.cwd(), 'e2e', 'samples', 'min.docx')
  await page.locator('input[type="file"]').setInputFiles(filePath)

  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/convert/doc')),
    page.getByRole('button', { name: /开始转换/ }).click(),
  ])

  expect(resp.status()).toBe(200)
  await expect(page.locator('iframe')).toBeVisible()
  await expect(page.getByRole('link', { name: /下载/i })).toBeVisible()
})
