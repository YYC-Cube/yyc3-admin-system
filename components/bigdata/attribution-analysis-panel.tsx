"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target } from "lucide-react"

interface AttributionFactor {
  name: string
  contribution: number
  impact: string
}

interface AttributionAnalysisPanelProps {
  factors: AttributionFactor[]
  outcome: string
}

export function AttributionAnalysisPanel({ factors, outcome }: AttributionAnalysisPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          归因分析
        </CardTitle>
        <CardDescription>{outcome}的影响因素分析</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {factors.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{factor.name}</span>
                <span className="text-muted-foreground">{factor.contribution}%</span>
              </div>
              <Progress value={factor.contribution} />
              <p className="text-sm text-muted-foreground">{factor.impact}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
