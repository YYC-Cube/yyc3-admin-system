import fs from 'node:fs'
import path from 'node:path'

import { test, expect } from '@playwright/test'

function makeTempFile(name: string, sizeBytes: number, content = 'x') {
  const p = path.join(process.cwd(), '.tmp-e2e', name)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content.repeat(Math.max(1, Math.floor(sizeBytes / Math.max(1, content.length)))))
  return p
}

function hasTool(cmd: string): boolean {
  try {
    require('node:child_process').execSync(`command -v ${cmd}`, { stdio: 'ignore', shell: '/bin/bash' })
    return true
  } catch {
    return false
  }
}

// 最小 EPS/AI 样例（非严格有效，仅用于上传链路验证）
function makeMiniEps() {
  const p = path.join(process.cwd(), '.tmp-e2e', 'mini.eps')
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, Buffer.from('%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 10 10'))
  return p
}

const MAX = 10 * 1024 * 1024

test.describe('EPS/AI → SVG/PNG 页面', () => {
  test('上传并选择目标格式，断言网络响应与UI', async ({ page }) => {
    await page.goto('/convert/vector')
    const filePath = makeMiniEps()
    await page.locator('input[type="file"]').setInputFiles(filePath)
    await page.selectOption('select', 'svg')

    const [resp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/convert/vector')),
      page.getByRole('button', { name: '开始转换' }).click(),
    ])

    const status = resp.status()
    if (status === 200) {
      // SVG 预览（iframe 存在）
      await expect(page.locator('iframe')).toBeVisible()
    } else {
      expect([400, 413, 503]).toContain(status)
    }
  })

  test('文件大小超限：返回 413', async ({ request }) => {
    const big = Buffer.alloc(MAX + 1024, 0x61)
    const resp = await request.post('/api/convert/vector', {
      multipart: {
        file: { name: 'big.eps', mimeType: 'application/postscript', buffer: big },
        to: 'svg',
      },
    })
    expect(resp.status()).toBe(413)
  })

  // 改为“请求客户端 + UI 最小断言”组合，规避 HMR 干扰
  test('非法格式：上传非 EPS/AI 返回 400', async ({ request, page }) => {
    const buf = Buffer.from('hello')
    const resp = await request.post('/api/convert/vector', {
      multipart: {
        file: { name: 'bad.txt', mimeType: 'text/plain', buffer: buf },
        to: 'svg',
      },
    })
    expect(resp.status()).toBe(400)
    // UI 最小断言：页面可正常渲染，按钮存在
    await page.goto('/convert/vector')
    await expect(page.getByRole('button', { name: '开始转换' })).toBeVisible()
  })

  // 保持工具缺失场景使用请求客户端，并补充最小 UI 断言
  test('工具缺失：未安装 inkscape 返回 503', async ({ request, page }) => {
    if (hasTool('inkscape')) {
      test.skip(true, '检测到 inkscape，跳过缺失场景')
    }
    const buf = Buffer.from('%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 10 10')
    const resp = await request.post('/api/convert/vector', {
      multipart: {
        file: { name: 'mini.eps', mimeType: 'application/postscript', buffer: buf },
        to: 'svg',
      },
    })
    expect(resp.status()).toBe(503)
    // UI 最小断言：页面可正常渲染
    await page.goto('/convert/vector')
    await expect(page.getByRole('heading', { name: '矢量格式转换（EPS/AI → SVG/PNG）' })).toBeVisible()
  })
})