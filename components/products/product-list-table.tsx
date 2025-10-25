/**
 * 商品列表表格组件 - 负责展示商品数据
 */

"use client"

import { motion } from "framer-motion"
import { Edit, Trash2, ImageIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product, ProductCategory } from "@/lib/types"

interface ProductListTableProps {
  products: Product[]
  categories: ProductCategory[]
  loading: boolean
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

export function ProductListTable({ products, categories, loading, onEdit, onDelete }: ProductListTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  return (
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
          {products.map((product, index) => (
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
                <Badge variant="outline">{categories.find((c) => c.id === product.categoryId)?.name || "未分类"}</Badge>
              </TableCell>
              <TableCell>{product.unit}</TableCell>
              <TableCell className="text-muted-foreground line-through">¥{product.originalPrice.toFixed(2)}</TableCell>
              <TableCell className="font-medium text-foreground">¥{product.price.toFixed(2)}</TableCell>
              <TableCell className="font-medium text-primary">¥{product.memberPrice.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={product.stock > product.minStock ? "default" : "destructive"}>{product.stock}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive"
                    onClick={() => onDelete(product.id)}
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
  )
}
// </CHANGE>
