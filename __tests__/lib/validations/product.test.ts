import { productSchema } from '@/lib/validations/product'

describe('Product Validation', () => {
  describe('productSchema', () => {
    it('应该验证有效的商品数据', () => {
      const validProduct = {
        name: '青岛啤酒',
        alias: '青啤',
        barcode: ['6901234567890'], // 必填字段
        categoryId: 'cat-001', // 必填字段(不是category)
        unit: '瓶',
        originalPrice: 12, // 必填字段
        price: 10,
        memberPrice: 9,
        costPrice: 5, // 必填字段(不是cost)
        stock: 100,
        minStock: 10,
        allowDiscount: true,
        isLowConsumption: false,
      }

      const result = productSchema.safeParse(validProduct)
      if (!result.success) {
        console.error('Validation errors:', result.error.errors)
      }
      expect(result.success).toBe(true)
    })

    it('应该拒绝无效的商品名称', () => {
      const invalidProduct = {
        name: '', // 空字符串应该失败
        barcode: ['123'],
        categoryId: 'cat-001',
        unit: '瓶',
        originalPrice: 10,
        price: 10,
        memberPrice: 10,
        costPrice: 5,
        stock: 0,
        minStock: 0,
      }

      const result = productSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
    })

    it('应该拒绝负数价格', () => {
      const invalidProduct = {
        name: '测试商品',
        barcode: ['123'],
        categoryId: 'cat-001',
        unit: '个',
        originalPrice: 10,
        price: -10, // 负数价格应该失败
        memberPrice: 10,
        costPrice: 5,
        stock: 0,
        minStock: 0,
      }

      const result = productSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
    })

    it('应该拒绝空条形码数组', () => {
      const invalidProduct = {
        name: '测试商品',
        barcode: [], // 空数组应该失败(至少需要一个)
        categoryId: 'cat-001',
        unit: '个',
        originalPrice: 10,
        price: 10,
        memberPrice: 10,
        costPrice: 5,
        stock: 0,
        minStock: 0,
      }

      const result = productSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
    })
  })
})
