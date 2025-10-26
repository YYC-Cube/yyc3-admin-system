"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// 抹零设置页面
export default function RoundingSettingsPage() {
  const [basicRounding, setBasicRounding] = useState("none")
  const [advancedSettings, setAdvancedSettings] = useState([
    {
      id: "1",
      storeId: "store_1",
      storeName: "启智KTV",
      rounding: "round_to_jiao",
      areaIds: ["all"],
      areaNames: "全部区域",
      applyToOrder: true,
      applyToBill: true,
    },
  ])

  const handleSaveBasic = () => {
    toast.success("抹零设置保存成功")
  }

  const roundingOptions = [
    { value: "none", label: "无", description: "不进行抹零处理" },
    { value: "round_to_jiao", label: "进位到角", description: "小数点后第二位进位" },
    { value: "round_to_yuan", label: "进位到1元", description: "小数点后全部进位" },
    { value: "round_to_10", label: "进位到10元", description: "个位数进位到10" },
    { value: "round_to_100", label: "进位到100元", description: "十位数进位到100" },
    { value: "round_jiao", label: "四舍五入到角", description: "小数点后第二位四舍五入" },
    { value: "round_yuan", label: "四舍五入到1元", description: "小数点后全部四舍五入" },
    { value: "round_10", label: "四舍五入到10元", description: "个位数四舍五入" },
    { value: "round_100", label: "四舍五入到100元", description: "十位数四舍五入" },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-3xl font-bold">抹零设置</h1>
          <p className="text-muted-foreground mt-1">配置账单金额的抹零规则</p>
        </div>
      </motion.div>

      {/* 基础抹零设置 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>基础抹零设置</CardTitle>
            <CardDescription>设置全局的抹零规则，适用于所有门店</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={basicRounding} onValueChange={setBasicRounding}>
              <div className="grid gap-4">
                {roundingOptions.map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor={option.value} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
            <div className="flex justify-end">
              <Button onClick={handleSaveBasic}>
                <Save className="mr-2 h-4 w-4" />
                保存设置
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 高级抹零设置 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>高级抹零设置</CardTitle>
            <CardDescription>针对不同区域、订单类型设置独立的抹零规则</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">抹零规则说明</p>
                  <p className="text-sm text-muted-foreground">
                    如果勾选后买单订单、现付订单、账单时，会被多次抹零。账单是由多个订单组成的。
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>适用门店</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择门店" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="store_1">启智KTV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>抹零设置</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择抹零方式" />
                    </SelectTrigger>
                    <SelectContent>
                      {roundingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>区域设置</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择区域" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部区域</SelectItem>
                      <SelectItem value="area_1">A区</SelectItem>
                      <SelectItem value="area_2">B区</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>类型设置</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">订单</SelectItem>
                      <SelectItem value="bill">账单</SelectItem>
                      <SelectItem value="both">订单和账单</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  添加规则
                </Button>
              </div>
            </div>

            {/* 已有规则列表 */}
            <div className="space-y-2">
              <Label>已配置规则</Label>
              <div className="border rounded-lg divide-y">
                {advancedSettings.map((setting) => (
                  <div key={setting.id} className="p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{setting.storeName}</p>
                      <p className="text-sm text-muted-foreground">
                        区域: {setting.areaNames} | 抹零方式:{" "}
                        {roundingOptions.find((o) => o.value === setting.rounding)?.label}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      删除
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 抹零示例 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>抹零示例</CardTitle>
            <CardDescription>不同抹零方式的计算示例</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium border-b pb-2">
                <div>原金额</div>
                <div>抹零方式</div>
                <div>抹零后金额</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>¥123.45</div>
                <div>进位到角</div>
                <div className="font-medium">¥123.50</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>¥123.45</div>
                <div>进位到1元</div>
                <div className="font-medium">¥124.00</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>¥123.45</div>
                <div>四舍五入到角</div>
                <div className="font-medium">¥123.50</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>¥123.45</div>
                <div>四舍五入到1元</div>
                <div className="font-medium">¥123.00</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
