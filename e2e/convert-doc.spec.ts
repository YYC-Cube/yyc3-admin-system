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

// 最小化 docx 样例（非严格有效，仅用于上传链路验证）
function makeMiniDocx() {
  const p = path.join(process.cwd(), '.tmp-e2e', 'mini.docx')
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, Buffer.from('PK\x03\x04minimal-docx'))
  return p
}

const MAX = 10 * 1024 * 1024 // 与 environmentConfig.api.maxUploadSize 对齐

test.describe('DOCX → PDF 页面', () => {
  test('成功/失败路径：上传并点击转换，断言网络响应与UI', async ({ page }) => {
    await page.goto('/convert/doc')
    const filePath = makeMiniDocx()
    const input = page.locator('input[type="file"]')
    await input.setInputFiles(filePath)

    const [resp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/convert/doc')), 
      page.getByRole('button', { name: '开始转换' }).click(),
    ])

    const status = resp.status()
    if (status === 200) {
      // 成功预览（iframe 存在）
      await expect(page.locator('iframe')).toBeVisible()
    } else {
      // 失败路径（503: 工具缺失、400: 非法格式等、413: 超限）
      expect([400, 413, 503]).toContain(status)
    }
  })

  test('文件大小超限：应返回 413', async ({ request }) => {
    const big = Buffer.alloc(MAX + 1024, 0x61) // 'a' * (MAX+1024)
    const resp = await request.post('/api/convert/doc', {
      multipart: {
        file: { name: 'big.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer: big },
        to: 'pdf',
      },
    })
    expect(resp.status()).toBe(413)
  })

  // 改为“请求客户端 + UI 最小断言”组合
  test('非法格式：上传非 docx，应返回 400', async ({ request, page }) => {
    const buf = Buffer.from('hello')
    const resp = await request.post('/api/convert/doc', {
      multipart: {
        file: { name: 'bad.txt', mimeType: 'text/plain', buffer: buf },
        to: 'pdf',
      },
    })
    expect(resp.status()).toBe(400)
    // UI 最小断言：页面正常渲染
    await page.goto('/convert/doc')
    await expect(page.getByRole('button', { name: '开始转换' })).toBeVisible()
  })

  // 工具缺失场景改为请求客户端，并加入最小 UI 断言
  test('工具缺失场景：若未安装 libreoffice，应返回 503', async ({ request, page }) => {
    if (hasTool('soffice') || hasTool('libreoffice')) {
      test.skip(true, '检测到 libreoffice/soffice，跳过缺失场景')
    }
    const fileBuf = Buffer.from('PK\x03\x04minimal-docx')
    const resp = await request.post('/api/convert/doc', {
      multipart: {
        file: { name: 'mini.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer: fileBuf },
        to: 'pdf',
      },
    })
    expect(resp.status()).toBe(503)
    await page.goto('/convert/doc')
    await expect(page.getByRole('heading', { name: '文档格式转换（DOCX → PDF）' })).toBeVisible()
  })
})