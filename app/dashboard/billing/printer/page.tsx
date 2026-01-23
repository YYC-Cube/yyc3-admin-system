"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Printer, Receipt, Settings, ChevronLeft, ArrowLeft, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

/**
 * @file 账单打印配置页面
 * @description 配置账单打印相关设置，支持打印预览和参数调整
 * @module dashboard/billing/printer
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

export default function BillingPrinterPage() {
  const router = useRouter()
  
  // 打印配置状态
  const [printConfig, setPrintConfig] = useState({
    showHeader: true,
    showFooter: true,
    showItemDetails: true,
    showPaymentDetails: true,
    printLogo: true,
    printWatermark: false,
    paperSize: 'A4',
    orientation: 'portrait',
    fontSize: 'normal'
  })

  // 预览数据
  const [previewData] = useState({
    id: "ZD1901041651326204612",
    store: "启智",
    room: "星际穿越",
    type: "计时开房",
    amount: 12460.0,
    paid: 12460.0,
    time: "2019-01-04 16:51",
    items: [
      {
        id: 1,
        name: "房费",
        quantity: 1,
        price: 12000.0,
        amount: 12000.0
      },
      {
        id: 2,
        name: "服务费",
        quantity: 1,
        price: 460.0,
        amount: 460.0
      }
    ],
    payments: [
      {
        id: 1,
        method: "微信支付",
        amount: 12460.0
      }
    ]
  })

  // 处理配置更改
  const handleConfigChange = (key: string, value: any) => {
    setPrintConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // 处理打印操作
  const handlePrint = () => {
    console.log("执行打印操作，配置:", printConfig)
    // 实际项目中这里应该调用打印API或触发浏览器打印
  }

  // 处理保存配置
  const handleSaveConfig = () => {
    console.log("保存打印配置:", printConfig)
    // 实际项目中这里应该将配置保存到后端或本地存储
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和返回 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="p-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">打印设置</h1>
          <p className="text-sm text-muted-foreground">配置账单打印选项和预览</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧配置面板 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                打印配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 显示选项 */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">显示选项</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showHeader">显示页眉</Label>
                    <Switch 
                      id="showHeader" 
                      checked={printConfig.showHeader}
                      onCheckedChange={(checked) => handleConfigChange('showHeader', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showFooter">显示页脚</Label>
                    <Switch 
                      id="showFooter" 
                      checked={printConfig.showFooter}
                      onCheckedChange={(checked) => handleConfigChange('showFooter', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showItemDetails">显示消费明细</Label>
                    <Switch 
                      id="showItemDetails" 
                      checked={printConfig.showItemDetails}
                      onCheckedChange={(checked) => handleConfigChange('showItemDetails', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showPaymentDetails">显示支付详情</Label>
                    <Switch 
                      id="showPaymentDetails" 
                      checked={printConfig.showPaymentDetails}
                      onCheckedChange={(checked) => handleConfigChange('showPaymentDetails', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="printLogo">打印Logo</Label>
                    <Switch 
                      id="printLogo" 
                      checked={printConfig.printLogo}
                      onCheckedChange={(checked) => handleConfigChange('printLogo', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="printWatermark">打印水印</Label>
                    <Switch 
                      id="printWatermark" 
                      checked={printConfig.printWatermark}
                      onCheckedChange={(checked) => handleConfigChange('printWatermark', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* 页面设置 */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-medium">页面设置</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>纸张大小</Label>
                      <select 
                        value={printConfig.paperSize}
                        onChange={(e) => handleConfigChange('paperSize', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      >
                        <option value="A4">A4</option>
                        <option value="A5">A5</option>
                        <option value="receipt">收据纸</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label>页面方向</Label>
                      <select 
                        value={printConfig.orientation}
                        onChange={(e) => handleConfigChange('orientation', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      >
                        <option value="portrait">纵向</option>
                        <option value="landscape">横向</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>字体大小</Label>
                    <select 
                      value={printConfig.fontSize}
                      onChange={(e) => handleConfigChange('fontSize', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="small">小</option>
                      <option value="normal">正常</option>
                      <option value="large">大</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 pt-2">
                <Button className="flex-1" onClick={handleSaveConfig}>
                  保存配置
                </Button>
                <Button className="flex-1" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  打印
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧预览面板 */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                打印预览
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 预览容器 */}
              <div 
                className={`border rounded-md mx-auto bg-white p-6 ${printConfig.orientation === 'landscape' ? 'w-[842px] h-[595px]' : 'w-[595px] h-[842px]'}`}
                style={{
                  fontSize: printConfig.fontSize === 'small' ? '12px' : printConfig.fontSize === 'large' ? '16px' : '14px'
                }}
              >
                {/* 页眉 */}
                {printConfig.showHeader && (
                  <div className="text-center mb-6 pb-4 border-b">
                    {printConfig.printLogo && (
                      <div className="flex justify-center mb-2">
                        <div className="w-20 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          Logo
                        </div>
                      </div>
                    )}
                    <h2 className="text-xl font-bold">{previewData.store}</h2>
                    <p className="text-sm text-gray-600">消费账单</p>
                  </div>
                )}

                {/* 账单信息 */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">账单号</p>
                      <p className="font-mono">{previewData.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">消费时间</p>
                      <p>{previewData.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">消费包厢</p>
                      <p>{previewData.room}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">开房类型</p>
                      <Badge variant="outline" className="py-0">{previewData.type}</Badge>
                    </div>
                  </div>

                  {/* 消费明细 */}
                  {printConfig.showItemDetails && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2 border-b pb-1">消费明细</h3>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">商品名称</th>
                            <th className="text-center py-2">数量</th>
                            <th className="text-right py-2">单价</th>
                            <th className="text-right py-2">金额</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.items.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="py-2">{item.name}</td>
                              <td className="text-center py-2">{item.quantity}</td>
                              <td className="text-right py-2">¥{item.price.toFixed(2)}</td>
                              <td className="text-right py-2 font-medium">¥{item.amount.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3} className="text-right py-2 font-medium">合计</td>
                            <td className="text-right py-2 font-bold">¥{previewData.amount.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}

                  {/* 支付详情 */}
                  {printConfig.showPaymentDetails && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2 border-b pb-1">支付详情</h3>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">支付方式</th>
                            <th className="text-right py-2">支付金额</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.payments.map((payment) => (
                            <tr key={payment.id} className="border-b">
                              <td className="py-2">{payment.method}</td>
                              <td className="text-right py-2 font-medium">¥{payment.amount.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td className="text-right py-2 font-medium">实付金额</td>
                            <td className="text-right py-2 font-bold text-green-600">¥{previewData.paid.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                {/* 页脚 */}
                {printConfig.showFooter && (
                  <div className="mt-auto pt-4 border-t text-center text-sm text-gray-500">
                    <p>感谢您的光临！</p>
                    <p className="mt-1">本账单仅供参考，请以实际消费为准</p>
                  </div>
                )}

                {/* 水印 */}
                {printConfig.printWatermark && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
                    <div className="transform rotate-45 text-7xl font-bold text-gray-400">
                      预览
                    </div>
                  </div>
                )}
              </div>

              {/* 预览控制 */}
              <div className="flex justify-center mt-4 gap-2">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                  上一页
                </Button>
                <Button variant="ghost" size="sm">
                  第 1 页
                </Button>
                <Button variant="ghost" size="sm">
                  下一页
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
