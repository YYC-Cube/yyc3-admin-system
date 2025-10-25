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

    // 返回处理后的图片
    return new NextResponse(processedImage.data, {
      headers: {
        "Content-Type": `image/${processedImage.format}`,
        "X-Image-Width": processedImage.width.toString(),
        "X-Image-Height": processedImage.height.toString(),
        "X-Image-Size": processedImage.size.toString(),
        "X-Processed-At": "edge",
      },
    })
  } catch (error) {
    console.error("[Edge Image] 处理失败:", error)
    return NextResponse.json({ error: "图片处理失败" }, { status: 500 })
  }
}
