import fs from 'node:fs'
import path from 'node:path'

import { test, expect } from '@playwright/test'

// 工具启用标识（用于 doc 队列成功路径）
const tools = process.env.CI_TOOLS_ENABLED === 'true'

// 轮询队列进度，直到 done/error/超时
async function waitForDone(request: any, taskId: string, timeoutMs = 30000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    const r = await request.get(`/api/tasks/${taskId}`)
    expect(r.ok()).toBeTruthy()
    const j = await r.json()
    if (j.status === 'done' || j.status === 'error') return j
    await new Promise((res) => setTimeout(res, 800))
  }
  throw new Error('队列等待超时')
}

// 图片队列：使用项目内置示例图片（placeholder.jpg），转换为 webp
test('队列：image 成功路径（JPEG → WEBP）', async ({ request }) => {
  const filePath = path.join(process.cwd(), 'public', 'placeholder.jpg')
  const buffer = fs.readFileSync(filePath)
  const create = await request.post('/api/tasks', {
    multipart: {
      file: { name: 'placeholder.jpg', mimeType: 'image/jpeg', buffer },
      to: 'webp',
      category: 'image',
    },
  })
  expect(create.ok()).toBeTruthy()
  const { taskId } = await create.json()
  const prog = await waitForDone(request, taskId)
  expect(prog.status).toBe('done')
  expect(prog.mime).toBe('image/webp')
  expect(typeof prog.dataBase64).toBe('string')
  expect(prog.dataBase64.length).toBeGreaterThan(100)
})

// 文档队列：在工具启用时运行 DOCX → PDF 成功路径
if (!tools) test.skip(true, 'CI 工具未启用，跳过 DOC 队列成功路径')

test('队列：doc 成功路径（DOCX → PDF）', async ({ request }) => {
  const docx = path.join(process.cwd(), 'e2e', 'samples', 'min.docx')
  const buffer = fs.readFileSync(docx)
  const create = await request.post('/api/tasks', {
    multipart: {
      file: { name: 'min.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer },
      to: 'pdf',
      category: 'doc',
    },
  })
  expect(create.ok()).toBeTruthy()
  const { taskId } = await create.json()
  const prog = await waitForDone(request, taskId, 60000)
  expect(prog.status).toBe('done')
  expect(prog.mime).toBe('application/pdf')
  expect(typeof prog.dataBase64).toBe('string')
  expect(prog.dataBase64.length).toBeGreaterThan(100)
})
