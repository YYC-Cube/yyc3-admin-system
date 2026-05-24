'use client'

import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import { Download, Plus, Search } from 'lucide-react'

interface FilterBarProps {
  children?: React.ReactNode
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (value: string) => void
  onSearchChange?: (value: string) => void
  onExport?: () => void
  onAdd?: () => void
  addButtonText?: string
  filters?: {
    label: string
    value?: string
    options: { label: string; value: string }[]
    onChange: (value: string) => void
  }[]
  showDateRange?: boolean
  onDateRangeChange?: (range: any) => void
}

export function FilterBar({
  children: _children,
  searchPlaceholder = '搜索...',
  searchValue: _searchValue,
  onSearch,
  onSearchChange: _onSearchChange,
  onExport,
  onAdd,
  addButtonText: _addButtonText,
  filters,
  showDateRange,
  onDateRangeChange,
}: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* 搜索框 */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9"
            onChange={e => onSearch?.(e.target.value)}
          />
        </div>

        {/* 日期范围选择器 */}
        {showDateRange && <DatePickerWithRange onChange={onDateRangeChange} />}

        {/* 筛选器 */}
        {filters?.map((filter, index) => (
          <Select key={index} onValueChange={filter.onChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        )}
        {onAdd && (
          <Button size="sm" onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            新增
          </Button>
        )}
      </div>
    </motion.div>
  )
}
