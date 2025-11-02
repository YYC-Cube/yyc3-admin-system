"use client"

import { Upload, Sparkles, Trash2 } from "lucide-react"
import React, { useRef, useMemo, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/hooks/useLanguage"
import { formats } from "@/lib/constants/formats"

interface InputPanelProps {
  selectedFormat: string
  setSelectedFormat: (format: string) => void
  inputData: string
  onInputChange: (value: string) => void
  onSampleData: () => void
  onClear: () => void
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const InputPanel = ({
  selectedFormat,
  setSelectedFormat,
  inputData,
  onInputChange,
  onSampleData,
  onClear,
  onFileUpload,
}: InputPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()
  // 统一生成占位符，确保在 SSR/CSR 初始值一致
  const placeholder = useMemo(() => {
    const label = formats.find((f) => f.value === selectedFormat)?.label ?? ""
    return `${label}${t("placeholders.inputData")}`
  }, [selectedFormat, t])

  // === E2E 支持：监听自定义事件以直接设置输入文本 ===
  // 说明：在极端情况下点击或全局函数未触发，测试可派发事件 E2E_SET_INPUT
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<string>
      if (typeof ce.detail === 'string') {
        onInputChange(ce.detail)
      }
    }
    document.addEventListener('E2E_SET_INPUT', handler as EventListener)
    return () => document.removeEventListener('E2E_SET_INPUT', handler as EventListener)
  }, [onInputChange, selectedFormat])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
          <SelectTrigger className="w-40 h-10 bg-card border-border hover:border-ring transition-colors" data-slot="select-trigger">
            <SelectValue placeholder={t("buttons.format")} />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border max-h-60">
            {formats.map((format) => (
              <SelectItem key={format.value} value={format.value} className="hover:bg-accent">
                <span className="flex items-center gap-2">
                  <span>{format.icon}</span>
                  {format.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="lg"
          onClick={onSampleData}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
          data-slot="sample-button"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {t("buttons.sample")}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          data-slot="upload-button"
        >
          <Upload className="w-4 h-4 mr-2" />
          {t("buttons.fileSelect")}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onClear}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
          data-slot="clear-button"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t("buttons.clear")}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".csv,.tsv,.txt,.html,.md,.tex,.sql,.json,.yml,.yaml,.xml"
        onChange={onFileUpload}
        data-slot="upload-input"
      />

      <Textarea
        placeholder={placeholder}
        value={inputData}
        onChange={(e) => onInputChange(e.target.value)}
        className="min-h-[350px] font-mono text-sm bg-muted border-border focus:border-ring focus:ring-ring rounded-xl resize-none"
        data-slot="input-textarea"
      />
      <div className="flex items-center gap-3">
        <Button className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/90">
          {t("actions.parse")}
        </Button>
        <Button className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/90">
          {t("actions.clear")}
        </Button>
        <Button variant="destructive" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
          {t("actions.reset")}
        </Button>
      </div>
    </div>
  )
}
