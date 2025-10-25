"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle, AlertCircle } from "lucide-react"

interface DataSource {
  name: string
  status: "active" | "error"
  recordsToday: number
  lastSync: string
}

interface DataCollectionPanelProps {
  sources: DataSource[]
}

export function DataCollectionPanel({ sources }: DataCollectionPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          数据采集状态
        </CardTitle>
        <CardDescription>实时监控数据源</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sources.map((source, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {source.status === "active" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium">{source.name}</p>
                  <p className="text-sm text-muted-foreground">今日采集: {source.recordsToday.toLocaleString()} 条</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={source.status === "active" ? "default" : "destructive"}>
                  {source.status === "active" ? "正常" : "异常"}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">{source.lastSync}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
