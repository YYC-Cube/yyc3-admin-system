"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// 模拟员工数据
const employees = [
  {
    id: "1",
    name: "启智网络",
    phone: "13103790379",
    position: "主账号",
    status: "active",
  },
  {
    id: "2",
    name: "张俊南",
    phone: "18259429295",
    position: "测试很多权限",
    status: "active",
  },
  {
    id: "3",
    name: "黄柳坚",
    phone: "13666074127",
    position: "管理员权限",
    status: "active",
  },
  {
    id: "4",
    name: "服务员001",
    phone: "13779938520",
    position: "管理员权限",
    status: "active",
  },
  {
    id: "5",
    name: "Ixy",
    phone: "18955555555",
    position: "测试很多权限",
    status: "active",
  },
  {
    id: "6",
    name: "天线",
    phone: "15980301708",
    position: "收银员",
    status: "active",
  },
  {
    id: "7",
    name: "小能",
    phone: "15969869369",
    position: "禁用吧",
    status: "inactive",
  },
]

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">员工管理</h1>
        <p className="mt-2 text-muted-foreground">管理员工信息和权限设置</p>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">员工总数</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{employees.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">在职员工</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-600">
                    {employees.filter((e) => e.status === "active").length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <UserCheck className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">已禁用</p>
                  <p className="mt-2 text-2xl font-bold text-destructive">
                    {employees.filter((e) => e.status === "inactive").length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                  <UserX className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 搜索和操作区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索员工姓名或手机号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加员工
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 员工表格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>员工列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>手机号</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {employee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{employee.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{employee.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.position}</Badge>
                      </TableCell>
                      <TableCell>
                        {employee.status === "active" ? (
                          <Badge variant="default" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                            在职
                          </Badge>
                        ) : (
                          <Badge variant="destructive">已禁用</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
