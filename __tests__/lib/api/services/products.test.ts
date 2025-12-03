import { productService } from '@/lib/api/services/products'
import { jest } from '@jest/globals'

// Mock global fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getProducts', () => {
    it('应该返回商品列表', async () => {
      const mockProducts = [
        { id: '1', name: '青岛啤酒', price: 10, category: '啤酒' },
        { id: '2', name: '可乐', price: 5, category: '饮料' },
      ]

      const mockResponse = {
        success: true,
        data: {
          items: mockProducts,
          total: 2,
          page: 1,
          pageSize: 10,
        },
      }

      ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await productService.getProducts({ page: 1, pageSize: 10 })

      expect(result.data?.items).toHaveLength(2)
      expect(result.data?.total).toBe(2)
    })

    it('应该支持分页查询', async () => {
      const mockProducts = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 11}`,
        name: `商品${i + 11}`,
        price: 10,
        category: '测试',
      }))

      const mockResponse = {
        success: true,
        data: {
          items: mockProducts,
          total: 25,
          page: 2,
          pageSize: 10,
        },
      }

      ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await productService.getProducts({ page: 2, pageSize: 10 })

      expect(result.data?.items).toHaveLength(10)
      expect(result.data?.page).toBe(2)
    })

    it('应该支持搜索过滤', async () => {
      const mockProducts = [
        { id: '1', name: '青岛啤酒', price: 10, category: '啤酒' },
        { id: '2', name: '雪花啤酒', price: 8, category: '啤酒' },
      ]

      const mockResponse = {
        success: true,
        data: {
          items: mockProducts,
          total: 2,
          page: 1,
          pageSize: 10,
        },
      }

      ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await productService.getProducts({
        page: 1,
        pageSize: 10,
        keyword: '啤酒',
      })

      expect(result.data?.items).toHaveLength(2)
      expect(result.data?.items.every(p => p.name.includes('啤酒'))).toBe(true)
    })
  })

  describe('createProduct', () => {
    it('应该创建新商品', async () => {
      const newProduct = {
        name: '新商品',
        price: 15,
        category: '测试',
        unit: '瓶',
        stock: 100,
      }

      const mockResponse = {
        success: true,
        data: {
          id: 'new-123',
          ...newProduct,
        },
      }

      ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await productService.createProduct(newProduct)

      expect(result.data).toHaveProperty('id')
      expect(result.data?.name).toBe(newProduct.name)
      expect(result.data?.price).toBe(newProduct.price)
    })

    it('应该验证必填字段', async () => {
      const invalidProduct = {
        name: '',
        price: -1,
      }

      const mockResponse = {
        success: false,
        error: '验证失败',
      }

      ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        json: async () => mockResponse,
      } as Response)

      const result = await productService.createProduct(invalidProduct as any)
      expect(result.success).toBe(false)
    })
  })

  describe('updateProduct', () => {
    it('应该更新商品信息', async () => {
      const updates = {
        name: '更新后的商品',
        price: 20,
      }

      const mockResponse = {
        success: true,
        data: {
          id: '1',
          ...updates,
        },
      }

      ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await productService.updateProduct('1', updates)

      expect(result.data?.name).toBe(updates.name)
      expect(result.data?.price).toBe(updates.price)
    })

    it('商品不存在时应该返回错误', async () => {
      const mockResponse = {
        message: '商品不存在',
      }

      ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        json: async () => mockResponse,
      } as Response)

      const result = await productService.updateProduct('999', { name: '测试' })
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })

  describe('deleteProduct', () => {
    it('应该删除商品', async () => {
      const mockResponse = {
        success: true,
      }

      ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await productService.deleteProduct('1')
      expect(result.success).toBe(true)
    })

    it('商品不存在时应该返回错误', async () => {
      const mockResponse = {
        message: '商品不存在',
      }

      ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        json: async () => mockResponse,
      } as Response)

      const result = await productService.deleteProduct('999')
      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })
})
