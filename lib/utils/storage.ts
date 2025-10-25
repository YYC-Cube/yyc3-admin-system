// 本地存储工具(用于数据持久化模拟)

const STORAGE_PREFIX = "ktv_admin_"

export const storage = {
  // 保存数据
  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return

    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(STORAGE_PREFIX + key, serialized)
    } catch (error) {
      console.error("[v0] 存储数据失败:", error)
    }
  },

  // 获取数据
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === "undefined") return defaultValue ?? null

    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key)
      if (!item) return defaultValue ?? null

      return JSON.parse(item) as T
    } catch (error) {
      console.error("[v0] 读取数据失败:", error)
      return defaultValue ?? null
    }
  },

  // 删除数据
  remove(key: string): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_PREFIX + key)
  },

  // 清空所有数据
  clear(): void {
    if (typeof window === "undefined") return

    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  },

  // 获取所有键
  keys(): string[] {
    if (typeof window === "undefined") return []

    const keys = Object.keys(localStorage)
    return keys.filter((key) => key.startsWith(STORAGE_PREFIX)).map((key) => key.replace(STORAGE_PREFIX, ""))
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
    return items.find((item) => item.id === id) || null
  }

  // 创建记录
  create(data: Omit<T, "id">): T {
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
    const index = items.findIndex((item) => item.id === id)

    if (index === -1) return null

    items[index] = { ...items[index], ...data }
    storage.set(this.storageKey, items)

    return items[index]
  }

  // 删除记录
  delete(id: string): boolean {
    const items = this.getAll()
    const filtered = items.filter((item) => item.id !== id)

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
    pageSize = 10,
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
      sort?: { field: keyof T; order: "asc" | "desc" }
    } = {},
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
      items = items.filter((item) => {
        return Object.entries(options.filters!).every(([key, value]) => {
          const itemValue = (item as any)[key]
          if (typeof value === "string" && typeof itemValue === "string") {
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
        const order = options.sort!.order === "asc" ? 1 : -1

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

  async update<T extends { id: string }>(tableName: string, id: string, data: Partial<T>): Promise<T | null> {
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
  get<T>(key: string): T[] {
    return storage.get<T[]>(`db_${key}`, []) || []
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

export function initializeMockData() {
  // 初始化商品类型
  const categories = storage.get("db_categories", [])
  if (!categories || categories.length === 0) {
    const defaultCategories = [
      {
        id: "cat_1",
        name: "啤酒",
        displayOrder: 1,
        isDisplay: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cat_2",
        name: "休闲食品",
        displayOrder: 2,
        isDisplay: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cat_3",
        name: "果盘",
        displayOrder: 3,
        isDisplay: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cat_4",
        name: "洋酒",
        displayOrder: 4,
        isDisplay: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "cat_5",
        name: "饮料",
        displayOrder: 5,
        isDisplay: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    storage.set("db_categories", defaultCategories)
  }

  // 初始化商品
  const products = storage.get("db_products", [])
  if (!products || products.length === 0) {
    const defaultProducts = [
      {
        id: "prod_1",
        storeId: "store_1",
        name: "青岛纯生330ml",
        alias: "青岛纯生",
        barcode: ["6901028123456"],
        categoryId: "cat_1",
        unit: "瓶",
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
      {
        id: "prod_2",
        storeId: "store_1",
        name: "JELLYBIRD果冻酒36gx2",
        alias: "果冻酒",
        barcode: ["6901028234567"],
        categoryId: "cat_2",
        unit: "个",
        originalPrice: 15,
        price: 12,
        memberPrice: 10,
        stock: 156,
        minStock: 30,
        costPrice: 8,
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: false,
        isLowConsumption: false,
        displayOrder: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "prod_3",
        storeId: "store_1",
        name: "小果盘",
        alias: "小果盘",
        barcode: ["6901028345678"],
        categoryId: "cat_3",
        unit: "份",
        originalPrice: 50,
        price: 45,
        memberPrice: 40,
        stock: 89,
        minStock: 20,
        costPrice: 25,
        isGift: false,
        allowDiscount: true,
        isSale: true,
        isRecommend: true,
        isLowConsumption: true,
        displayOrder: 9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    storage.set("db_products", defaultProducts)
  }

  // 初始化会员
  const members = storage.get("db_members", [])
  if (!members || members.length === 0) {
    const defaultMembers = [
      {
        id: "member_1",
        storeId: "store_1",
        cardNumber: "000001",
        name: "张三",
        phone: "13800138000",
        level: 1,
        balance: 1000,
        points: 500,
        totalConsumption: 5000,
        visitCount: 25,
        birthday: "1990-01-15",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "member_2",
        storeId: "store_1",
        cardNumber: "000002",
        name: "李四",
        phone: "13900139000",
        level: 2,
        balance: 2500,
        points: 1200,
        totalConsumption: 12000,
        visitCount: 48,
        birthday: "1985-06-20",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    storage.set("db_members", defaultMembers)
  }
}
