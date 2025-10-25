"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export function InferenceTestPanel() {
  const [selectedModel, setSelectedModel] = useState("product-classifier")
  const [inputData, setInputData] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleRunInference = async () => {
    setLoading(true)
    try {
      // 模拟推理请求
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockResult = {
        predictions: [
          { label: "啤酒", confidence: 0.92 },
          { label: "小吃", confidence: 0.85 },
          { label: "饮料", confidence: 0.73 },
        ],
        latency: 42,
        modelVersion: "1.0.0",
        timestamp: Date.now(),
      }

      setResult(mockResult)
    } catch (error) {
      console.error("推理失败:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">推理测试</h2>
        <p className="text-sm text-muted-foreground mt-1">测试AI模型的推理功能和性能</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 输入区域 */}
        <div className="space-y-4">
          <div>
            <Label>选择模型</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product-classifier">商品分类模型</SelectItem>
                <SelectItem value="demand-predictor">需求预测模型</SelectItem>
                <SelectItem value="recommendation-engine">推荐引擎模型</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>输入数据</Label>
            <Textarea
              placeholder="输入测试数据（JSON格式）&#10;例如: [0.1, 0.2, 0.3, ...]"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="mt-2 h-32 font-mono text-sm"
            />
          </div>

          <Button onClick={handleRunInference} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                推理中...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                运行推理
              </>
            )}
          </Button>
        </div>

        {/* 结果区域 */}
        <div className="space-y-4">
          <Label>推理结果</Label>
          {result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">预测结果</span>
                  <span className="text-xs text-muted-foreground">延迟: {result.latency}ms</span>
                </div>
                <div className="space-y-2">
                  {result.predictions.map((pred: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{pred.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${pred.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {(pred.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">模型版本:</span>
                    <span className="font-medium">{result.modelVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">推理时间:</span>
                    <span className="font-medium">{new Date(result.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
              <p>运行推理后将显示结果</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
