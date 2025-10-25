"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductForm } from "@/components/forms/product-form"
import type { Product, ProductCategory } from "@/lib/types"
import type { ProductFormData } from "@/lib/validations/product"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
  categories: ProductCategory[]
  onSubmit: (data: ProductFormData) => Promise<void>
}

export function ProductDialog({ open, onOpenChange, product, categories, onSubmit }: ProductDialogProps) {
  const handleSubmit = async (data: ProductFormData) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "编辑商品" : "新增商品"}</DialogTitle>
        </DialogHeader>
        <ProductForm
          product={product}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
