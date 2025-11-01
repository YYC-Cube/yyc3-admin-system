/**
 * @file API 请求预检工具
 * @description 校验上传大小与目标格式白名单，便于测试与复用
 * @module lib/api/preCheck
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

import { environmentConfig, ImageOutputFormat } from "../../config/environment";

export function validateImageRequest(fileSize: number, to: string) {
  if (fileSize > environmentConfig.api.maxUploadSize) {
    throw new Error(
      `文件过大: ${(fileSize / 1024 / 1024).toFixed(2)}MB，限制 ${(
        environmentConfig.api.maxUploadSize / 1024 / 1024
      ).toFixed(0)}MB`
    );
  }
  const allowed = environmentConfig.image.allowedOutputFormats;
  if (!allowed.includes(String(to) as ImageOutputFormat)) {
    throw new Error(`不支持的输出格式: ${to}，允许 ${allowed.join(", ")}`);
  }
}
