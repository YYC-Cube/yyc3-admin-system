"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Radio, Wifi, WifiOff, Activity, MapPin, Settings } from "lucide-react"

interface RFIDReader {
  readerId: string
  type: "fixed" | "handheld"
  location: string
  status: "online" | "offline" | "error"
  lastHeartbeat: number
  tagsRead: number
  signalStrength?: number
}

export function RFIDReadersPanel() {
  const [readers, setReaders] = useState<RFIDReader[]>([
    {
      readerId: "READER_001",
      type: "fixed",
      location: "仓库入口",
      status: "online",
      lastHeartbeat: Date.now(),
      tagsRead: 1245,
      signalStrength: 95,
    },
    {
      readerId: "READER_002",
      type: "fixed",
      location: "A区货架",
      status: "online",
      lastHeartbeat: Date.now() - 30000,
      tagsRead: 856,
      signalStrength: 88,
    },
    {
      readerId: "READER_003",
      type: "fixed",
      location: "B区货架",
      status: "offline",
      lastHeartbeat: Date.now() - 600000,
      tagsRead: 432,
      signalStrength: 0,
    },
    {
      readerId: "READER_004",
      type: "handheld",
      location: "移动设备",
      status: "online",
      lastHeartbeat: Date.now() - 10000,
      tagsRead: 234,
      signalStrength: 92,
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="default" className="bg-green-500">
            <Wifi className="h-3 w-3 mr-1" />
            在线
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="secondary">
            <WifiOff className="h-3 w-3 mr-1" />
            离线
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive">
            <Activity className="h-3 w-3 mr-1" />
            错误
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    return type === "fixed" ? (
      <Badge variant="outline">固定式</Badge>
    ) : (
      <Badge variant="outline" className="bg-blue-50">
        手持式
      </Badge>
    )
  }

  const formatLastSeen = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)

    if (minutes > 0) return `${minutes}分钟前`
    return `${seconds}秒前`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>RFID读写器状态</CardTitle>
            <CardDescription>实时监控读写器运行状态</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            配置
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>读写器</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>位置</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>读取数</TableHead>
                <TableHead>信号强度</TableHead>
                <TableHead>最后心跳</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {readers.map((reader) => (
                <TableRow key={reader.readerId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Radio className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{reader.readerId}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(reader.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {reader.location}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(reader.status)}</TableCell>
                  <TableCell>
                    <span className="font-medium">{reader.tagsRead.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    {reader.status === "online" ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              reader.signalStrength! > 80
                                ? "bg-green-500"
                                : reader.signalStrength! > 50
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${reader.signalStrength}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{reader.signalStrength}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{formatLastSeen(reader.lastHeartbeat)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
