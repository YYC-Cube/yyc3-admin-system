import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

// 信令消息类型
type SignalingMessage =
  | { type: "create-room"; roomId: string; config: any }
  | { type: "join-room"; roomId: string; userId: string; offer: RTCSessionDescriptionInit }
  | { type: "leave-room"; roomId: string; userId: string }
  | { type: "ice-candidate"; roomId: string; userId: string; candidate: RTCIceCandidateInit }
  | { type: "answer"; roomId: string; userId: string; answer: RTCSessionDescriptionInit }

/**
 * 信令服务器API
 * 处理WebRTC信令交换
 */
export async function POST(request: NextRequest) {
  try {
    const message: SignalingMessage = await request.json()

    console.log("[v0] 收到信令消息:", message.type)

    // 根据消息类型处理
    switch (message.type) {
      case "create-room":
        return handleCreateRoom(message)

      case "join-room":
        return handleJoinRoom(message)

      case "leave-room":
        return handleLeaveRoom(message)

      case "ice-candidate":
        return handleIceCandidate(message)

      case "answer":
        return handleAnswer(message)

      default:
        return NextResponse.json({ error: "未知的消息类型" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] 信令处理错误:", error)
    return NextResponse.json({ error: "信令处理失败" }, { status: 500 })
  }
}

/**
 * 处理创建房间
 */
function handleCreateRoom(message: Extract<SignalingMessage, { type: "create-room" }>) {
  // 实际实现需要存储房间信息到Redis或数据库
  console.log("[v0] 创建房间:", message.roomId)

  return NextResponse.json({
    success: true,
    roomId: message.roomId,
  })
}

/**
 * 处理加入房间
 */
function handleJoinRoom(message: Extract<SignalingMessage, { type: "join-room" }>) {
  // 实际实现需要:
  // 1. 验证房间是否存在
  // 2. 检查房间人数限制
  // 3. 将offer转发给房间内其他参与者
  // 4. 返回answer给加入者
  console.log("[v0] 加入房间:", message.roomId, message.userId)

  return NextResponse.json({
    success: true,
    answer: {
      type: "answer",
      sdp: "mock-sdp-answer",
    },
  })
}

/**
 * 处理离开房间
 */
function handleLeaveRoom(message: Extract<SignalingMessage, { type: "leave-room" }>) {
  // 实际实现需要通知房间内其他参与者
  console.log("[v0] 离开房间:", message.roomId, message.userId)

  return NextResponse.json({
    success: true,
  })
}

/**
 * 处理ICE候选
 */
function handleIceCandidate(message: Extract<SignalingMessage, { type: "ice-candidate" }>) {
  // 实际实现需要将ICE候选转发给对应的peer
  console.log("[v0] ICE候选:", message.roomId, message.userId)

  return NextResponse.json({
    success: true,
  })
}

/**
 * 处理Answer
 */
function handleAnswer(message: Extract<SignalingMessage, { type: "answer" }>) {
  // 实际实现需要将answer转发给对应的peer
  console.log("[v0] Answer:", message.roomId, message.userId)

  return NextResponse.json({
    success: true,
  })
}
