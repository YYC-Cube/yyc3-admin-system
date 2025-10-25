import { productSchema } from "@/lib/validations/product"

describe("Product Validation", () => {
  describe("productSchema", () => {
    it("应该验证有效的商品数据", () => {
      const validProduct = {
        name: "青岛啤酒",
        alias: "青啤",
        category: "啤酒",
        unit: "瓶",
        price: 10,
        memberPrice: 9,
        cost: 5,
        stock: 100,
        minStock: 10,
        status: "active",
        allowDiscount: true,
        isLowConsumption: false,
      }

      const result = productSchema.safeParse(validProduct)
      expect(result.success).toBe(true)
    })

    it("应该拒绝无效的商品名称", () => {
      const invalidProduct = {
        name: "",
        category: "啤酒",
        unit: "瓶",
        price: 10,
      }

      const result = productSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
    })

    it("应该拒绝负数价格", () => {
      const invalidProduct = {
        name: "测试商品",
        category: "测试",
        unit: "个",
        price: -10,
      }

      const result = productSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
    })

    it("应该拒绝无效的状态值", () => {
      const invalidProduct = {
        name: "测试商品",
        category: "测试",
        unit: "个",
        price: 10,
        status: "invalid_status",
      }

      const result = productSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
    })
  })
})
