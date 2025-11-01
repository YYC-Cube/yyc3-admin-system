/**
 * @file 图片转换服务
 * @description 基于 sharp 的图片格式转换封装，提供统一错误与类型接口
 * @module lib/convert/image
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

import sharp from "sharp";

import type { ImageOutputFormat } from "../../config/environment";
import { HealthMonitor } from "../monitoring/healthMonitor";

export interface ImageConvertResult {
  mime: string;
  data: Buffer;
  meta?: {
    width?: number;
    height?: number;
    size?: number; // 字节数
    durationMs?: number;
  };
}

/**
 * @description 将输入 Buffer 转为指定图片格式
 * @param input - 原始图片二进制数据
 * @param to - 目标格式（png/jpeg/webp/avif/tiff/heif）
 * @returns 转换结果，包含 MIME 与二进制数据
 * @throws {Error} 当格式不支持或转换失败时抛出
 */
export async function convertImage(
  input: Buffer,
  to: ImageOutputFormat
): Promise<ImageConvertResult> {
  const span = HealthMonitor.getInstance().startApiSpan("convert/image");
  const start = Date.now();
  try {
    const image = sharp(input, { failOnError: true });

    let out: Buffer;
    let mime: string;

    switch (to) {
      case "png":
        out = await image.png({ compressionLevel: 9 }).toBuffer();
        mime = "image/png";
        break;
      case "jpeg":
        out = await image.jpeg({ quality: 85 }).toBuffer();
        mime = "image/jpeg";
        break;
      case "webp":
        out = await image.webp({ quality: 85 }).toBuffer();
        mime = "image/webp";
        break;
      case "avif":
        out = await image.avif({ quality: 60 }).toBuffer();
        mime = "image/avif";
        break;
      case "tiff":
        out = await image.tiff({ compression: "lzw" }).toBuffer();
        mime = "image/tiff";
        break;
      case "heif":
        // 注意：heif 需要 libvips 编译支持，对某些环境可能不可用
        out = await image.heif({ quality: 60 }).toBuffer();
        mime = "image/heif";
        break;
      default:
        throw new Error(`不支持的目标格式: ${to}`);
    }

    const meta = await sharp(out).metadata();
    const durationMs = Date.now() - start;

    // 性能异常告警：转换耗时过长
    if (durationMs > 2000) {
      HealthMonitor.getInstance().notify("图片转换耗时较长", { to, durationMs });
    }

    span.end(true);
    return {
      mime,
      data: out,
      meta: {
        width: meta.width,
        height: meta.height,
        size: out.length,
        durationMs,
      },
    };
  } catch (err) {
    span.end(false);
    throw err;
  }
}