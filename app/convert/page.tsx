"use client";

/**
 * @file 图片转换前端页面
 * @description 简易上传与目标格式选择，调用 /api/convert/image 完成转换并预览
 * @module app/convert/page
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

import { Download } from "lucide-react";
import React, { useMemo, useState } from "react";

import { environmentConfig } from "../../config/environment";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const formats = environmentConfig.image.allowedOutputFormats;

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [to, setTo] = useState<(typeof formats)[number]>("png");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [previewMime, setPreviewMime] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  const maxMb = useMemo(
    () => Math.floor(environmentConfig.api.maxUploadSize / 1024 / 1024),
    []
  );

  const baseName = (name?: string) => {
    if (!name) return "converted";
    const i = name.lastIndexOf(".");
    return i > 0 ? name.slice(0, i) : name;
  };

  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const f = e.target.files?.[0] ?? null;
    setError(null);
    setPreviewUrl(null);
    setBlobUrl(null);
    setFile(f);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    setError(null);
    setPreviewUrl(null);
    setBlobUrl(null);
    setFile(f);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const onConvert = async () => {
    if (!file) {
      setError("请先选择文件");
      toast({ title: "提示", description: "请先选择文件", duration: 3000 });
      return;
    }
    if (file.size > environmentConfig.api.maxUploadSize) {
      setError(`文件大小超过限制 ${maxMb}MB`);
      toast({
        title: "大小超限",
        description: `最大 ${maxMb}MB`,
        duration: 3000,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setError(null);
    setPreviewUrl(null);
    setBlobUrl(null);
    setProgress(10);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("to", to);

      setProgress(30);
      const res = await fetch("/api/convert/image", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message ?? `转换失败(${res.status})`);
      }

      const contentType = res.headers.get("Content-Type") || "";
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
      const serverName = match ? decodeURIComponent(match[1] || match[2]) : null;
      const xFileName = res.headers.get("X-File-Name");
      setProgress(70);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setBlobUrl(url);
      setPreviewMime(contentType || null);
      const fallbackName = `${baseName(file?.name)}.${to}`;
      setPreviewName(serverName || xFileName || fallbackName);
      setProgress(100);
      toast({ title: "转换成功", description: `已生成 ${to} 格式`, duration: 3000 });
    } catch (err: any) {
      setError(err?.message ?? String(err));
      toast({
        title: "转换失败",
        description: err?.message ?? String(err),
        duration: 4000,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">图片格式转换</h1>
      <p className="text-sm text-muted-foreground">
        支持输出: {formats.join(", ")}，最大上传 {maxMb}MB。
      </p>

      <div className="space-y-4">
        <div
          className="w-full rounded border border-dashed p-6 text-center"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <p className="text-sm mb-3">拖拽图片到此处，或下方选择文件</p>
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="w-full rounded border p-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm">目标格式</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value as (typeof formats)[number])}
            className="rounded border px-2 py-1"
          >
            {formats.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <Button size="lg" onClick={onConvert} disabled={loading}>
            {loading ? "转换中..." : "开始转换"}
          </Button>
        </div>

        {loading && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">进度</p>
            <Progress value={progress} />
          </div>
        )}

        {error && (
          <div className="rounded border border-red-300 bg-red-50 p-2 text-red-700">
            {error}
          </div>
        )}

        {previewUrl && (
          <div className="space-y-2">
            <p className="text-sm">转换结果预览：</p>
            <img src={previewUrl} alt="预览" className="max-h-96 rounded border" />
            <div className="flex gap-3">
              {blobUrl && (
                <a
                  href={blobUrl}
                  download={previewName ?? `${baseName(file?.name)}.${to}`}
                  className="inline-flex items-center gap-2 rounded border px-3 py-2"
                >
                  <Download className="w-4 h-4" /> 下载结果
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
