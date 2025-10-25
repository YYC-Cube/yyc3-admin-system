"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Circle } from "lucide-react"

interface PathStep {
  page: string
  users: number
  dropRate: number
}

interface PathAnalysisPanelProps {
  steps: PathStep[]
}

export function PathAnalysisPanel({ steps }: PathAnalysisPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>用户路径分析</CardTitle>
        <CardDescription>用户浏览路径与流失点</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index}>
              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <Circle className="h-4 w-4 fill-primary text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{step.page}</p>
                  <p className="text-sm text-muted-foreground">{step.users} 位用户</p>
                </div>
                {step.dropRate > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-destructive">流失率</p>
                    <p className="font-semibold text-destructive">{step.dropRate}%</p>
                  </div>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
