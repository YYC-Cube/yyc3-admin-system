import { db } from "@/lib/db/mysql"

// 群组类型
export type GroupType = "department" | "team" | "project" | "custom"

// 消息类型
export type MessageType = "text" | "file" | "image" | "task" | "notification"

// 通知类型
export type NotificationType = "system" | "task" | "approval" | "announcement"

// 权限动作
export type PermissionAction = "read" | "write" | "delete" | "manage"

// 部门
export interface Department {
  id: string
  name: string
  parentId?: string
  managerId: string
  members: string[]
  createdAt: Date
  updatedAt: Date
}

// 团队
export interface Team {
  id: string
  name: string
  departmentId: string
  leaderId: string
  members: string[]
  createdAt: Date
  updatedAt: Date
}

// 角色
export interface Role {
  id: string
  name: string
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}

// 权限
export interface Permission {
  resource: string
  actions: PermissionAction[]
}

// 组织架构
export interface Organization {
  departments: Department[]
  teams: Team[]
  roles: Role[]
}

// 消息
export interface Message {
  id: string
  from: string
  to: string | string[]
  content: string
  type: MessageType
  groupId?: string
  fileUrl?: string
  timestamp: Date
  read: boolean
  readBy?: string[]
}

// 群组
export interface Group {
  id: string
  name: string
  type: GroupType
  members: string[]
  admins: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// 协作
export interface Collaboration {
  taskId: string
  participants: string[]
  messages: Message[]
  files: CollaborationFile[]
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface CollaborationFile {
  id: string
  name: string
  url: string
  uploadedBy: string
  uploadedAt: Date
}

// 通知
export interface Notification {
  id: string
  type: NotificationType
  title: string
  content: string
  userId: string
  read: boolean
  link?: string
  createdAt: Date
}

// 消息结果
export interface MessageResult {
  messageId: string
  success: boolean
  deliveredTo: string[]
  failedTo: string[]
}

export class InternalCommunicationFramework {
  /**
   * 发送消息
   */
  async sendMessage(from: string, to: string | string[], message: Partial<Message>): Promise<MessageResult> {
    const recipients = Array.isArray(to) ? to : [to]
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newMessage: Message = {
      id: messageId,
      from,
      to,
      content: message.content || "",
      type: message.type || "text",
      groupId: message.groupId,
      fileUrl: message.fileUrl,
      timestamp: new Date(),
      read: false,
      readBy: [],
    }

    const deliveredTo: string[] = []
    const failedTo: string[] = []

    // 保存消息
    try {
      await db.query(
        `INSERT INTO messages (id, from_user, to_user, content, type, group_id, file_url, timestamp, is_read, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          newMessage.id,
          newMessage.from,
          JSON.stringify(newMessage.to),
          newMessage.content,
          newMessage.type,
          newMessage.groupId,
          newMessage.fileUrl,
          newMessage.timestamp,
          newMessage.read,
        ],
      )

      // 为每个接收者创建消息记录
      for (const recipient of recipients) {
        try {
          await db.query(
            `INSERT INTO user_messages (user_id, message_id, is_read, created_at)
             VALUES (?, ?, ?, NOW())`,
            [recipient, messageId, false],
          )
          deliveredTo.push(recipient)

          // 发送实时通知（WebSocket/SSE）
          await this.sendRealtimeNotification(recipient, newMessage)
        } catch (error) {
          console.error(`[v0] Failed to deliver message to ${recipient}:`, error)
          failedTo.push(recipient)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to save message:", error)
      return {
        messageId,
        success: false,
        deliveredTo: [],
        failedTo: recipients,
      }
    }

    return {
      messageId,
      success: failedTo.length === 0,
      deliveredTo,
      failedTo,
    }
  }

  /**
   * 创建群组
   */
  async createGroup(name: string, members: string[], type: GroupType, createdBy: string): Promise<Group> {
    const groupId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const group: Group = {
      id: groupId,
      name,
      type,
      members,
      admins: [createdBy],
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.query(
      `INSERT INTO groups (id, name, type, members, admins, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        group.id,
        group.name,
        group.type,
        JSON.stringify(group.members),
        JSON.stringify(group.admins),
        group.createdBy,
        group.createdAt,
        group.updatedAt,
      ],
    )

    // 为每个成员创建群组关系
    for (const member of members) {
      await db.query(
        `INSERT INTO user_groups (user_id, group_id, joined_at)
         VALUES (?, ?, NOW())`,
        [member, groupId],
      )
    }

    return group
  }

  /**
   * 任务协同
   */
  async collaborateOnTask(taskId: string, participants: string[]): Promise<Collaboration> {
    const collaboration: Collaboration = {
      taskId,
      participants,
      messages: [],
      files: [],
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.query(
      `INSERT INTO task_collaborations (task_id, participants, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        collaboration.taskId,
        JSON.stringify(collaboration.participants),
        collaboration.status,
        collaboration.createdAt,
        collaboration.updatedAt,
      ],
    )

    // 为每个参与者发送通知
    for (const participant of participants) {
      await this.pushNotification(participant, {
        type: "task",
        title: "新的任务协作",
        content: `您被邀请参与任务 ${taskId} 的协作`,
        link: `/dashboard/ai-ops/ops?task=${taskId}`,
      })
    }

    return collaboration
  }

  /**
   * 推送通知
   */
  async pushNotification(userId: string, notification: Partial<Notification>): Promise<void> {
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newNotification: Notification = {
      id: notificationId,
      type: notification.type || "system",
      title: notification.title || "",
      content: notification.content || "",
      userId,
      read: false,
      link: notification.link,
      createdAt: new Date(),
    }

    await db.query(
      `INSERT INTO notifications (id, type, title, content, user_id, is_read, link, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newNotification.id,
        newNotification.type,
        newNotification.title,
        newNotification.content,
        newNotification.userId,
        newNotification.read,
        newNotification.link,
        newNotification.createdAt,
      ],
    )

    // 发送实时通知
    await this.sendRealtimeNotification(userId, newNotification)
  }

  /**
   * 权限检查
   */
  async checkPermission(userId: string, resource: string, action: PermissionAction): Promise<boolean> {
    // 获取用户角色
    const [userRoles] = await db.query(
      `SELECT r.* FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = ?`,
      [userId],
    )

    if (!userRoles || userRoles.length === 0) {
      return false
    }

    // 检查权限
    for (const role of userRoles) {
      const permissions = JSON.parse(role.permissions || "[]")

      for (const permission of permissions) {
        if (permission.resource === resource || permission.resource === "*") {
          if (permission.actions.includes(action) || permission.actions.includes("*")) {
            return true
          }
        }
      }
    }

    return false
  }

  /**
   * 获取组织架构
   */
  async getOrganization(): Promise<Organization> {
    // 获取部门
    const [departments] = await db.query(`SELECT * FROM departments ORDER BY name`)

    // 获取团队
    const [teams] = await db.query(`SELECT * FROM teams ORDER BY name`)

    // 获取角色
    const [roles] = await db.query(`SELECT * FROM roles ORDER BY name`)

    return {
      departments: departments.map((d: any) => ({
        id: d.id,
        name: d.name,
        parentId: d.parent_id,
        managerId: d.manager_id,
        members: JSON.parse(d.members || "[]"),
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      })),
      teams: teams.map((t: any) => ({
        id: t.id,
        name: t.name,
        departmentId: t.department_id,
        leaderId: t.leader_id,
        members: JSON.parse(t.members || "[]"),
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      })),
      roles: roles.map((r: any) => ({
        id: r.id,
        name: r.name,
        permissions: JSON.parse(r.permissions || "[]"),
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })),
    }
  }

  /**
   * 创建部门
   */
  async createDepartment(name: string, managerId: string, parentId?: string): Promise<Department> {
    const departmentId = `dept_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const department: Department = {
      id: departmentId,
      name,
      parentId,
      managerId,
      members: [managerId],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.query(
      `INSERT INTO departments (id, name, parent_id, manager_id, members, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        department.id,
        department.name,
        department.parentId,
        department.managerId,
        JSON.stringify(department.members),
        department.createdAt,
        department.updatedAt,
      ],
    )

    return department
  }

  /**
   * 创建团队
   */
  async createTeam(name: string, departmentId: string, leaderId: string, members: string[]): Promise<Team> {
    const teamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const team: Team = {
      id: teamId,
      name,
      departmentId,
      leaderId,
      members: [...members, leaderId],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.query(
      `INSERT INTO teams (id, name, department_id, leader_id, members, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        team.id,
        team.name,
        team.departmentId,
        team.leaderId,
        JSON.stringify(team.members),
        team.createdAt,
        team.updatedAt,
      ],
    )

    return team
  }

  /**
   * 获取用户消息
   */
  async getUserMessages(userId: string, limit = 50): Promise<Message[]> {
    const [results] = await db.query(
      `SELECT m.*, um.is_read
       FROM messages m
       JOIN user_messages um ON m.id = um.message_id
       WHERE um.user_id = ?
       ORDER BY m.timestamp DESC
       LIMIT ?`,
      [userId, limit],
    )

    return results.map((r: any) => ({
      id: r.id,
      from: r.from_user,
      to: JSON.parse(r.to_user),
      content: r.content,
      type: r.type,
      groupId: r.group_id,
      fileUrl: r.file_url,
      timestamp: r.timestamp,
      read: r.is_read,
    }))
  }

  /**
   * 标记消息已读
   */
  async markMessageAsRead(userId: string, messageId: string): Promise<void> {
    await db.query(`UPDATE user_messages SET is_read = TRUE, read_at = NOW() WHERE user_id = ? AND message_id = ?`, [
      userId,
      messageId,
    ])
  }

  /**
   * 获取用户通知
   */
  async getUserNotifications(userId: string, limit = 20): Promise<Notification[]> {
    const [results] = await db.query(`SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`, [
      userId,
      limit,
    ])

    return results.map((r: any) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      content: r.content,
      userId: r.user_id,
      read: r.is_read,
      link: r.link,
      createdAt: r.created_at,
    }))
  }

  // 辅助方法

  private async sendRealtimeNotification(userId: string, data: any): Promise<void> {
    // 实现WebSocket/SSE实时推送
    // 这里是占位实现，实际需要集成WebSocket服务
    console.log(`[v0] Sending realtime notification to ${userId}:`, data)
  }
}

export const internalCommunicationFramework = new InternalCommunicationFramework()
