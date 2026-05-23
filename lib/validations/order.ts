// 订单表单验证规则

import { z } from "zod"
import { OrderType, PaymentType } from "@/lib/types"

export const orderItemSchema = z.object({
  productId: z.string().min(1, "请选择商品"),
  quantity: z.number().int().min(1, "数量至少为1"),
  price: z.number().min(0, "价格不能为负数"),
  isGift: z.boolean().default(false),
})

export const orderSchema = z.object({
  storeId: z.string().min(1, "请选择门店"),
  roomId: z.string().optional(),
  customerId: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "至少需要一个商品"),
  orderType: z.nativeEnum(OrderType),
  paymentType: z.nativeEnum(PaymentType),
  discountAmount: z.number().min(0).default(0),
  salesPersonId: z.string().optional(),
})

export type OrderFormData = z.infer<typeof orderSchema>
