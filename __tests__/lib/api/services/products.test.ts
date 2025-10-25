import { productService } from "@/lib/api/services/products"
import { mockDB } from "@/lib/utils/storage"
import { jest } from "@jest/globals"

describe("ProductService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getProducts", () => {
    it("应该返回商品列表", async () => {
      const mockProducts = [
        { id: "1", name: "青岛啤酒", price: 10, category: "啤酒" },
        { id: "2", name: "可乐", price: 5, category: "饮料" },
      ]

      jest.spyOn(mockDB, "get").mockReturnValue({ products: mockProducts })

      const result = await productService.getProducts({ page: 1, pageSize: 10 })

      expect(result.data).toHaveLength(2)
      expect(result.total).toBe(2)
    })

    it("应该支持分页查询", async () => {
      const mockProducts = Array.from({ length: 25 }, (_, i) => ({
        id: `${i + 1}`,
        name: `商品${i + 1}`,
        price: 10,
        category: "测试",
      }))

      jest.spyOn(mockDB, "get").mockReturnValue({ products: mockProducts })

      const result = await productService.getProducts({ page: 2, pageSize: 10 })

      expect(result.data).toHaveLength(10)
      expect(result.page).toBe(2)
    })

    it("应该支持搜索过滤", async () => {
      const mockProducts = [
        { id: "1", name: "青岛啤酒", price: 10, category: "啤酒" },
        { id: "2", name: "雪花啤酒", price: 8, category: "啤酒" },
        { id: "3", name: "可乐", price: 5, category: "饮料" },
      ]

      jest.spyOn(mockDB, "get").mockReturnValue({ products: mockProducts })

      const result = await productService.getProducts({
        page: 1,
        pageSize: 10,
        search: "啤酒",
      })

      expect(result.data).toHaveLength(2)
      expect(result.data.every((p) => p.name.includes("啤酒"))).toBe(true)
    })
  })

  describe("createProduct", () => {
    it("应该创建新商品", async () => {
      const newProduct = {
        name: "新商品",
        price: 15,
        category: "测试",
        unit: "瓶",
        stock: 100,
      }

      const result = await productService.createProduct(newProduct)

      expect(result).toHaveProperty("id")
      expect(result.name).toBe(newProduct.name)
      expect(result.price).toBe(newProduct.price)
    })

    it("应该验证必填字段", async () => {
      const invalidProduct = {
        name: "",
        price: -1,
      }

      await expect(productService.createProduct(invalidProduct as any)).rejects.toThrow()
    })
  })

  describe("updateProduct", () => {
    it("应该更新商品信息", async () => {
      const updates = {
        name: "更新后的商品",
        price: 20,
      }

      const result = await productService.updateProduct("1", updates)

      expect(result.name).toBe(updates.name)
      expect(result.price).toBe(updates.price)
    })

    it("商品不存在时应该抛出错误", async () => {
      await expect(productService.updateProduct("999", { name: "测试" })).rejects.toThrow("商品不存在")
    })
  })

  describe("deleteProduct", () => {
    it("应该删除商品", async () => {
      await expect(productService.deleteProduct("1")).resolves.not.toThrow()
    })

    it("商品不存在时应该抛出错误", async () => {
      await expect(productService.deleteProduct("999")).rejects.toThrow("商品不存在")
    })
  })
})
