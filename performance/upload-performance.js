/**
 * K6 文件上传性能测试
 * Phase 5.2 - 性能与压力测试
 *
 * 测试目标: 验证文件上传功能的性能和稳定性
 */

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// 自定义指标
const uploadSuccess = new Rate('upload_success')
const uploadDuration = new Trend('upload_duration')
const uploadThroughput = new Trend('upload_throughput')

// 测试配置
export const options = {
  scenarios: {
    // 小文件上传 (< 1MB)
    small_files: {
      executor: 'constant-vus',
      vus: 20,
      duration: '1m',
      exec: 'smallFileUpload',
    },
    // 中等文件上传 (1-5MB)
    medium_files: {
      executor: 'constant-vus',
      vus: 10,
      duration: '2m',
      exec: 'mediumFileUpload',
      startTime: '1m',
    },
    // 大文件上传 (5-10MB)
    large_files: {
      executor: 'constant-vus',
      vus: 5,
      duration: '2m',
      exec: 'largeFileUpload',
      startTime: '3m',
    },
  },
  thresholds: {
    upload_success: ['rate>0.95'],
    upload_duration: ['p(95)<10000'],
    upload_throughput: ['avg>500000'], // 平均 > 500KB/s
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'
const token = __ENV.API_TOKEN || ''

function getHeaders() {
  return {
    Authorization: `Bearer ${token}`,
  }
}

// 生成随机文件内容
function generateFileContent(sizeInKB) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const chunkSize = 1024
  let content = ''

  for (let i = 0; i < sizeInKB; i++) {
    for (let j = 0; j < chunkSize; j++) {
      content += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  }

  return content
}

// 小文件上传 (100KB - 500KB)
export function smallFileUpload() {
  const headers = getHeaders()
  const fileSize = Math.floor(Math.random() * 400) + 100 // 100-500KB
  const fileContent = generateFileContent(fileSize)

  const formData = {
    file: http.file(fileContent, `test-${Date.now()}.txt`),
    category: 'product-images',
  }

  const start = Date.now()

  const res = http.post(`${BASE_URL}/api/upload`, formData, {
    headers,
    timeout: '30s',
  })

  const duration = Date.now() - start
  uploadDuration.add(duration)

  const throughput = (fileSize * 1024) / (duration / 1000) // bytes per second
  uploadThroughput.add(throughput)

  const isSuccess = check(res, {
    'small file upload status 200': r => r.status === 200,
    'small file has url': r => r.json('data.url') !== undefined,
    'small file upload < 5s': () => duration < 5000,
  })

  uploadSuccess.add(isSuccess ? 1 : 0)

  sleep(1)
}

// 中等文件上传 (1MB - 5MB)
export function mediumFileUpload() {
  const headers = getHeaders()
  const fileSizeKB = (Math.floor(Math.random() * 4) + 1) * 1024 // 1-5MB
  const fileContent = generateFileContent(fileSizeKB)

  const formData = {
    file: http.file(fileContent, `medium-${Date.now()}.jpg`),
    category: 'product-videos',
  }

  const start = Date.now()

  const res = http.post(`${BASE_URL}/api/upload`, formData, {
    headers,
    timeout: '60s',
  })

  const duration = Date.now() - start
  uploadDuration.add(duration)

  const throughput = (fileSizeKB * 1024) / (duration / 1000)
  uploadThroughput.add(throughput)

  const isSuccess = check(res, {
    'medium file upload status 200': r => r.status === 200,
    'medium file upload < 15s': () => duration < 15000,
  })

  uploadSuccess.add(isSuccess ? 1 : 0)

  sleep(2)
}

// 大文件上传 (5MB - 10MB)
export function largeFileUpload() {
  const headers = getHeaders()
  const fileSizeKB = (Math.floor(Math.random() * 5) + 5) * 1024 // 5-10MB
  const fileContent = generateFileContent(fileSizeKB)

  const formData = {
    file: http.file(fileContent, `large-${Date.now()}.mp4`),
    category: 'marketing-materials',
  }

  const start = Date.now()

  const res = http.post(`${BASE_URL}/api/upload`, formData, {
    headers,
    timeout: '120s',
  })

  const duration = Date.now() - start
  uploadDuration.add(duration)

  const throughput = (fileSizeKB * 1024) / (duration / 1000)
  uploadThroughput.add(throughput)

  const isSuccess = check(res, {
    'large file upload status 200': r => r.status === 200,
    'large file upload < 30s': () => duration < 30000,
  })

  uploadSuccess.add(isSuccess ? 1 : 0)

  sleep(5)
}

export function handleSummary(data) {
  const metrics = data.metrics

  console.log('\n文件上传性能测试结果')
  console.log('='.repeat(50))

  console.log('\n上传成功率:')
  console.log(`  总上传次数: ${metrics.http_reqs?.values?.count || 0}`)
  console.log(`  成功率: ${((metrics.upload_success?.values?.rate || 0) * 100).toFixed(2)}%`)

  console.log('\n上传性能:')
  console.log(`  平均上传时长: ${((metrics.upload_duration?.values?.avg || 0) / 1000).toFixed(2)}s`)
  console.log(
    `  P95上传时长: ${((metrics.upload_duration?.values?.['p(95)'] || 0) / 1000).toFixed(2)}s`
  )
  console.log(`  最大上传时长: ${((metrics.upload_duration?.values?.max || 0) / 1000).toFixed(2)}s`)

  console.log('\n传输速率:')
  const avgThroughput = metrics.upload_throughput?.values?.avg || 0
  console.log(`  平均速率: ${(avgThroughput / 1024 / 1024).toFixed(2)} MB/s`)
  console.log(
    `  最大速率: ${((metrics.upload_throughput?.values?.max || 0) / 1024 / 1024).toFixed(2)} MB/s`
  )
  console.log(
    `  最小速率: ${((metrics.upload_throughput?.values?.min || 0) / 1024 / 1024).toFixed(2)} MB/s\n`
  )

  return {
    'performance/results/upload-performance-summary.json': JSON.stringify(data, null, 2),
  }
}
