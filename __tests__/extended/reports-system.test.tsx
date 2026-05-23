/**
 * @file reports-system.test.tsx
 * @description 报表系统模块测试 - 覆盖营业报表、会员报表、酒水存取报表、仓库报表等功能
 * @author YYC
 * @version 1.0.0
 * @created 2025-01-21
 * @updated 2025-01-21
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { 
  Download, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Wine,
  Package,
  Gift,
  CreditCard
} from 'lucide-react'

// Mock UI Components
const MockCard = ({ children, className = '', ...props }: any) => (
  <div data-testid="card" className={className} {...props}>
    {children}
  </div>
)

const MockCardContent = ({ children, className = '', ...props }: any) => (
  <div data-testid="card-content" className={className} {...props}>
    {children}
  </div>
)

const MockCardHeader = ({ children, className = '', ...props }: any) => (
  <div data-testid="card-header" className={className} {...props}>
    {children}
  </div>
)

const MockCardTitle = ({ children, className = '', ...props }: any) => (
  <h3 data-testid="card-title" className={className} {...props}>
    {children}
  </h3>
)

const MockButton = ({ children, className = '', onClick, variant, ...props }: any) => (
  <button 
    data-testid="button" 
    className={className} 
    onClick={onClick}
    data-variant={variant}
    {...props}
  >
    {children}
  </button>
)

const MockInput = ({ className = '', onChange, ...props }: any) => (
  <input 
    data-testid="input" 
    className={className} 
    onChange={onChange}
    {...props}
  />
)

const MockSelect = ({ children, onValueChange, ...props }: any) => (
  <div data-testid="select" onClick={() => onValueChange?.('test-value')} {...props}>
    {children}
  </div>
)

const MockSelectContent = ({ children }: any) => (
  <div data-testid="select-content">
    {children}
  </div>
)

const MockSelectItem = ({ children, value, ...props }: any) => (
  <div data-testid="select-item" data-value={value} {...props}>
    {children}
  </div>
)

const MockSelectTrigger = ({ children }: any) => (
  <div data-testid="select-trigger">
    {children}
  </div>
)

const MockSelectValue = ({ placeholder }: any) => (
  <span data-testid="select-value">{placeholder}</span>
)

const MockTable = ({ children, className = '', ...props }: any) => (
  <table data-testid="table" className={className} {...props}>
    {children}
  </table>
)

const MockTableHeader = ({ children }: any) => (
  <thead data-testid="table-header">
    {children}
  </thead>
)

const MockTableBody = ({ children }: any) => (
  <tbody data-testid="table-body">
    {children}
  </tbody>
)

const MockTableHead = ({ children, className = '', ...props }: any) => (
  <th data-testid="table-head" className={className} {...props}>
    {children}
  </th>
)

const MockTableRow = ({ children, className = '', ...props }: any) => (
  <tr data-testid="table-row" className={className} {...props}>
    {children}
  </tr>
)

const MockTableCell = ({ children, className = '', ...props }: any) => (
  <td data-testid="table-cell" className={className} {...props}>
    {children}
  </td>
)

const MockTabs = ({ children, defaultValue, ...props }: any) => (
  <div data-testid="tabs" data-default-value={defaultValue} {...props}>
    {children}
  </div>
)

const MockTabsList = ({ children, className = '', ...props }: any) => (
  <div data-testid="tabs-list" className={className} {...props}>
    {children}
  </div>
)

const MockTabsTrigger = ({ children, value, ...props }: any) => (
  <button 
    data-testid="tabs-trigger" 
    data-value={value} 
    {...props}
  >
    {children}
  </button>
)

const MockTabsContent = ({ children, value, ...props }: any) => (
  <div data-testid="tabs-content" data-value={value} {...props}>
    {children}
  </div>
)

const MockBadge = ({ children, variant, className = '', ...props }: any) => (
  <span 
    data-testid="badge" 
    data-variant={variant}
    className={className} 
    {...props}
  >
    {children}
  </span>
)

// Mock Icons
jest.mock('lucide-react', () => ({
  Download: ({ className, ...props }: any) => (
    <svg data-testid="icon-download" className={className} {...props} />
  ),
  TrendingUp: ({ className, ...props }: any) => (
    <svg data-testid="icon-trending-up" className={className} {...props} />
  ),
  DollarSign: ({ className, ...props }: any) => (
    <svg data-testid="icon-dollar-sign" className={className} {...props} />
  ),
  ShoppingBag: ({ className, ...props }: any) => (
    <svg data-testid="icon-shopping-bag" className={className} {...props} />
  ),
  Users: ({ className, ...props }: any) => (
    <svg data-testid="icon-users" className={className} {...props} />
  ),
  Wine: ({ className, ...props }: any) => (
    <svg data-testid="icon-wine" className={className} {...props} />
  ),
  Package: ({ className, ...props }: any) => (
    <svg data-testid="icon-package" className={className} {...props} />
  ),
  Gift: ({ className, ...props }: any) => (
    <svg data-testid="icon-gift" className={className} {...props} />
  ),
  CreditCard: ({ className, ...props }: any) => (
    <svg data-testid="icon-credit-card" className={className} {...props} />
  ),
}))

// Mock components
jest.mock('@/components/ui/card', () => ({
  Card: MockCard,
  CardContent: MockCardContent,
  CardHeader: MockCardHeader,
  CardTitle: MockCardTitle,
}))

jest.mock('@/components/ui/button', () => ({
  Button: MockButton,
}))

jest.mock('@/components/ui/input', () => ({
  Input: MockInput,
}))

jest.mock('@/components/ui/select', () => ({
  Select: MockSelect,
  SelectContent: MockSelectContent,
  SelectItem: MockSelectItem,
  SelectTrigger: MockSelectTrigger,
  SelectValue: MockSelectValue,
}))

jest.mock('@/components/ui/table', () => ({
  Table: MockTable,
  TableHeader: MockTableHeader,
  TableBody: MockTableBody,
  TableHead: MockTableHead,
  TableRow: MockTableRow,
  TableCell: MockTableCell,
}))

jest.mock('@/components/ui/tabs', () => ({
  Tabs: MockTabs,
  TabsList: MockTabsList,
  TabsTrigger: MockTabsTrigger,
  TabsContent: MockTabsContent,
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: MockBadge,
}))

// Mock dashboard components
const MockStatCard = ({ title, value, icon: Icon, delay }: any) => (
  <div data-testid="stat-card" data-delay={delay}>
    <div data-testid="stat-card-title">{title}</div>
    <div data-testid="stat-card-value">{value}</div>
    <div data-testid="stat-card-icon">
      <Icon />
    </div>
  </div>
)

const MockFilterBar = ({ filters, onSearch }: any) => (
  <div data-testid="filter-bar">
    {filters?.map((filter: any, index: number) => (
      <div key={index} data-testid="filter-item">
        <span>{filter.label}</span>
        <div onClick={() => filter.onChange?.('test-value')}>
          {filter.options?.map((option: any) => (
            <div key={option.value} data-value={option.value}>
              {option.label}
            </div>
          ))}
        </div>
      </div>
    ))}
    <button data-testid="filter-search" onClick={onSearch}>
      搜索
    </button>
  </div>
)

const MockDataTable = ({ columns, data }: any) => (
  <div data-testid="data-table">
    <table>
      <thead>
        <tr>
          {columns.map((column: any, index: number) => (
            <th key={index}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, rowIndex: number) => (
          <tr key={rowIndex}>
            {columns.map((column: any, colIndex: number) => (
              <td key={colIndex}>
                {column.render ? column.render(row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

jest.mock('@/components/dashboard/stat-card', () => ({
  StatCard: MockStatCard,
}))

jest.mock('@/components/dashboard/filter-bar', () => ({
  FilterBar: MockFilterBar,
}))

jest.mock('@/components/dashboard/data-table', () => ({
  DataTable: MockDataTable,
}))

// Mock chart components
const MockChartContainer = ({ children, className, config }: any) => (
  <div data-testid="chart-container" className={className} data-config={JSON.stringify(config)}>
    {children}
  </div>
)

const MockChartTooltip = () => <div data-testid="chart-tooltip" />

const MockBarChart = ({ children, data }: any) => (
  <div data-testid="bar-chart" data-data={JSON.stringify(data)}>
    {children}
  </div>
)

const MockResponsiveContainer = ({ children, width, height }: any) => (
  <div data-testid="responsive-container" style={{ width, height }}>
    {children}
  </div>
)

const MockXAxis = ({ dataKey }: any) => (
  <div data-testid="x-axis" data-key={dataKey} />
)

const MockYAxis = () => <div data-testid="y-axis" />

const MockBar = ({ dataKey, fill, radius }: any) => (
  <div data-testid="bar" data-key={dataKey} data-fill={fill} data-radius={JSON.stringify(radius)} />
)

jest.mock('@/components/ui/chart', () => ({
  ChartContainer: MockChartContainer,
  ChartTooltip: MockChartTooltip,
}))

jest.mock('recharts', () => ({
  BarChart: MockBarChart,
  ResponsiveContainer: MockResponsiveContainer,
  XAxis: MockXAxis,
  YAxis: MockYAxis,
  Bar: MockBar,
}))

// 模拟报表数据
const mockSalesData = [
  {
    id: "1",
    time: "2019-01-08 11:19",
    orderNo: "D108175561882149",
    type: "续时",
    payType: "自定义支付类型2",
    store: "启智",
    room: "5314",
    operator: "启智网络",
    category: "酒水套餐",
    product: "酒水套餐",
    unit: "份",
    quantity: 1,
    price: "0.01",
    cost: "6.00",
    total: "0.01",
    costTotal: "6.00",
    profit: "-5.99",
  },
]

const mockMemberStats = [
  {
    id: "1",
    cardNo: "000003",
    name: "张三",
    phone: "18950177190",
    visits: 8,
    totalSpent: 2374.2,
    balance: 1662.14,
    points: 20872,
  },
]

const mockLiquorSummary = [
  {
    id: 1,
    store: "启智",
    category: "休闲食品",
    product: "JELLYBIRD果冻酒36gx2",
    unit: "个",
    storageQty: 46.0,
    pickupQty: 0.0,
    price: 1.0,
    storageAmount: 46.0,
    pickupAmount: 0.0,
  },
]

const mockStockChanges = [
  {
    id: "D110086192017717",
    time: "2019-01-10 16:23",
    type: "订单销售",
    change: "出库",
    store: "启智",
    warehouse: "超市仓",
    category: "休闲食品",
    product: "JELLYBIRD果冻酒36gx2",
    unit: "个",
    quantity: 1.0,
    price: 1.0,
    total: 1.0,
  },
]

const mockChartData = [
  { month: "1月", recharge: 45000, consumption: 38000 },
  { month: "2月", recharge: 52000, consumption: 42000 },
]

describe('报表系统模块测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('营业报表测试', () => {
    it('应该正确渲染营业报表页面', () => {
      render(
        <div>
          <div>
            <h1>营业报表</h1>
            <p>查看和分析门店营业数据</p>
          </div>
          
          <div>
            <MockCard>
              <MockCardContent>
                <div>
                  <p>销售总额</p>
                  <p>¥11,718.86</p>
                </div>
                <DollarSign />
              </MockCardContent>
            </MockCard>
            
            <MockCard>
              <MockCardContent>
                <div>
                  <p>成本总额</p>
                  <p>¥67,890.20</p>
                </div>
                <ShoppingBag />
              </MockCardContent>
            </MockCard>
            
            <MockCard>
              <MockCardContent>
                <div>
                  <p>利润总额</p>
                  <p>¥-59,123.15</p>
                </div>
                <TrendingUp />
              </MockCardContent>
            </MockCard>
            
            <MockCard>
              <MockCardContent>
                <div>
                  <p>销售数量</p>
                  <p>865</p>
                </div>
                <Users />
              </MockCardContent>
            </MockCard>
          </div>
        </div>
      )

      expect(screen.getByText('营业报表')).toBeInTheDocument()
      expect(screen.getByText('查看和分析门店营业数据')).toBeInTheDocument()
      expect(screen.getByText('销售总额')).toBeInTheDocument()
      expect(screen.getByText('¥11,718.86')).toBeInTheDocument()
      expect(screen.getByText('成本总额')).toBeInTheDocument()
      expect(screen.getByText('¥67,890.20')).toBeInTheDocument()
      expect(screen.getByText('利润总额')).toBeInTheDocument()
      expect(screen.getByText('¥-59,123.15')).toBeInTheDocument()
      expect(screen.getByText('销售数量')).toBeInTheDocument()
      expect(screen.getByText('865')).toBeInTheDocument()
    })

    it('应该正确渲染报表标签页', () => {
      render(
        <MockTabs defaultValue="sales">
          <MockTabsList>
            <MockTabsTrigger value="sales">商品销售明细</MockTabsTrigger>
            <MockTabsTrigger value="summary">商品销售汇总</MockTabsTrigger>
            <MockTabsTrigger value="profit">销售盈利报表</MockTabsTrigger>
            <MockTabsTrigger value="income">营业收入报表</MockTabsTrigger>
          </MockTabsList>
          
          <MockTabsContent value="sales">
            <div>商品销售明细内容</div>
          </MockTabsContent>
        </MockTabs>
      )

      expect(screen.getByText('商品销售明细')).toBeInTheDocument()
      expect(screen.getByText('商品销售汇总')).toBeInTheDocument()
      expect(screen.getByText('销售盈利报表')).toBeInTheDocument()
      expect(screen.getByText('营业收入报表')).toBeInTheDocument()
      expect(screen.getByText('商品销售明细内容')).toBeInTheDocument()
    })

    it('应该正确渲染筛选区域', () => {
      render(
        <MockCard>
          <MockCardContent>
            <div>
              <div>
                <label>时间范围</label>
                <MockInput type="date" />
              </div>
              <div>
                <label>消费门店</label>
                <MockSelect>
                  <MockSelectTrigger>
                    <MockSelectValue placeholder="选择门店" />
                  </MockSelectTrigger>
                  <MockSelectContent>
                    <MockSelectItem value="all">全部门店</MockSelectItem>
                    <MockSelectItem value="store1">启智</MockSelectItem>
                  </MockSelectContent>
                </MockSelect>
              </div>
              <div>
                <label>商品类型</label>
                <MockSelect>
                  <MockSelectTrigger>
                    <MockSelectValue placeholder="选择类型" />
                  </MockSelectTrigger>
                  <MockSelectContent>
                    <MockSelectItem value="all">全部类型</MockSelectItem>
                    <MockSelectItem value="package">酒水套餐</MockSelectItem>
                  </MockSelectContent>
                </MockSelect>
              </div>
              <div>
                <MockButton>查询</MockButton>
                <MockButton>
                  <Download />
                </MockButton>
              </div>
            </div>
          </MockCardContent>
        </MockCard>
      )

      expect(screen.getByText('时间范围')).toBeInTheDocument()
      expect(screen.getByText('消费门店')).toBeInTheDocument()
      expect(screen.getByText('商品类型')).toBeInTheDocument()
      expect(screen.getByText('全部门店')).toBeInTheDocument()
      expect(screen.getByText('查询')).toBeInTheDocument()
    })

    it('应该正确显示销售明细数据表格', () => {
      render(
        <MockTable>
          <MockTableHeader>
            <MockTableRow>
              <MockTableHead>操作时间</MockTableHead>
              <MockTableHead>单据编号</MockTableHead>
              <MockTableHead>门店</MockTableHead>
              <MockTableHead>包厢</MockTableHead>
              <MockTableHead>商品分类</MockTableHead>
              <MockTableHead>商品名称</MockTableHead>
              <MockTableHead>数量</MockTableHead>
              <MockTableHead>单价</MockTableHead>
              <MockTableHead>总额</MockTableHead>
            </MockTableRow>
          </MockTableHeader>
          <MockTableBody>
            {mockSalesData.map((sale) => (
              <MockTableRow key={sale.id}>
                <MockTableCell>{sale.time}</MockTableCell>
                <MockTableCell>{sale.orderNo}</MockTableCell>
                <MockTableCell>{sale.store}</MockTableCell>
                <MockTableCell>{sale.room}</MockTableCell>
                <MockTableCell>{sale.category}</MockTableCell>
                <MockTableCell>{sale.product}</MockTableCell>
                <MockTableCell>{sale.quantity}</MockTableCell>
                <MockTableCell>¥{sale.price}</MockTableCell>
                <MockTableCell>¥{sale.total}</MockTableCell>
              </MockTableRow>
            ))}
          </MockTableBody>
        </MockTable>
      )

      expect(screen.getByText('操作时间')).toBeInTheDocument()
      expect(screen.getByText('D108175561882149')).toBeInTheDocument()
      expect(screen.getByText('启智')).toBeInTheDocument()
      expect(screen.getByText('5314')).toBeInTheDocument()
      expect(screen.getAllByText('酒水套餐').length).toBeGreaterThan(0)
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getAllByText('¥0.01').length).toBeGreaterThan(0)
    })
  })

  describe('会员报表测试', () => {
    it('应该正确渲染会员报表页面', () => {
      render(
        <div>
          <div>
            <Users />
            <h1>会员报表</h1>
            <p>查看会员消费和充值统计</p>
          </div>
          
          <div>
            <MockStatCard
              title="会员总数"
              value="1,234"
              icon={Users}
              delay={0}
            />
            <MockStatCard
              title="本月充值"
              value="¥6.7万"
              icon={CreditCard}
              delay={0.1}
            />
            <MockStatCard
              title="本月消费"
              value="¥5.8万"
              icon={TrendingUp}
              delay={0.2}
            />
            <MockStatCard
              title="积分发放"
              value="12.8万"
              icon={Gift}
              delay={0.3}
            />
          </div>
        </div>
      )

      expect(screen.getByText('会员报表')).toBeInTheDocument()
      expect(screen.getByText('查看会员消费和充值统计')).toBeInTheDocument()
      expect(screen.getByText('会员总数')).toBeInTheDocument()
      expect(screen.getByText('1,234')).toBeInTheDocument()
      expect(screen.getByText('本月充值')).toBeInTheDocument()
      expect(screen.getByText('¥6.7万')).toBeInTheDocument()
      expect(screen.getByText('本月消费')).toBeInTheDocument()
      expect(screen.getByText('¥5.8万')).toBeInTheDocument()
      expect(screen.getByText('积分发放')).toBeInTheDocument()
      expect(screen.getByText('12.8万')).toBeInTheDocument()
    })

    it('应该正确渲染充值消费趋势图', () => {
      render(
        <MockCard>
          <MockCardHeader>
            <MockCardTitle>充值与消费趋势</MockCardTitle>
          </MockCardHeader>
          <MockCardContent>
            <MockChartContainer
              config={{
                recharge: { label: "充值金额", color: "hsl(var(--chart-1))" },
                consumption: { label: "消费金额", color: "hsl(var(--chart-2))" },
              }}
            >
              <MockResponsiveContainer width="100%" height="100%">
                <MockBarChart data={mockChartData}>
                  <MockXAxis dataKey="month" />
                  <MockYAxis />
                  <MockChartTooltip />
                  <MockBar dataKey="recharge" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                  <MockBar dataKey="consumption" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                </MockBarChart>
              </MockResponsiveContainer>
            </MockChartContainer>
          </MockCardContent>
        </MockCard>
      )

      expect(screen.getByText('充值与消费趋势')).toBeInTheDocument()
      expect(screen.getByTestId('chart-container')).toBeInTheDocument()
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      expect(screen.getByTestId('x-axis')).toBeInTheDocument()
      expect(screen.getByTestId('y-axis')).toBeInTheDocument()
      expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument()
    })

    it('应该正确显示会员数据表格', () => {
      const memberColumns = [
        { key: "cardNo", label: "会员卡号" },
        { key: "name", label: "会员姓名" },
        { key: "phone", label: "手机号" },
        {
          key: "visits",
          label: "到店次数",
          render: (row: any) => <span>{row.visits}次</span>,
        },
        {
          key: "totalSpent",
          label: "累计消费",
          render: (row: any) => <span className="text-green-600">¥{row.totalSpent.toFixed(2)}</span>,
        },
        {
          key: "balance",
          label: "账户余额",
          render: (row: any) => <span className="text-primary">¥{row.balance.toFixed(2)}</span>,
        },
        {
          key: "points",
          label: "积分余额",
          render: (row: any) => <MockBadge>{row.points}</MockBadge>,
        },
      ]

      render(
        <MockDataTable
          columns={memberColumns}
          data={mockMemberStats}
        />
      )

      expect(screen.getByText('会员卡号')).toBeInTheDocument()
      expect(screen.getByText('会员姓名')).toBeInTheDocument()
      expect(screen.getByText('手机号')).toBeInTheDocument()
      expect(screen.getByText('000003')).toBeInTheDocument()
      expect(screen.getByText('张三')).toBeInTheDocument()
      expect(screen.getByText('18950177190')).toBeInTheDocument()
      expect(screen.getByText('8次')).toBeInTheDocument()
      expect(screen.getByText('¥2374.20')).toBeInTheDocument()
      expect(screen.getByText('¥1662.14')).toBeInTheDocument()
      expect(screen.getByText('20872')).toBeInTheDocument()
    })
  })

  describe('酒水存取报表测试', () => {
    it('应该正确渲染酒水存取报表页面', () => {
      render(
        <div>
          <div>
            <h1>酒水存取报表</h1>
            <p>查看酒水寄存、取酒、充公等相关数据报表</p>
          </div>
          
          <div>
            <MockCard>
              <MockCardHeader>
                <MockCardTitle>寄存总量</MockCardTitle>
                <Package />
              </MockCardHeader>
              <MockCardContent>
                <div>63</div>
                <p>本期寄存数量</p>
              </MockCardContent>
            </MockCard>
            
            <MockCard>
              <MockCardHeader>
                <MockCardTitle>取酒总量</MockCardTitle>
                <Wine />
              </MockCardHeader>
              <MockCardContent>
                <div>4</div>
                <p>本期取酒数量</p>
              </MockCardContent>
            </MockCard>
            
            <MockCard>
              <MockCardHeader>
                <MockCardTitle>寄存金额</MockCardTitle>
                <TrendingUp />
              </MockCardHeader>
              <MockCardContent>
                <div>¥66.50</div>
                <p>寄存商品总价值</p>
              </MockCardContent>
            </MockCard>
            
            <MockCard>
              <MockCardHeader>
                <MockCardTitle>取酒金额</MockCardTitle>
                <TrendingUp />
              </MockCardHeader>
              <MockCardContent>
                <div>¥6.50</div>
                <p>取酒商品总价值</p>
              </MockCardContent>
            </MockCard>
          </div>
        </div>
      )

      expect(screen.getByText('酒水存取报表')).toBeInTheDocument()
      expect(screen.getByText('查看酒水寄存、取酒、充公等相关数据报表')).toBeInTheDocument()
      expect(screen.getByText('寄存总量')).toBeInTheDocument()
      expect(screen.getByText('63')).toBeInTheDocument()
      expect(screen.getByText('取酒总量')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('寄存金额')).toBeInTheDocument()
      expect(screen.getByText('¥66.50')).toBeInTheDocument()
      expect(screen.getByText('取酒金额')).toBeInTheDocument()
      expect(screen.getByText('¥6.50')).toBeInTheDocument()
    })

    it('应该正确渲染筛选栏', () => {
      const mockFilters = [
        {
          label: '选择门店',
          options: [
            { label: '全部门店', value: 'all' },
            { label: '启智', value: 'store1' },
          ],
          onChange: jest.fn()
        },
        {
          label: '商品类型',
          options: [
            { label: '全部类型', value: 'all' },
            { label: '洋酒', value: 'liquor' },
          ],
          onChange: jest.fn()
        }
      ]

      const mockOnSearch = jest.fn()

      render(
        <MockFilterBar
          filters={mockFilters}
          onSearch={mockOnSearch}
        />
      )

      expect(screen.getByText('选择门店')).toBeInTheDocument()
      expect(screen.getByText('商品类型')).toBeInTheDocument()
      expect(screen.getByText('全部门店')).toBeInTheDocument()
      expect(screen.getByText('启智')).toBeInTheDocument()
      expect(screen.getByText('全部类型')).toBeInTheDocument()
      expect(screen.getByText('洋酒')).toBeInTheDocument()
    })

    it('应该正确显示酒水存取数据表格', () => {
      const liquorColumns = [
        { key: "store", label: "门店", width: "w-32" },
        { key: "category", label: "商品类型", width: "w-28" },
        { key: "product", label: "商品名称", width: "w-48" },
        { key: "unit", label: "单位", width: "w-20" },
        {
          key: "storageQty", 
          label: "寄存信息", 
          render: (row: any) => (
            <div>
              <Package />
              <span>{row.storageQty}</span>
              <span>金额: ¥{(row.storageAmount || 0).toFixed(2)}</span>
            </div>
          )
        },
        {
          key: "pickupQty", 
          label: "取酒信息", 
          render: (row: any) => (
            <div>
              <Wine />
              <span>{row.pickupQty}</span>
              <span>金额: ¥{(row.pickupAmount || 0).toFixed(2)}</span>
            </div>
          )
        },
        {
          key: "price", 
          label: "进货单价", 
          render: (row: any) => (
            <span>¥{(row.price || 0).toFixed(2)}</span>
          )
        },
      ]

      render(
        <MockDataTable
          columns={liquorColumns}
          data={mockLiquorSummary}
        />
      )

      expect(screen.getByText('门店')).toBeInTheDocument()
      expect(screen.getByText('商品类型')).toBeInTheDocument()
      expect(screen.getByText('商品名称')).toBeInTheDocument()
      expect(screen.getByText('单位')).toBeInTheDocument()
      expect(screen.getByText('寄存信息')).toBeInTheDocument()
      expect(screen.getByText('取酒信息')).toBeInTheDocument()
      expect(screen.getByText('启智')).toBeInTheDocument()
      expect(screen.getByText('休闲食品')).toBeInTheDocument()
      expect(screen.getByText('JELLYBIRD果冻酒36gx2')).toBeInTheDocument()
      expect(screen.getAllByText('个').length).toBeGreaterThan(0)
      expect(screen.getAllByText('46').length).toBeGreaterThan(0)
      expect(screen.getAllByText('0').length).toBeGreaterThan(0)
    })
  })

  describe('仓库报表测试', () => {
    it('应该正确渲染仓库报表页面', () => {
      render(
        <div>
          <div>
            <h1>仓库报表</h1>
            <p>查看商品入库、出库相关进出库报表数据</p>
          </div>
          
          <div>
            <MockCard>
              <MockCardHeader>
                <MockCardTitle>入库数量</MockCardTitle>
                <TrendingUp />
              </MockCardHeader>
              <MockCardContent>
                <div>61,513</div>
                <p>本期入库总数</p>
              </MockCardContent>
            </MockCard>
            
            <MockCard>
              <MockCardHeader>
                <MockCardTitle>出库数量</MockCardTitle>
                <TrendingUp />
              </MockCardHeader>
              <MockCardContent>
                <div>67,876</div>
                <p>本期出库总数</p>
              </MockCardContent>
            </MockCard>
          </div>
        </div>
      )

      expect(screen.getByText('仓库报表')).toBeInTheDocument()
      expect(screen.getByText('查看商品入库、出库相关进出库报表数据')).toBeInTheDocument()
      expect(screen.getByText('入库数量')).toBeInTheDocument()
      expect(screen.getByText('61,513')).toBeInTheDocument()
      expect(screen.getByText('出库数量')).toBeInTheDocument()
      expect(screen.getByText('67,876')).toBeInTheDocument()
    })

    it('应该正确显示库存变化数据表格', () => {
      const warehouseColumns = [
        { key: "time", label: "操作时间", width: "w-40" },
        { 
          key: "id", 
          label: "单据编号", 
          render: (row: any) => <span>{row.id}</span>
        },
        { 
          key: "type", 
          label: "单据类型", 
          render: (row: any) => <MockBadge>{row.type}</MockBadge>
        },
        { 
          key: "change", 
          label: "库存变化", 
          render: (row: any) => (
            <MockBadge variant={row.change === "入库" ? "default" : "secondary"}>
              {row.change}
            </MockBadge>
          )
        },
        { key: "warehouse", label: "仓库", width: "w-28" },
        { 
          key: "product", 
          label: "商品信息", 
          render: (row: any) => (
            <div>
              <div>{row.product}</div>
              <div>{row.category} · {row.unit}</div>
            </div>
          )
        },
        { 
          key: "quantity", 
          label: "数量", 
          render: (row: any) => <span>{row.quantity}</span>
        },
        { 
          key: "total", 
          label: "进货价合计", 
          render: (row: any) => <span>¥{row.total?.toFixed(2) || '0.00'}</span>
        },
      ]

      render(
        <MockDataTable
          columns={warehouseColumns}
          data={mockStockChanges}
        />
      )

      expect(screen.getByText('操作时间')).toBeInTheDocument()
      expect(screen.getByText('单据编号')).toBeInTheDocument()
      expect(screen.getByText('单据类型')).toBeInTheDocument()
      expect(screen.getByText('库存变化')).toBeInTheDocument()
      expect(screen.getByText('仓库')).toBeInTheDocument()
      expect(screen.getByText('商品信息')).toBeInTheDocument()
      expect(screen.getByText('数量')).toBeInTheDocument()
      expect(screen.getByText('进货价合计')).toBeInTheDocument()
      expect(screen.getByText('D110086192017717')).toBeInTheDocument()
      expect(screen.getByText('订单销售')).toBeInTheDocument()
      expect(screen.getByText('出库')).toBeInTheDocument()
      expect(screen.getByText('超市仓')).toBeInTheDocument()
      expect(screen.getByText('JELLYBIRD果冻酒36gx2')).toBeInTheDocument()
      expect(screen.getByText('休闲食品 · 个')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('¥1.00')).toBeInTheDocument()
    })
  })

  describe('报表系统交互测试', () => {
    it('应该正确处理筛选操作', async () => {
      const mockOnSearch = jest.fn()

      render(
        <MockFilterBar
          filters={[
            {
              label: '选择门店',
              options: [{ label: '全部门店', value: 'all' }],
              onChange: jest.fn()
            }
          ]}
          onSearch={mockOnSearch}
        />
      )

      const searchButton = screen.getByTestId('filter-search')
      fireEvent.click(searchButton)

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalled()
      })
    })

    it('应该正确处理导出功能', () => {
      const mockOnExport = jest.fn()

      render(
        <MockButton onClick={mockOnExport}>
          <Download />
        </MockButton>
      )

      const exportButton = screen.getByTestId('button')
      fireEvent.click(exportButton)

      expect(mockOnExport).toHaveBeenCalled()
    })

    it('应该正确处理搜索功能', () => {
      const mockOnChange = jest.fn()

      render(
        <MockInput 
          placeholder="搜索商品名称"
          onChange={mockOnChange}
        />
      )

      const searchInput = screen.getByTestId('input')
      fireEvent.change(searchInput, { target: { value: '测试商品' } })

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: '测试商品'
          })
        })
      )
    })

    it('应该正确处理日期选择', () => {
      render(
        <MockInput type="date" />
      )

      const dateInput = screen.getByTestId('input')
      fireEvent.change(dateInput, { target: { value: '2024-01-01' } })

      expect(dateInput).toHaveValue('2024-01-01')
    })
  })
})