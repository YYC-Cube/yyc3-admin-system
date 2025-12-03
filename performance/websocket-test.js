/**
 * K6 WebSocket连接测试
 * Phase 5.2 - 性能与压力测试
 *
 * 测试目标: 验证WebSocket实时通信性能
 */

import ws from 'k6/ws'
import { check } from 'k6'
import { Rate, Trend, Counter } from 'k6/metrics'

// 自定义指标
const wsConnectionSuccess = new Rate('ws_connection_success')
const wsMessageSent = new Counter('ws_messages_sent')
const wsMessageReceived = new Counter('ws_messages_received')
const wsLatency = new Trend('ws_latency')
const wsConnectionDuration = new Trend('ws_connection_duration')

// 测试配置
export const options = {
  stages: [
    { duration: '30s', target: 100 }, // 100个WebSocket连接
    { duration: '2m', target: 500 }, // 增长到500个连接
    { duration: '1m', target: 1000 }, // 峰值1000个连接
    { duration: '1m', target: 100 }, // 降回100
    { duration: '30s', target: 0 }, // 关闭连接
  ],
  thresholds: {
    ws_connection_success: ['rate>0.95'],
    ws_latency: ['p(95)<100'], // 95%消息延迟 < 100ms
    ws_connection_duration: ['p(95)<500'], // 95%连接建立 < 500ms
  },
}

const WS_URL = __ENV.WS_URL || 'ws://localhost:3000/ws'
const token = __ENV.API_TOKEN || ''

export default function () {
  const url = `${WS_URL}?token=${token}`
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const connectStart = Date.now()

  const res = ws.connect(url, params, function (socket) {
    const connectDuration = Date.now() - connectStart
    wsConnectionDuration.add(connectDuration)

    socket.on('open', () => {
      wsConnectionSuccess.add(1)

      // 发送心跳消息
      socket.setInterval(() => {
        const sendTime = Date.now()
        socket.send(
          JSON.stringify({
            type: 'ping',
            timestamp: sendTime,
          })
        )
        wsMessageSent.add(1)
      }, 5000)

      // 发送业务消息
      socket.setInterval(() => {
        const sendTime = Date.now()
        socket.send(
          JSON.stringify({
            type: 'order_status_subscribe',
            orderId: `ord-${Math.floor(Math.random() * 10000)}`,
            timestamp: sendTime,
          })
        )
        wsMessageSent.add(1)
      }, 10000)
    })

    socket.on('message', data => {
      wsMessageReceived.add(1)

      try {
        const message = JSON.parse(data)

        // 计算延迟
        if (message.timestamp) {
          const latency = Date.now() - message.timestamp
          wsLatency.add(latency)
        }

        check(message, {
          'message has type': m => m.type !== undefined,
          'pong response': m => (m.type === 'pong' ? true : m.type !== 'ping'),
        })
      } catch (e) {
        console.error('Failed to parse message:', e)
      }
    })

    socket.on('error', e => {
      console.error('WebSocket error:', e)
    })

    socket.on('close', () => {
      console.log('WebSocket closed')
    })

    // 保持连接60秒
    socket.setTimeout(() => {
      socket.close()
    }, 60000)
  })

  check(res, {
    'ws connection established': r => r && r.status === 101,
  }) || wsConnectionSuccess.add(0)
}

export function handleSummary(data) {
  const metrics = data.metrics

  console.log('\nWebSocket连接测试结果')
  console.log('='.repeat(50))

  console.log('\n连接统计:')
  console.log(`  连接尝试: ${metrics.ws_connecting?.values?.count || 0}`)
  console.log(
    `  连接成功率: ${((metrics.ws_connection_success?.values?.rate || 0) * 100).toFixed(2)}%`
  )
  console.log(`  平均连接时长: ${(metrics.ws_connection_duration?.values?.avg || 0).toFixed(2)}ms`)

  console.log('\n消息统计:')
  console.log(`  发送消息数: ${metrics.ws_messages_sent?.values?.count || 0}`)
  console.log(`  接收消息数: ${metrics.ws_messages_received?.values?.count || 0}`)
  console.log(
    `  消息丢失率: ${
      (
        1 -
        (metrics.ws_messages_received?.values?.count || 0) /
          (metrics.ws_messages_sent?.values?.count || 1)
      ).toFixed(4) * 100
    }%`
  )

  console.log('\n消息延迟:')
  console.log(`  平均延迟: ${(metrics.ws_latency?.values?.avg || 0).toFixed(2)}ms`)
  console.log(`  P50延迟: ${(metrics.ws_latency?.values?.['p(50)'] || 0).toFixed(2)}ms`)
  console.log(`  P95延迟: ${(metrics.ws_latency?.values?.['p(95)'] || 0).toFixed(2)}ms`)
  console.log(`  P99延迟: ${(metrics.ws_latency?.values?.['p(99)'] || 0).toFixed(2)}ms\n`)

  return {
    'performance/results/websocket-summary.json': JSON.stringify(data, null, 2),
  }
}
