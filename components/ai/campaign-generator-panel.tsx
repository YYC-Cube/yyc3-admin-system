"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Target, Calendar, DollarSign } from "lucide-react"
import type { CustomerSegment, BusinessGoal, MarketingCampaign, GoalType } from "@/lib/ai/marketing-assistant"
import { marketingAssistant } from "@/lib/ai/marketing-assistant"

export function CampaignGeneratorPanel() {
  const [selectedSegment, setSelectedSegment] = useState<string>("")
  const [goalType, setGoalType] = useState<GoalType>("increase_revenue" as GoalType)
  const [targetValue, setTargetValue] = useState<number>(50000)
  const [timeframe, setTimeframe] = useState<number>(30)
  const [generatedCampaign, setGeneratedCampaign] = useState<MarketingCampaign | null>(null)
  const [generating, setGenerating] = useState(false)

  // 模拟客户细分数据
  const segments: CustomerSegment[] = [
    {
      id: "vip",
      name: "VIP客户",
      description: "高价值、高频次、近期活跃的核心客户",
      criteria: { minSpending: 5000, minVisits: 10 },
      memberCount: 342,
      avgLifetimeValue: 15000,
      characteristics: ["高消费", "高频次", "高忠诚度"],
    },
    {
      id: "loyal",
      name: "忠诚客户",
      description: "中高价值、高频次的稳定客户",
      criteria: { minSpending: 2000, minVisits: 8 },
      memberCount: 1256,
      avgLifetimeValue: 8000,
      characteristics: ["中高消费", "高频次", "稳定"],
    },
    {
      id: "potential",
      name: "潜力客户",
      description: "消费能力强但频次较低的客户",
      criteria: { minSpending: 3000, maxVisits: 5 },
      memberCount: 892,
      avgLifetimeValue: 6000,
      characteristics: ["高消费", "低频次", "有增长潜力"],
    },
  ]

  const handleGenerate = async () => {
    if (!selectedSegment) return

    setGenerating(true)

    // 模拟生成过程
    setTimeout(() => {
      const segment = segments.find((s) => s.id === selectedSegment)
      if (!segment) return

      const businessGoal: BusinessGoal = {
        type: goalType,
        targetValue,
        timeframe,
      }

      const campaign = marketingAssistant.generateCampaign(segment, businessGoal)
      setGeneratedCampaign(campaign)
      setGenerating(false)
    }, 1500)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 左侧：参数配置 */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI营销活动生成器
            </h3>
            <p className="text-sm text-muted-foreground mt-1">配置参数，AI将自动生成最优营销方案</p>
          </div>

          <div className="space-y-4">
            {/* 目标细分 */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                目标客户细分
              </Label>
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger>
                  <SelectValue placeholder="选择目标客户群" />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.name} ({segment.memberCount}人)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 业务目标 */}
            <div className="space-y-2">
              <Label>业务目标</Label>
              <Select value={goalType} onValueChange={(value) => setGoalType(value as GoalType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase_revenue">提升营业额</SelectItem>
                  <SelectItem value="increase_visits">增加访问次数</SelectItem>
                  <SelectItem value="reduce_churn">降低客户流失</SelectItem>
                  <SelectItem value="increase_member_balance">提升会员余额</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 目标值 */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                目标值（元）
              </Label>
              <Input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                placeholder="50000"
              />
            </div>

            {/* 时间范围 */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                时间范围（天）
              </Label>
              <Input
                type="number"
                value={timeframe}
                onChange={(e) => setTimeframe(Number(e.target.value))}
                placeholder="30"
              />
            </div>

            <Button onClick={handleGenerate} disabled={!selectedSegment || generating} className="w-full">
              {generating ? "AI生成中..." : "生成营销方案"}
            </Button>
          </div>
        </div>
      </Card>

      {/* 右侧：生成结果 */}
      <Card className="p-6">
        {generatedCampaign ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">{generatedCampaign.content.title}</h3>
              <Badge className="mt-2">{generatedCampaign.type}</Badge>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">活动描述</Label>
                <p className="mt-1">{generatedCampaign.content.description}</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">优惠内容</Label>
                <p className="mt-1 text-lg font-semibold text-primary">{generatedCampaign.content.offer}</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">活动条款</Label>
                <ul className="mt-1 space-y-1">
                  {generatedCampaign.content.terms.map((term, index) => (
                    <li key={index} className="text-sm">
                      • {term}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm text-muted-foreground">预算</Label>
                  <p className="text-xl font-bold">¥{generatedCampaign.budget.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">预期ROI</Label>
                  <p className="text-xl font-bold text-green-500">{generatedCampaign.expectedROI.toFixed(1)}x</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">发布活动</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  保存草稿
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-muted-foreground">
            <div>
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>配置参数后，AI将为您生成最优营销方案</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
