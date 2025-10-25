"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Cable as Cube } from "lucide-react"

export function OLAPAnalysisPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cube className="h-5 w-5" />
          OLAP多维分析
        </CardTitle>
        <CardDescription>自定义维度和度量进行分析</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>选择维度</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="选择分析维度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">时间</SelectItem>
              <SelectItem value="product">产品</SelectItem>
              <SelectItem value="region">地区</SelectItem>
              <SelectItem value="customer">客户</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>选择度量</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="选择分析指标" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">销售额</SelectItem>
              <SelectItem value="quantity">销量</SelectItem>
              <SelectItem value="profit">利润</SelectItem>
              <SelectItem value="margin">利润率</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-muted rounded-lg text-center text-sm text-muted-foreground">
          选择维度和度量后，将显示分析结果
        </div>
      </CardContent>
    </Card>
  )
}
