"use client"

import { ShoppingCart, Package, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>快捷操作</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <ShoppingCart className="mr-2 h-4 w-4" />
          新建订单
        </Button>
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <Package className="mr-2 h-4 w-4" />
          添加商品
        </Button>
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <Users className="mr-2 h-4 w-4" />
          会员管理
        </Button>
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <TrendingUp className="mr-2 h-4 w-4" />
          查看报表
        </Button>
      </CardContent>
    </Card>
  )
}
