"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { useMobile } from "@/hooks/use-mobile"

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface ResponsiveTableProps {
  columns: Column[]
  data: any[]
  keyField?: string
}

export function ResponsiveTable({ columns, data, keyField = "id" }: ResponsiveTableProps) {
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((row) => (
          <Card key={row[keyField]}>
            <CardContent className="p-4">
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between py-2 border-b last:border-0">
                  <span className="font-medium text-sm text-muted-foreground">{column.label}</span>
                  <span className="text-sm">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row[keyField]}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
