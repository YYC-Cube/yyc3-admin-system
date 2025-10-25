"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Filter } from "lucide-react"

interface FunnelStep {
  name: string
  users: number
  conversionRate: number
}

interface FunnelAnalysisPanelProps {
  steps: FunnelStep[]
}

export function FunnelAnalysisPanel({ steps }: FunnelAnalysisPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          漏斗分析
        </CardTitle>
        <CardDescription>转化漏斗各环节表现</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{step.name}</span>
                <div className="text-right">
                  <p className="font-semibold">{step.users.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{step.conversionRate}%</p>
                </div>
              </div>
              <Progress value={step.conversionRate} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
