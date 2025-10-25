"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Gift, TrendingUp, UserPlus, Edit, Trash2, DollarSign } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { MemberDialog } from "@/components/dialogs/member-dialog"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { memberService } from "@/lib/api/services/members"
import type { Member } from "@/lib/types"
import type { MemberFormData } from "@/lib/validations/member"

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  const [memberDialogOpen, setMemberDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingMemberId, setDeletingMemberId] = useState<string>("")

  const { toast } = useToast()

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      setLoading(true)
      const res = await memberService.getMembers()
      if (res.success && res.data) {
        setMembers(res.data.items)
      }
    } catch (error) {
      console.error("[v0] 加载会员数据失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载会员数据,请刷新页面重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitMember = async (data: MemberFormData) => {
    try {
      if (editingMember) {
        const res = await memberService.updateMember(editingMember.id, data)
        if (res.success) {
          toast({
            title: "更新成功",
            description: "会员信息已更新",
          })
          await loadMembers()
        }
      } else {
        const res = await memberService.createMember(data)
        if (res.success) {
          toast({
            title: "创建成功",
            description: "会员已创建",
          })
          await loadMembers()
        }
      }
    } catch (error) {
      console.error("[v0] 提交会员失败:", error)
      toast({
        title: "操作失败",
        description: "无法保存会员信息",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMember = async () => {
    try {
      const res = await memberService.deleteMember(deletingMemberId)
      if (res.success) {
        toast({
          title: "删除成功",
          description: "会员已删除",
        })
        await loadMembers()
      }
    } catch (error) {
      console.error("[v0] 删除会员失败:", error)
      toast({
        title: "删除失败",
        description: "无法删除会员",
        variant: "destructive",
      })
    }
  }

  const handleAddMember = () => {
    setEditingMember(undefined)
    setMemberDialogOpen(true)
  }

  const handleEditMember = (member: Member) => {
    setEditingMember(member)
    setMemberDialogOpen(true)
  }

  const handleDeleteClick = (memberId: string) => {
    setDeletingMemberId(memberId)
    setDeleteDialogOpen(true)
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      member.cardNumber.includes(searchTerm)
    const matchesLevel = selectedLevel === "all" || member.level === Number.parseInt(selectedLevel)
    return matchesSearch && matchesLevel
  })

  // 计算统计数据
  const stats = {
    totalMembers: members.length,
    newMembers: members.filter((m) => {
      const createdDate = new Date(m.createdAt)
      const now = new Date()
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      return createdDate > monthAgo
    }).length,
    totalConsumption: members.reduce((sum, m) => sum + m.totalConsumption, 0),
    totalPoints: members.reduce((sum, m) => sum + m.points, 0),
  }

  const columns = [
    {
      key: "avatar",
      label: "头像",
      render: (_: string, row: Member) => (
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary">{row.name[0]}</AvatarFallback>
        </Avatar>
      ),
    },
    { key: "cardNumber", label: "会员卡号" },
    { key: "name", label: "姓名" },
    { key: "phone", label: "手机号" },
    {
      key: "level",
      label: "会员等级",
      render: (value: number) => <Badge>{`${value}级会员`}</Badge>,
    },
    {
      key: "balance",
      label: "账户余额",
      render: (value: number) => <span className="font-medium">¥{value.toFixed(2)}</span>,
    },
    {
      key: "visitCount",
      label: "到店次数",
      render: (value: number) => <span className="font-semibold text-primary">{value}次</span>,
    },
    {
      key: "totalConsumption",
      label: "累计消费",
      render: (value: number) => <span className="font-semibold text-green-600">¥{value.toFixed(2)}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">会员管理</h1>
          <p className="text-sm text-muted-foreground">管理会员信息和会员权益</p>
        </div>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="总会员数"
          value={stats.totalMembers.toString()}
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
          description="较上月增长"
          delay={0}
        />
        <StatCard
          title="新增会员"
          value={stats.newMembers.toString()}
          icon={UserPlus}
          trend={{ value: 8.2, isPositive: true }}
          description="本月新增"
          delay={0.1}
        />
        <StatCard
          title="会员消费"
          value={`¥${(stats.totalConsumption / 10000).toFixed(1)}万`}
          icon={TrendingUp}
          trend={{ value: 15.3, isPositive: true }}
          description="累计总消费"
          delay={0.2}
        />
        <StatCard
          title="积分总额"
          value={`${(stats.totalPoints / 10000).toFixed(1)}万`}
          icon={Gift}
          trend={{ value: 5.7, isPositive: true }}
          description="会员积分总额"
          delay={0.3}
        />
      </div>

      {/* 筛选栏 */}
      <FilterBar
        searchPlaceholder="搜索会员卡号、姓名、手机号..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={handleAddMember}
        onExport={() => console.log("导出会员")}
        addButtonText="新增会员"
        filters={[
          {
            label: "会员等级",
            value: selectedLevel,
            options: [
              { label: "全部等级", value: "all" },
              { label: "一级会员", value: "1" },
              { label: "二级会员", value: "2" },
              { label: "三级会员", value: "3" },
              { label: "四级会员", value: "4" },
              { label: "五级会员", value: "5" },
            ],
            onChange: setSelectedLevel,
          },
        ]}
      />

      {/* 数据表格 */}
      <DataTable
        columns={columns}
        data={filteredMembers}
        loading={loading}
        onRowClick={(member) => handleEditMember(member)}
        actions={(member) => (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditMember(member)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <DollarSign className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive"
              onClick={() => handleDeleteClick(member.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <MemberDialog
        open={memberDialogOpen}
        onOpenChange={setMemberDialogOpen}
        member={editingMember}
        onSubmit={handleSubmitMember}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="确认删除"
        description="确定要删除这个会员吗?此操作无法撤销,会员的所有数据将被永久删除。"
        onConfirm={handleDeleteMember}
        variant="destructive"
        confirmText="删除"
      />
    </div>
  )
}
