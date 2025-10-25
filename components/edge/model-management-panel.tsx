"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, RefreshCw, Trash2, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"

interface Model {
  id: string
  name: string
  version: string
  type: string
  size: number
  loaded: boolean
}

export function ModelManagementPanel() {
  const [models] = useState<Model[]>([
    {
      id: "product-classifier",
      name: "商品分类模型",
      version: "1.0.0",
      type: "classification",
      size: 5242880,
      loaded: true,
    },
    {
      id: "demand-predictor",
      name: "需求预测模型",
      version: "1.0.0",
      type: "regression",
      size: 2097152,
      loaded: false,
    },
    {
      id: "recommendation-engine",
      name: "推荐引擎模型",
      version: "1.0.0",
      type: "recommendation",
      size: 10485760,
      loaded: true,
    },
  ])

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`
  }

  const handleLoadModel = async (modelId: string) => {
    console.log("加载模型:", modelId)
  }

  const handleUnloadModel = async (modelId: string) => {
    console.log("卸载模型:", modelId)
  }

  const handleUpdateModel = async (modelId: string) => {
    console.log("更新模型:", modelId)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">模型管理</h2>
          <p className="text-sm text-muted-foreground mt-1">管理边缘AI模型的加载、更新和卸载</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          添加模型
        </Button>
      </div>

      <div className="space-y-4">
        {models.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{model.name}</h3>
                  <Badge variant={model.loaded ? "default" : "secondary"}>
                    {model.loaded ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        已加载
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" />
                        未加载
                      </>
                    )}
                  </Badge>
                  <Badge variant="outline">{model.type}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>版本: {model.version}</span>
                  <span>大小: {formatSize(model.size)}</span>
                  <span>ID: {model.id}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {model.loaded ? (
                  <Button variant="outline" size="sm" onClick={() => handleUnloadModel(model.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    卸载
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleLoadModel(model.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    加载
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleUpdateModel(model.id)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  更新
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
