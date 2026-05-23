// 商品表单验证规则

import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "商品名称不能为空").max(100, "商品名称不能超过100个字符"),
  alias: z.string().optional(),
  barcode: z.array(z.string()).min(1, "至少需要一个条形码"),
  categoryId: z.string().min(1, "请选择商品类型"),
  unit: z.string().min(1, "请输入商品单位"),
  originalPrice: z.number().min(0, "原价不能为负数"),
  price: z.number().min(0, "优惠价不能为负数"),
  memberPrice: z.number().min(0, "会员价不能为负数"),
  stock: z.number().int().min(0, "库存不能为负数"),
  minStock: z.number().int().min(0, "最小库存不能为负数"),
  costPrice: z.number().min(0, "成本价不能为负数"),
  images: z.array(z.string()).optional(),
  flavors: z.array(z.string()).optional(),
  isGift: z.boolean().default(false),
  allowDiscount: z.boolean().default(true),
  isSale: z.boolean().default(true),
  isRecommend: z.boolean().default(false),
  isLowConsumption: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
})

export type ProductFormData = z.infer<typeof productSchema>

export const productCategorySchema = z.object({
  name: z.string().min(1, "类型名称不能为空").max(50, "类型名称不能超过50个字符"),
  displayOrder: z.number().int().min(0, "显示顺序不能为负数"),
  isDisplay: z.boolean().default(true),
})

export type ProductCategoryFormData = z.infer<typeof productCategorySchema>

export const productFlavorSchema = z.object({
  name: z.string().min(1, "口味名称不能为空").max(50, "口味名称不能超过50个字符"),
})

export type ProductFlavorFormData = z.infer<typeof productFlavorSchema>
