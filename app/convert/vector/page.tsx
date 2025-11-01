"use client";

/**
 * @file 矢量转换页面 (EPS/AI → SVG/PNG)
 * @author YYC
 */

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useTaskPolling } from "@/hooks/useTaskPolling";
import { VectorTarget } from "@/lib/convert/types";

export default function VectorConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [to, setTo] = useState<VectorTarget>("svg");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [previewMime, setPreviewMime] = useState<string | null>(null);
  const { toast } = useToast();
  const { isPolling, progress: queueProgress, message: queueMessage, start: startPolling, cancel: cancelPolling } = useTaskPolling();

  const targets: VectorTarget[] = ["svg", "png"];
  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreviewUrl(null);
  };

  const onConvert = async () => {
    if (!file) {
      toast({ title: "提示", description: "请先选择 EPS/AI 文件" });
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("to", to);
    const res = await fetch("/api/convert/vector", { method: "POST", body: fd });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast({ title: "转换失败", description: j?.message ?? `错误(${res.status})`, variant: "destructive" });
      return;
    }
    const contentType = res.headers.get("Content-Type") || (to === "svg" ? "image/svg+xml" : "image/png");
    const disposition = res.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
    const serverName = match ? decodeURIComponent(match[1] || match[2]) : null;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setPreviewMime(contentType);
    const fallbackName = (file?.name?.replace(/\.[^.]+$/, "") || "converted") + "." + to;
    setPreviewName(serverName || fallbackName);
    toast({ title: "转换成功", description: `已生成 ${to.toUpperCase()}` });
  };

  const onConvertWithQueue = async () => {
    if (!file) {
      toast({ title: "提示", description: "请先选择 EPS/AI 文件" });
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("to", to);
    fd.append("category", "vector");
    const create = await fetch("/api/tasks", { method: "POST", body: fd });
    if (!create.ok) {
      const j = await create.json().catch(() => ({}));
      toast({ title: "任务创建失败", description: j?.message ?? `错误(${create.status})`, variant: "destructive" });
      return;
    }
    const { taskId } = await create.json();
    startPolling(taskId, async (prog) => {
      if (prog.status === "done") {
        const mime = to === "svg" ? "image/svg+xml" : "image/png";
        const url = `data:${mime};base64,` + (prog.dataBase64 ?? "");
        setPreviewUrl(url);
        if (prog.mime) setPreviewMime(prog.mime);
        const baseName = file?.name?.replace(/\.[^.]+$/, "") || "converted";
        const ext = (prog.mime?.includes("svg")) ? "svg" : (prog.mime?.includes("png")) ? "png" : to;
        setPreviewName(prog.fileName || `${baseName}.${ext}`);
        toast({ title: "转换成功", description: "队列已完成" });
      } else if (prog.status === "error") {
        toast({ title: "转换失败", description: prog.message ?? "", variant: "destructive" });
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">矢量格式转换（EPS/AI → SVG/PNG）</h1>
      <div className="space-y-4">
        <input type="file" accept=".eps,.ai" onChange={onSelectFile} className="w-full rounded border p-2" />
        <div className="flex items-center gap-3">
          <label className="text-sm">目标格式</label>
          <select value={to} onChange={(e) => setTo(e.target.value as VectorTarget)} className="rounded border px-2 py-1">
            {targets.map((t: VectorTarget) => (
               <option key={t} value={t}>{t}</option>
             ))}
           </select>
          <Button size="lg" onClick={onConvert}>开始转换</Button>
          <Button size="lg" variant="secondary" onClick={onConvertWithQueue}>队列转换(含进度)</Button>
          <Button size="lg" variant="outline" disabled={!isPolling} onClick={() => { cancelPolling(); toast({ title: "已取消", description: "已停止队列查询" }); }}>取消轮询</Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">队列进度</span>
            <span className="text-sm">{queueProgress}%</span>
          </div>
          <Progress value={queueProgress} />
          {queueMessage && <p className="text-sm text-muted-foreground">{queueMessage}</p>}
        </div>
        {previewUrl && (
          <div className="space-y-2">
            <p className="text-sm">转换结果预览：</p>
            {to === "svg" ? (
              <iframe src={previewUrl} className="w-full h-96 rounded border" />
            ) : (
              <img src={previewUrl} alt="预览" className="max-h-96 rounded border" />
            )}
            <a href={previewUrl} download={previewName ?? ((file?.name ?? "converted") + "." + to)} className="underline">下载结果</a>
          </div>
        )}
      </div>
    </div>
  );
}
