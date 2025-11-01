/**
 * @file 外部工具转换适配器
 * @description 通过容器/系统命令调用 LibreOffice/InkScape 等完成复杂格式转换
 * @module lib/convert/external
 * @author YYC
 * @version 0.2.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export type ExternalTool = 'libreoffice' | 'inkscape'

export interface ExternalConvertOptions {
  tool: ExternalTool
  from: string
  to: string
}

export interface ExternalConvertResult {
  mime: string
  data: Buffer
  meta?: { durationMs?: number }
}

export async function isToolAvailable(tool: ExternalTool): Promise<boolean> {
  const cmd = tool === 'libreoffice' ? 'soffice' : 'inkscape'
  const p = spawn(cmd, ['--version'])
  return await new Promise((resolve) => {
    p.on('error', () => resolve(false))
    p.on('exit', (code) => resolve(code === 0 || code === 1))
  })
}

function guessMime(to: string): string {
  switch (to) {
    case 'pdf': return 'application/pdf'
    case 'png': return 'image/png'
    case 'svg': return 'image/svg+xml'
    default: return 'application/octet-stream'
  }
}

export async function convertWithExternalTool(input: Buffer, opt: ExternalConvertOptions): Promise<ExternalConvertResult> {
  const start = Date.now()
  const available = await isToolAvailable(opt.tool)
  if (!available) {
    throw new Error(`${opt.tool} 未安装或不可用：请部署容器或在服务器安装对应工具`)
  }

  const tmp = path.join(os.tmpdir(), `etc-${randomUUID()}`)
  await fs.mkdir(tmp, { recursive: true })
  const inPath = path.join(tmp, `input.${opt.from}`)
  const outPath = path.join(tmp, `output.${opt.to}`)
  await fs.writeFile(inPath, input)

  let cmd = ''
  let args: string[] = []
  if (opt.tool === 'libreoffice') {
    // DOCX → PDF
    cmd = 'soffice'
    args = ['--headless', '--convert-to', 'pdf', '--outdir', tmp, inPath]
  } else {
    // EPS/AI → SVG/PNG（优先使用 inkscape）
    cmd = 'inkscape'
    const typeArg = opt.to === 'png' ? 'png' : 'svg'
    args = [inPath, `--export-type=${typeArg}`, `--export-filename=${outPath}`]
  }

  const proc = spawn(cmd, args, { stdio: 'ignore' })
  const exited: number = await new Promise((resolve) => {
    const t = setTimeout(() => { try { proc.kill('SIGKILL') } catch {} ; resolve(-1) }, 30_000)
    proc.on('exit', (code) => { clearTimeout(t); resolve(code ?? -1) })
    proc.on('error', () => { clearTimeout(t); resolve(-1) })
  })

  // 组装输出路径（libreoffice 会在同目录生成 output.pdf；inkscape 指定 outPath）
  const guessed = opt.tool === 'libreoffice' ? path.join(tmp, path.parse(inPath).name + '.pdf') : outPath

  // 如果主路径不存在或进程非 0，尝试回退管线
  async function fallbackPipeline(): Promise<ExternalConvertResult> {
    if (opt.from === 'eps' || opt.from === 'ai') {
      if (opt.to === 'svg') {
        // Ghostscript: EPS/AI → PDF，再用 pdf2svg → SVG
        const gsArgs = ['-dSAFER', '-dBATCH', '-dNOPAUSE', '-sDEVICE=pdfwrite', `-sOutputFile=${path.join(tmp, 'out.pdf')}`, inPath]
        const gsProc = spawn('gs', gsArgs, { stdio: 'ignore' })
        const gsExit: number = await new Promise((resolve) => {
          gsProc.on('exit', (code) => resolve(code ?? -1))
          gsProc.on('error', () => resolve(-1))
        })
        if (gsExit !== 0) throw new Error('Ghostscript 转换 PDF 失败')
        const pdfPath = path.join(tmp, 'out.pdf')
        const svgPath = path.join(tmp, 'output.svg')
        const pdf2svgProc = spawn('pdf2svg', [pdfPath, svgPath], { stdio: 'ignore' })
        const p2Exit: number = await new Promise((resolve) => {
          pdf2svgProc.on('exit', (code) => resolve(code ?? -1))
          pdf2svgProc.on('error', () => resolve(-1))
        })
        if (p2Exit !== 0) throw new Error('pdf2svg 生成 SVG 失败')
        const data = await fs.readFile(svgPath)
        try { await fs.rm(tmp, { recursive: true, force: true }) } catch {}
        return { mime: guessMime('svg'), data, meta: { durationMs: Date.now() - start } }
      }
      if (opt.to === 'png') {
        // ImageMagick: 直接栅格化为 PNG
        const magickArgs = ['-density', '300', inPath, '-background', 'white', '-alpha', 'remove', '-alpha', 'off', outPath]
        const magickProc = spawn('magick', magickArgs, { stdio: 'ignore' })
        const mgExit: number = await new Promise((resolve) => {
          magickProc.on('exit', (code) => resolve(code ?? -1))
          magickProc.on('error', () => resolve(-1))
        })
        if (mgExit !== 0) throw new Error('ImageMagick 生成 PNG 失败')
        const data = await fs.readFile(outPath)
        try { await fs.rm(tmp, { recursive: true, force: true }) } catch {}
        return { mime: guessMime('png'), data, meta: { durationMs: Date.now() - start } }
      }
    }
    throw new Error(`${opt.tool} 转换失败或输出缺失，且无可用回退管线`)
  }

  if (opt.tool === 'libreoffice') {
    if (exited !== 0) throw new Error(`${opt.tool} 转换失败或超时`)
    const data = await fs.readFile(guessed)
    try { await fs.rm(tmp, { recursive: true, force: true }) } catch {}
    return { mime: guessMime(opt.to), data, meta: { durationMs: Date.now() - start } }
  }

  // inkscape 路线：优先读取输出，不存在则尝试回退
  try {
    if (exited !== 0) return await fallbackPipeline()
    const data = await fs.readFile(guessed)
    try { await fs.rm(tmp, { recursive: true, force: true }) } catch {}
    return { mime: guessMime(opt.to), data, meta: { durationMs: Date.now() - start } }
  } catch (e) {
    // 输出不存在或读取失败 → 回退
    return await fallbackPipeline()
  }
}
