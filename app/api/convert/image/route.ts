/**
 * @file 图片转换 API 路由
 * @module api/convert/image
 * @author YYC
 */

import { NextRequest, NextResponse } from "next/server";

import { environmentConfig, ImageOutputFormat } from "../../../../config/environment";
import { validateImageRequest } from "../../../../lib/api/preCheck";
import { convertImage } from "../../../../lib/convert/image";
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
  const acquired = acquire(ip);

  const span = HealthMonitor.getInstance().startApiSpan("convert/image");
  const start = Date.now();

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const to = String(form.get("to") || "").toLowerCase();
    if (!file) return NextResponse.json({ error: "BadRequest", message: "必须上传文件" }, { status: 400 });
    try {
      validateImageRequest(file.size, to);
    } catch (err: any) {
      return NextResponse.json({ error: "BadRequest", message: err?.message ?? "请求参数错误" }, { status: 400 });
    }

    const name = file.name || "converted";
    const inName = name.replace(/\.[^.]+$/, "");
    const input = Buffer.from(await file.arrayBuffer());
    const result = await convertImage(input, to as ImageOutputFormat);

    span.end(true);
    const extByMime = (mime: string) => {
      switch (mime) {
        case "image/jpeg": return "jpg"; // 兼容性更好
        case "image/png": return "png";
        case "image/webp": return "webp";
        case "image/avif": return "avif";
        case "image/tiff": return "tif"; // 规范化为 .tif，更贴近生态常用
        case "image/heif": return "heif";
        default: return "bin"; // 回退：未知类型
      }
    };
    const ext = extByMime(result.mime);
    const hasExt = /\.[a-z0-9]+$/i.test(inName);
    const outName = hasExt ? inName.replace(/\.[a-z0-9]+$/i, `.${ext}`) : `${inName}.${ext}`;
    const asciiName = outName.replace(/[^\x20-\x7E]/g, "_");
    const encodedName = encodeURIComponent(outName);
    const contentDisposition = `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`;
    // 直接返回二进制响应，便于前端以 blob 预览
    return new Response(new Uint8Array(result.data), {
      headers: {
        "Content-Type": result.mime,
        "Content-Length": String(result.data.length),
        "X-Convert-Duration": String(result.meta?.durationMs ?? Date.now() - start),
        "X-Rate-Remaining": String(rate.remaining),
        "Content-Disposition": contentDisposition,
        "X-File-Name": outName,
      },
    });
  } catch (error: any) {
    span.end(false);
    // 统一错误响应
    return NextResponse.json(
      {
        error: "ConvertFailed",
        message: error?.message ?? "未知错误",
        detail: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 400 }
    );
  } finally {
    if (acquired) release(ip);
  }
}
