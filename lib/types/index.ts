// 数据类型定义

// 用户和权限相关
export interface User {
  id: string
  name: string
  phone: string
  role: UserRole
  storeId: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  CASHIER = "cashier",
  WAITER = "waiter",
}

export enum Permission {
  // 销售权限
  VIEW_ORDERS = "view_orders",
  CREATE_ORDERS = "create_orders",
  EDIT_ORDERS = "edit_orders",
  DELETE_ORDERS = "delete_orders",

  // 商品权限
  VIEW_PRODUCTS = "view_products",
  CREATE_PRODUCTS = "create_products",
  EDIT_PRODUCTS = "edit_products",
  DELETE_PRODUCTS = "delete_products",

  // 仓库权限
  VIEW_WAREHOUSE = "view_warehouse",
  MANAGE_WAREHOUSE = "manage_warehouse",

  // 报表权限
  VIEW_REPORTS = "view_reports",
  EXPORT_REPORTS = "export_reports",

  // 会员权限
  VIEW_MEMBERS = "view_members",
  MANAGE_MEMBERS = "manage_members",

  // 系统设置权限
  VIEW_SETTINGS = "view_settings",
  MANAGE_SETTINGS = "manage_settings",
}

// 商品相关
export interface Product {
  id: string
  name: string
  alias: string
  barcode: string[]
  categoryId: string
  category?: ProductCategory
  unit: string
  originalPrice: number
  price: number
  memberPrice: number
  memberPrices?: {
    level1?: number
    level2?: number
    level3?: number
    level4?: number
    level5?: number
  }
  stock: number
  minStock: number
  costPrice: number
  images: string[]
  flavors: string[]
  isGift: boolean
  allowDiscount: boolean
  isSale: boolean
  isRecommend: boolean
  isLowConsumption: boolean
  displayOrder: number
  commission?: {
    amount?: number
    percentage?: number
  }
  storeId: string
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: string
  name: string
  displayOrder: number
  isDisplay: boolean
  storeId: string
}

export interface ProductFlavor {
  id: string
  name: string
  storeId: string
}

// 订单相关
export interface Order {
  id: string
  orderNo: string
  storeId: string
  store?: Store
  roomId?: string
  room?: Room
  customerId?: string
  customer?: Member
  items: OrderItem[]
  totalAmount: number
  discountAmount: number
  paidAmount: number
  refundAmount: number
  orderType: OrderType
  paymentType: PaymentType
  paymentStatus: PaymentStatus
  orderSource: OrderSource
  salesPersonId?: string
  salesPerson?: User
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  product?: Product
  quantity: number
  price: number
  totalAmount: number
  discountAmount: number
  isGift: boolean
}

export enum OrderType {
  ROOM_PACKAGE = "room_package",
  DRINK = "drink",
  FOOD = "food",
  OTHER = "other",
}

export enum PaymentType {
  WECHAT = "wechat",
  ALIPAY = "alipay",
  MEMBER_CARD = "member_card",
  CASH = "cash",
  CARD = "card",
  CREDIT = "credit",
  CUSTOM1 = "custom1",
  CUSTOM2 = "custom2",
  CUSTOM3 = "custom3",
  CUSTOM4 = "custom4",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  REFUNDED = "refunded",
  PARTIAL_REFUND = "partial_refund",
}

export enum OrderSource {
  SELF_SERVICE = "self_service",
  TOUCHSCREEN = "touchscreen",
  APP = "app",
  WECHAT = "wechat",
}

// 会员相关
export interface Member {
  id: string
  cardNo: string
  name: string
  phone: string
  birthday?: string
  level: MemberLevel
  balance: {
    general: number
    room: number
    gift: number
  }
  points: {
    total: number
    used: number
    available: number
  }
  visitCount: number
  totalConsumption: number
  storeId: string
  createdAt: string
  updatedAt: string
}

export enum MemberLevel {
  LEVEL1 = 1,
  LEVEL2 = 2,
  LEVEL3 = 3,
  LEVEL4 = 4,
  LEVEL5 = 5,
}

// 仓库相关
export interface Warehouse {
  id: string
  name: string
  isStorageWarehouse: boolean
  storeId: string
}

export interface StockRecord {
  id: string
  warehouseId: string
  warehouse?: Warehouse
  productId: string
  product?: Product
  quantity: number
  type: StockRecordType
  relatedId?: string
  operatorId: string
  operator?: User
  createdAt: string
}

export enum StockRecordType {
  PURCHASE = "purchase",
  SALE = "sale",
  TRANSFER = "transfer",
  DAMAGE = "damage",
  INVENTORY = "inventory",
  STORAGE = "storage",
  RETRIEVE = "retrieve",
}

// 门店相关
export interface Store {
  id: string
  name: string
  address: string
  phone: string
  businessHours: {
    start: string
    end: string
  }
  roomCount: number
  settings: StoreSettings
  createdAt: string
  updatedAt: string
}

export interface StoreSettings {
  allowLowStockSale: boolean
  autoReceiveTasks: boolean
  mergeOrderItems: boolean
  printSettings: PrintSettings
  // 其他设置...
}

export interface PrintSettings {
  autoPrint: boolean
  printers: Printer[]
}

export interface Printer {
  id: string
  name: string
  ip: string
  type: PrinterType
  isDefault: boolean
}

export enum PrinterType {
  THERMAL_80MM = "thermal_80mm",
  THERMAL_58MM = "thermal_58mm",
  LASER = "laser",
}

// 包厢相关
export interface Room {
  id: string
  name: string
  type: RoomType
  area: string
  status: RoomStatus
  storeId: string
}

export enum RoomType {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  VIP = "vip",
  LUXURY = "luxury",
}

export enum RoomStatus {
  AVAILABLE = "available",
  OCCUPIED = "occupied",
  RESERVED = "reserved",
  CLEANING = "cleaning",
  MAINTENANCE = "maintenance",
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 表单验证类型
export interface ValidationError {
  field: string
  message: string
}

// 支付相关类型定义
export interface Payment {
  id: string
  orderId: string
  order?: Order
  amount: number
  paymentType: PaymentType
  paymentStatus: PaymentStatus
  transactionId?: string
  qrCode?: string
  expireAt?: string
  paidAt?: string
  refundedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PaymentCallback {
  transactionId: string
  orderId: string
  amount: number
  status: "success" | "failed"
  timestamp: string
}

// 通知相关类型定义
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  content: string
  data?: any
  isRead: boolean
  createdAt: string
}

export enum NotificationType {
  ORDER = "order",
  PAYMENT = "payment",
  INVENTORY = "inventory",
  MEMBER = "member",
  SYSTEM = "system",
}

// 数据导入导出相关类型
export interface ImportResult {
  success: number
  failed: number
  errors: ImportError[]
}

export interface ImportError {
  row: number
  field: string
  message: string
  data: any
}

export interface ExportOptions {
  format: "excel" | "csv"
  fields?: string[]
  filters?: any
}

// 多门店同步相关类型
export interface SyncRecord {
  id: string
  sourceStoreId: string
  targetStoreId: string
  dataType: SyncDataType
  dataId: string
  status: SyncStatus
  error?: string
  createdAt: string
  completedAt?: string
}

export enum SyncDataType {
  PRODUCT = "product",
  MEMBER = "member",
  ORDER = "order",
  SETTINGS = "settings",
}

export enum SyncStatus {
  PENDING = "pending",
  SYNCING = "syncing",
  SUCCESS = "success",
  FAILED = "failed",
}

// 数据分析相关类型
export interface AnalyticsData {
  date: string
  revenue: number
  orders: number
  members: number
  avgOrderValue: number
}

export interface TrendData {
  label: string
  value: number
  change: number
}

export interface CategorySales {
  category: string
  sales: number
  percentage: number
}
