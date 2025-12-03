'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, TrendingUp, Users, Award } from 'lucide-react'

export function OpsTrackerDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // 模拟数据
  const stats = {
    totalTasks: 156,
    completedTasks: 128,
    overdueTasks: 8,
    anomalies: 12,
    avgCompletionRate: 82,
    avgQualityScore: 87,
    totalBonus: 15600,
    totalPenalty: 2400,
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 关键指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">任务完成率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedTasks}/{stats.totalTasks} 已完成
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">质量评分</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgQualityScore}/100</div>
            <p className="text-xs text-muted-foreground">平均质量评分</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">异常告警</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.anomalies}</div>
            <p className="text-xs text-muted-foreground">{stats.overdueTasks} 个逾期任务</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">奖惩总额</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ¥{(stats.totalBonus - stats.totalPenalty).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              奖励 ¥{stats.totalBonus.toLocaleString()} - 惩罚 ¥
              {stats.totalPenalty.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 详细内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="tasks">任务跟踪</TabsTrigger>
          <TabsTrigger value="anomalies">异常监控</TabsTrigger>
          <TabsTrigger value="performance">绩效评估</TabsTrigger>
          <TabsTrigger value="incentive">奖惩管理</TabsTrigger>
          <TabsTrigger value="optimization">优化建议</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>系统概览</CardTitle>
              <CardDescription>运维执行跟踪与奖惩系统整体情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">任务执行效率</span>
                  <span className="text-sm text-muted-foreground">较上月 +12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">异常识别率</span>
                  <span className="text-sm text-muted-foreground">95.6%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">员工积极性</span>
                  <span className="text-sm text-muted-foreground">较上月 +18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">运营成本</span>
                  <span className="text-sm text-green-600">较上月 -15%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>任务跟踪</CardTitle>
              <CardDescription>实时跟踪所有运营任务的执行情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(index => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">运营任务 #{index}</p>
                      <p className="text-xs text-muted-foreground">
                        负责人: 员工{index} | 截止: 2025-12-0{index}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${index % 3 === 0 ? 'bg-green-100 text-green-700' : index % 3 === 1 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}
                      >
                        {index % 3 === 0 ? '已完成' : index % 3 === 1 ? '进行中' : '待处理'}
                      </span>
                      <span className="text-sm font-medium">{85 + index * 2}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>异常监控</CardTitle>
              <CardDescription>智能识别和监控运营异常</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { type: '超时告警', desc: '任务A执行超时30分钟', level: 'high', time: '5分钟前' },
                  {
                    type: '质量异常',
                    desc: '服务质量评分低于标准',
                    level: 'medium',
                    time: '15分钟前',
                  },
                  { type: '资源预警', desc: '库存即将短缺', level: 'low', time: '1小时前' },
                ].map((anomaly, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <AlertTriangle
                      className={`h-5 w-5 mt-0.5 ${anomaly.level === 'high' ? 'text-red-500' : anomaly.level === 'medium' ? 'text-orange-500' : 'text-yellow-500'}`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{anomaly.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">{anomaly.desc}</p>
                      <p className="text-xs text-muted-foreground mt-1">{anomaly.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>绩效评估</CardTitle>
              <CardDescription>员工和部门绩效评估与排名</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: '张三', dept: '运营部', score: 95, rank: 1 },
                  { name: '李四', dept: '客服部', score: 92, rank: 2 },
                  { name: '王五', dept: '销售部', score: 88, rank: 3 },
                  { name: '赵六', dept: '技术部', score: 85, rank: 4 },
                ].map(employee => (
                  <div
                    key={employee.rank}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${employee.rank === 1 ? 'bg-yellow-100 text-yellow-700' : employee.rank === 2 ? 'bg-gray-100 text-gray-700' : employee.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}
                      >
                        #{employee.rank}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.dept}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{employee.score}</p>
                      <p className="text-xs text-muted-foreground">综合评分</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incentive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>奖惩管理</CardTitle>
              <CardDescription>自动计算和执行奖惩机制</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: '张三',
                    type: '奖励',
                    amount: 2000,
                    reason: '超额完成销售目标',
                    date: '2025-12-01',
                  },
                  {
                    name: '李四',
                    type: '奖励',
                    amount: 1500,
                    reason: '客户满意度第一名',
                    date: '2025-12-01',
                  },
                  {
                    name: '王五',
                    type: '惩罚',
                    amount: -500,
                    reason: '任务延期',
                    date: '2025-11-30',
                  },
                ].map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{record.name}</p>
                      <p className="text-xs text-muted-foreground">{record.reason}</p>
                      <p className="text-xs text-muted-foreground">{record.date}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${record.type === '奖励' ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {record.amount > 0 ? '+' : ''}¥{Math.abs(record.amount)}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${record.type === '奖励' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {record.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>优化建议</CardTitle>
              <CardDescription>AI分析并提供运营优化建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    title: '人员排班优化',
                    desc: '建议在周末高峰期增加2名服务人员',
                    impact: '高',
                    saving: '预计提升效率25%',
                  },
                  {
                    title: '库存管理建议',
                    desc: '建议提前采购畅销商品A和B',
                    impact: '中',
                    saving: '减少缺货损失15%',
                  },
                  {
                    title: '流程改进方案',
                    desc: '简化结账流程可减少客户等待时间',
                    impact: '高',
                    saving: '客户满意度+18%',
                  },
                ].map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg space-y-2 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-medium">{suggestion.title}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${suggestion.impact === '高' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                      >
                        影响: {suggestion.impact}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.desc}</p>
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <span>{suggestion.saving}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
