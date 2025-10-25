"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { BarChart3 } from "lucide-react"

interface ComparisonData {
  name: string
  group1: number
  group2: number
}

interface ComparisonAnalysisPanelProps {
  data: ComparisonData[]
  group1Name: string
  group2Name: string
}

export function ComparisonAnalysisPanel({ data, group1Name, group2Name }: ComparisonAnalysisPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          对比分析
        </CardTitle>
        <CardDescription>
          {group1Name} vs {group2Name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="group1" fill="hsl(var(--primary))" name={group1Name} />
            <Bar dataKey="group2" fill="hsl(var(--chart-2))" name={group2Name} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
