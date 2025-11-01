/**
 * @file 任务创建 API
 * @description 创建转换任务并返回 taskId（含限流与并发保护）
 * @module api/tasks
 * @author YYC
 */

import { NextRequest, NextResponse } from "next/server";

import { environmentConfig } from "../../../config/environment";
import { HealthMonitor } from "../../../lib/monitoring/healthMonitor";
import { GlobalTaskQueue } from "../../../lib/queue/taskQueue";
import { TaskCategory } from "../../../lib/queue/taskTypes";
import { checkRateLimit, acquire, release } from "../../../lib/rateLimiter";

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
  if (!rate.allowed) return NextResponse.json({ error: "RateLimited" }, { status: 429 });
  if (!acquire(ip)) return NextResponse.json({ error: "Busy" }, { status: 503 });

  const span = HealthMonitor.getInstance().startApiSpan("tasks/create");

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const to = (form.get("to") as string | null) ?? "png";
    const category = (form.get("category") as TaskCategory | null) ?? "image";

    if (!file) throw new Error("缺少文件: 需包含 field 'file'");
    if (file.size > environmentConfig.api.maxUploadSize) {
      span.end(false);
      return NextResponse.json({ error: "PayloadTooLarge" }, { status: 413 });
    }

    const name = file.name ?? "input";
    const buf = Buffer.from(await file.arrayBuffer());
    const id = GlobalTaskQueue.enqueue({ category, from: null, to, fileBuffer: buf, fileName: name });

    span.end(true);
    return NextResponse.json({ taskId: id }, { status: 200 });
  } catch (error: any) {
    span.end(false);
    return NextResponse.json({ error: "TaskCreateFailed", message: error?.message ?? String(error) }, { status: 400 });
  } finally {
    release(ip);
  }
}
