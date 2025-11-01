# Easy Table Converter

![Top Banner](public/yyc3-brand-logo.png)

[![Next.js](https://img.shields.io/badge/Next.js-15.2-000?logo=next.js&logoColor=white)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?logo=tailwindcss)](https://tailwindcss.com/) [![pnpm](https://img.shields.io/badge/pnpm-8-FFDC00?logo=pnpm&label=pnpm)](https://pnpm.io/) [![Playwright](https://img.shields.io/badge/E2E-Playwright-45BA4F?logo=playwright)](https://playwright.dev/)

<!-- CI 状态徽章：替换 OWNER/REPO 为真实仓库路径后启用 -->

[![E2E CI](https://github.com/OWNER/REPO/actions/workflows/e2e.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/e2e.yml)

一个用于文档、图片、矢量三类文件格式转换的现代化 Web 应用。支持上传、实时进度、结果预览，并统一输出文件名策略，最大程度减少不同浏览器的解析差异。

---

## 端到端演示

> 将 Demo GIF 放置到 `public/demo.gif`，如下内嵌即可在 README 中直接展示：

![Demo](public/demo.gif)

> 如果需要，我可以帮你生成并录制该 GIF 文件（页面路径：`/convert/vector` 与 `/convert/doc`）。🌹

## 核心特性

- 矢量转换：`EPS/AI → SVG/PNG`，优先使用 `Inkscape`，当工具无法产出时自动回退到 `Ghostscript + pdf2svg（SVG）` 或 `ImageMagick（PNG）`
- 文档转换：`DOCX → PDF`，使用 `LibreOffice`（无头模式）稳定转换
- 健康监控：`/api/health` 返回运行时与应用指标并给出健康分（已集成 `HealthMonitor`）
- 统一下载名：服务端设置 `Content-Disposition` 与 `X-File-Name`，前端解析多头字段保障一致性
- 安全与限流：上传大小校验、速率限制、并发控制、错误统一处理（`ErrorHandler`）
- 前端体验：上传、目标格式选择、转换进度提示、预览与下载（页面 `app/convert/*`）

## 下载文件名与扩展策略

为减少浏览器与实现差异，前端解析响应头时采用统一优先级来确定下载/预览文件名与扩展名：

- 优先 `filename*`（RFC 5987 / RFC 6266）
- 其次 `filename`
- 再次 `X-File-Name`（项目自定义回退头）
- 若以上均缺失：`原始文件名基础名 + 目标扩展`

前端同时解析 `Content-Type` 作为预览 MIME 类型，保证预览组件正确渲染。
实现位置示例：`app/convert/vector/page.tsx`、`app/convert/doc/page.tsx`、`app/convert/page.tsx`。

## 快速开始

- 安装依赖：`pnpm install`
- 启动开发：`pnpm exec next dev -p 3015`
- 访问前端：`http://localhost:3015/convert`

外部工具（建议通过 Homebrew 安装）：

- 矢量：`brew install --cask inkscape`、`brew install ghostscript pdf2svg imagemagick`
- 文档：`brew install --cask libreoffice`

> 生产环境建议使用容器封装上述工具并提供受控的 PATH，以保证可用性与安全策略。🌹

## API 概览

- `POST /api/convert/vector`
  - 表单字段：`file`（.eps/.ai），`to`（svg|png）
  - 成功：`200`，`Content-Type: image/svg+xml | image/png`，并返回统一下载名头
  - 校验失败：`400/413`（参数或大小）
  - 工具缺失：`503 ToolUnavailable`（统一状态码，详见 docs）
- `POST /api/convert/doc`
  - 表单字段：`file`（.docx），输出固定为 `pdf`
  - 成功：`200`，`Content-Type: application/pdf`
  - 工具缺失：`503 ToolUnavailable`
- `GET /api/health`
  - 返回运行时与应用健康指标、健康分以及关键配置（已接入 `HealthMonitor`）

## 成功路径演示（样例）

- EPS → SVG：
  ```bash
  curl -i -X POST \
    -F "file=@e2e/samples/min.eps;type=application/postscript" \
    -F "to=svg" \
    http://localhost:3015/api/convert/vector
  # 期望：200，Content-Type: image/svg+xml，Content-Disposition 与 X-File-Name 指向 min.svg
  ```
- AI → PNG：
  ```bash
  curl -i -X POST \
    -F "file=@e2e/samples/min.ai;type=application/postscript" \
    -F "to=png" \
    http://localhost:3015/api/convert/vector
  # 期望：200，Content-Type: image/png，下载名与扩展正确
  ```

## 健康与错误

- 健康接口：`/api/health` 暴露 `memoryUsage/cpuUsage/eventLoop/apiHealth/database` 等指标与健康分
- 错误处理：统一使用 `lib/errorHandler.ts`，并预留外部监控系统告警对接
- 限流策略：`lib/rateLimiter.ts` 提供 IP 级速率限制与并发控制

## 页面入口

- 矢量转换页：`/convert/vector`
- 文档转换页：`/convert/doc`
- 通用入口：`/convert`

## 图片演示

- 品牌图：`public/yyc3-brand-logo.png`
- 标志：`public/yyc3-logo.svg`
- 预览占位：`public/placeholder.jpg` / `public/placeholder.svg`

![Logo](public/yyc3-logo.svg)

## 目录结构（简）

```
app/
  api/
    convert/vector
    convert/doc
    health
  convert/
    vector
    doc
config/environment.ts
lib/
  convert/*  # 外部工具适配与回退管线
  monitoring/healthMonitor.ts
  rateLimiter.ts
```

## 联系与支持

- Email：admin@0379.email
- 反馈：欢迎通过 Issue/PR 分享改进建议

---

建议在 CI 中集成对外部工具的可用性检查（`inkscape/soffice/gs/pdf2svg/magick --version`）与最小转换用例（EPS→SVG、AI→PNG、DOCX→PDF），并将状态徽章链接到仓库 Actions，提升稳定性与可观测性。🌹
