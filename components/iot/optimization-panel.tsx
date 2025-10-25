"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingDown } from "lucide-react"

interface OptimizationSuggestion {
  title: string
  description: string
  savings: number
  priority: "high" | "medium" | "low"
}

interface OptimizationPanelProps {
  suggestions: OptimizationSuggestion[]
}

export function OptimizationPanel({ suggestions }: OptimizationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          节能优化建议
        </CardTitle>
        <CardDescription>AI智能分析节能方案</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{suggestion.title}</h4>
                <Badge
                  variant={
                    suggestion.priority === "high"
                      ? "destructive"
                      : suggestion.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {suggestion.priority === "high"
                    ? "高优先级"
                    : suggestion.priority === "medium"
                      ? "中优先级"
                      : "低优先级"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{suggestion.description}</p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-500">预计节省 ¥{suggestion.savings}/月</span>
                </div>
                <Button size="sm">应用建议</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
