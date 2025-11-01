# 📦 通用格式转换能力规划（可行性分析与落地路线）

> 目标：在现有 Next.js + Node.js 项目基础上，分阶段引入「图片、文档、电子书、矢量」等格式的转换能力，确保性能、稳定性与安全性。

---

## 1. 范围与优先级

- 图片（MVP 优先）：`PNG` ↔ `JPEG` ↔ `WEBP`、`SVG → PNG`、`AVIF/HEIF`（后续）
- 文档（阶段二）：`DOCX → PDF`、`PDF → PNG/文本`、`RTF/ODT → PDF`
- 电子书（阶段三）：`EPUB → MOBI/AZW3`、`FB2 → EPUB`（需外部 CLI）
- 矢量（阶段二）：`SVG ↔ PDF`、`EPS/AI → SVG/PNG`（部分需外部工具）

说明：MVP 以「用户量高、依赖小、易部署」为原则，先完成图片与部分文档转换。🌹

---

## 2. 可行性评估（技术与依赖）

### 2.1 图片

- 可用库：`sharp`（Node 图像处理，支持 PNG/JPEG/WEBP/AVIF）、`resvg`（SVG 渲染）
- 约束：`HEIC/HEIF` 需 `libvips` 编译支持；统一服务端渲染。
- 结论：服务端 Node 运行时可落地，MVP可行。

### 2.2 文档

- 需外部：`LibreOffice`（headless：`soffice`）做通用 Office → PDF。
- 结论：基础路径（DOCX → PDF）可行。

### 2.3 电子书

- 可用工具：`Calibre` CLI（`ebook-convert`）。
- 结论：阶段三引入。

### 2.4 矢量

- 需外部：`ghostscript`/`inkscape`、`pdf2svg`、`ImageMagick`。
- 结论：`SVG ↔ PNG/PDF` 可行；复杂格式依赖外部工具。

---

## 3. 架构设计（与健康度规范对齐）

- API 路由：Next.js App Router，`app/api/convert/[category]/route.ts`（`category`: `image|doc|ebook|vector`）
- 运行时：`runtime: 'nodejs'`
- 队列/限流：令牌桶 + 资源锁；后续可接入 Redis。
- 健康监控：集成运行时与应用健康指标（内存、事件循环、API 响应）。

---

## 4. API 设计

### 4.1 请求

```json
POST /api/convert/image
{
  "from": "png",
  "to": "webp",
  "options": { "quality": 85 },
  "payload": "base64字符串 或 multipart/form-data"
}
```

### 4.2 响应

```json
200 OK
{
  "mime": "image/webp",
  "data": "base64字符串",
  "meta": { "size": 12345, "durationMs": 127 }
}
```

### 4.3 统一错误（与 `ErrorHandler` 对齐）

```json
503
{ "error": "ToolUnavailable", "message": "<工具名> 不可用" }
```

> 注：工具缺失统一为 `503`，早期部分测试写作 `501`，需同步调整 e2e 期望。🌹

---

## 5. 依赖与安装

- 图片：`pnpm add sharp @resvg/resvg-js`
- 文档：`LibreOffice`（brew cask）
- 矢量：`ghostscript`、`inkscape`、`pdf2svg`、`ImageMagick`

---

## 6. 安全与合规

- 大文件限制：`maxFileSize`（默认 10MB，可配置 `config/environment.ts`）
- MIME 校验：白名单；拒绝可执行内容（宏、脚本）。
- 沙箱与隔离：外部工具采用容器化或独立服务。

---

## 7. 性能与缓存

- 流式处理与缓存：按 `sha256(file)+from+to+options` 缓存。
- 并发控制：请求级队列与资源锁，防止过载。

---

## 8. 健康监控与稳定性

- 运行时健康：内存、CPU、事件循环滞后；异常触发告警与降级。
- API 健康：响应时间、错误率与吞吐监控。

---

## 9. UI 接入（示意）

- 上传组件、目标格式选择器、转换结果展示（下载/预览/日志）。

---

## 10. 数据结构（TypeScript）

```ts
interface ConvertRequest<T extends Record<string, unknown> = {}> {
  category: 'image' | 'doc' | 'ebook' | 'vector';
  from: string;
  to: string;
  options?: T;
  fileBase64?: string;
}

interface ConvertResponse {
  mime: string;
  dataBase64: string;
  meta: { size: number; durationMs: number };
}
```

---

## 11. 测试规划

- 单元：转换入口、白名单、错误路径（超限、非法 MIME）。
- 集成：端到端上传 → 转换 → 下载；对比输出哈希或像素差。
- e2e：统一断言工具缺失返回 `503` 与 `ToolUnavailable`。

---

## 12. 里程碑

- Milestone 1：图片转换（2 周）
- Milestone 2：文档与矢量（3–4 周）
- Milestone 3：电子书（2–3 周）

---

## 13. 风险与应对

- 依赖体积与复杂度：外部工具独立服务化。
- 资源过载：并发控制与降级；健康分过低时关闭非核心格式。

---

## 14. 运维与告警

- 告警渠道：错误率升高、事件循环滞后、内存峰值越界 → Slack/邮件告警。
- 监控面板：展示健康分、错误类型与耗时分布。

---

## 15. 立即行动（Next Steps）

- 调整 e2e 期望为 `503 ToolUnavailable` 并补充最小转换用例（EPS→SVG、AI→PNG、DOCX→PDF）。
- 在 CI 中加入工具可用性检查 `inkscape/soffice/gs/pdf2svg/magick --version`。

> 建议先以「图片 + DOCX→PDF」组成最小闭环，在真实数据下跑通性能与监控，再按里程碑逐步拓展格式，降低一次性复杂度与依赖风险。🌹
