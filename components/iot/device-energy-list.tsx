"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getDeviceIcon, type DeviceType } from "@/lib/utils/alert-helpers"

interface DeviceEnergy {
  name: string
  type: "lighting" | "ac" | "audio"
  consumption: number
  percentage: number
}

interface DeviceEnergyListProps {
  devices: DeviceEnergy[]
}

export function DeviceEnergyList({ devices }: DeviceEnergyListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>设备能耗排行</CardTitle>
        <CardDescription>各设备能源消耗占比</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map((device, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getDeviceIcon(device.type as DeviceType)}
                  <span className="font-medium">{device.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{device.consumption} kWh</p>
                  <p className="text-sm text-muted-foreground">{device.percentage}%</p>
                </div>
              </div>
              <Progress value={device.percentage} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
