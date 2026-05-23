import { type NextRequest, NextResponse } from "next/server"
import { edgeAIInference } from "@/lib/edge/ai-inference"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const { modelId, input } = await request.json()

    // 加载模型
    const model = await edgeAIInference.loadModel(modelId)

    // 执行推理
    const result = await edgeAIInference.inference(model, input)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
