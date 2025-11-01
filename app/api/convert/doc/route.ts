/**
 * @file 文档转换 API 路由 (DOCX → PDF)
 * @module api/convert/doc
 * @author YYC
 */

import { NextRequest, NextResponse } from "next/server";

import { environmentConfig } from "../../../../config/environment";
import { convertWithExternalTool, isToolAvailable } from "../../../../lib/convert/external";
import { HealthMonitor } from "../../../../lib/monitoring/healthMonitor";
import { checkRateLimit, acquire, release } from "../../../../lib/rateLimiter";

export const runtime = "nodejs";

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "RateLimitExceeded", message: "请求过于频繁" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(environmentConfig.api.rateLimit.windowMs / 1000)) } }
    );
  }

  const span = HealthMonitor.getInstance().startApiSpan("convert/doc");
  const acquired = acquire(ip);

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "BadRequest", message: "必须上传文件" }, { status: 400 });
    if (file.size > environmentConfig.api.maxUploadSize) return NextResponse.json({ error: "PayloadTooLarge", message: `文件大小超过 ${Math.floor(environmentConfig.api.maxUploadSize / 1024 / 1024)}MB` }, { status: 413 });
    const name = file.name || "converted.docx";
    const input = Buffer.from(await file.arrayBuffer());
    // 工具可用性预检：未安装则统一返回 503 ToolUnavailable
    const ok = await isToolAvailable("libreoffice");
    if (!ok) {
      span.end(false);
      return NextResponse.json(
        { error: "ToolUnavailable", message: "LibreOffice 未安装或不可用", tool: "libreoffice" },
        { status: 503 }
      );
    }
    const result = await convertWithExternalTool(input, { tool: "libreoffice", from: "docx", to: "pdf" });

    span.end(true);
    // 统一设置 Content-Disposition，确保各浏览器解析一致
    const outName = name.replace(/\.docx$/i, ".pdf");
    const asciiName = outName.replace(/[^\x20-\x7E]/g, "_");
    const encodedName = encodeURIComponent(outName);
    const contentDisposition = `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`;
    return new Response(new Uint8Array(result.data), {
      headers: { "Content-Type": result.mime, "Content-Length": String(result.data.length), "Content-Disposition": contentDisposition, "X-File-Name": outName },
    });
  } catch (error: any) {
    span.end(false);
    return NextResponse.json({ error: "ConvertFailed", message: error?.message ?? String(error) }, { status: 400 });
  } finally {
    if (acquired) release(ip);
  }
}
