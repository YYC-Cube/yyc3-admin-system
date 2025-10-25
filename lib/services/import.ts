// 数据导入服务

import type { ImportResult, Product, Member } from "@/lib/types"
import { mockDB } from "@/lib/utils/storage"

// 解析CSV文件
export async function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim())

      const data = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim())
        const obj: any = {}
        headers.forEach((header, index) => {
          obj[header] = values[index]
        })
        return obj
      })

      resolve(data)
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsText(file)
  })
}

// 导��商品数据
export async function importProducts(file: File): Promise<ImportResult> {
  const result: ImportResult = {
    success: 0,
    failed: 0,
    errors: [],
  }

  try {
    const data = await parseCSV(file)
    const products = mockDB.get<Product>("products") || []

    data.forEach((row, index) => {
      try {
        // 验证必填字段
        if (!row.name || !row.price) {
          throw new Error("缺少必填字段")
        }

        // 创建商品对象
        const product: Product = {
          id: `PROD${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          name: row.name,
          alias: row.alias || row.name,
          barcode: row.barcode ? [row.barcode] : [],
          categoryId: row.categoryId || "default",
          unit: row.unit || "个",
          originalPrice: Number.parseFloat(row.originalPrice) || Number.parseFloat(row.price),
          price: Number.parseFloat(row.price),
          memberPrice: Number.parseFloat(row.memberPrice) || Number.parseFloat(row.price),
          stock: Number.parseInt(row.stock) || 0,
          minStock: Number.parseInt(row.minStock) || 10,
          costPrice: Number.parseFloat(row.costPrice) || 0,
          images: [],
          flavors: [],
          isGift: false,
          allowDiscount: true,
          isSale: true,
          isRecommend: false,
          isLowConsumption: false,
          displayOrder: 0,
          storeId: "default",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        products.push(product)
        result.success++
      } catch (error: any) {
        result.failed++
        result.errors.push({
          row: index + 2,
          field: "unknown",
          message: error.message,
          data: row,
        })
      }
    })

    mockDB.set("products", products)
  } catch (error: any) {
    result.errors.push({
      row: 0,
      field: "file",
      message: error.message,
      data: null,
    })
  }

  return result
}

// 导入会员数据
export async function importMembers(file: File): Promise<ImportResult> {
  const result: ImportResult = {
    success: 0,
    failed: 0,
    errors: [],
  }

  try {
    const data = await parseCSV(file)
    const members = mockDB.get<Member>("members") || []

    data.forEach((row, index) => {
      try {
        // 验证必填字段
        if (!row.name || !row.phone) {
          throw new Error("缺少必填字段")
        }

        // 创建会员对象
        const member: Member = {
          id: `MEM${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          cardNo: row.cardNo || `CARD${Date.now()}`,
          name: row.name,
          phone: row.phone,
          birthday: row.birthday,
          level: Number.parseInt(row.level) || 1,
          balance: {
            general: Number.parseFloat(row.balance) || 0,
            room: 0,
            gift: 0,
          },
          points: {
            total: 0,
            used: 0,
            available: 0,
          },
          visitCount: 0,
          totalConsumption: 0,
          storeId: "default",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        members.push(member)
        result.success++
      } catch (error: any) {
        result.failed++
        result.errors.push({
          row: index + 2,
          field: "unknown",
          message: error.message,
          data: row,
        })
      }
    })

    mockDB.set("members", members)
  } catch (error: any) {
    result.errors.push({
      row: 0,
      field: "file",
      message: error.message,
      data: null,
    })
  }

  return result
}

// 下载导入模板
export function downloadTemplate(type: "products" | "members") {
  const templates = {
    products: "name,alias,barcode,categoryId,unit,price,originalPrice,memberPrice,stock,minStock,costPrice\n",
    members: "name,phone,cardNo,birthday,level,balance\n",
  }

  const blob = new Blob([templates[type]], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${type}_template.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
