"use client";
/* eslint-env browser */

/**
 * @file 文档转换页面 (DOCX → PDF)
 * @author YYC
 */

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useTaskPolling } from "@/hooks/useTaskPolling";
import { DocTarget } from "@/lib/convert/types";

export default function DocConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [to, _setTo] = useState<DocTarget>("pdf");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [_previewMime, setPreviewMime] = useState<string | null>(null);
  const { toast } = useToast();
  const { isPolling, progress: queueProgress, message: queueMessage, start: startPolling, cancel: cancelPolling } = useTaskPolling();

  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreviewUrl(null);
  };

  const onConvert = async () => {
    if (!file) {
      toast({ title: "提示", description: "请先选择 DOCX 文件" });
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("to", "pdf");
    const res = await fetch("/api/convert/doc", { method: "POST", body: fd });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast({ title: "转换失败", description: j?.message ?? `错误(${res.status})`, variant: "destructive" });
      return;
    }
    const contentType = res.headers.get("Content-Type") || "application/pdf";
    const disposition = res.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
    const serverName = match ? decodeURIComponent(match[1] || match[2]) : null;
    const xFileName = res.headers.get("X-File-Name");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setPreviewMime(contentType);
    const fallbackName = (file?.name?.replace(/\.[^.]+$/, "") || "converted") + ".pdf";
    const finalName = serverName || xFileName || fallbackName;
    setPreviewName(finalName);
    toast({ title: "转换成功", description: "已生成 PDF" });
  };

  const onConvertWithQueue = async () => {
    if (!file) {
      toast({ title: "提示", description: "请先选择 DOC/DOCX 文件" });
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("to", to);
    fd.append("category", "doc");
    const create = await fetch("/api/tasks", { method: "POST", body: fd });
    if (!create.ok) {
      const j = await create.json().catch(() => ({}));
      toast({ title: "任务创建失败", description: j?.message ?? `错误(${create.status})`, variant: "destructive" });
      return;
    }
    const { taskId } = await create.json();
    startPolling(taskId, async (prog) => {
      if (prog.status === "done") {
        try {
          if (prog.fileUrl) {
            const r = await fetch(prog.fileUrl);
            const blob = await r.blob();
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
          } else {
            const url = `data:application/pdf;base64,` + (prog.dataBase64 ?? "");
            setPreviewUrl(url);
          }
          if (prog.mime) setPreviewMime(prog.mime);
          const baseName = file?.name?.replace(/\.[^.]+$/, "") || "converted";
          setPreviewName(prog.fileName || `${baseName}.pdf`);
          toast({ title: "转换成功", description: "队列已完成" });
        } catch {
          toast({ title: "预览生成失败", description: "下载或生成预览出错", variant: "destructive" });
        }
      } else if (prog.status === "error") {
        toast({ title: "转换失败", description: prog.message ?? "", variant: "destructive" });
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">文档格式转换（DOCX → PDF）</h1>
      <div className="space-y-4">
        <input type="file" accept=".doc,.docx" onChange={onSelectFile} className="w-full rounded border p-2" />
        <div className="flex items-center gap-3">
          <Button size="lg" onClick={onConvert}>开始转换</Button>
          <Button size="lg" variant="secondary" onClick={onConvertWithQueue}>队列转换(含进度)</Button>
          <Button size="lg" variant="outline" disabled={!isPolling} onClick={() => {
            cancelPolling();
            toast({ title: "已取消", description: "已停止队列查询" });
          }}>取消轮询</Button>

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
            <p className="text-sm">转换结果（PDF）预览：</p>
            <iframe src={previewUrl} className="w-full h-96 rounded border" />
            <a href={previewUrl} download={previewName ?? ((file?.name ?? "converted") + ".pdf")} className="underline">下载 PDF</a>
          </div>
        )}
      </div>
    </div>
  );
}
