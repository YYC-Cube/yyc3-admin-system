/**
 * @file API 预检测试
 * @description 覆盖大文件与非法格式的异常路径
 * @author YYC
 * @created 2025-10-31
 */

import { describe, it, expect } from "vitest";

import { environmentConfig } from "../../config/environment";

import { validateImageRequest } from "./preCheck";

describe("validateImageRequest", () => {
  it("should throw on oversized file", () => {
    const big = environmentConfig.api.maxUploadSize + 1;
    expect(() => validateImageRequest(big, "png")).toThrow(/文件过大/);
  });

  it("should throw on unsupported format", () => {
    const ok = environmentConfig.api.maxUploadSize - 100;
    expect(() => validateImageRequest(ok, "bmp")).toThrow(/不支持的输出格式/);
  });

  it("should pass on valid size and format", () => {
    const ok = environmentConfig.api.maxUploadSize - 100;
    expect(() => validateImageRequest(ok, "png")).not.toThrow();
  });
});
