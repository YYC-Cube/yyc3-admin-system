import { GET, POST } from "@/app/api/products/route"
import { NextRequest } from "next/server"

describe("Products API Integration", () => {
  describe("GET /api/products", () => {
    it("应该返回商品列表", async () => {
      const request = new NextRequest("http://localhost:3000/api/products")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty("data")
      expect(data).toHaveProperty("total")
      expect(Array.isArray(data.data)).toBe(true)
    })

    it("应该支持分页参数", async () => {
      const request = new NextRequest("http://localhost:3000/api/products?page=2&pageSize=5")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.page).toBe(2)
      expect(data.pageSize).toBe(5)
    })

    it("应该支持搜索参数", async () => {
      const request = new NextRequest("http://localhost:3000/api/products?search=啤酒")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.every((p: any) => p.name.includes("啤酒") || p.category.includes("啤酒"))).toBe(true)
    })
  })

  describe("POST /api/products", () => {
    it("应该创建新商品", async () => {
      const newProduct = {
        name: "测试商品",
        category: "测试",
        unit: "个",
        price: 10,
        stock: 100,
      }

      const request = new NextRequest("http://localhost:3000/api/products", {
        method: "POST",
        body: JSON.stringify(newProduct),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toHaveProperty("id")
      expect(data.name).toBe(newProduct.name)
    })

    it("应该验证请求数据", async () => {
      const invalidProduct = {
        name: "",
        price: -1,
      }

      const request = new NextRequest("http://localhost:3000/api/products", {
        method: "POST",
        body: JSON.stringify(invalidProduct),
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })
  })
})
