/**
 * @file 图片转换测试
 * @description 使用极小 SVG 作为输入，验证 PNG 输出成功
 * @author YYC
 * @created 2025-10-31
 */

import { describe, it, expect } from "vitest";

import { convertImage } from "./image";

const tinySvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="red"/></svg>`
);

describe("convertImage", () => {
  it("should convert svg buffer to png", async () => {
    const res = await convertImage(tinySvg, "png");
    expect(res.mime).toBe("image/png");
    expect(res.data.length).toBeGreaterThan(0);
    expect((res.meta?.width ?? 0) > 0).toBe(true);
    expect((res.meta?.height ?? 0) > 0).toBe(true);
  });
});
