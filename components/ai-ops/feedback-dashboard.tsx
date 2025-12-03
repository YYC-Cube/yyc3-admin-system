'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageSquare, TrendingUp, AlertCircle, ThumbsUp } from 'lucide-react'

export function FeedbackDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // 模拟数据
  const stats = {
    totalFeedback: 1248,
    avgSatisfaction: 78.5,
    responseRate: 92.3,
    resolutionRate: 87.6,
  }

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">反馈总数</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedback}</div>
            <p className="text-xs text-muted-foreground">本月收集反馈</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均满意度</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSatisfaction}分</div>
            <p className="text-xs text-green-600">+3.2% 较上月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">响应率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <p className="text-xs text-muted-foreground">24小时内响应</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">解决率</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolutionRate}%</div>
            <p className="text-xs text-green-600">+5.1% 较上月</p>
          </CardContent>
        </Card>
      </div>

      {/* 功能标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="customer">客户反馈</TabsTrigger>
          <TabsTrigger value="internal">内部反馈</TabsTrigger>
          <TabsTrigger value="insights">数据洞察</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>反馈概览</CardTitle>
              <CardDescription>查看所有反馈的汇总信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">总反馈数</p>
                  <p className="text-3xl font-bold">1,247</p>
                  <p className="text-xs text-green-600">较上月 +12%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">平均响应时间</p>
                  <p className="text-3xl font-bold">2.5h</p>
                  <p className="text-xs text-green-600">较上月 -18%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">处理率</p>
                  <p className="text-3xl font-bold">94%</p>
                  <p className="text-xs text-green-600">较上月 +8%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">客户满意度</p>
                  <p className="text-3xl font-bold">4.7/5</p>
                  <p className="text-xs text-green-600">较上月 +0.3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>客户反馈</CardTitle>
              <CardDescription>管理客户反馈，自动分类和情绪识别</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    customer: '张三',
                    feedback: '服务非常好，环境也很不错',
                    sentiment: 'positive',
                    status: '已处理',
                    time: '2小时前',
                  },
                  {
                    customer: '李四',
                    feedback: '等待时间有点长',
                    sentiment: 'negative',
                    status: '处理中',
                    time: '5小时前',
                  },
                  {
                    customer: '王五',
                    feedback: '价格合理，体验良好',
                    sentiment: 'positive',
                    status: '已处理',
                    time: '1天前',
                  },
                ].map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">{item.customer}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              item.sentiment === 'positive'
                                ? 'bg-green-100 text-green-700'
                                : item.sentiment === 'negative'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {item.sentiment === 'positive'
                              ? '正面'
                              : item.sentiment === 'negative'
                                ? '负面'
                                : '中立'}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              item.status === '已处理'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.feedback}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="internal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>内部反馈</CardTitle>
              <CardDescription>收集和管理员工反馈，支持匿名反馈</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    dept: '技术部',
                    feedback: '希望增加开发资源',
                    type: '资源需求',
                    anonymous: false,
                    time: '3小时前',
                  },
                  {
                    dept: '匿名',
                    feedback: '管理制度需要优化',
                    type: '管理建议',
                    anonymous: true,
                    time: '1天前',
                  },
                  {
                    dept: '运营部',
                    feedback: '团队协作氛围很好',
                    type: '积极评价',
                    anonymous: false,
                    time: '2天前',
                  },
                ].map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">{item.dept}</span>
                          {item.anonymous && (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                              匿名
                            </span>
                          )}
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.feedback}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>数据洞察</CardTitle>
              <CardDescription>反馈趋势分析和改进建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-lg">
                  <h4 className="text-sm font-semibold mb-2">趋势分析</h4>
                  <p className="text-sm text-muted-foreground">
                    近期客户反馈总体趋向正面，满意度持续上升，建议继续保持当前服务水平。
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500 rounded-lg">
                  <h4 className="text-sm font-semibold mb-2">改进建议</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 优化响应速度，目标控制1.5小时内</li>
                    <li>• 增加自动分类准确率，减少人工干预</li>
                    <li>• 建立反馈闭环机制，跟踪改进效果</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 rounded-lg">
                  <h4 className="text-sm font-semibold mb-2">亮点提示</h4>
                  <p className="text-sm text-muted-foreground">
                    本月收到218条积极反馈，主要集中在服务态度和环境氛围方面，建议对相关人员进行表彰。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
