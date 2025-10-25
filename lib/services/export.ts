// 数据导出服务

import type { ExportOptions } from "@/lib/types"

// 导出为Excel
export async function exportToExcel<T>(data: T[], options: ExportOptions): Promise<Blob> {
  // 模拟Excel导出
  // 实际应用中应该使用 xlsx 或 exceljs 库

  const headers = options.fields || Object.keys(data[0] || {})
  const rows = data.map((item: any) => headers.map((field) => item[field]))

  // 创建CSV内容（简化版）
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
}

// 导出为CSV
export async function exportToCSV<T>(data: T[], options: ExportOptions): Promise<Blob> {
  const headers = options.fields || Object.keys(data[0] || {})
  const rows = data.map((item: any) => headers.map((field) => item[field]))

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
}

// 下载文件
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 导出商品数据
export async function exportProducts(filters?: any) {
  const { mockDB } = await import("@/lib/utils/storage")
  const products = mockDB.get("products") || []

  const blob = await exportToExcel(products, {
    format: "excel",
    fields: ["name", "category", "price", "stock", "createdAt"],
  })

  downloadFile(blob, `products_${Date.now()}.csv`)
}

// 导出订单数据
export async function exportOrders(filters?: any) {
  const { mockDB } = await import("@/lib/utils/storage")
  const orders = mockDB.get("orders") || []

  const blob = await exportToExcel(orders, {
    format: "excel",
    fields: ["orderNo", "totalAmount", "paymentType", "paymentStatus", "createdAt"],
  })

  downloadFile(blob, `orders_${Date.now()}.csv`)
}

// 导出会员数据
export async function exportMembers(filters?: any) {
  const { mockDB } = await import("@/lib/utils/storage")
  const members = mockDB.get("members") || []

  const blob = await exportToExcel(members, {
    format: "excel",
    fields: ["cardNo", "name", "phone", "level", "totalConsumption", "createdAt"],
  })

  downloadFile(blob, `members_${Date.now()}.csv`)
}
