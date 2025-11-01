/**
 * @file 矢量转换 API 路由 (EPS/AI → SVG/PNG)
 * @module api/convert/vector
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

  const span = HealthMonitor.getInstance().startApiSpan("convert/vector");
  const acquired = acquire(ip);

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const to = String(form.get("to") || "").toLowerCase();

    if (!file) return NextResponse.json({ error: "BadRequest", message: "必须上传文件" }, { status: 400 });
    if (!(to === "svg" || to === "png")) return NextResponse.json({ error: "BadRequest", message: "目标格式仅支持 svg/png" }, { status: 400 });
    if (file.size > environmentConfig.api.maxUploadSize) return NextResponse.json({ error: "PayloadTooLarge", message: `文件大小超过 ${Math.floor(environmentConfig.api.maxUploadSize / 1024 / 1024)}MB` }, { status: 413 });

    if (!(await isToolAvailable("inkscape"))) return NextResponse.json({ error: "ToolUnavailable", message: "Inkscape 不可用" }, { status: 503 });

    const name = file.name || "converted";
    const from = name.toLowerCase().endsWith(".ai") ? "ai" : name.toLowerCase().endsWith(".eps") ? "eps" : "unknown";
    if (from === "unknown") {
      return NextResponse.json({ error: "Unsupported", message: "仅支持 .eps 或 .ai 文件" }, { status: 400 });
    }

    const input = Buffer.from(await file.arrayBuffer());
    // 工具可用性预检：未安装则统一返回 503 ToolUnavailable
    const ok = await isToolAvailable("inkscape");
    if (!ok) {
      span.end(false);
      return NextResponse.json(
        { error: "ToolUnavailable", message: "Inkscape 未安装或不可用", tool: "inkscape" },
        { status: 503 }
      );
    }
    const result = await convertWithExternalTool(input, { tool: "inkscape", from, to });

    span.end(true);
    // 统一设置 Content-Disposition，确保各浏览器解析一致
    const ext = to.toLowerCase();
    const baseName = name.replace(/\.(eps|ai)$/i, "");
    const outName = `${baseName}.${ext}`;
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
