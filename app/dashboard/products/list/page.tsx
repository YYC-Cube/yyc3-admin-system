"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Download, Edit, Trash2, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ProductDialog } from "@/components/dialogs/product-dialog"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { productService } from "@/lib/api/services/products"
import type { Product, ProductCategory } from "@/lib/types"
import type { ProductFormData } from "@/lib/validations/product"

export default function ProductListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProductId, setDeletingProductId] = useState<string>("")

  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ])

      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data.items)
      }
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data)
      }
    } catch (error) {
      console.error("[v0] 加载数据失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载商品数据,请刷新页面重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitProduct = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        const res = await productService.updateProduct(editingProduct.id, data)
        if (res.success) {
          toast({
            title: "更新成功",
            description: "商品信息已更新",
          })
          await loadData()
        }
      } else {
        const res = await productService.createProduct(data)
        if (res.success) {
          toast({
            title: "创建成功",
            description: "商品已创建",
          })
          await loadData()
        }
      }
    } catch (error) {
      console.error("[v0] 提交商品失败:", error)
      toast({
        title: "操作失败",
        description: "无法保存商品信息",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async () => {
    try {
      const res = await productService.deleteProduct(deletingProductId)
      if (res.success) {
        toast({
          title: "删除成功",
          description: "商品已删除",
        })
        await loadData()
      }
    } catch (error) {
      console.error("[v0] 删除商品失败:", error)
      toast({
        title: "删除失败",
        description: "无法删除商品",
        variant: "destructive",
      })
    }
  }

  const handleAddProduct = () => {
    setEditingProduct(undefined)
    setProductDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductDialogOpen(true)
  }

  const handleDeleteClick = (productId: string) => {
    setDeletingProductId(productId)
    setDeleteDialogOpen(true)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">商品管理</h1>
        <p className="mt-2 text-muted-foreground">管理商品资料、类型和口味设置</p>
      </motion.div>

      {/* 标签页切换 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="list">商品列表</TabsTrigger>
            <TabsTrigger value="category">商品类型</TabsTrigger>
            <TabsTrigger value="flavor">商品口味</TabsTrigger>
          </TabsList>

          {/* 商品列表标签页 */}
          <TabsContent value="list" className="space-y-6">
            {/* 搜索和操作区域 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="搜索商品名称或编号..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddProduct}>
                      <Plus className="mr-2 h-4 w-4" />
                      新增商品
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      导入商品
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="商品类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="销售状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="sale">销售中</SelectItem>
                      <SelectItem value="stop">已停售</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="w-full bg-transparent" onClick={loadData}>
                    <Search className="mr-2 h-4 w-4" />
                    查询
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 商品表格 */}
            <Card>
              <CardHeader>
                <CardTitle>商品列表 ({filteredProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">加载中...</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>商品图片</TableHead>
                          <TableHead>商品名称</TableHead>
                          <TableHead>商品类型</TableHead>
                          <TableHead>单位</TableHead>
                          <TableHead>原价</TableHead>
                          <TableHead>优惠价</TableHead>
                          <TableHead>会员价</TableHead>
                          <TableHead>库存</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product, index) => (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <TableCell>
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium text-foreground">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.alias}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {categories.find((c) => c.id === product.categoryId)?.name || "未分类"}
                              </Badge>
                            </TableCell>
                            <TableCell>{product.unit}</TableCell>
                            <TableCell className="text-muted-foreground line-through">
                              ¥{product.originalPrice.toFixed(2)}
                            </TableCell>
                            <TableCell className="font-medium text-foreground">¥{product.price.toFixed(2)}</TableCell>
                            <TableCell className="font-medium text-primary">
                              ¥{product.memberPrice.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={product.stock > product.minStock ? "default" : "destructive"}>
                                {product.stock}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-destructive"
                                  onClick={() => handleDeleteClick(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 商品类型标签页 */}
          <TabsContent value="category" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>商品类型管理</CardTitle>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加类型
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>显示顺序</TableHead>
                      <TableHead>商品类型</TableHead>
                      <TableHead>消费者端显示</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category, index) => (
                      <motion.tr
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <TableCell>{category.order}</TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <Badge variant={category.display ? "default" : "secondary"}>
                            {category.display ? "是" : "否"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              修改
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              删除
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 商品口味标签页 */}
          <TabsContent value="flavor" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>商品口味管理</CardTitle>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加口味
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>序号</TableHead>
                      <TableHead>商品口味</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category, index) => (
                      <motion.tr
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              修改
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              删除
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        product={editingProduct}
        categories={categories}
        onSubmit={handleSubmitProduct}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="确认删除"
        description="确定要删除这个商品吗?此操作无法撤销。"
        onConfirm={handleDeleteProduct}
        variant="destructive"
        confirmText="删除"
      />
    </div>
  )
}
