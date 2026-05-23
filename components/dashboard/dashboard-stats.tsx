'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

interface Stat {
  id: string
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
}

interface DashboardStatsProps {
  data: Stat[]
}

export function DashboardStats({ data }: DashboardStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm">
                  <span className={stat.trend === 'up' ? 'text-emerald-600' : 'text-destructive'}>
                    {stat.change}
                  </span>
                  <span className="ml-1 text-muted-foreground">vs 昨日</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
