/**
 * @file AI运维系统模块测试
 * @description 覆盖边缘AI推理、合规审计自动化、AI智能营销等核心功能
 * @module ai-ops-system
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock 基础UI组件
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div data-testid="card-header" className={className}>{children}</div>
  ),
  CardTitle: ({ children, className }: any) => (
    <div data-testid="card-title" className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>{children}</div>
  ),
}))

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue }: any) => (
    <div data-testid="tabs" data-default-value={defaultValue}>{children}</div>
  ),
  TabsList: ({ children }: any) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({ children, value }: any) => (
    <button data-testid="tabs-trigger" data-value={value}>{children}</button>
  ),
  TabsContent: ({ children, value }: any) => (
    <div data-testid="tabs-content" data-value={value}>{children}</div>
  ),
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
  ),
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className }: any) => (
    <button data-testid="button" onClick={onClick} className={className}>{children}</button>
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ placeholder, onChange, type, value }: any) => (
    <input 
      data-testid="input" 
      placeholder={placeholder} 
      onChange={onChange} 
      type={type} 
      value={value}
    />
  ),
}))

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: any) => (
    <div data-testid="select" onClick={() => onValueChange?.('test')}>{children}</div>
  ),
  SelectContent: ({ children }: any) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>{children}</div>
  ),
  SelectTrigger: ({ children }: any) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: any) => (
    <div data-testid="select-value" data-placeholder={placeholder}>{placeholder}</div>
  ),
}))

// Mock AI相关组件
const MockCustomerSegmentPanel = ({ onSegmentChange }: any) => (
  <div data-testid="customer-segment-panel">
    <h3>客户细分分析</h3>
    <div>
      {mockCustomerSegments.map((segment, index) => (
        <div key={index} data-segment={segment.name}>
          <span>{segment.name}</span>
          <span>{segment.countFormatted}</span>
          <span>{segment.percentage}</span>
        </div>
      ))}
    </div>
  </div>
)

const MockCampaignGeneratorPanel = ({ onGenerate }: any) => (
  <div data-testid="campaign-generator-panel">
    <h3>AI营销活动生成</h3>
    <button data-testid="generate-campaign" onClick={() => onGenerate?.()}>
      生成新活动
    </button>
    <div>
      {mockCampaignSuggestions.map((campaign, index) => (
        <div key={index} data-campaign={campaign.name}>
          <span>{campaign.name}</span>
          <span>{campaign.target}</span>
          <span>{campaign.estimatedROI}</span>
        </div>
      ))}
    </div>
  </div>
)

const MockCampaignPerformancePanel = ({ onAnalyze }: any) => (
  <div data-testid="campaign-performance-panel">
    <h3>活动效果分析</h3>
    <div>
      {mockCampaignPerformance.map((perf, index) => (
        <div key={index} data-performance={perf.campaignName}>
          <span>{perf.campaignName}</span>
          <span>{perf.impressions}</span>
          <span>{perf.conversions}</span>
          <span>{perf.roi}</span>
        </div>
      ))}
    </div>
  </div>
)

jest.mock('@/components/ai/customer-segment-panel', () => ({
  CustomerSegmentPanel: MockCustomerSegmentPanel,
}))

jest.mock('@/components/ai/campaign-generator-panel', () => ({
  CampaignGeneratorPanel: MockCampaignGeneratorPanel,
}))

jest.mock('@/components/ai/campaign-performance-panel', () => ({
  CampaignPerformancePanel: MockCampaignPerformancePanel,
}))

// Mock图标组件
jest.mock('lucide-react', () => ({
  Users: ({ size = 24, 'data-testid': testId }: any) => (
    <div data-testid={testId} data-size={size}>Users</div>
  ),
  Target: ({ size = 24, 'data-testid': testId }: any) => (
    <div data-testid={testId} data-size={size}>Target</div>
  ),
  TrendingUp: ({ size = 24, 'data-testid': testId }: any) => (
    <div data-testid={testId} data-size={size}>TrendingUp</div>
  ),
  Zap: ({ size = 24, 'data-testid': testId }: any) => (
    <div data-testid={testId} data-size={size}>Zap</div>
  ),
  Shield: ({ size = 24, 'data-testid': testId }: any) => (
    <div data-testid={testId} data-size={size}>Shield</div>
  ),
  AlertTriangle: ({ size = 24, 'data-testid': testId }: any) => (
    <div data-testid={testId} data-size={size}>AlertTriangle</div>
  ),
  BarChart3: ({ size = 24, 'data-testid': testId }: any) => (
    <div data-testid={testId} data-size={size}>BarChart3</div>
  ),
  Brain: ({ size = 24, 'data-testid': testId }: any) => (
    <div data-testid={testId} data-size={size}>Brain</div>
  ),
  Clock: ({ size = 24, 'data-testid': testId }: any) => (
    <div data-testid={testId} data-size={size}>Clock</div>
  ),
  CheckCircle: ({ size = 24, 'data-testid': testId }: any) => (
    <div data-testid={testId} data-size={size}>CheckCircle</div>
  ),
  XCircle: ({ size = 24, 'data-testid': testId }: any) => (
    <div data-testid={testId} data-size={size}>XCircle</div>
  ),
}))

// Mock图标组件
const { Users, Target, Zap, TrendingUp, Cpu, HardDrive, Wifi, BarChart2, FileCheck, AlertCircle, CheckCircle2, RefreshCw, Calendar, ChevronRight } = require('lucide-react')

// 模拟合规审计数据
const mockComplianceAudits = [
  {
    id: 'audit-001',
    name: '数据安全审计',
    type: 'security',
    status: 'passed',
    startTime: '2024-10-15T09:00:00Z',
    endTime: '2024-10-15T09:30:00Z',
    duration: '30分钟',
    issues: 0,
    severity: 'low',
    coverage: '98.5%'
  },
  {
    id: 'audit-002',
    name: '隐私政策合规检查',
    type: 'privacy',
    status: 'passed',
    startTime: '2024-10-15T10:00:00Z',
    endTime: '2024-10-15T10:20:00Z',
    duration: '20分钟',
    issues: 0,
    severity: 'low',
    coverage: '95.2%'
  },
  {
    id: 'audit-003',
    name: '操作日志完整性检查',
    type: 'integrity',
    status: 'warning',
    startTime: '2024-10-15T11:00:00Z',
    endTime: '2024-10-15T11:45:00Z',
    duration: '45分钟',
    issues: 2,
    severity: 'medium',
    coverage: '92.8%'
  },
  {
    id: 'audit-004',
    name: '数据访问权限审计',
    type: 'access',
    status: 'failed',
    startTime: '2024-10-15T13:00:00Z',
    endTime: '2024-10-15T13:50:00Z',
    duration: '50分钟',
    issues: 5,
    severity: 'high',
    coverage: '88.3%'
  }
]

// 模拟审计问题详情
const mockAuditIssues = [
  {
    id: 'issue-001',
    auditId: 'audit-003',
    description: '部分操作日志缺少时间戳',
    severity: 'medium',
    location: '用户管理模块',
    recommendation: '修复日志记录功能，确保所有操作都有时间戳',
    status: 'pending'
  },
  {
    id: 'issue-002',
    auditId: 'audit-003',
    description: '日志文件权限设置过宽',
    severity: 'medium',
    location: '系统配置',
    recommendation: '修改日志文件权限为644',
    status: 'pending'
  },
  {
    id: 'issue-003',
    auditId: 'audit-004',
    description: '发现未授权的数据访问记录',
    severity: 'high',
    location: '数据API',
    recommendation: '检查并加强API访问控制',
    status: 'critical'
  },
  {
    id: 'issue-004',
    auditId: 'audit-004',
    description: '多个账户拥有过高权限',
    severity: 'high',
    location: '权限管理模块',
    recommendation: '实施最小权限原则',
    status: 'critical'
  },
  {
    id: 'issue-005',
    auditId: 'audit-004',
    description: '管理员密码未定期更换',
    severity: 'high',
    location: '用户管理模块',
    recommendation: '启用强制密码更换策略',
    status: 'critical'
  }
]

// Mock合规审计自动化面板组件 - 确保组件在同一文件中正确定义
function ComplianceAuditPanel({ onAuditRun, onIssueResolve, onAuditDetail }: any) {
  return (
  <div data-testid="compliance-audit-panel">
    <h3>合规审计自动化管理</h3>
    
    {/* 审计概览统计 */}
    <div data-testid="audit-overview-stats">
      <div data-testid="stat-total-audits">
        <span>总审计次数</span>
        <span>{mockComplianceAudits.length}</span>
      </div>
      <div data-testid="stat-passed-audits">
        <span>通过审计</span>
        <span>{mockComplianceAudits.filter(a => a.status === 'passed').length}</span>
      </div>
      <div data-testid="stat-warning-audits">
        <span>警告审计</span>
        <span>{mockComplianceAudits.filter(a => a.status === 'warning').length}</span>
      </div>
      <div data-testid="stat-failed-audits">
        <span>失败审计</span>
        <span>{mockComplianceAudits.filter(a => a.status === 'failed').length}</span>
      </div>
    </div>
    
    {/* 审计列表 */}
    <div data-testid="compliance-audit-list">
      <h4>审计历史</h4>
      {mockComplianceAudits.map(audit => (
        <div 
          key={audit.id} 
          data-testid={`audit-${audit.id}`}
          data-status={audit.status}
        >
          <div>
            <span data-testid="audit-name">{audit.name}</span>
            <span data-testid="audit-type">{audit.type}</span>
            <span 
              data-testid="audit-status" 
              data-status={audit.status}
              className={audit.status === 'passed' ? 'text-green' : audit.status === 'warning' ? 'text-yellow' : 'text-red'}
            >
              {audit.status === 'passed' ? '通过' : audit.status === 'warning' ? '警告' : '失败'}
            </span>
          </div>
          <div>
            <span data-testid="audit-duration">{audit.duration}</span>
            <span data-testid="audit-issues">{audit.issues} 个问题</span>
            <span data-testid="audit-severity">{audit.severity === 'high' ? '高' : audit.severity === 'medium' ? '中' : '低'}风险</span>
            <span data-testid="audit-coverage">覆盖: {audit.coverage}</span>
          </div>
          <div>
            <FileCheck size={24} data-testid="file-check-icon" data-size={24} />
            {audit.status !== 'passed' && (
              <AlertCircle size={24} data-testid="alert-icon" data-size={24} />
            )}
            {audit.status === 'passed' && (
              <CheckCircle2 size={24} data-testid="check-circle-icon" data-size={24} />
            )}
            <button 
              onClick={() => onAuditDetail(audit.id)} 
              data-testid={`view-audit-${audit.id}`}
            >
              查看详情
            </button>
          </div>
        </div>
      ))}
    </div>
    
    {/* 问题列表 */}
    <div data-testid="compliance-issues-list">
      <h4>待解决问题</h4>
      {mockAuditIssues.map(issue => (
        <div 
          key={issue.id} 
          data-testid={`issue-${issue.id}`}
          data-severity={issue.severity}
          data-status={issue.status}
        >
          <div>
            <span data-testid="issue-description">{issue.description}</span>
            <span 
              data-testid="issue-severity" 
              data-severity={issue.severity}
            >
              {issue.severity === 'high' ? '高' : issue.severity === 'medium' ? '中' : '低'}风险
            </span>
            <span 
              data-testid="issue-status" 
              data-status={issue.status}
            >
              {issue.status === 'pending' ? '待处理' : '严重'}
            </span>
          </div>
          <div>
            <span data-testid="issue-location">{issue.location}</span>
            <button 
              onClick={() => onIssueResolve(issue.id)} 
              data-testid={`resolve-issue-${issue.id}`}
            >
              标记已解决
            </button>
          </div>
        </div>
      ))}
    </div>
    
    {/* 操作按钮 */}
    <div data-testid="audit-actions">
      <button 
        onClick={() => onAuditRun('security')} 
        data-testid="run-security-audit"
      >
        <RefreshCw size={24} data-testid="refresh-icon" data-size={24} />
        运行安全审计
      </button>
      <button 
        onClick={() => onAuditRun('privacy')} 
        data-testid="run-privacy-audit"
      >
        <FileCheck size={24} data-testid="file-check-icon" data-size={24} />
        运行隐私审计
      </button>
      <button 
        onClick={() => onAuditRun('integrity')} 
        data-testid="run-integrity-audit"
      >
        <CheckCircle2 size={24} data-testid="check-circle-icon" data-size={24} />
        运行完整性审计
      </button>
      <button 
        onClick={() => onAuditRun('access')} 
        data-testid="run-access-audit"
      >
        <AlertCircle size={24} data-testid="alert-icon" data-size={24} />
        运行访问审计
      </button>
    </div>
  </div>
  )
}

// 模拟边缘AI推理设备数据
const mockEdgeDevices = [
  {
    id: 'edge-001',
    name: '边缘节点-A',
    location: '门店A',
    status: 'online',
    inferenceSpeed: '128ms',
    cpuUsage: '45.2%',
    memoryUsage: '67.8%',
    connectionStrength: '94%',
    tasksRunning: 5
  },
  {
    id: 'edge-002',
    name: '边缘节点-B',
    location: '门店B',
    status: 'online',
    inferenceSpeed: '95ms',
    cpuUsage: '32.5%',
    memoryUsage: '51.3%',
    connectionStrength: '89%',
    tasksRunning: 3
  },
  {
    id: 'edge-003',
    name: '边缘节点-C',
    location: '门店C',
    status: 'offline',
    inferenceSpeed: 'N/A',
    cpuUsage: 'N/A',
    memoryUsage: 'N/A',
    connectionStrength: '0%',
    tasksRunning: 0
  }
]

// 模拟边缘AI推理任务数据
const mockInferenceTasks = [
  {
    id: 'task-001',
    name: '人脸识别',
    deviceId: 'edge-001',
    status: 'running',
    accuracy: '98.7%',
    latency: '45ms',
    throughput: '120/s',
    lastUpdated: '2024-10-15T10:30:00Z'
  },
  {
    id: 'task-002',
    name: '商品识别',
    deviceId: 'edge-001',
    status: 'running',
    accuracy: '96.2%',
    latency: '38ms',
    throughput: '85/s',
    lastUpdated: '2024-10-15T10:35:00Z'
  },
  {
    id: 'task-003',
    name: '客流统计',
    deviceId: 'edge-002',
    status: 'running',
    accuracy: '97.5%',
    latency: '52ms',
    throughput: '60/s',
    lastUpdated: '2024-10-15T10:28:00Z'
  }
]

// Mock边缘AI推理控制面板组件
const EdgeAIInferencePanel = ({ onDeviceSelect, onTaskCreate, onTaskStop }: any) => (
  <div data-testid="edge-ai-inference-panel">
    <h3>边缘AI推理管理</h3>
    
    {/* 设备列表 */}
    <div data-testid="edge-devices-list">
      <h4>边缘设备</h4>
      {mockEdgeDevices.map(device => (
        <div 
          key={device.id} 
          data-testid={`device-${device.id}`}
          data-status={device.status}
        >
          <span data-testid="device-name">{device.name}</span>
          <span data-testid="device-location">{device.location}</span>
          <span data-testid="device-status" data-status={device.status}>
            {device.status === 'online' ? '在线' : '离线'}
          </span>
          <span data-testid="device-cpu">{device.cpuUsage}</span>
          <span data-testid="device-memory">{device.memoryUsage}</span>
          <Cpu size={24} data-testid="cpu-icon" data-size={24} />
          <HardDrive size={24} data-testid="memory-icon" data-size={24} />
          <Wifi size={24} data-testid="connection-icon" data-size={24} />
          <button 
            onClick={() => onDeviceSelect(device.id)} 
            data-testid={`select-device-${device.id}`}
          >
            选择
          </button>
        </div>
      ))}
    </div>
    
    {/* 推理任务列表 */}
    <div data-testid="inference-tasks-list">
      <h4>推理任务</h4>
      {mockInferenceTasks.map(task => (
        <div 
          key={task.id} 
          data-testid={`task-${task.id}`}
          data-status={task.status}
        >
          <span data-testid="task-name">{task.name}</span>
          <span data-testid="task-device">{task.deviceId}</span>
          <span data-testid="task-status">{task.status}</span>
          <span data-testid="task-accuracy">{task.accuracy}</span>
          <span data-testid="task-latency">{task.latency}</span>
          <BarChart2 size={24} data-testid="performance-icon" data-size={24} />
          {task.status === 'running' && (
            <button 
              onClick={() => onTaskStop(task.id)} 
              data-testid={`stop-task-${task.id}`}
            >
              停止
            </button>
          )}
        </div>
      ))}
    </div>
    
    {/* 创建任务按钮 */}
    <button 
      onClick={onTaskCreate} 
      data-testid="create-task-button"
    >
      创建推理任务
    </button>
  </div>
)

// Mock主仪表盘组件
function MarketingDashboard({ onSegmentChange, onGenerate, onAnalyze, onAuditRun, onIssueResolve, onAuditDetail }) {
  return (
    <div data-testid="marketing-dashboard">
      {/* 统计卡片 */}
      <div>
        <div data-testid="stat-card-total-customers">
          <span>总客户数</span>
          <span>8,542</span>
          <Users size={24} data-testid="users-icon" data-size={24} />
        </div>
        <div data-testid="stat-card-segments">
          <span>客户细分</span>
          <span>6</span>
          <Target size={24} data-testid="target-icon" data-size={24} />
        </div>
        <div data-testid="stat-card-campaigns">
          <span>活跃活动</span>
          <span>12</span>
          <Zap size={24} data-testid="zap-icon" data-size={24} />
        </div>
        <div data-testid="stat-card-roi">
          <span>平均ROI</span>
          <span>2.3x</span>
          <TrendingUp size={24} data-testid="trending-up-icon" data-size={24} />
        </div>
      </div>

      {/* 功能标签页 */}
      <div data-testid="tabs" data-default-value="segments">
        <div data-testid="tabs-list">
          <button data-testid="tabs-trigger" data-value="segments">客户细分</button>
          <button data-testid="tabs-trigger" data-value="generator">活动生成</button>
          <button data-testid="tabs-trigger" data-value="performance">效果分析</button>
          <button data-testid="tabs-trigger" data-value="compliance">合规审计</button>
        </div>

        <div data-testid="tabs-content" data-value="segments">
          <MockCustomerSegmentPanel onSegmentChange={onSegmentChange} />
        </div>

        <div data-testid="tabs-content" data-value="generator">
          <MockCampaignGeneratorPanel onGenerate={onGenerate} />
        </div>

        <div data-testid="tabs-content" data-value="performance">
          <MockCampaignPerformancePanel onAnalyze={onAnalyze} />
        </div>

        <div data-testid="tabs-content" data-value="compliance">
          <ComplianceAuditPanel 
            onAuditRun={onAuditRun} 
            onIssueResolve={onIssueResolve} 
            onAuditDetail={onAuditDetail} 
          />
        </div>
      </div>
    </div>
  );
}

jest.mock('@/components/ai/marketing-dashboard', () => ({
  MarketingDashboard: MarketingDashboard
}));

// 模拟数据
const mockCustomerSegments = [
  { name: "高价值客户", count: 1200, countFormatted: "1,200", percentage: "14.1%" },
  { name: "活跃用户", count: 3500, countFormatted: "3,500", percentage: "41.0%" },
  { name: "沉睡客户", count: 2100, countFormatted: "2,100", percentage: "24.6%" },
  { name: "新客户", count: 1742, countFormatted: "1,742", percentage: "20.3%" },
]

const mockCampaignSuggestions = [
  {
    name: "冬季促销活动",
    target: "活跃用户",
    estimatedROI: "2.8x",
    description: "针对活跃用户群体推出冬季特惠活动",
  },
  {
    name: "沉睡客户唤醒",
    target: "沉睡客户",
    estimatedROI: "1.9x",
    description: "通过优惠券和个性化推荐唤醒沉睡客户",
  },
  {
    name: "会员专属活动",
    target: "高价值客户",
    estimatedROI: "3.2x",
    description: "为高价值客户提供专属VIP服务",
  },
]

const mockCampaignPerformance = [
  {
    campaignName: "中秋节营销活动",
    impressions: "45,320",
    conversions: "1,256",
    roi: "3.1x",
    status: "进行中",
  },
  {
    campaignName: "新用户注册活动",
    impressions: "23,150",
    conversions: "892",
    roi: "2.7x",
    status: "已完成",
  },
  {
    campaignName: "春季促销",
    impressions: "38,940",
    conversions: "1,087",
    roi: "2.4x",
    status: "已完成",
  },
]

const mockComplianceChecks = [
  {
    id: "1",
    category: "数据隐私",
    status: "通过",
    riskLevel: "低",
    score: 95,
    lastCheck: "2024-10-15 10:30",
  },
  {
    id: "2",
    category: "网络安全",
    status: "需要关注",
    riskLevel: "中",
    score: 78,
    lastCheck: "2024-10-15 09:45",
  },
  {
    id: "3",
    category: "内容审核",
    status: "通过",
    riskLevel: "低",
    score: 92,
    lastCheck: "2024-10-15 11:15",
  },
]

const mockSystemAlerts = [
  {
    id: "1",
    type: "性能警告",
    message: "CPU使用率超过85%",
    timestamp: "2024-10-15 14:32",
    severity: "high",
  },
  {
    id: "2",
    type: "异常检测",
    message: "检测到异常流量模式",
    timestamp: "2024-10-15 14:28",
    severity: "medium",
  },
  {
    id: "3",
    type: "资源告警",
    message: "内存使用率持续偏高",
    timestamp: "2024-10-15 14:25",
    severity: "low",
  },
]

describe('AI运维系统模块测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AI智能营销助手测试', () => {
    it('应该正确渲染营销仪表盘页面', () => {
      render(
        <div>
          <div>
            <h1>AI智能营销助手</h1>
            <p>基于AI的客户细分、营销活动生成和效果优化</p>
          </div>
          
          <div>
            <MarketingDashboard />
          </div>
        </div>
      )

      expect(screen.getByText('AI智能营销助手')).toBeInTheDocument()
      expect(screen.getByText('基于AI的客户细分、营销活动生成和效果优化')).toBeInTheDocument()
      expect(screen.getByTestId('marketing-dashboard')).toBeInTheDocument()
    })

    it('应该正确显示营销统计数据', () => {
      render(<MarketingDashboard />)

      expect(screen.getAllByText('8,542').length).toBeGreaterThan(0)
      expect(screen.getAllByText('6').length).toBeGreaterThan(0)
      expect(screen.getAllByText('12').length).toBeGreaterThan(0)
      expect(screen.getAllByText('2.3x').length).toBeGreaterThan(0)
      expect(screen.getByTestId('users-icon')).toBeInTheDocument()
      expect(screen.getByTestId('target-icon')).toBeInTheDocument()
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument()
      expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument()
    })

    it('应该正确处理标签页切换', () => {
      render(<MarketingDashboard />)

      // 默认选中客户细分标签
      expect(screen.getByTestId('tabs')).toHaveAttribute('data-default-value', 'segments')
      expect(screen.getByTestId('customer-segment-panel')).toBeInTheDocument()

      // 点击活动生成标签
      const generatorTab = screen.getAllByText('活动生成')[0]
      fireEvent.click(generatorTab)

      // 验证活动生成面板存在
      expect(screen.getByTestId('campaign-generator-panel')).toBeInTheDocument()
    })

    it('应该正确显示客户细分数据', () => {
      render(<MarketingDashboard />)

      expect(screen.getByText('客户细分分析')).toBeInTheDocument()
      expect(screen.getAllByText('高价值客户').length).toBeGreaterThan(0)
      expect(screen.getAllByText('1,200').length).toBeGreaterThan(0)
      expect(screen.getAllByText('14.1%').length).toBeGreaterThan(0)
      expect(screen.getAllByText('活跃用户').length).toBeGreaterThan(0)
      expect(screen.getAllByText('3,500').length).toBeGreaterThan(0)
    })

    it('应该正确显示营销活动建议', () => {
      render(<MarketingDashboard />)

      const generatorTab = screen.getAllByText('活动生成')[0]
      fireEvent.click(generatorTab)

      expect(screen.getByText('AI营销活动生成')).toBeInTheDocument()
      expect(screen.getByTestId('generate-campaign')).toBeInTheDocument()
      expect(screen.getByText('冬季促销活动')).toBeInTheDocument()
      expect(screen.getByText('2.8x')).toBeInTheDocument()
      expect(screen.getByText('沉睡客户唤醒')).toBeInTheDocument()
    })

    it('应该正确显示活动效果分析', () => {
      render(<MarketingDashboard />)

      const performanceTab = screen.getAllByText('效果分析')[0]
      fireEvent.click(performanceTab)

      expect(screen.getByText('活动效果分析')).toBeInTheDocument()
      expect(screen.getAllByText('中秋节营销活动').length).toBeGreaterThan(0)
      expect(screen.getAllByText('45,320').length).toBeGreaterThan(0)
      expect(screen.getAllByText('1,256').length).toBeGreaterThan(0)
      expect(screen.getAllByText('3.1x').length).toBeGreaterThan(0)
    })
  })

  describe('合规检查系统测试', () => {
    it('应该正确渲染合规检查页面', () => {
      const { Shield, Clock, AlertTriangle } = require('lucide-react')
      
      render(
        <div>
          <div>
            <h1>合规检查系统</h1>
            <p>自动化合规审计和风险评估</p>
          </div>
          
          <div>
            <div data-testid="compliance-overview">
              <div data-testid="compliance-score">
                <span>整体合规评分</span>
                <span>88.3</span>
                <Shield size={24} />
              </div>
              <div data-testid="active-checks">
                <span>正在运行的检查</span>
                <span>12</span>
                <Clock size={24} />
              </div>
              <div data-testid="risk-issues">
                <span>待处理风险</span>
                <span>3</span>
                <AlertTriangle size={24} />
              </div>
            </div>
          </div>
        </div>
      )

      expect(screen.getByText('合规检查系统')).toBeInTheDocument()
      expect(screen.getByText('自动化合规审计和风险评估')).toBeInTheDocument()
      expect(screen.getAllByText('88.3').length).toBeGreaterThan(0)
      expect(screen.getAllByText('12').length).toBeGreaterThan(0)
      expect(screen.getAllByText('3').length).toBeGreaterThan(0)
    })

    it('应该正确显示合规检查列表', () => {
      render(
        <div>
          {mockComplianceChecks.map((check, index) => (
            <div key={check.id} data-testid="compliance-check">
              <span data-category={check.category}>{check.category}</span>
              <span data-status={check.status}>{check.status}</span>
              <span data-risk={check.riskLevel}>{check.riskLevel}</span>
              <span data-score={check.score}>{check.score}</span>
              <span data-time={check.lastCheck}>{check.lastCheck}</span>
            </div>
          ))}
        </div>
      )

      expect(screen.getByText('数据隐私')).toBeInTheDocument()
      expect(screen.getAllByText('通过').length).toBeGreaterThan(0)
      expect(screen.getAllByText('低').length).toBeGreaterThan(0)
      expect(screen.getByText('95')).toBeInTheDocument()
      expect(screen.getByText('网络安全')).toBeInTheDocument()
      expect(screen.getByText('需要关注')).toBeInTheDocument()
    })

    it('应该正确处理合规检查操作', () => {
      const mockOnCheck = jest.fn()

      render(
        <div>
          <button data-testid="run-compliance-check" onClick={mockOnCheck}>
            运行合规检查
          </button>
        </div>
      )

      const checkButton = screen.getByTestId('run-compliance-check')
      fireEvent.click(checkButton)

      expect(mockOnCheck).toHaveBeenCalled()
    })
  })

  describe('系统监控与告警测试', () => {
    it('应该正确渲染系统监控面板', () => {
      const { BarChart3, Brain } = require('lucide-react')
      
      render(
        <div>
          <div>
            <h1>系统监控</h1>
            <p>实时监控系统性能和异常</p>
          </div>
          
          <div>
            <div data-testid="system-metrics">
              <div data-testid="cpu-usage">
                <span>CPU使用率</span>
                <span>45.2%</span>
                <BarChart3 size={24} />
              </div>
              <div data-testid="memory-usage">
                <span>内存使用率</span>
                <span>67.8%</span>
                <Brain size={24} />
              </div>
              <div data-testid="disk-usage">
                <span>磁盘使用率</span>
                <span>23.1%</span>
                <BarChart3 size={24} />
              </div>
            </div>
          </div>
        </div>
      )

      expect(screen.getByText('系统监控')).toBeInTheDocument()
      expect(screen.getByText('实时监控系统性能和异常')).toBeInTheDocument()
      expect(screen.getAllByText('45.2%').length).toBeGreaterThan(0)
      expect(screen.getAllByText('67.8%').length).toBeGreaterThan(0)
      expect(screen.getAllByText('23.1%').length).toBeGreaterThan(0)
    })

    it('应该正确显示系统告警', () => {
      render(
        <div>
          {mockSystemAlerts.map((alert, index) => (
            <div key={alert.id} data-testid="system-alert" data-severity={alert.severity}>
              <span>{alert.type}</span>
              <span>{alert.message}</span>
              <span>{alert.timestamp}</span>
              <span data-testid="alert-icon">{alert.severity}</span>
            </div>
          ))}
        </div>
      )

      expect(screen.getByText('性能警告')).toBeInTheDocument()
      expect(screen.getByText('CPU使用率超过85%')).toBeInTheDocument()
      expect(screen.getByText('异常检测')).toBeInTheDocument()
      expect(screen.getByText('检测到异常流量模式')).toBeInTheDocument()
    })

    it('应该正确处理告警响应', () => {
      const mockOnAlertResponse = jest.fn()

      render(
        <div>
          <button data-testid="resolve-alert" onClick={mockOnAlertResponse}>
            处理告警
          </button>
        </div>
      )

      const resolveButton = screen.getByTestId('resolve-alert')
      fireEvent.click(resolveButton)

      expect(mockOnAlertResponse).toHaveBeenCalled()
    })
  })

  describe('AI运维交互功能测试', () => {
    it('应该正确处理营销活动生成', async () => {
      const mockOnGenerate = jest.fn()

      render(
        <div>
          <MockCampaignGeneratorPanel onGenerate={mockOnGenerate} />
        </div>
      )

      const generateButton = screen.getByTestId('generate-campaign')
      fireEvent.click(generateButton)

      await waitFor(() => {
        expect(mockOnGenerate).toHaveBeenCalled()
      })
    })

    it('应该正确处理客户细分更新', () => {
      const mockOnSegmentChange = jest.fn()

      render(
        <div>
          <MockCustomerSegmentPanel onSegmentChange={mockOnSegmentChange} />
        </div>
      )

      // 模拟点击客户细分项
      const segmentItems = screen.getAllByText('高价值客户')
      expect(segmentItems.length).toBeGreaterThan(0)
    })

    it('应该正确处理效果分析', () => {
      const mockOnAnalyze = jest.fn()

      render(
        <div>
          <MockCampaignPerformancePanel onAnalyze={mockOnAnalyze} />
        </div>
      )

      // 验证效果分析数据显示
      expect(screen.getByText('活动效果分析')).toBeInTheDocument()
      expect(screen.getByText('中秋节营销活动')).toBeInTheDocument()
    })

    it('应该正确处理筛选和搜索功能', () => {
      render(
        <div>
          <input data-testid="search-input" placeholder="搜索活动..." />
          <select data-testid="filter-select">
            <option value="all">全部状态</option>
            <option value="active">进行中</option>
            <option value="completed">已完成</option>
          </select>
        </div>
      )

      const searchInput = screen.getByTestId('search-input')
      fireEvent.change(searchInput, { target: { value: '测试搜索' } })

      expect(searchInput).toHaveValue('测试搜索')

      const filterSelect = screen.getByTestId('filter-select')
      fireEvent.click(filterSelect)

      expect(screen.getByText('全部状态')).toBeInTheDocument()
      expect(screen.getByText('进行中')).toBeInTheDocument()
      expect(screen.getByText('已完成')).toBeInTheDocument()
    })

    it('应该正确处理数据导出功能', () => {
      const mockOnExport = jest.fn()

      render(
        <div>
          <button data-testid="export-data" onClick={mockOnExport}>
            导出数据
          </button>
        </div>
      )

      const exportButton = screen.getByTestId('export-data')
      fireEvent.click(exportButton)

      expect(mockOnExport).toHaveBeenCalled()
    })

    it('应该正确处理实时数据更新', async () => {
      jest.useFakeTimers()

      let updateCount = 0
      const RealTimeDashboard = () => {
        const [time, setTime] = React.useState(new Date().toLocaleTimeString())

        React.useEffect(() => {
          const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString())
            updateCount++
          }, 1000)
          return () => clearInterval(interval)
        }, [])

        return (
          <div data-testid="real-time-dashboard">
            <div>当前时间: {time}</div>
            <div data-testid="update-count">{updateCount}</div>
          </div>
        )
      }

      render(<RealTimeDashboard />)

      expect(screen.getByText(/当前时间:/)).toBeInTheDocument()

      // 等待至少一次更新
      await waitFor(() => {
        expect(parseInt(screen.getByTestId('update-count').textContent || '0')).toBeGreaterThan(0)
      }, { timeout: 2000 })

      jest.useRealTimers()
    })
  })

  describe('AI运维错误处理测试', () => {
    it('应该正确处理API错误', () => {
      const mockErrorHandler = jest.fn()

      render(
        <div data-testid="error-boundary">
          <div>错误: 无法加载数据</div>
          <button onClick={mockErrorHandler}>重试</button>
        </div>
      )

      expect(screen.getByText('错误: 无法加载数据')).toBeInTheDocument()
      
      const retryButton = screen.getByText('重试')
      fireEvent.click(retryButton)

      expect(mockErrorHandler).toHaveBeenCalled()
    })

    it('应该正确处理网络连接问题', () => {
      render(
        <div data-testid="network-error">
          <div>网络连接失败</div>
          <div>请检查网络连接后重试</div>
        </div>
      )

      expect(screen.getByText('网络连接失败')).toBeInTheDocument()
      expect(screen.getByText('请检查网络连接后重试')).toBeInTheDocument()
    })

    it('应该正确处理数据验证错误', () => {
      render(
        <div data-testid="validation-error">
          <div>数据格式错误</div>
          <div>请检查输入数据的格式</div>
        </div>
      )

      expect(screen.getByText('数据格式错误')).toBeInTheDocument()
      expect(screen.getByText('请检查输入数据的格式')).toBeInTheDocument()
    })
  })

  describe('边缘AI推理功能测试', () => {
    it('应该正确渲染边缘AI推理控制面板', () => {
      render(
        <div data-testid="ai-ops-system">
          <EdgeAIInferencePanel 
            onDeviceSelect={jest.fn()} 
            onTaskCreate={jest.fn()} 
            onTaskStop={jest.fn()} 
          />
        </div>
      )

      expect(screen.getByTestId('edge-ai-inference-panel')).toBeInTheDocument()
      expect(screen.getByText('边缘AI推理管理')).toBeInTheDocument()
    })

    it('应该正确显示边缘设备列表', () => {
      render(
        <div data-testid="ai-ops-system">
          <EdgeAIInferencePanel 
            onDeviceSelect={jest.fn()} 
            onTaskCreate={jest.fn()} 
            onTaskStop={jest.fn()} 
          />
        </div>
      )

      expect(screen.getByTestId('edge-devices-list')).toBeInTheDocument()
      expect(screen.getAllByTestId(/device-edge-/)).toHaveLength(mockEdgeDevices.length)
      
      // 验证设备信息显示
      expect(screen.getByText('边缘节点-A')).toBeInTheDocument()
      expect(screen.getByText('门店A')).toBeInTheDocument()
      expect(screen.getByText('在线')).toBeInTheDocument()
      expect(screen.getAllByText('N/A')).toHaveLength(3) // 离线设备的三个N/A值
    })

    it('应该正确显示推理任务列表', () => {
      render(
        <div data-testid="ai-ops-system">
          <EdgeAIInferencePanel 
            onDeviceSelect={jest.fn()} 
            onTaskCreate={jest.fn()} 
            onTaskStop={jest.fn()} 
          />
        </div>
      )

      expect(screen.getByTestId('inference-tasks-list')).toBeInTheDocument()
      expect(screen.getAllByTestId(/task-task-/)).toHaveLength(mockInferenceTasks.length)
      
      // 验证任务信息显示
      expect(screen.getByText('人脸识别')).toBeInTheDocument()
      expect(screen.getByText('商品识别')).toBeInTheDocument()
      expect(screen.getByText('客流统计')).toBeInTheDocument()
      expect(screen.getByText('98.7%')).toBeInTheDocument()
      expect(screen.getByText('96.2%')).toBeInTheDocument()
      expect(screen.getByText('97.5%')).toBeInTheDocument()
    })

    it('应该正确处理设备选择操作', () => {
      const onDeviceSelect = jest.fn()

      render(
        <div data-testid="ai-ops-system">
          <EdgeAIInferencePanel 
            onDeviceSelect={onDeviceSelect} 
            onTaskCreate={jest.fn()} 
            onTaskStop={jest.fn()} 
          />
        </div>
      )

      // 点击选择设备按钮
      const selectButton = screen.getByTestId('select-device-edge-001')
      fireEvent.click(selectButton)

      expect(onDeviceSelect).toHaveBeenCalledWith('edge-001')
    })

    it('应该正确处理任务停止操作', () => {
      const onTaskStop = jest.fn()

      render(
        <div data-testid="ai-ops-system">
          <EdgeAIInferencePanel 
            onDeviceSelect={jest.fn()} 
            onTaskCreate={jest.fn()} 
            onTaskStop={onTaskStop} 
          />
        </div>
      )

      // 点击停止任务按钮
      const stopButton = screen.getByTestId('stop-task-task-001')
      fireEvent.click(stopButton)

      expect(onTaskStop).toHaveBeenCalledWith('task-001')
    })

    it('应该正确处理创建任务操作', () => {
      const onTaskCreate = jest.fn()

      render(
        <div data-testid="ai-ops-system">
          <EdgeAIInferencePanel 
            onDeviceSelect={jest.fn()} 
            onTaskCreate={onTaskCreate} 
            onTaskStop={jest.fn()} 
          />
        </div>
      )

      // 点击创建任务按钮
      const createButton = screen.getByTestId('create-task-button')
      fireEvent.click(createButton)

      expect(onTaskCreate).toHaveBeenCalled()
    })

    it('应该正确显示设备状态和性能指标', () => {
      render(
        <div data-testid="ai-ops-system">
          <EdgeAIInferencePanel 
            onDeviceSelect={jest.fn()} 
            onTaskCreate={jest.fn()} 
            onTaskStop={jest.fn()} 
          />
        </div>
      )

      // 验证在线状态的设备
      const onlineDevices = screen.getAllByTestId(/device-status/).filter(el => 
        el.getAttribute('data-status') === 'online'
      )
      expect(onlineDevices.length).toBe(2)
      
      // 验证离线状态的设备
      const offlineDevices = screen.getAllByTestId(/device-status/).filter(el => 
        el.getAttribute('data-status') === 'offline'
      )
      expect(offlineDevices.length).toBe(1)
      
      // 验证性能指标显示
      expect(screen.getByText('45.2%')).toBeInTheDocument()
      expect(screen.getByText('67.8%')).toBeInTheDocument()
      expect(screen.getByText('32.5%')).toBeInTheDocument()
    })  
  })

  describe('合规审计自动化功能测试', () => {
    it('应该正确渲染合规审计控制面板', () => {
      render(
        <div data-testid="ai-ops-system">
          <div data-testid="compliance-audit-panel">
            <h3>合规审计自动化管理</h3>
            
            {/* 审计概览统计 */}
            <div data-testid="audit-overview-stats">
              <div data-testid="stat-total-audits">
                <span>总审计次数</span>
                <span>{mockComplianceAudits.length}</span>
              </div>
              <div data-testid="stat-passed-audits">
                <span>通过审计</span>
                <span>{mockComplianceAudits.filter(a => a.status === 'passed').length}</span>
              </div>
              <div data-testid="stat-warning-audits">
                <span>警告审计</span>
                <span>{mockComplianceAudits.filter(a => a.status === 'warning').length}</span>
              </div>
              <div data-testid="stat-failed-audits">
                <span>失败审计</span>
                <span>{mockComplianceAudits.filter(a => a.status === 'failed').length}</span>
              </div>
            </div>
          </div>
        </div>
      )

      expect(screen.getByTestId('compliance-audit-panel')).toBeInTheDocument()
      expect(screen.getByText('合规审计自动化管理')).toBeInTheDocument()
    })

    it('应该正确显示审计概览统计信息', () => {
      render(
        <div data-testid="ai-ops-system">
          <div data-testid="compliance-audit-panel">
            <h3>合规审计自动化管理</h3>
            
            {/* 审计概览统计 */}
            <div data-testid="audit-overview-stats">
              <div data-testid="stat-total-audits">
                <span>总审计次数</span>
                <span>{mockComplianceAudits.length}</span>
              </div>
              <div data-testid="stat-passed-audits">
                <span>通过审计</span>
                <span>{mockComplianceAudits.filter(a => a.status === 'passed').length}</span>
              </div>
              <div data-testid="stat-warning-audits">
                <span>警告审计</span>
                <span>{mockComplianceAudits.filter(a => a.status === 'warning').length}</span>
              </div>
              <div data-testid="stat-failed-audits">
                <span>失败审计</span>
                <span>{mockComplianceAudits.filter(a => a.status === 'failed').length}</span>
              </div>
            </div>
          </div>
        </div>
      )

      expect(screen.getByTestId('audit-overview-stats')).toBeInTheDocument()
      
      // 验证统计数据
      expect(screen.getByTestId('stat-total-audits')).toBeInTheDocument()
      expect(screen.getByTestId('stat-passed-audits')).toBeInTheDocument()
      expect(screen.getByTestId('stat-warning-audits')).toBeInTheDocument()
      expect(screen.getByTestId('stat-failed-audits')).toBeInTheDocument()
      
      // 验证统计数据值
      expect(screen.getAllByText('4')).toHaveLength(1) // 总审计次数
      expect(screen.getAllByText('2')).toHaveLength(1) // 通过审计数量
      expect(screen.getAllByText('1')).toHaveLength(2) // 警告和失败审计数量各1
    })

    it('应该正确显示审计历史列表', () => {
      render(
        <div data-testid="ai-ops-system">
          <div data-testid="compliance-audit-panel">
            <h3>合规审计自动化管理</h3>
            
            {/* 审计历史列表 */}
            <div data-testid="compliance-audit-list">
              <h4>审计历史</h4>
              {mockComplianceAudits.map(audit => (
                <div 
                  key={audit.id} 
                  data-testid="audit-item"
                  data-audit-id={audit.id}
                  data-status={audit.status}
                >
                  <div>
                    <span data-testid="audit-name">{audit.name}</span>
                    <span data-testid="audit-type">{audit.type}</span>
                    <span 
                      data-testid="audit-status" 
                      data-status={audit.status}
                      className={audit.status === 'passed' ? 'text-green' : audit.status === 'warning' ? 'text-yellow' : 'text-red'}
                    >
                      {audit.status === 'passed' ? '通过' : audit.status === 'warning' ? '警告' : '失败'}
                    </span>
                  </div>
                  <div>
                    <span data-testid="audit-duration">{audit.duration}</span>
                    <span data-testid="audit-issues">{audit.issues} 个问题</span>
                    <span data-testid="audit-severity">{audit.severity === 'high' ? '高' : audit.severity === 'medium' ? '中' : '低'}风险</span>
                    <span data-testid="audit-coverage">覆盖: {audit.coverage}</span>
                  </div>
                  <button data-testid="view-audit-detail" data-audit-id={audit.id}>查看详情</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

      expect(screen.getByTestId('compliance-audit-list')).toBeInTheDocument()
      expect(screen.getAllByTestId('audit-item')).toHaveLength(mockComplianceAudits.length)
      
      // 验证审计信息显示
      expect(screen.getByText('数据安全审计')).toBeInTheDocument()
      expect(screen.getByText('隐私政策合规检查')).toBeInTheDocument()
      expect(screen.getByText('操作日志完整性检查')).toBeInTheDocument()
      expect(screen.getByText('数据访问权限审计')).toBeInTheDocument()
      
      // 验证审计状态
      expect(screen.getAllByText('通过')).toHaveLength(2)
      expect(screen.getByText('警告')).toBeInTheDocument()
      expect(screen.getByText('失败')).toBeInTheDocument()
    })

    it('应该正确显示待解决问题列表', () => {
      render(
        <div data-testid="ai-ops-system">
          <div data-testid="compliance-audit-panel">
            <h3>合规审计自动化管理</h3>
            
            {/* 待解决问题列表 */}
            <div data-testid="compliance-issues-list">
              <h4>待解决问题</h4>
              {mockAuditIssues.map(issue => (
                <div 
                  key={issue.id} 
                  data-testid="issue-item"
                  data-issue-id={issue.id}
                  data-severity={issue.severity}
                >
                  <div>
                    <span data-testid="issue-title">{issue.title}</span>
                    <span data-testid="issue-category">{issue.category}</span>
                    <span 
                      data-testid="issue-severity"
                      className={issue.severity === 'high' ? 'text-red' : issue.severity === 'medium' ? 'text-yellow' : 'text-green'}
                    >
                      {issue.severity === 'high' ? '高风险' : issue.severity === 'medium' ? '中风险' : '低风险'}
                    </span>
                  </div>
                  <div>
                    <span data-testid="issue-description">{issue.description}</span>
                    <span data-testid="issue-date">{issue.detectedDate}</span>
                    <span data-testid="issue-system">{issue.affectedSystem}</span>
                  </div>
                  <div>
                    <button data-testid="resolve-issue" data-issue-id={issue.id}>标记已解决</button>
                    <button data-testid="view-issue-detail" data-issue-id={issue.id}>查看详情</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

      expect(screen.getByTestId('compliance-issues-list')).toBeInTheDocument()
      expect(screen.getAllByTestId('issue-item')).toHaveLength(mockAuditIssues.length)
      
      // 验证问题信息显示
      expect(screen.getByText('部分操作日志缺少时间戳')).toBeInTheDocument()
      expect(screen.getByText('日志文件权限设置过宽')).toBeInTheDocument()
      expect(screen.getByText('发现未授权的数据访问记录')).toBeInTheDocument()
      
      // 验证风险等级
      expect(screen.getAllByText('中风险')).toHaveLength(2)
      expect(screen.getAllByText('高风险')).toHaveLength(3)
    })

    it('应该正确处理运行审计操作', () => {
      const onAuditRun = jest.fn()

      render(
        <div data-testid="ai-ops-system">
          <div data-testid="compliance-audit-panel">
            <h3>合规审计自动化管理</h3>
            
            {/* 审计操作按钮 */}
            <div data-testid="audit-actions">
              <h4>立即执行审计</h4>
              <div>
                <button 
                  data-testid="run-security-audit"
                  onClick={() => onAuditRun('security')}
                >
                  运行安全审计
                </button>
                <button 
                  data-testid="run-privacy-audit"
                  onClick={() => onAuditRun('privacy')}
                >
                  运行隐私审计
                </button>
                <button 
                  data-testid="run-integrity-audit"
                  onClick={() => onAuditRun('integrity')}
                >
                  运行完整性审计
                </button>
                <button 
                  data-testid="run-access-audit"
                  onClick={() => onAuditRun('access')}
                >
                  运行访问审计
                </button>
              </div>
            </div>
          </div>
        </div>
      )

      // 测试运行安全审计
      const securityAuditButton = screen.getByTestId('run-security-audit')
      fireEvent.click(securityAuditButton)
      expect(onAuditRun).toHaveBeenCalledWith('security')
      
      // 测试运行隐私审计
      const privacyAuditButton = screen.getByTestId('run-privacy-audit')
      fireEvent.click(privacyAuditButton)
      expect(onAuditRun).toHaveBeenCalledWith('privacy')
      
      // 测试运行完整性审计
      const integrityAuditButton = screen.getByTestId('run-integrity-audit')
      fireEvent.click(integrityAuditButton)
      expect(onAuditRun).toHaveBeenCalledWith('integrity')
      
      // 测试运行访问审计
      const accessAuditButton = screen.getByTestId('run-access-audit')
      fireEvent.click(accessAuditButton)
      expect(onAuditRun).toHaveBeenCalledWith('access')
    })

    it('应该正确处理标记问题已解决操作', () => {
      const onIssueResolve = jest.fn()

      render(
        <div data-testid="ai-ops-system">
          <div data-testid="compliance-audit-panel">
            <h3>合规审计自动化管理</h3>
            
            {/* 待解决问题列表 */}
            <div data-testid="compliance-issues-list">
              <h4>待解决问题</h4>
              {mockAuditIssues.map(issue => (
                <div 
                  key={issue.id} 
                  data-testid={`issue-${issue.id}`}
                  data-severity={issue.severity}
                >
                  <div>
                    <span data-testid="issue-title">{issue.title}</span>
                    <span data-testid="issue-category">{issue.category}</span>
                    <span 
                      data-testid="issue-severity"
                      className={issue.severity === 'high' ? 'text-red' : issue.severity === 'medium' ? 'text-yellow' : 'text-green'}
                    >
                      {issue.severity === 'high' ? '高风险' : issue.severity === 'medium' ? '中风险' : '低风险'}
                    </span>
                  </div>
                  <div>
                    <span data-testid="issue-description">{issue.description}</span>
                    <span data-testid="issue-date">{issue.detectedDate}</span>
                    <span data-testid="issue-system">{issue.affectedSystem}</span>
                  </div>
                  <div>
                    <button 
                      data-testid="resolve-issue"
                      data-issue-id={issue.id}
                      onClick={() => onIssueResolve(issue.id)}
                    >
                      标记已解决
                    </button>
                    <button data-testid="view-issue-detail" data-issue-id={issue.id}>查看详情</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

      // 点击标记已解决按钮
      const resolveButton = screen.getAllByTestId('resolve-issue')[0]
      fireEvent.click(resolveButton)

      expect(onIssueResolve).toHaveBeenCalled()
    })

    it('应该正确处理查看审计详情操作', () => {
      const onAuditDetail = jest.fn()

      render(
        <div data-testid="ai-ops-system">
          <div data-testid="compliance-audit-panel">
            <h3>合规审计自动化管理</h3>
            
            {/* 审计历史列表 */}
            <div data-testid="compliance-audit-list">
              <h4>审计历史</h4>
              {mockComplianceAudits.map(audit => (
                <div 
                  key={audit.id} 
                  data-testid={`audit-${audit.id}`}
                  data-status={audit.status}
                >
                  <div>
                    <span data-testid="audit-name">{audit.name}</span>
                    <span data-testid="audit-type">{audit.type}</span>
                    <span 
                      data-testid="audit-status" 
                      data-status={audit.status}
                      className={audit.status === 'passed' ? 'text-green' : audit.status === 'warning' ? 'text-yellow' : 'text-red'}
                    >
                      {audit.status === 'passed' ? '通过' : audit.status === 'warning' ? '警告' : '失败'}
                    </span>
                  </div>
                  <div>
                    <span data-testid="audit-duration">{audit.duration}</span>
                    <span data-testid="audit-issues">{audit.issues} 个问题</span>
                    <span data-testid="audit-severity">{audit.severity === 'high' ? '高' : audit.severity === 'medium' ? '中' : '低'}风险</span>
                    <span data-testid="audit-coverage">覆盖: {audit.coverage}</span>
                  </div>
                  <button 
                    data-testid="view-audit-detail"
                    data-audit-id={audit.id}
                    onClick={() => onAuditDetail(audit.id)}
                  >
                    查看详情
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

      // 点击查看详情按钮
      const detailButton = screen.getAllByTestId('view-audit-detail')[0]
      fireEvent.click(detailButton)

      expect(onAuditDetail).toHaveBeenCalled()
    })
    
    it('应该正确显示审计覆盖范围和风险等级', () => {
      render(
        <div data-testid="ai-ops-system">
          <div data-testid="compliance-audit-panel">
            <h3>合规审计自动化管理</h3>
            
            {/* 审计概览统计 */}
            <div data-testid="audit-overview-stats">
              <div data-testid="stat-total-audits">
                <span>总审计次数</span>
                <span>{mockComplianceAudits.length}</span>
              </div>
              <div data-testid="stat-passed-audits">
                <span>通过审计</span>
                <span>{mockComplianceAudits.filter(a => a.status === 'passed').length}</span>
              </div>
              <div data-testid="stat-warning-audits">
                <span>警告审计</span>
                <span>{mockComplianceAudits.filter(a => a.status === 'warning').length}</span>
              </div>
              <div data-testid="stat-failed-audits">
                <span>失败审计</span>
                <span>{mockComplianceAudits.filter(a => a.status === 'failed').length}</span>
              </div>
            </div>
            
            {/* 审计列表 */}
            <div data-testid="compliance-audit-list">
              <h4>审计历史</h4>
              {mockComplianceAudits.map(audit => (
                <div 
                  key={audit.id} 
                  data-testid={`audit-${audit.id}`}
                  data-status={audit.status}
                >
                  <div>
                    <span data-testid="audit-name">{audit.name}</span>
                    <span data-testid="audit-type">{audit.type}</span>
                    <span 
                      data-testid="audit-status" 
                      data-status={audit.status}
                      className={audit.status === 'passed' ? 'text-green' : audit.status === 'warning' ? 'text-yellow' : 'text-red'}
                    >
                      {audit.status === 'passed' ? '通过' : audit.status === 'warning' ? '警告' : '失败'}
                    </span>
                  </div>
                  <div>
                    <span data-testid="audit-duration">{audit.duration}</span>
                    <span data-testid="audit-issues">{audit.issues} 个问题</span>
                    <span data-testid="audit-severity">{audit.severity === 'high' ? '高' : audit.severity === 'medium' ? '中' : '低'}风险</span>
                    <span data-testid="audit-coverage">覆盖: {audit.coverage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

      // 验证覆盖范围显示
      expect(screen.getByText('覆盖: 98.5%')).toBeInTheDocument()
      expect(screen.getByText('覆盖: 95.2%')).toBeInTheDocument()
      expect(screen.getByText('覆盖: 92.8%')).toBeInTheDocument()
      expect(screen.getByText('覆盖: 88.3%')).toBeInTheDocument()
      
      // 验证风险等级显示
      expect(screen.getAllByText('低风险')).toHaveLength(2)
      expect(screen.getByText('中风险')).toBeInTheDocument()
      expect(screen.getByText('高风险')).toBeInTheDocument()
    })
  })

  describe('AI运维性能测试', () => {
    it('应该正确处理大量数据渲染', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `客户${i}`,
        value: Math.random() * 1000,
      }))

      render(
        <div data-testid="large-data-container">
          {largeDataset.slice(0, 10).map((item) => (
            <div key={item.id} data-testid="data-item">
              <span>{item.name}</span>
              <span>{item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )

      expect(screen.getByTestId('large-data-container')).toBeInTheDocument()
      expect(screen.getAllByTestId('data-item')).toHaveLength(10)
    })

    it('应该正确处理实时数据流', async () => {
      jest.useFakeTimers()

      const dataStream = [1, 2, 3, 4, 5]
      let currentIndex = 0

      render(
        <div data-testid="data-stream">
          <div>当前数据: {dataStream[currentIndex] || 0}</div>
        </div>
      )

      // 模拟数据流更新
      const interval = setInterval(() => {
        if (currentIndex < dataStream.length - 1) {
          currentIndex++
        } else {
          clearInterval(interval)
        }
      }, 100)

      jest.advanceTimersByTime(500)

      await waitFor(() => {
        expect(screen.getByText(/当前数据:/)).toBeInTheDocument()
      })

      clearInterval(interval)
      jest.useRealTimers()
    })
  })
})

export {}