"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Download, FileSpreadsheet, Users, Package, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { importProducts, importMembers, downloadTemplate } from "@/lib/services/import"
import { exportProducts, exportOrders, exportMembers } from "@/lib/services/export"
import type { ImportResult } from "@/lib/types"

// 数据导入导出页面
export default function ImportExportPage() {
  const { toast } = useToast()
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  // 处理文件导入
  const handleImport = async (file: File, type: "products" | "members") => {
    setImporting(true)
    setImportResult(null)

    try {
      let result: ImportResult

      if (type === "products") {
        result = await importProducts(file)
      } else {
        result = await importMembers(file)
      }

      setImportResult(result)

      if (result.success > 0) {
        toast({
          title: "导入成功",
          description: `成功导入 ${result.success} 条数据${result.failed > 0 ? `,失败 ${result.failed} 条` : ""}`,
        })
      } else {
        toast({
          title: "导入失败",
          description: "没有成功导入任何数据,请检查文件格式",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "导入错误",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: "products" | "members") => {
    const file = event.target.files?.[0]
    if (file) {
      handleImport(file, type)
    }
  }

  // 导出数据
  const handleExport = async (type: "products" | "orders" | "members") => {
    try {
      if (type === "products") {
        await exportProducts()
      } else if (type === "orders") {
        await exportOrders()
      } else {
        await exportMembers()
      }

      toast({
        title: "导出成功",
        description: "数据已导出到文件",
      })
    } catch (error: any) {
      toast({
        title: "导出失败",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">数据导入导出</h1>
        <p className="mt-2 text-muted-foreground">批量导入导出数据,提高数据管理效率</p>
      </motion.div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList>
          <TabsTrigger value="import">数据导入</TabsTrigger>
          <TabsTrigger value="export">数据导出</TabsTrigger>
        </TabsList>

        {/* 数据导入 */}
        <TabsContent value="import" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* 商品导入 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  商品数据导入
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">支持批量导入商品信息,包括名称、价格、库存等</p>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => downloadTemplate("products")}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    下载导入模板
                  </Button>

                  <label htmlFor="product-import" className="block">
                    <Button className="w-full" disabled={importing} asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        {importing ? "导入中..." : "选择文件导入"}
                      </span>
                    </Button>
                    <input
                      id="product-import"
                      type="file"
                      accept=".csv,.xlsx"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, "products")}
                    />
                  </label>
                </div>

                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                  <p className="font-medium">导入说明:</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-xs">
                    <li>支持CSV和Excel格式</li>
                    <li>必填字段:商品名称、价格</li>
                    <li>建议先下载模板填写</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 会员导入 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  会员数据导入
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">支持批量导入会员信息,包括姓名、手机号、等级等</p>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => downloadTemplate("members")}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    下载导入模板
                  </Button>

                  <label htmlFor="member-import" className="block">
                    <Button className="w-full" disabled={importing} asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        {importing ? "导入中..." : "选择文件导入"}
                      </span>
                    </Button>
                    <input
                      id="member-import"
                      type="file"
                      accept=".csv,.xlsx"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, "members")}
                    />
                  </label>
                </div>

                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                  <p className="font-medium">导入说明:</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-xs">
                    <li>支持CSV和Excel格式</li>
                    <li>必填字段:姓名、手机号</li>
                    <li>手机号重复将自动跳过</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 导入结果 */}
          {importResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>导入结果</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                      <CheckCircle className="h-8 w-8 text-emerald-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">成功导入</p>
                        <p className="text-2xl font-bold text-emerald-600">{importResult.success}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                      <XCircle className="h-8 w-8 text-destructive" />
                      <div>
                        <p className="text-sm text-muted-foreground">导入失败</p>
                        <p className="text-2xl font-bold text-destructive">{importResult.failed}</p>
                      </div>
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">错误详情:</p>
                      <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
                        {importResult.errors.map((error, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-destructive">第{error.row}行:</span>
                            <span className="ml-2 text-muted-foreground">{error.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* 数据导出 */}
        <TabsContent value="export" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  商品数据
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">导出所有商品信息到Excel文件</p>
                <Button className="w-full" onClick={() => handleExport("products")}>
                  <Download className="mr-2 h-4 w-4" />
                  导出商品数据
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  订单数据
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">导出所有订单信息到Excel文件</p>
                <Button className="w-full" onClick={() => handleExport("orders")}>
                  <Download className="mr-2 h-4 w-4" />
                  导出订单数据
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  会员数据
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">导出所有会员信息到Excel文件</p>
                <Button className="w-full" onClick={() => handleExport("members")}>
                  <Download className="mr-2 h-4 w-4" />
                  导出会员数据
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
