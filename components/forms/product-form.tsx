// 商品表单组件

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { productSchema, type ProductFormData } from "@/lib/validations/product"
import type { Product, ProductCategory } from "@/lib/types"

interface ProductFormProps {
  product?: Product
  categories: ProductCategory[]
  onSubmit: (data: ProductFormData) => Promise<void>
  onCancel: () => void
}

export function ProductForm({ product, categories, onSubmit, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [barcodes, setBarcodes] = useState<string[]>(product?.barcode || [""])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          alias: product.alias,
          barcode: product.barcode,
          categoryId: product.categoryId,
          unit: product.unit,
          originalPrice: product.originalPrice,
          price: product.price,
          memberPrice: product.memberPrice,
          stock: product.stock,
          minStock: product.minStock,
          costPrice: product.costPrice,
          isGift: product.isGift,
          allowDiscount: product.allowDiscount,
          isSale: product.isSale,
          isRecommend: product.isRecommend,
          isLowConsumption: product.isLowConsumption,
          displayOrder: product.displayOrder,
        }
      : {
          barcode: [""],
          isGift: false,
          allowDiscount: true,
          isSale: true,
          isRecommend: false,
          isLowConsumption: false,
          displayOrder: 0,
        },
  })

  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addBarcode = () => {
    const newBarcodes = [...barcodes, ""]
    setBarcodes(newBarcodes)
    setValue("barcode", newBarcodes)
  }

  const removeBarcode = (index: number) => {
    const newBarcodes = barcodes.filter((_, i) => i !== index)
    setBarcodes(newBarcodes)
    setValue("barcode", newBarcodes)
  }

  const updateBarcode = (index: number, value: string) => {
    const newBarcodes = [...barcodes]
    newBarcodes[index] = value
    setBarcodes(newBarcodes)
    setValue("barcode", newBarcodes)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 条形码 */}
          <div className="space-y-2">
            <Label>商品条形码 *</Label>
            {barcodes.map((barcode, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={barcode}
                  onChange={(e) => updateBarcode(index, e.target.value)}
                  placeholder="输入或扫描条形码"
                />
                {barcodes.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeBarcode(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addBarcode}>
              <Plus className="mr-2 h-4 w-4" />
              添加条形码
            </Button>
            {errors.barcode && <p className="text-sm text-destructive">{errors.barcode.message}</p>}
          </div>

          {/* 商品名称 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">商品名称 *</Label>
              <Input id="name" {...register("name")} placeholder="请输入商品名称" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="alias">商品别名</Label>
              <Input id="alias" {...register("alias")} placeholder="请输入商品别名" />
            </div>
          </div>

          {/* 商品类型和单位 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categoryId">商品类型 *</Label>
              <Select onValueChange={(value) => setValue("categoryId", value)} defaultValue={product?.categoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择商品类型" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">商品单位 *</Label>
              <Input id="unit" {...register("unit")} placeholder="例如: 瓶、个、份" />
              {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
            </div>
          </div>

          {/* 价格信息 */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">原价 *</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                {...register("originalPrice", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.originalPrice && <p className="text-sm text-destructive">{errors.originalPrice.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">优惠价 *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberPrice">会员价 *</Label>
              <Input
                id="memberPrice"
                type="number"
                step="0.01"
                {...register("memberPrice", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.memberPrice && <p className="text-sm text-destructive">{errors.memberPrice.message}</p>}
            </div>
          </div>

          {/* 库存信息 */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="stock">当前库存 *</Label>
              <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} placeholder="0" />
              {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock">最小库存 *</Label>
              <Input id="minStock" type="number" {...register("minStock", { valueAsNumber: true })} placeholder="0" />
              {errors.minStock && <p className="text-sm text-destructive">{errors.minStock.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice">成本价 *</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                {...register("costPrice", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.costPrice && <p className="text-sm text-destructive">{errors.costPrice.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 其他设置 */}
      <Card>
        <CardHeader>
          <CardTitle>其他设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>赠送商品</Label>
              <p className="text-sm text-muted-foreground">是否可作为赠送商品</p>
            </div>
            <Switch checked={watch("isGift")} onCheckedChange={(checked) => setValue("isGift", checked)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>允许打折</Label>
              <p className="text-sm text-muted-foreground">是否参与打折活动</p>
            </div>
            <Switch
              checked={watch("allowDiscount")}
              onCheckedChange={(checked) => setValue("allowDiscount", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>销售商品</Label>
              <p className="text-sm text-muted-foreground">是否在售卖端口显示</p>
            </div>
            <Switch checked={watch("isSale")} onCheckedChange={(checked) => setValue("isSale", checked)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>推荐商品</Label>
              <p className="text-sm text-muted-foreground">是否在首页推荐</p>
            </div>
            <Switch checked={watch("isRecommend")} onCheckedChange={(checked) => setValue("isRecommend", checked)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>属于低消</Label>
              <p className="text-sm text-muted-foreground">是否纳入最低消费</p>
            </div>
            <Switch
              checked={watch("isLowConsumption")}
              onCheckedChange={(checked) => setValue("isLowConsumption", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder">显示顺序</Label>
            <Input
              id="displayOrder"
              type="number"
              {...register("displayOrder", { valueAsNumber: true })}
              placeholder="数字越大越靠前"
            />
            <p className="text-sm text-muted-foreground">用于控制商品在列表中的显示顺序,数字越大越靠前</p>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "更新商品" : "创建商品"}
        </Button>
      </div>
    </form>
  )
}
