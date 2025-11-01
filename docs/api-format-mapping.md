# API 扩展名映射与下载策略

> 说明本项目直接转换 API 的文件扩展名与响应头策略，确保前后端行为一致。

## 输出扩展名规范

- 文档（DOCX → PDF）
  - 扩展名：`.pdf`
- 矢量（EPS/AI → SVG/PNG）
  - 扩展名：与 `to` 保持一致（`.svg` 或 `.png`）
- 图片（SVG/PNG/JPEG/… → PNG/JPEG/WebP/AVIF/TIFF/HEIF）
  - 扩展名根据响应 MIME 规范化：
    - `image/jpeg` → `.jpg`
    - `image/png` → `.png`
    - `image/webp` → `.webp`
    - `image/avif` → `.avif`
    - `image/tiff` → `.tif`（项目优选简写，与生态常用对齐）
    - `image/heif` → `.heif`

## 响应头约定

- `Content-Type`: 精确的 MIME 类型（如 `image/png`）
- `Content-Disposition`: 统一使用附件下载格式，兼容各浏览器
  - `attachment; filename="<ASCII安全名>"; filename*=UTF-8''<URL编码文件名>`
  - 说明：同时提供 `filename` 与 RFC 5987 的 `filename*`，避免非 ASCII 文件名解析差异
- `X-File-Name`: 显式返回服务端生成的输出文件名（含扩展名）
  - 用途：前端可强制使用该文件名，避免依赖不同浏览器对 `Content-Disposition` 的解析差异

## 统一错误状态码（工具缺失）

为保证前后端一致性与测试稳定，外部工具缺失场景统一返回：

- 状态码：`503 Service Unavailable`
- 错误结构：`{ "error": "ToolUnavailable", "message": "<工具名> 不可用" }`
- 适用范围：
  - 矢量路由：`Inkscape` 不可用时（EPS/AI → SVG/PNG）
  - 文档路由：`LibreOffice` 不可用时（DOCX → PDF）

> e2e 期望值：统一断言 `503` 与 `ToolUnavailable`，避免历史上存在的 `501` 预期差异。请在测试文件中同步更新。🌹

## 前端建议

- 直接转换：优先解析 `Content-Disposition` 的 `filename*`，失败则回退到 `filename`；如仍失败则使用 `X-File-Name`
- 队列完成：优先使用队列进度中的 `fileName` 与 `mime`；如返回临时 `fileUrl`，前端通过 `blob()` 生成 `ObjectURL` 预览

## 兼容性注意事项

- 非 ASCII 文件名将自动生成 ASCII 安全回退值（将不可打印字符替换为 `_`），同时保留 UTF-8 的原始文件名于 `filename*`
- 若浏览器不完全支持 RFC 5987，建议前端优先读取 `X-File-Name`

保持扩展与 MIME 一致、错误语义统一，可显著降低跨浏览器与跨环境差异并提升测试一致性。🌹
