"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { memberSchema, type MemberFormData } from "@/lib/validations/member"
import type { Member } from "@/lib/types"

interface MemberFormProps {
  member?: Member
  onSubmit: (data: MemberFormData) => Promise<void>
  onCancel: () => void
}

export function MemberForm({ member, onSubmit, onCancel }: MemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: member
      ? {
          name: member.name,
          phone: member.phone,
          level: member.level,
          balance: member.balance,
          points: member.points,
          birthday: member.birthday,
          gender: member.gender,
          address: member.address,
          remark: member.remark,
        }
      : {
          level: 1,
          balance: 0,
          points: 0,
        },
  })

  const handleFormSubmit = async (data: MemberFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">会员姓名 *</Label>
              <Input id="name" {...register("name")} placeholder="请输入会员姓名" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">手机号码 *</Label>
              <Input id="phone" {...register("phone")} placeholder="请输入手机号码" />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="level">会员等级 *</Label>
              <Select
                onValueChange={(value) => setValue("level", Number.parseInt(value))}
                defaultValue={String(member?.level || 1)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择会员等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">一级会员</SelectItem>
                  <SelectItem value="2">二级会员</SelectItem>
                  <SelectItem value="3">三级会员</SelectItem>
                  <SelectItem value="4">四级会员</SelectItem>
                  <SelectItem value="5">五级会员</SelectItem>
                </SelectContent>
              </Select>
              {errors.level && <p className="text-sm text-destructive">{errors.level.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">性别</Label>
              <Select onValueChange={(value) => setValue("gender", value as any)} defaultValue={member?.gender}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男</SelectItem>
                  <SelectItem value="female">女</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">生日</Label>
              <Input id="birthday" type="date" {...register("birthday")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">地址</Label>
            <Input id="address" {...register("address")} placeholder="请输入地址" />
          </div>
        </CardContent>
      </Card>

      {/* 账户信息 */}
      {member && (
        <Card>
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>账户余额</Label>
                <div className="text-2xl font-bold text-primary">¥{member.balance.toFixed(2)}</div>
              </div>

              <div className="space-y-2">
                <Label>积分余额</Label>
                <div className="text-2xl font-bold text-primary">{member.points}</div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>累计消费</Label>
                <div className="text-lg font-medium">¥{member.totalConsumption.toFixed(2)}</div>
              </div>

              <div className="space-y-2">
                <Label>到店次数</Label>
                <div className="text-lg font-medium">{member.visitCount}次</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 备注信息 */}
      <Card>
        <CardHeader>
          <CardTitle>备注信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <Textarea id="remark" {...register("remark")} placeholder="请输入备注信息" rows={4} />
            {errors.remark && <p className="text-sm text-destructive">{errors.remark.message}</p>}
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
          {member ? "更新会员" : "创建会员"}
        </Button>
      </div>
    </form>
  )
}
