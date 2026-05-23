// 会员表单验证规则

import { z } from "zod"

export const memberSchema = z.object({
  name: z.string().min(1, "请输入会员姓名").max(50, "姓名不能超过50个字符"),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号码"),
  level: z.number().min(1, "会员等级不能小于1").max(5, "会员等级不能大于5"),
  balance: z.number().min(0, "余额不能为负数").optional(),
  points: z.number().min(0, "积分不能为负数").optional(),
  birthday: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().max(200, "地址不能超过200个字符").optional(),
  remark: z.string().max(500, "备注不能超过500个字符").optional(),
})

export type MemberFormData = z.infer<typeof memberSchema>

export const rechargeSchema = z.object({
  amount: z.number().min(0.01, "充值金额必须大于0"),
  giftAmount: z.number().min(0, "赠送金额不能为负数").optional(),
  paymentMethod: z.string().min(1, "请选择支付方式"),
  remark: z.string().max(200, "备注不能超过200个字符").optional(),
})

export type RechargeFormData = z.infer<typeof rechargeSchema>
