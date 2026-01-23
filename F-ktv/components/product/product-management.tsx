"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  Scan,
  Tag,
  Image as ImageIcon,
} from "lucide-react"

interface Product {
  id: string
  barcode?: string
  name: string
  alias?: string
  unit?: string
  originalPrice?: number
  salePrice?: number
  memberPrice?: number
  price?: number
  category: string
  categoryId?: string
  isGift?: boolean
  allowDiscount?: boolean
  isSaleProduct?: boolean
  isRecommended?: boolean
  isLowConsumption?: boolean
  showToConsumer?: boolean
  flavors?: string[]
  image?: string
  stock?: number
}

interface ProductCategory {
  id: string
  name: string
  displayOrder: number
  showToConsumer: boolean
  productCount: number
}



export default function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      barcode: "1234567890123",
      name: "雪花啤酒",
      alias: "雪花",
      unit: "瓶",
      originalPrice: 12,
      salePrice: 10,
      memberPrice: 8,
      category: "啤酒类",
      categoryId: "1",
      isGift: false,
      allowDiscount: true,
      isSaleProduct: true,
      isRecommended: true,
      isLowConsumption: false,
      showToConsumer: true,
      flavors: ["原味"],
      image: "https://picsum.photos/200/200",
      stock: 100,
    },
    {
      id: "2",
      barcode: "2345678901234",
      name: "五粮液",
      alias: "五粮液52度",
      unit: "瓶",
      originalPrice: 1299,
      salePrice: 1199,
      memberPrice: 1099,
      category: "白酒类",
      categoryId: "2",
      isGift: false,
      allowDiscount: false,
      isSaleProduct: false,
      isRecommended: true,
      isLowConsumption: false,
      showToConsumer: true,
      flavors: [],
      image: "https://picsum.photos/201/201",
      stock: 50,
    },
    {
      id: "3",
      barcode: "3456789012345",
      name: "薯片",
      alias: "乐事薯片",
      unit: "包",
      originalPrice: 5,
      salePrice: 4.5,
      memberPrice: 4,
      category: "小食类",
      categoryId: "3",
      isGift: false,
      allowDiscount: true,
      isSaleProduct: true,
      isRecommended: false,
      isLowConsumption: true,
      showToConsumer: true,
      flavors: ["原味", "番茄味"],
      image: "https://picsum.photos/202/202",
      stock: 200,
    },
  ])

  const [categories] = useState<ProductCategory[]>([
    {
      id: "1",
      name: "啤酒类",
      displayOrder: 1,
      showToConsumer: true,
      productCount: 15,
    },
    {
      id: "2",
      name: "白酒类",
      displayOrder: 2,
      showToConsumer: true,
      productCount: 10,
    },
    {
      id: "3",
      name: "小食类",
      displayOrder: 3,
      showToConsumer: true,
      productCount: 20,
    },
    {
      id: "4",
      name: "软饮类",
      displayOrder: 4,
      showToConsumer: true,
      productCount: 12,
    },
    {
      id: "5",
      name: "洋酒类",
      displayOrder: 5,
      showToConsumer: true,
      productCount: 8,
    },
    {
      id: "6",
      name: "其他",
      displayOrder: 6,
      showToConsumer: true,
      productCount: 5,
    },
  ])



  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isBatchOperationDialogOpen, setIsBatchOperationDialogOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [selectedTab, setSelectedTab] = useState("list")
  const [sortOption, setSortOption] = useState("default")
  const [filterOptions, setFilterOptions] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    inStockOnly: false,
    isGiftOnly: false,
    isSaleProductOnly: false,
  })
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    id: "",
    barcode: "",
    name: "",
    alias: "",
    unit: "",
    originalPrice: 0,
    salePrice: 0,
    memberPrice: 0,
    categoryId: "",
    isGift: false,
    allowDiscount: true,
    isSaleProduct: false,
    isRecommended: false,
    isLowConsumption: false,
    showToConsumer: true,
    flavors: [],
    stock: 0,
  })

  const productsPerPage = 10

  // 过滤产品
  const handleFilter = () => {
    let filtered = [...products]

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.alias?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.barcode?.includes(searchQuery)
      )
    }

    // 分类过滤
    if (filterOptions.category !== "all") {
      filtered = filtered.filter((product) => product.categoryId === filterOptions.category)
    }

    // 价格范围过滤
    if (filterOptions.minPrice) {
      const minPrice = parseFloat(filterOptions.minPrice)
      if (!isNaN(minPrice)) {
        filtered = filtered.filter((product) => (product.salePrice || 0) >= minPrice)
      }
    }
    if (filterOptions.maxPrice) {
      const maxPrice = parseFloat(filterOptions.maxPrice)
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter((product) => (product.salePrice || 0) <= maxPrice)
      }
    }

    // 库存过滤
    if (filterOptions.inStockOnly) {
      filtered = filtered.filter((product) => (product.stock || 0) > 0)
    }

    // 赠品过滤
    if (filterOptions.isGiftOnly) {
      filtered = filtered.filter((product) => product.isGift === true)
    }

    // 促销商品过滤
    if (filterOptions.isSaleProductOnly) {
      filtered = filtered.filter((product) => product.isSaleProduct === true)
    }

    // 排序
    switch (sortOption) {
      case "priceAsc":
        filtered.sort((a, b) => (a.salePrice || 0) - (b.salePrice || 0))
        break
      case "priceDesc":
        filtered.sort((a, b) => (b.salePrice || 0) - (a.salePrice || 0))
        break
      case "nameAsc":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "nameDesc":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "stockAsc":
        filtered.sort((a, b) => (a.stock || 0) - (b.stock || 0))
        break
      case "stockDesc":
        filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0))
        break
      default:
        // 默认排序
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }

  // 处理搜索输入
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // 清除过滤
  const clearFilters = () => {
    setSearchQuery("")
    setSortOption("default")
    setFilterOptions({
      category: "all",
      minPrice: "",
      maxPrice: "",
      inStockOnly: false,
      isGiftOnly: false,
      isSaleProductOnly: false,
    })
    setFilteredProducts(products)
    setCurrentPage(1)
  }

  // 全选/取消全选
  const handleSelectAll = () => {
    setIsSelectAll(!isSelectAll)
    if (!isSelectAll) {
      setSelectedProducts(filteredProducts.map((product) => product.id))
    } else {
      setSelectedProducts([])
    }
  }

  // 选择单个产品
  const handleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]
    )
  }

  // 处理添加产品
  const handleAddProduct = () => {
    const product: Product = {
      id: Date.now().toString(),
      barcode: newProduct.barcode || "",
      name: newProduct.name || "",
      alias: newProduct.alias,
      unit: newProduct.unit,
      originalPrice: newProduct.originalPrice,
      salePrice: newProduct.salePrice,
      memberPrice: newProduct.memberPrice,
      category: categories.find(c => c.id === newProduct.categoryId)?.name || "未分类",
      categoryId: newProduct.categoryId,
      isGift: newProduct.isGift,
      allowDiscount: newProduct.allowDiscount,
      isSaleProduct: newProduct.isSaleProduct,
      isRecommended: newProduct.isRecommended,
      isLowConsumption: newProduct.isLowConsumption,
      showToConsumer: newProduct.showToConsumer,
      flavors: newProduct.flavors,
      image: newProduct.image,
      stock: newProduct.stock,
    }

    setProducts([...products, product])
    handleFilter()
    setIsAddDialogOpen(false)
    setNewProduct({
      id: "",
      barcode: "",
      name: "",
      alias: "",
      unit: "",
      originalPrice: 0,
      salePrice: 0,
      memberPrice: 0,
      categoryId: "",
      isGift: false,
      allowDiscount: true,
      isSaleProduct: false,
      isRecommended: false,
      isLowConsumption: false,
      showToConsumer: true,
      flavors: [],
      stock: 0,
    })
  }

  // 处理删除产品
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id))
    handleFilter()
  }

  // 处理批量删除
  const handleBatchDelete = () => {
    setProducts(products.filter((product) => !selectedProducts.includes(product.id)))
    handleFilter()
    setSelectedProducts([])
    setIsSelectAll(false)
    setIsBatchOperationDialogOpen(false)
  }

  // 处理导入产品
  const handleImportProducts = () => {
    // 模拟导入操作
    console.log("导入产品")
    setIsImportDialogOpen(false)
  }

  // 处理导出产品
  const handleExportProducts = () => {
    // 模拟导出操作
    console.log("导出产品")
    setIsExportDialogOpen(false)
  }



  // 获取当前页产品
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  // 计算总页数
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // 计算总价
  const totalValue = currentProducts.reduce(
    (sum, p) => sum + ((p.salePrice || 0) * (p.stock || 0)),
    0
  )

  // 获取分类名称
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "未分类"
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || "未知分类"
  }



  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">产品管理</h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsImportDialogOpen(true)}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload size={16} />
              导入
            </Button>
            <Button
              onClick={() => setIsExportDialogOpen(true)}
              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Download size={16} />
              导出
            </Button>
            {selectedProducts.length > 0 && (
              <Button
                onClick={() => setIsBatchOperationDialogOpen(true)}
                className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
              >
                批量操作 ({selectedProducts.length})
              </Button>
            )}
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus size={16} />
              添加产品
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索产品名称、别名或条码"
              className="w-full pl-8"
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
            />
          </div>
          <Select value={filterOptions.category} onValueChange={(value) => setFilterOptions({ ...filterOptions, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="最低价"
            className="w-full"
            value={filterOptions.minPrice}
            onChange={(e) => setFilterOptions({ ...filterOptions, minPrice: e.target.value })}
          />
          <Input
            type="number"
            placeholder="最高价"
            className="w-full"
            value={filterOptions.maxPrice}
            onChange={(e) => setFilterOptions({ ...filterOptions, maxPrice: e.target.value })}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="in-stock-only"
              checked={filterOptions.inStockOnly}
              onCheckedChange={(checked) => setFilterOptions({ ...filterOptions, inStockOnly: checked })}
            />
            <Label htmlFor="in-stock-only">只看有库存</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="is-gift-only"
              checked={filterOptions.isGiftOnly}
              onCheckedChange={(checked) => setFilterOptions({ ...filterOptions, isGiftOnly: checked })}
            />
            <Label htmlFor="is-gift-only">只看赠品</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="is-sale-product-only"
              checked={filterOptions.isSaleProductOnly}
              onCheckedChange={(checked) => setFilterOptions({ ...filterOptions, isSaleProductOnly: checked })}
            />
            <Label htmlFor="is-sale-product-only">只看促销商品</Label>
          </div>
          <div className="flex-1" />
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">默认排序</SelectItem>
              <SelectItem value="priceAsc">价格从低到高</SelectItem>
              <SelectItem value="priceDesc">价格从高到低</SelectItem>
              <SelectItem value="nameAsc">名称A-Z</SelectItem>
              <SelectItem value="nameDesc">名称Z-A</SelectItem>
              <SelectItem value="stockAsc">库存从低到高</SelectItem>
              <SelectItem value="stockDesc">库存从高到低</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleFilter} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
            <Filter size={16} />
            筛选
          </Button>
          <Button onClick={clearFilters} variant="secondary">
            清除筛选
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="list">产品列表</TabsTrigger>
          <TabsTrigger value="analysis">数据分析</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <CardHeader>
                <CardTitle>产品总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{filteredProducts.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
              <CardHeader>
                <CardTitle>有库存产品</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {filteredProducts.filter((p) => (p.stock || 0) > 0).length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              <CardHeader>
                <CardTitle>促销产品</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {filteredProducts.filter((p) => p.isSaleProduct).length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500 to-amber-700 text-white">
              <CardHeader>
                <CardTitle>库存总值</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">¥{totalValue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelectAll}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      选择
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    条码
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    产品名称
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    分类
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    售价
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    会员价
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    库存
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-slate-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Scan size={16} className="text-slate-400" />
                        {product.barcode || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center">
                            <ImageIcon size={16} className="text-slate-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-900">{product.name}</div>
                          {product.alias && (
                            <div className="text-sm text-slate-500">{product.alias}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="secondary" className="bg-slate-100">
                        {getCategoryName(product.categoryId)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        ¥{product.salePrice?.toFixed(2) || '0.00'}
                      </div>
                      {product.originalPrice && product.salePrice && product.originalPrice > product.salePrice && (
                        <div className="text-xs text-slate-500 line-through">
                          ¥{product.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        ¥{product.memberPrice?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(product.stock || 0) <= 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {product.stock || 0}
                        {product.unit && <span className="ml-1">{product.unit}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {product.isGift && (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">赠品</Badge>
                        )}
                        {product.isSaleProduct && (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">促销</Badge>
                        )}
                        {product.isRecommended && (
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">推荐</Badge>
                        )}
                        {product.isLowConsumption && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">低消</Badge>
                        )}
                        {!product.showToConsumer && (
                          <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">隐藏</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={() => {
                            // 编辑产品逻辑
                          }}
                        >
                          <Edit size={16} className="text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 size={16} className="text-slate-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              显示 {(currentPage - 1) * productsPerPage + 1} 到 {Math.min(currentPage * productsPerPage, filteredProducts.length)} 共 {filteredProducts.length} 个产品
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                上一页
              </Button>
              <span className="text-sm text-slate-500">
                {currentPage} / {totalPages || 1}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                下一页
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>分类销售占比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.slice(0, 6).map((category, _index) => {
                    const percentage = Math.floor(Math.random() * 30) + 10
                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-900">{category.name}</span>
                          <span className="text-sm font-medium text-slate-900">{percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>热门产品TOP10</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.slice(0, 10).map((product) => {
                    const sales = Math.floor(Math.random() * 1000) + 100
                    return (
                      <div key={product.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center">
                                <ImageIcon size={16} className="text-slate-400" />
                              </div>
                            )}
                            <span className="text-sm font-medium text-slate-900">{product.name}</span>
                          </div>
                          <span className="text-sm font-medium text-slate-900">{sales} 件</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(sales / 10, 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 添加产品弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>添加产品</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                产品名称
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="请输入产品名称"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="barcode" className="text-right">
                条码
              </Label>
              <Input
                id="barcode"
                className="col-span-3"
                value={newProduct.barcode}
                onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                placeholder="请输入条码"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alias" className="text-right">
                别名
              </Label>
              <Input
                id="alias"
                className="col-span-3"
                value={newProduct.alias}
                onChange={(e) => setNewProduct({ ...newProduct, alias: e.target.value })}
                placeholder="请输入别名"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                分类
              </Label>
              <Select
                value={newProduct.categoryId}
                onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salePrice" className="text-right">
                售价
              </Label>
              <Input
                id="salePrice"
                type="number"
                className="col-span-3"
                value={newProduct.salePrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, salePrice: parseFloat(e.target.value) })
                }
                placeholder="请输入售价"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="memberPrice" className="text-right">
                会员价
              </Label>
              <Input
                id="memberPrice"
                type="number"
                className="col-span-3"
                value={newProduct.memberPrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, memberPrice: parseFloat(e.target.value) })
                }
                placeholder="请输入会员价"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="originalPrice" className="text-right">
                原价
              </Label>
              <Input
                id="originalPrice"
                type="number"
                className="col-span-3"
                value={newProduct.originalPrice}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, originalPrice: parseFloat(e.target.value) })
                }
                placeholder="请输入原价"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                库存
              </Label>
              <Input
                id="stock"
                type="number"
                className="col-span-3"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })
                }
                placeholder="请输入库存"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                单位
              </Label>
              <Input
                id="unit"
                className="col-span-3"
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                placeholder="请输入单位"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isGift" className="text-right">
                赠品
              </Label>
              <Switch
                id="isGift"
                checked={newProduct.isGift || false}
                onCheckedChange={(checked) => setNewProduct({ ...newProduct, isGift: checked })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="allowDiscount" className="text-right">
                允许折扣
              </Label>
              <Switch
                id="allowDiscount"
                checked={newProduct.allowDiscount || false}
                onCheckedChange={(checked) => setNewProduct({ ...newProduct, allowDiscount: checked })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isSaleProduct" className="text-right">
                促销商品
              </Label>
              <Switch
                id="isSaleProduct"
                checked={newProduct.isSaleProduct || false}
                onCheckedChange={(checked) => setNewProduct({ ...newProduct, isSaleProduct: checked })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isRecommended" className="text-right">
                推荐商品
              </Label>
              <Switch
                id="isRecommended"
                checked={newProduct.isRecommended || false}
                onCheckedChange={(checked) => setNewProduct({ ...newProduct, isRecommended: checked })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isLowConsumption" className="text-right">
                低消商品
              </Label>
              <Switch
                id="isLowConsumption"
                checked={newProduct.isLowConsumption || false}
                onCheckedChange={(checked) => setNewProduct({ ...newProduct, isLowConsumption: checked })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="showToConsumer" className="text-right">
                显示给顾客
              </Label>
              <Switch
                id="showToConsumer"
                checked={newProduct.showToConsumer || false}
                onCheckedChange={(checked) => setNewProduct({ ...newProduct, showToConsumer: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddProduct} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              确认添加
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 导入产品弹窗 */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>导入产品</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">
                拖拽文件到此处或点击上传Excel文件
              </p>
              <p className="text-xs text-slate-400 mt-1">
                支持格式：.xlsx, .xls
              </p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                选择文件
              </Button>
            </div>
            <div className="text-xs text-slate-500 space-y-2">
              <p>📋 导入说明：</p>
              <ul className="list-disc list-inside pl-2">
                <li>请下载模板并按模板格式填写数据</li>
                <li>导入的数据将追加到现有产品列表</li>
                <li>如条码重复，将更新现有产品信息</li>
              </ul>
              <Button variant="secondary" size="sm" className="mt-2">
                下载导入模板
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsImportDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleImportProducts} className="bg-blue-600 hover:bg-blue-700 text-white">
              开始导入
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 导出产品弹窗 */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>导出产品</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="export-all">导出全部产品</Label>
                <Switch id="export-all" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="export-with-images">包含产品图片</Label>
                <Switch id="export-with-images" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="export-filtered">仅导出筛选结果</Label>
                <Switch id="export-filtered" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="export-selected">仅导出选中产品</Label>
                <Switch id="export-selected" disabled={selectedProducts.length === 0} />
              </div>
            </div>
            <div className="text-sm text-slate-500 space-y-2">
              <p>📊 导出统计：</p>
              <ul className="list-disc list-inside pl-2">
                <li>产品总数：{products.length} 个</li>
                <li>筛选后：{filteredProducts.length} 个</li>
                <li>已选中：{selectedProducts.length} 个</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsExportDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleExportProducts} className="bg-green-600 hover:bg-green-700 text-white">
              开始导出
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 批量操作弹窗 */}
      <Dialog open={isBatchOperationDialogOpen} onOpenChange={setIsBatchOperationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>批量操作</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center py-3">
              <p className="text-lg font-medium">已选择 {selectedProducts.length} 个产品</p>
              <p className="text-sm text-slate-500 mt-1">请选择要执行的操作</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="destructive"
                className="w-full h-20 flex flex-col items-center justify-center gap-2"
                onClick={handleBatchDelete}
              >
                <Trash2 size={24} />
                <span>批量删除</span>
              </Button>
              <Button
                className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  // 批量修改分类
                }}
              >
                <Tag size={24} />
                <span>修改分类</span>
              </Button>
              <Button
                className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  // 批量上架
                }}
              >
                <CheckCircle size={24} />
                <span>批量上架</span>
              </Button>
              <Button
                className="w-full h-20 flex flex-col items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => {
                  // 批量下架
                }}
              >
                <XCircle size={24} />
                <span>批量下架</span>
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsBatchOperationDialogOpen(false)}>
              取消
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
