import { type NextRequest, NextResponse } from "next/server"
import { edgeComputeFunction } from "@/lib/edge/compute-functions"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, transformations } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "缺少图片URL" }, { status: 400 })
    }

    // 在边缘节点处理图片
    const processedImage = await edgeComputeFunction.processImage(imageUrl, transformations || [])

    // 在Edge Runtime中处理二进制响应
    // 将Buffer数据转换为兼容格式并使用类型断言
    const headers = new Headers();
    headers.set("Content-Type", `image/${processedImage.format}`);
    headers.set("Content-Length", processedImage.data.byteLength.toString());
    headers.set("X-Image-Width", processedImage.width.toString());
    headers.set("X-Image-Height", processedImage.height.toString());
    headers.set("X-Image-Size", processedImage.size.toString());
    headers.set("X-Processed-At", "edge");
    headers.set("Cache-Control", "public, max-age=86400");
    
    // 使用Headers对象和类型断言处理二进制数据
    return new NextResponse(processedImage.data as unknown as BodyInit, { headers });
  } catch (error) {
    console.error("[Edge Image] 处理失败:", error)
    return NextResponse.json({ error: "图片处理失败" }, { status: 500 })
  }
}
