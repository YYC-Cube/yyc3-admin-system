/**
 * @file 外部工具适配器测试
 * @description 验证工具检测与缺失时的错误提示
 * @author YYC
 */

import { describe, it, expect } from "vitest";

import { isToolAvailable, convertWithExternalTool } from "./external";

const dummyDocx = Buffer.from("PK\x03\x04"); // 伪造的 zip 头（docx为zip结构），不用于真实转换

describe("external tools", () => {
  it("should detect libreoffice availability (likely false locally)", async () => {
    const ok = await isToolAvailable("libreoffice");
    expect(typeof ok).toBe("boolean");
  });

  it("should reject conversion when libreoffice missing", async () => {
    const ok = await isToolAvailable("libreoffice");
    if (!ok) {
      await expect(convertWithExternalTool(dummyDocx, { tool: "libreoffice", from: "docx", to: "pdf" })).rejects.toThrow(/未安装|不可用|失败/);
    } else {
      // 如果环境真的安装了，将不做断言转换内容，仅断言不抛出同步错误
      await expect(convertWithExternalTool(dummyDocx, { tool: "libreoffice", from: "docx", to: "pdf" })).resolves.toBeTruthy();
    }
  });
});
