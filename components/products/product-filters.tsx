/**
 * 商品筛选组件 - 负责商品搜索和筛选
 */

"use client"

import { Search, Plus, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProductCategory } from "@/lib/types"

interface ProductFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: ProductCategory[]
  onAdd: () => void
  onImport: () => void
  onSearch: () => void
}

export function ProductFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onAdd,
  onImport,
  onSearch,
}: ProductFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索商品名称或编号..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              新增商品
            </Button>
            <Button variant="outline" onClick={onImport}>
              <Download className="mr-2 h-4 w-4" />
              导入商品
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
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
          <Button variant="outline" className="w-full bg-transparent" onClick={onSearch}>
            <Search className="mr-2 h-4 w-4" />
            查询
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
// </CHANGE>
