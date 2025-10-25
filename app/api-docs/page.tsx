// API文档页面

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Key, Book, Code, Zap } from "lucide-react"
import { apiDocumentation, generateApiKey } from "@/lib/services/api-platform"
import { toast } from "@/hooks/use-toast"

export default function ApiDocsPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [newKeyName, setNewKeyName] = useState("")

  const handleGenerateKey = () => {
    if (!newKeyName) {
      toast({ title: "请输入API密钥名称", variant: "destructive" })
      return
    }

    const newKey = generateApiKey(newKeyName, ["*"], 1000)
    setApiKeys([...apiKeys, newKey])
    setNewKeyName("")
    toast({ title: "API密钥生成成功" })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "已复制到剪贴板" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* 头部 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            启智KTV 开放API平台
          </h1>
          <p className="text-muted-foreground">强大的API接口，助力您的业务快速集成</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <Book className="mr-2 h-4 w-4" />
              概览
            </TabsTrigger>
            <TabsTrigger value="docs">
              <Code className="mr-2 h-4 w-4" />
              API文档
            </TabsTrigger>
            <TabsTrigger value="keys">
              <Key className="mr-2 h-4 w-4" />
              密钥管理
            </TabsTrigger>
          </TabsList>

          {/* 概览 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <Zap className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">快速集成</h3>
                <p className="text-sm text-muted-foreground">简单易用的RESTful API，5分钟即可完成集成</p>
              </Card>

              <Card className="p-6">
                <Key className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="font-semibold mb-2">安全可靠</h3>
                <p className="text-sm text-muted-foreground">API密钥认证，支持IP白名单和请求签名</p>
              </Card>

              <Card className="p-6">
                <Code className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="font-semibold mb-2">丰富功能</h3>
                <p className="text-sm text-muted-foreground">覆盖商品、订单、会员等核心业务场景</p>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">快速开始</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-medium mb-2">1. 生成API密钥</div>
                  <p className="text-sm text-muted-foreground">在"密钥管理"标签页生成您的API密钥</p>
                </div>
                <div>
                  <div className="font-medium mb-2">2. 发起API请求</div>
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`curl -X GET "https://api.ktv.com/v1/products" \\
  -H "X-API-Key: your_api_key" \\
  -H "X-API-Secret: your_api_secret"`}</pre>
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">3. 处理响应数据</div>
                  <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`{
  "code": 200,
  "data": {
    "items": [...],
    "total": 100
  }
}`}</pre>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* API文档 */}
          <TabsContent value="docs" className="space-y-6">
            {apiDocumentation.map((endpoint, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>{endpoint.method}</Badge>
                  <code className="text-sm font-mono">{endpoint.path}</code>
                </div>

                <p className="text-muted-foreground mb-4">{endpoint.description}</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">请求参数</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-2">参数名</th>
                            <th className="text-left p-2">类型</th>
                            <th className="text-left p-2">必填</th>
                            <th className="text-left p-2">说明</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param, i) => (
                            <tr key={i} className="border-t">
                              <td className="p-2 font-mono">{param.name}</td>
                              <td className="p-2">{param.type}</td>
                              <td className="p-2">{param.required ? "是" : "否"}</td>
                              <td className="p-2 text-muted-foreground">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">请求示例</h4>
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{JSON.stringify(endpoint.example.request, null, 2)}</pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">响应示例</h4>
                    <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{JSON.stringify(endpoint.example.response, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* 密钥管理 */}
          <TabsContent value="keys" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">生成新密钥</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="输入密钥名称（如：生产环境、测试环境）"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
                <Button onClick={handleGenerateKey}>生成密钥</Button>
              </div>
            </Card>

            <div className="space-y-4">
              {apiKeys.map((key) => (
                <Card key={key.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{key.name}</h4>
                      <p className="text-sm text-muted-foreground">创建于 {new Date(key.createdAt).toLocaleString()}</p>
                    </div>
                    <Badge variant={key.isActive ? "default" : "secondary"}>{key.isActive ? "活跃" : "已禁用"}</Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">API Key</div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">{key.key}</code>
                        <Button size="icon" variant="ghost" onClick={() => copyToClipboard(key.key)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-1">API Secret</div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">{key.secret}</code>
                        <Button size="icon" variant="ghost" onClick={() => copyToClipboard(key.secret)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm text-muted-foreground">请求限制: {key.rateLimit} 次/分钟</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          编辑
                        </Button>
                        <Button size="sm" variant="destructive">
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {apiKeys.length === 0 && (
                <Card className="p-12 text-center">
                  <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">暂无API密钥，请先生成一个密钥</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
