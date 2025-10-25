"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Users } from "lucide-react"

interface ChurnCustomer {
  id: string
  name: string
  riskScore: number
  reason: string
  recommendation: string
}

interface ChurnPredictionPanelProps {
  customers: ChurnCustomer[]
}

export function ChurnPredictionPanel({ customers }: ChurnPredictionPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          客户流失预测
        </CardTitle>
        <CardDescription>高风险客户预警</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.map((customer) => (
            <div key={customer.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{customer.name}</span>
                </div>
                <Badge variant="destructive">高风险</Badge>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">流失风险</span>
                  <span className="font-medium">{customer.riskScore}%</span>
                </div>
                <Progress value={customer.riskScore} className="h-2" />
              </div>

              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">
                  <span className="font-medium">原因:</span> {customer.reason}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">建议:</span> {customer.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
