"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

interface CustomerSegment {
  id: string
  name: string
  count: number
  percentage: number
  avgValue: number
  color: string
}

interface CustomerSegmentPanelProps {
  segments: CustomerSegment[]
}

export function CustomerSegmentPanel({ segments }: CustomerSegmentPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          客户分层
        </CardTitle>
        <CardDescription>基于RFM模型的客户细分</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {segments.map((segment) => (
            <div key={segment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                <div>
                  <div className="font-medium">{segment.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {segment.count}人 · {segment.percentage}%
                  </div>
                </div>
              </div>
              <Badge variant="secondary">¥{segment.avgValue.toLocaleString()}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
