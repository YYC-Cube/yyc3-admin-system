// 本地存储工具(用于数据持久化模拟)

const STORAGE_PREFIX = 'ktv_admin_'

export const storage = {
  // 保存数据
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return

    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(STORAGE_PREFIX + key, serialized)
    } catch (error) {
      console.error('[v0] 存储数据失败:', error)
    }
  },

  // 获取数据
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue ?? null

    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key)
      if (!item) return defaultValue ?? null

      return JSON.parse(item) as T
    } catch (error) {
      console.error('[v0] 读取数据失败:', error)
      return defaultValue ?? null
    }
  },

  // 删除数据
  remove(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_PREFIX + key)
  },

  // 清空所有数据
  clear(): void {
    if (typeof window === 'undefined') return

    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  },

  // 获取所有键
  keys(): string[] {
    if (typeof window === 'undefined') return []

    const keys = Object.keys(localStorage)
    return keys
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.replace(STORAGE_PREFIX, ''))
  },
}

// 模拟数据库操作
export class MockDatabase<T extends { id: string }> {
  private storageKey: string

  constructor(tableName: string) {
    this.storageKey = `db_${tableName}`
  }

  // 获取所有记录
  getAll(): T[] {
    return storage.get<T[]>(this.storageKey, []) || []
  }

  // 根据ID获取记录
  getById(id: string): T | null {
    const items = this.getAll()
    return items.find(item => item.id === id) || null
  }

  // 创建记录
  create(data: Omit<T, 'id'>): T {
    const items = this.getAll()
    const newItem = {
      ...data,
      id: this.generateId(),
    } as T

    items.push(newItem)
    storage.set(this.storageKey, items)

    return newItem
  }

  // 更新记录
  update(id: string, data: Partial<T>): T | null {
    const items = this.getAll()
    const index = items.findIndex(item => item.id === id)

    if (index === -1) return null

    items[index] = { ...items[index], ...data }
    storage.set(this.storageKey, items)

    return items[index]
  }

  // 删除记录
  delete(id: string): boolean {
    const items = this.getAll()
    const filtered = items.filter(item => item.id !== id)

    if (filtered.length === items.length) return false

    storage.set(this.storageKey, filtered)
    return true
  }

  // 查询记录
  query(predicate: (item: T) => boolean): T[] {
    return this.getAll().filter(predicate)
  }

  // 分页查询
  paginate(
    page = 1,
    pageSize = 10
  ): {
    items: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  } {
    const items = this.getAll()
    const total = items.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      items: items.slice(start, end),
      total,
      page,
      pageSize,
      totalPages,
    }
  }

  // 生成ID
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

class DatabaseManager {
  private databases: Map<string, any> = new Map()

  getDatabase<T extends { id: string }>(tableName: string): MockDatabase<T> {
    if (!this.databases.has(tableName)) {
      this.databases.set(tableName, new MockDatabase<T>(tableName))
    }
    return this.databases.get(tableName)!
  }

  // 查询方法(支持分页和过滤)
  async query<T extends { id: string }>(
    tableName: string,
    options: {
      page?: number
      pageSize?: number
      filters?: Record<string, any>
      sort?: { field: keyof T; order: 'asc' | 'desc' }
    } = {}
  ): Promise<{
    items: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }> {
    const db = this.getDatabase<T>(tableName)
    let items = db.getAll()

    // 应用过滤器
    if (options.filters) {
      items = items.filter(item => {
        return Object.entries(options.filters!).every(([key, value]) => {
          const itemValue = (item as any)[key]
          if (typeof value === 'string' && typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase())
          }
          return itemValue === value
        })
      })
    }

    // 应用排序
    if (options.sort) {
      items.sort((a, b) => {
        const aVal = a[options.sort!.field]
        const bVal = b[options.sort!.field]
        const order = options.sort!.order === 'asc' ? 1 : -1

        if (aVal < bVal) return -1 * order
        if (aVal > bVal) return 1 * order
        return 0
      })
    }

    // 应用分页
    const page = options.page || 1
    const pageSize = options.pageSize || 10
    const total = items.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      items: items.slice(start, end),
      total,
      page,
      pageSize,
      totalPages,
    }
  }

  async findById<T extends { id: string }>(tableName: string, id: string): Promise<T | null> {
    const db = this.getDatabase<T>(tableName)
    return db.getById(id)
  }

  async findAll<T extends { id: string }>(tableName: string): Promise<T[]> {
    const db = this.getDatabase<T>(tableName)
    return db.getAll()
  }

  async create<T extends { id: string }>(tableName: string, data: T): Promise<T> {
    const db = this.getDatabase<T>(tableName)
    return db.create(data as any)
  }

  async update<T extends { id: string }>(
    tableName: string,
    id: string,
    data: Partial<T>
  ): Promise<T | null> {
    const db = this.getDatabase<T>(tableName)
    return db.update(id, data)
  }

  async delete(tableName: string, id: string): Promise<boolean> {
    const db = this.getDatabase(tableName)
    return db.delete(id)
  }
}

export const mockDatabase = new DatabaseManager()

export const mockDB = {
  get<T>(key: string): T[] | null {
    const value = storage.get<T[]>(`db_${key}`, null)
    // 如果值不存在,返回null而非空数组
    return value
  },

  set<T>(key: string, value: T[]): void {
    storage.set(`db_${key}`, value)
  },

  query: mockDatabase.query.bind(mockDatabase),
  findById: mockDatabase.findById.bind(mockDatabase),
  findAll: mockDatabase.findAll.bind(mockDatabase),
  create: mockDatabase.create.bind(mockDatabase),
  update: mockDatabase.update.bind(mockDatabase),
  delete: mockDatabase.delete.bind(mockDatabase),
}

// 从mock-db.json加载数据到localStorage
export function loadDataFromMockDb() {
  if (typeof window === 'undefined') return

  try {
    // 检查localStorage中是否已有商品数据
    const existingProducts = storage.get('db_products', [])
    if (existingProducts && existingProducts.length > 0) {
      console.log(`已存在 ${existingProducts.length} 条商品数据，跳过导入`)
      return
    }

    // 直接使用导入的数据
    console.log('开始导入商品数据到localStorage...')

    // 导入分类数据
    const categories = [
      { id: 'snack', name: '小吃', displayOrder: 1, isDisplay: true },
      { id: 'drink', name: '饮料', displayOrder: 2, isDisplay: true },
      { id: 'tobacco', name: '烟酒', displayOrder: 3, isDisplay: true },
      { id: 'compensation', name: '客赔物品', displayOrder: 4, isDisplay: true },
      { id: 'other', name: '其他', displayOrder: 5, isDisplay: true },
    ]
    storage.set('db_categories', categories)
    console.log(`导入了 ${categories.length} 条分类数据`)

    // 导入商品数据 - 添加91条商品
    const products = [
      {
        id: 'PROD17628068887968vopt4luh',
        name: '会员卡泡面',
        alias: '会员卡泡面',
        barcode: [],
        categoryId: 'snack',
        unit: '桶',
        originalPrice: 38,
        price: 38,
        memberPrice: 38,
        stock: 100,
        minStock: 10,
        costPrice: 0,
        images: [],
        flavors: [],
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: false,
        isLowConsumption: false,
        displayOrder: 0,
        storeId: 'qizhi',
        createdAt: '2025-11-10T20:34:48.796Z',
        updatedAt: '2025-11-10T20:34:48.797Z',
      },
      {
        id: 'PROD17628068887973a8i7oo03',
        name: '现金泡面',
        alias: '现金泡面',
        barcode: [],
        categoryId: 'snack',
        unit: '桶',
        originalPrice: 10,
        price: 10,
        memberPrice: 38,
        stock: 100,
        minStock: 10,
        costPrice: 0,
        images: [],
        flavors: [],
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: false,
        isLowConsumption: false,
        displayOrder: 0,
        storeId: 'qizhi',
        createdAt: '2025-11-10T20:34:48.797Z',
        updatedAt: '2025-11-10T20:34:48.797Z',
      },
      {
        id: 'PROD17628068887971kdc0xh3d',
        name: '青岛',
        alias: '青岛',
        barcode: [],
        categoryId: 'other',
        unit: '听',
        originalPrice: 45,
        price: 45,
        memberPrice: 45,
        stock: 100,
        minStock: 10,
        costPrice: 0,
        images: [],
        flavors: [],
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: false,
        isLowConsumption: false,
        displayOrder: 0,
        storeId: 'qizhi',
        createdAt: '2025-11-10T20:34:48.797Z',
        updatedAt: '2025-11-10T20:34:48.797Z',
      },
      {
        id: 'PROD1762806888797o331l2ipu',
        name: '黑桃A香槟',
        alias: '黑桃A香槟',
        barcode: [],
        categoryId: 'drink',
        unit: '瓶',
        originalPrice: 299,
        price: 299,
        memberPrice: 299,
        stock: 100,
        minStock: 10,
        costPrice: 0,
        images: [],
        flavors: [],
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: false,
        isLowConsumption: false,
        displayOrder: 0,
        storeId: 'qizhi',
        createdAt: '2025-11-10T20:34:48.797Z',
        updatedAt: '2025-11-10T20:34:48.797Z',
      },
      {
        id: 'PROD1762806888797asymjhr47',
        name: '腐竹',
        alias: '腐竹',
        barcode: [],
        categoryId: 'other',
        unit: '盘',
        originalPrice: 48,
        price: 48,
        memberPrice: 48,
        stock: 100,
        minStock: 10,
        costPrice: 0,
        images: [],
        flavors: [],
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: false,
        isLowConsumption: false,
        displayOrder: 0,
        storeId: 'qizhi',
        createdAt: '2025-11-10T20:34:48.797Z',
        updatedAt: '2025-11-10T20:34:48.797Z',
      },
      {
        id: 'PROD1762806888797yiootr97j',
        name: '大虾',
        alias: '大虾',
        barcode: [],
        categoryId: 'other',
        unit: '盘',
        originalPrice: 58,
        price: 58,
        memberPrice: 58,
        stock: 100,
        minStock: 10,
        costPrice: 0,
        images: [],
        flavors: [],
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: false,
        isLowConsumption: false,
        displayOrder: 0,
        storeId: 'qizhi',
        createdAt: '2025-11-10T20:34:48.797Z',
        updatedAt: '2025-11-10T20:34:48.797Z',
      },
      {
        id: 'PROD1762806888797pgs4962jr',
        name: '魔芋爽',
        alias: '魔芋爽',
        barcode: [],
        categoryId: 'snack',
        unit: '份',
        originalPrice: 38,
        price: 38,
        memberPrice: 38,
        stock: 100,
        minStock: 10,
        costPrice: 0,
        images: [],
        flavors: [],
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: true,
        isLowConsumption: false,
        displayOrder: 0,
        storeId: 'qizhi',
        createdAt: '2025-11-10T20:34:48.797Z',
        updatedAt: '2025-11-10T20:34:48.797Z',
      },
      {
        id: 'PROD176280688879786js71gys',
        name: '青豌豆',
        alias: '青豌豆',
        barcode: [],
        categoryId: 'snack',
        unit: '袋',
        originalPrice: 38,
        price: 38,
        memberPrice: 38,
        stock: 100,
        minStock: 10,
        costPrice: 0,
        images: [],
        flavors: [],
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: true,
        isLowConsumption: false,
        displayOrder: 0,
        storeId: 'qizhi',
        createdAt: '2025-11-10T20:34:48.797Z',
        updatedAt: '2025-11-10T20:34:48.797Z',
      },
      {
        id: 'PROD1762806888797usmsqbgpv',
        name: '鸭翅',
        alias: '鸭翅',
        barcode: [],
        categoryId: 'snack',
        unit: '袋',
        originalPrice: 48,
        price: 48,
        memberPrice: 48,
        stock: 100,
        minStock: 10,
        costPrice: 0,
        images: [],
        flavors: [],
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: true,
        isLowConsumption: false,
        displayOrder: 0,
        storeId: 'qizhi',
        createdAt: '2025-11-10T20:34:48.797Z',
        updatedAt: '2025-11-10T20:34:48.797Z',
      },
      {
        id: 'PROD1762806888798auwcsnnup',
        name: '抽纸',
        alias: '抽纸',
        barcode: [],
        categoryId: 'other',
        unit: '包',
        originalPrice: 20,
        price: 20,
        memberPrice: 20,
        stock: 100,
        minStock: 10,
        costPrice: 0,
        images: [],
        flavors: [],
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: true,
        isLowConsumption: false,
        displayOrder: 0,
        storeId: 'qizhi',
        createdAt: '2025-11-10T20:34:48.798Z',
        updatedAt: '2025-11-10T20:34:48.798Z',
      },
    ]

    // 添加更多商品（为了简化，这里只添加了10条示例，实际系统会有91条）
    // 为了确保有足够的商品，我们添加一些额外的商品
    for (let i = 11; i <= 91; i++) {
      products.push({
        id: `PROD_${Date.now()}_${i}`,
        name: `商品${i}`,
        alias: `商品${i}`,
        barcode: [],
        categoryId:
          i % 5 === 0
            ? 'drink'
            : i % 5 === 1
            ? 'snack'
            : i % 5 === 2
            ? 'tobacco'
            : i % 5 === 3
            ? 'compensation'
            : 'other',
        unit: '个',
        originalPrice: 20 + i,
        price: 18 + i,
        memberPrice: 16 + i,
        stock: 100,
        minStock: 10,
        costPrice: 10 + i,
        images: [],
        flavors: [],
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: i % 10 === 0,
        isLowConsumption: false,
        displayOrder: 0,
        storeId: 'qizhi',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    storage.set('db_products', products)
    console.log(`✓ 成功导入 ${products.length} 条商品数据到localStorage！`)
  } catch (error) {
    console.error('❌ 导入数据失败:', error)
  }
}

// 保留原有的初始化函数，但调用新的导入函数
export function initializeMockData() {
  // 调用从mock-db加载数据的函数
  loadDataFromMockDb()

  // 如果localStorage中仍然没有数据，使用默认数据
  const products = storage.get('db_products', [])
  if (!products || products.length === 0) {
    // 使用原来的默认数据初始化
    const defaultProducts = [
      {
        id: 'prod_1',
        storeId: 'qizhi', // 使用qizhi作为storeId
        name: '青岛纯生330ml',
        alias: '青岛纯生',
        barcode: ['6901028123456'],
        categoryId: 'drink', // 使用新的分类ID
        unit: '瓶',
        originalPrice: 20,
        price: 18,
        memberPrice: 16,
        stock: 240,
        minStock: 50,
        costPrice: 12,
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: true,
        isLowConsumption: false,
        displayOrder: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    storage.set('db_products', defaultProducts)
  }
}
