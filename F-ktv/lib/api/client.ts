// API 客户端，包含模拟数据用于开发和演示
import type { ApiResponse, User as Employee, Room, Order, OrderItem, Product, Member } from "../../../lib/types"

// 模拟数据
const mockData = {
  rooms: [
    {
      id: "room-001",
      name: "豪华包厢A",
      type: "VIP",
      status: "available",
      capacity: 8,
      hourlyRate: 200,
      currentOrder: null,
      equipment: ["KTV", "投影", "酒柜"],
      lastCleaned: new Date().toISOString(),
    },
    {
      id: "room-002",
      name: "标准包厢B",
      type: "Standard",
      status: "occupied",
      capacity: 6,
      hourlyRate: 150,
      currentOrder: "order-001",
      equipment: ["KTV", "投影"],
      lastCleaned: new Date().toISOString(),
    },
  ] as any[],

  products: [
    {
      id: "prod-001",
      name: "青岛啤酒",
      category: "酒水",
      price: 15,
      memberPrice: 12,
      cost: 8,
      stock: 100,
      unit: "瓶",
      barcode: "123456789",
      isActive: true,
      canDiscount: true,
      image: "/placeholder.svg?height=100&width=100&text=青岛啤酒",
    },
    {
      id: "prod-002",
      name: "果盘",
      category: "小食",
      price: 68,
      memberPrice: 58,
      cost: 30,
      stock: 50,
      unit: "份",
      barcode: "987654321",
      isActive: true,
      canDiscount: true,
      image: "/placeholder.svg?height=100&width=100&text=果盘",
    },
  ] as any[],

  members: [
    {
      id: "member-001",
      name: "张三",
      phone: "13800138000",
      level: "VIP",
      points: 1500,
      balance: 500,
      totalSpent: 5000,
      joinDate: "2024-01-15",
      lastVisit: "2024-12-08",
      isActive: true,
    },
    {
      id: "member-002",
      name: "李四",
      phone: "13900139000",
      level: "Gold",
      points: 800,
      balance: 200,
      totalSpent: 2000,
      joinDate: "2024-03-20",
      lastVisit: "2024-12-07",
      isActive: true,
    },
  ] as any[],

  employees: [
    {
      id: "emp-001",
      name: "王经理",
      phone: "13700137000",
      role: "manager",
      department: "管理部",
      isActive: true,
      permissions: ["all"],
    },
  ] as any[],
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null
  private isClient: boolean

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.isClient = typeof window !== "undefined"

    if (this.isClient) {
      try {
        this.token = localStorage.getItem("auth_token")
      } catch (error) {
        console.warn("无法访问localStorage:", error)
        this.token = null
      }
    }
  }

  private async mockRequest<T>(data: T, delay = 500): Promise<ApiResponse<T>> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, delay))

    return {
      success: true,
      data,
      message: "操作成功",
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // 在开发环境中使用模拟数据
    if (process.env.NODE_ENV === "development" || !this.baseUrl.startsWith("http")) {
      return this.handleMockRequest<T>(endpoint, options)
    }

    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      // 降级到模拟数据
      return this.handleMockRequest<T>(endpoint, options)
    }
  }

  private async handleMockRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    console.log(`🔄 使用模拟数据: ${options.method || "GET"} ${endpoint}`)

    // 根据端点返回相应的模拟数据
    if (endpoint === "/rooms") {
      return this.mockRequest(mockData.rooms as T)
    }

    if (endpoint.startsWith("/rooms/")) {
      const roomId = endpoint.split("/")[2]
      const room = mockData.rooms.find((r) => r.id === roomId)
      return this.mockRequest(room as T)
    }

    if (endpoint === "/products") {
      return this.mockRequest({ products: mockData.products, total: mockData.products.length } as T)
    }

    if (endpoint === "/members") {
      return this.mockRequest({ members: mockData.members, total: mockData.members.length } as T)
    }

    if (endpoint === "/employees") {
      return this.mockRequest(mockData.employees as T)
    }

    if (endpoint === "/inventory") {
      const inventory = mockData.products.map((p) => ({
        id: `inv-${p.id}`,
        productId: p.id,
        productName: p.name,
        warehouseId: "warehouse-001",
        warehouseName: "主仓库",
        quantity: p.stock,
        minStock: 10,
        maxStock: 200,
        lastUpdated: new Date().toISOString(),
      }))
      return this.mockRequest(inventory as T)
    }

    // 默认返回成功响应
    return this.mockRequest({ success: true } as T)
  }

  // 认证相关
  async login(_username: string, _password: string) {
    const mockToken = "mock-jwt-token-" + Date.now()
    const mockUser = mockData.employees[0]

    if (this.isClient) {
      try {
        localStorage.setItem("auth_token", mockToken)
      } catch (error) {
        console.warn("无法保存token到localStorage:", error)
      }
    }

    this.token = mockToken

    return this.mockRequest({ token: mockToken, user: mockUser })
  }

  async logout() {
    if (this.isClient) {
      try {
        localStorage.removeItem("auth_token")
      } catch (error) {
        console.warn("无法从localStorage删除token:", error)
      }
    }
    this.token = null
    return this.mockRequest({ success: true })
  }

  // 包厢管理 API
  async getRooms(): Promise<ApiResponse<Room[]>> {
    return this.request("/rooms")
  }

  async getRoomById(id: string): Promise<ApiResponse<Room>> {
    return this.request(`/rooms/${id}`)
  }

  async updateRoomStatus(id: string, status: string, data?: any): Promise<ApiResponse<Room>> {
    return this.request(`/rooms/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, ...data }),
    })
  }

  async startRoom(roomId: string, customerId?: string, packageId?: string): Promise<ApiResponse<any>> {
    const mockOrder = {
      id: `order-${Date.now()}`,
      roomId,
      customerId,
      packageId,
      status: "active",
      startTime: new Date().toISOString(),
      items: [],
      total: 0,
    }
    return this.mockRequest(mockOrder)
  }

  async checkoutRoom(_roomId: string): Promise<ApiResponse<{ orderId: string; total: number }>> {
    return this.mockRequest({ orderId: `order-${Date.now()}`, total: 299.5 })
  }

  // 订单管理 API
  async getOrders(_params?: any): Promise<ApiResponse<{ orders: Order[]; total: number }>> {
    return this.request("/orders")
  }

  async createOrder(orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  }

  async updateOrder(id: string, orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    return this.request(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    })
  }

  async addOrderItem(orderId: string, item: Omit<OrderItem, "id">): Promise<ApiResponse<OrderItem>> {
    return this.request(`/orders/${orderId}/items`, {
      method: "POST",
      body: JSON.stringify(item),
    })
  }

  // 商品管理 API
  async getProducts(_params?: any): Promise<ApiResponse<{ products: Product[]; total: number }>> {
    return this.request("/products")
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.request(`/products/${id}`)
  }

  async createProduct(productData: Omit<Product, "id">): Promise<ApiResponse<Product>> {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    })
  }

  // 员工管理 API
  async getEmployees(): Promise<ApiResponse<Employee[]>> {
    return this.request("/employees")
  }

  async createEmployee(employeeData: Omit<Employee, "id">): Promise<ApiResponse<Employee>> {
    return this.request("/employees", {
      method: "POST",
      body: JSON.stringify(employeeData),
    })
  }

  async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<ApiResponse<Employee>> {
    return this.request(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employeeData),
    })
  }

  // 会员管理 API
  async getMembers(_params?: any): Promise<ApiResponse<{ members: Member[]; total: number }>> {
    return this.request("/members")
  }

  async getMemberByPhone(phone: string): Promise<ApiResponse<Member>> {
    const member = mockData.members.find((m) => m.phone === phone)
    return this.mockRequest(member)
  }

  // 库存管理 API
  async getInventory(_warehouseId?: string): Promise<ApiResponse<any[]>> {
    return this.request("/inventory")
  }

  async updateInventory(_productId: string, _warehouseId: string, _quantity: number): Promise<ApiResponse<any>> {
    return this.request("/inventory/update", {
      method: "POST",
      body: JSON.stringify({ productId: _productId, warehouseId: _warehouseId, quantity: _quantity }),
    })
  }

  // 报表 API
  async getSalesReport(_startDate: string, _endDate: string): Promise<ApiResponse<any>> {
    const mockReport = {
      totalSales: 15680.5,
      totalOrders: 45,
      averageOrderValue: 348.5,
      topProducts: mockData.products.slice(0, 3),
      salesByCategory: [
        { category: "酒水", amount: 8500, percentage: 54.2 },
        { category: "小食", amount: 4200, percentage: 26.8 },
        { category: "套餐", amount: 2980.5, percentage: 19.0 },
      ],
    }
    return this.mockRequest(mockReport)
  }

  async getRoomUtilizationReport(_startDate: string, _endDate: string): Promise<ApiResponse<any>> {
    return this.mockRequest({
      totalRooms: mockData.rooms.length,
      occupancyRate: 75.5,
      averageSessionDuration: 3.2,
    })
  }

  // 系统设置 API
  async getSettings(): Promise<ApiResponse<any>> {
    return this.mockRequest({
      storeName: "智慧商家KTV",
      currency: "CNY",
      timezone: "Asia/Shanghai",
      language: "zh-CN",
    })
  }

  async updateSettings(settings: any): Promise<ApiResponse<any>> {
    return this.request("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    })
  }
}

// 创建 API 客户端实例
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL || "mock://localhost")

export default ApiClient
