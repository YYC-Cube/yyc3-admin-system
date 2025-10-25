"use client"

import { motion } from "framer-motion"
import { Save, Store, MapPin, Phone, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function StoreSettingsPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">门店设置</h1>
        <p className="mt-2 text-muted-foreground">配置门店基本信息和运营参数</p>
      </motion.div>

      {/* 基本信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              基本信息
            </CardTitle>
            <CardDescription>设置门店的基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">门店名称</Label>
                <Input id="storeName" placeholder="请输入门店名称" defaultValue="巨嗨KTV" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">联系电话</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="storePhone" placeholder="请输入联系电话" defaultValue="13103790379" className="pl-9" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeAddress">门店地址</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="storeAddress"
                  placeholder="请输入门店地址"
                  defaultValue="软件园二期观日路26号之二"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="openTime">营业开始时间</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="openTime" type="time" defaultValue="12:00" className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="closeTime">营业结束时间</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="closeTime" type="time" defaultValue="02:00" className="pl-9" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 支付设置 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>支付设置</CardTitle>
            <CardDescription>配置支付方式和相关参数</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>微信支付</Label>
                  <p className="text-sm text-muted-foreground">启用微信支付功能</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>支付宝支付</Label>
                  <p className="text-sm text-muted-foreground">启用支付宝支付功能</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>会员卡支付</Label>
                  <p className="text-sm text-muted-foreground">启用会员卡余额支付</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>现金支付</Label>
                  <p className="text-sm text-muted-foreground">启用现金支付功能</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 业务设置 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>业务设置</CardTitle>
            <CardDescription>配置业务相关参数</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>商品库存不足出货</Label>
                  <p className="text-sm text-muted-foreground">库存不足时是否允许继续出货</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>账单自动打印</Label>
                  <p className="text-sm text-muted-foreground">消费结束时自动打印账单</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>结账员工验证</Label>
                  <p className="text-sm text-muted-foreground">结账时需要员工身份验证</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>经理打折剔除不打折商品</Label>
                  <p className="text-sm text-muted-foreground">打折时自动排除不可打折商品</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 保存按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex justify-end gap-4"
      >
        <Button variant="outline">取消</Button>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          保存设置
        </Button>
      </motion.div>
    </div>
  )
}
