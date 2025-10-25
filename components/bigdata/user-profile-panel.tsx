"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Tag } from "lucide-react"

interface UserProfile {
  name: string
  segment: string
  tags: string[]
  value: number
  lastVisit: string
}

interface UserProfilePanelProps {
  profile: UserProfile
}

export function UserProfilePanel({ profile }: UserProfilePanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          用户画像
        </CardTitle>
        <CardDescription>详细的用户行为特征</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-lg">{profile.name}</p>
            <p className="text-sm text-muted-foreground">最后访问: {profile.lastVisit}</p>
          </div>
          <Badge>{profile.segment}</Badge>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Tag className="h-4 w-4" />
            用户标签
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">客户价值</p>
          <p className="text-2xl font-bold">¥{profile.value.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}
