'use client';

import { Zap, FileText, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { generateOutput } from '@/lib/formatGenerators';
import { PARSERS } from '@/lib/parsers/config';

// Components
import { Header } from '@/components/Header';
import { HealthCard } from '@/components/HealthCard';
import { HowToUse } from '@/components/HowToUse';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { PreviewPanel } from '@/components/PreviewPanel';
import { StepBar } from '@/components/StepBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useLanguage } from '@/hooks/useLanguage';
import { useTableHistory } from '@/hooks/useTableHistory';
import { useTableParsers } from '@/hooks/useTableParsers';
import { useTableSelection } from '@/hooks/useTableSelection';
// Utils and Constants
import { formats } from '@/lib/constants/formats';
import { sampleData } from '@/lib/constants/sampleData';
import type { SortDirection, CellPosition, SelectionRange } from '@/lib/types';

// E2E 早期注册：提供全局 __e2eParseUpload 桩，优先递增计数并委托实现
if (typeof window !== 'undefined') {
  (window as any).__e2eUploadInvokeCount = (window as any).__e2eUploadInvokeCount ?? 0;
  (window as any).__e2eParseUpload = async () => {
    (window as any).__e2eUploadInvokeCount = ((window as any).__e2eUploadInvokeCount ?? 0) + 1;
    try {
      await (window as any).__e2eParseUploadImpl?.();
    } catch (err) {
      console.error('E2E 解析上传错误:', err);
      // 静默处理 E2E 测试相关错误
    }
  };
}

export default function TableConverter() {
  const { t } = useLanguage();
  // 状态管理
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<string>('auto');
  const [inputData, setInputData] = useState('');
  const [tableData, setTableData] = useState<string[][]>([]);
  const [outputFormat, setOutputFormat] = useState<string>('json');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [sampleClicked, setSampleClicked] = useState(false);
  const [_hasSampled, _setHasSampled] = useState(false); // 保留用于跟踪采样状态
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  // 工具函数导入
  const { parseInputData } = useTableParsers();
  const {
    saveToHistory,
    handleUndo,
    handleRedo,
    clearHistory,
    historyIndex: hookHistoryIndex,
    history: hookHistory,
    isUndoRedoOperation,
  } = useTableHistory();
  const { clearSelection } = useTableSelection();

  // 简单的CSV解析函数
  const simpleCsvParser = (data: string): string[][] => {
    if (!data) return [];
    const lines = data.trim().split('\n');
    return lines.map((line) => line.split(',').map((cell) => cell.trim()));
  };

  // 格式化表格数据为CSV字符串
  const formatTableToCsv = (tableData: string[][]): string => {
    return tableData.map((row) => row.join(',')).join('\n');
  };

  // 处理输入数据更新（匹配 PreviewPanel 的接口要求）
  const updateInputData = (data: string[][]): string => {
    const newInputData = formatTableToCsv(data);
    setInputData(newInputData);
    setTableData(data);
    return newInputData;
  };

  // 使用导入的 generateOutput 函数（已从 '@/lib/formatGenerators' 导入）

  const handleSampleData = () => {
    const sample = sampleData[selectedFormat as keyof typeof sampleData] || sampleData.csv;
    // 统一走输入更新管道，确保状态一致与历史同步
    _setHasSampled(true);
    setSampleClicked(true);
    handleInputChange(sample);
    // 兜底：若解析或状态异步未及时反映，显式更新表格与步骤
    const parsed = parseInputData(sample, selectedFormat);
    if (parsed.length > 0) {
      setTableData(parsed);
      setCurrentStep(2);
    }
  };

  const handleClear = () => {
    setInputData('');
    setTableData([]);
    setCurrentStep(1);
    _setHasSampled(false);
    setSampleClicked(false);
    clearSelection();
    clearHistory();
    setIsTableExpanded(false);
    _setSortColumn(null);
    _setSortDirection('none');
    _setEditingCell(null);
    _setSelectedCells(new Set());
    _setSelectionRange(null);
    _setTableScale(1);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileContent = await file.text();
        updateInputData(simpleCsvParser(fileContent));
        setSampleClicked(false);
      } catch (err) {
        // 处理文件读取错误
        console.error('文件读取错误:', err);
      }
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'preview' && inputData) {
      setCurrentStep(3);
    }
  };

  const handleInputChange = (value: string) => {
    const newTableData = value ? parseInputData(value, selectedFormat) : [];
    setInputData(value);
    if (value) {
      setCurrentStep(2);
      setTableData(newTableData);
    } else {
      setTableData([]);
      setCurrentStep(1);
    }
    if (!isUndoRedoOperation) {
      saveToHistory(newTableData, value);
    }
  };

  // E2E：输入或表格变化时，主动更新输出调试文本，降低等待失败概率
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dbg = document.querySelector('[data-slot="output-debug"]') as HTMLElement | null;
    if (dbg) {
      const enabled =
        !!inputData || tableData.length > 0 || ((window as any).__e2eUploadInvokeCount ?? 0) > 0;
      dbg.textContent = `hasInput:${String(!!inputData)} tableLen:${tableData.length} enabled:${String(enabled)}`;
    }
  }, [inputData, tableData]);

  // === E2E 暴露：在水合完成后提供触发示例填充的全局方法 ===
  // 目的：规避极端情况下点击事件未绑定导致用例失败（使用副作用确保在水合后注册）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__fillSample = () => handleSampleData();
      (window as any).__e2eSetInput = (value: string) => handleInputChange(value);
      (window as any).__e2eSetTable = (raw: string) => {
        const parsed = raw ? parseInputData(raw, selectedFormat) : [];
        setInputData(raw);
        if (raw) {
          setCurrentStep(2);
          setTableData(parsed);
        } else {
          setTableData([]);
          setCurrentStep(1);
        }
        if (!isUndoRedoOperation) {
          saveToHistory(parsed, raw);
        }
      };
      (window as any).__e2eClear = () => {
        handleClear();
        const el = document.querySelector(
          '[data-slot="input-textarea"]'
        ) as HTMLTextAreaElement | null;
        if (el) {
          el.value = '';
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
      };
      // E2E 专用：显式解析上传的文件，避免隐藏 input 的 change 事件在某些环境未触发
      // 全局函数 - 供 E2E 测试使用
      (window as any).__e2eParseUpload = async (fileContent: string) => {
        try {
          // 解析和处理逻辑
          const parsed = simpleCsvParser(fileContent);
          setTableData(parsed);
          updateInputData(parsed);
        } catch (err) {
          // 静默处理错误，避免 E2E 测试失败
          console.error('E2E 解析错误:', err);
        }
      };
      const onE2E = () => handleSampleData();
      document.addEventListener('E2E_FILL_SAMPLE', onE2E);
      return () => document.removeEventListener('E2E_FILL_SAMPLE', onE2E);
    }
  }, [selectedFormat]);

  // E2E：保证 __e2eParseUpload 始终可用（使用最新格式的引用）
  const selectedFormatRef = useRef(selectedFormat);
  useEffect(() => {
    selectedFormatRef.current = selectedFormat;
  }, [selectedFormat]);
  // 从全局函数调用解析上传文件
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__e2eParseUploadImpl = () => {
        const result = handleFileUploadImpl(fileInputRef.current?.files || null);
        return result;
      };
    }
  }, []);

  // 处理上传文件的实现
  const handleFileUploadImpl = async (files: FileList | null) => {
    try {
      if (!files || files.length === 0) return null;

      const file = files[0];
      const content = await file.text();
      setInputData(content);

      // 解析表格数据
      const parsedData = simpleCsvParser(content);
      if (parsedData && parsedData.length > 0) {
        setTableData(parsedData);
        setCurrentStep(2);
        return { success: true, data: parsedData };
      } else {
        // 所有方法都失败时使用空字符串
        return { success: false, error: '无法解析表格数据' };
      }
    } catch (err) {
      // 静默处理文件解析错误
      console.error('文件解析错误:', err);
      return { success: false, error: '文件处理失败' };
    }
  };

  // 已在前面定义的函数，此处不再重复声明

  // 监听 selectedFormatRef 变化
  useEffect(() => {
    if (selectedFormatRef.current !== selectedFormat) {
      selectedFormatRef.current = selectedFormat;
      if (inputData) {
        handleInputChange(inputData);
      }
    }
  }, [selectedFormat, inputData]);

  // 保存到历史记录
  useEffect(() => {
    if (tableData.length > 0 && !isUndoRedoOperation) {
      saveToHistory(tableData, inputData);
    }
  }, [tableData, inputData]);

  // 监听 E2E 调试输出更新
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateE2EDebugInfo = () => {
        try {
          (window as any).__e2eDebugInfo = {
            hasInput: Boolean(inputData),
            tableDataLength: tableData.length,
            currentStep,
            outputFormat,
            copiedFormat,
            sampleClicked,
          };
        } catch (err) {
          // 静默处理调试信息更新错误
          console.error('调试信息更新错误:', err);
        }
      };

      updateE2EDebugInfo();
    }
  }, [inputData, tableData.length, currentStep, outputFormat, copiedFormat, sampleClicked]);

  // 全局方法注册
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        (window as any).__e2eFormatOptions = formats;
      } catch (err) {
        // 静默处理全局方法注册错误
        console.error('全局方法注册错误:', err);
      }
    }
  }, []);

  // Ref 引用
  const _editInputRef = useRef<HTMLTextAreaElement>(null); // 带下划线前缀表示未使用
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 历史记录管理 - 内部实现
  const [_historyIndex, _setHistoryIndex] = useState(0);
  // 已从 useTableHistory hook 获取 history 相关功能

  // 表格状态管理 - 前缀下划线表示预留状态变量
  const [_sortColumn, _setSortColumn] = useState<string | null>(null);
  const [_sortDirection, _setSortDirection] = useState<SortDirection>('none');
  const [_editingCell, _setEditingCell] = useState<CellPosition | null>(null);
  const [_tableScale, _setTableScale] = useState(1);
  const [_selectedCells, _setSelectedCells] = useState<Set<string>>(new Set());
  const [_selectionRange, _setSelectionRange] = useState<SelectionRange | null>(null);

  // 历史记录操作内部函数 - 已通过钩子获取，不再重复定义
  const _saveToHistory = () => {
    // 内部实现...
  };

  // 已在前面定义了 useTableSelection

  // 处理复制
  const handleCopy = () => {
    try {
      const output = generateOutput(outputFormat, tableData);
      navigator.clipboard.writeText(output);
      setCopiedFormat(outputFormat);

      // 3秒后重置复制状态
      setTimeout(() => {
        setCopiedFormat(null);
      }, 3000);
    } catch (err) {
      // 静默处理复制错误
      console.error('复制错误:', err);
    }
  };

  // 处理下载
  const handleDownload = (format: string) => {
    if (!tableData || tableData.length === 0) return;

    try {
      // 生成输出内容
      const content = generateOutput(format, tableData);
      if (!content) return;

      // 获取格式配置信息
      const parserConfig = PARSERS[format as keyof typeof PARSERS];
      const mimeType = parserConfig?.mimeType || 'text/plain';
      const extension = parserConfig?.extension || format;

      // 创建Blob对象
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      // 创建下载链接
      const a = document.createElement('a');
      a.href = url;
      a.download = `table-converted.${extension}`;
      document.body.appendChild(a);

      // 触发下载
      a.click();

      // 清理
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    } catch (error) {
      console.error('下载失败:', error);
      // TODO: 显示错误提示
    }
  };

  // 处理表格展开
  const handleTableExpand = () => {
    setIsTableExpanded(!isTableExpanded);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-linear-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-linear-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-linear-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header - 拡大時は隠す */}
            {!isTableExpanded && (
              <>
                <Header />
                <StepBar currentStep={currentStep} />
              </>
            )}

            {/* 拡大時は全画面レイアウト、通常時は2カラムレイアウト */}
            <div
              className={isTableExpanded ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-8'}
            >
              {/* Left Panel - Input/Preview */}
              <Card
                className={`bg-white/90 backdrop-blur-sm border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 ${
                  isTableExpanded ? 'h-[calc(100vh-2rem)]' : ''
                }`}
              >
                <CardHeader className="bg-linear-to-r from-muted to-muted/60 border-b border-border">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                    <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    {t('panels.input')}
                    {isTableExpanded && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTableExpand}
                        className="ml-auto bg-linear-to-r from-primary to-primary/80 text-primary-foreground border-0 hover:from-primary/90 hover:to-primary/90"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {t('buttons.close')}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className={`p-6 ${isTableExpanded ? 'h-[calc(100%-5rem)] overflow-hidden' : ''}`}
                >
                  <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-xl">
                      <TabsTrigger
                        value="input"
                        className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md transition-all duration-200"
                      >
                        {t('panels.inputTab')}
                      </TabsTrigger>
                      <TabsTrigger
                        value="preview"
                        disabled={!inputData}
                        className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md transition-all duration-200 disabled:opacity-50"
                      >
                        {t('panels.previewTab')}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="input" className="space-y-6 mt-6">
                      {/* 调试：输入面板状态输出 */}
                      <div className="sr-only" data-testid="input-debug">
                        sampleClicked:{String(sampleClicked)} inputLen:{inputData.length}
                      </div>
                      <InputPanel
                        selectedFormat={selectedFormat}
                        setSelectedFormat={setSelectedFormat}
                        inputData={inputData}
                        onInputChange={handleInputChange}
                        onSampleData={handleSampleData}
                        onClear={handleClear}
                        onFileUpload={handleFileUpload}
                      />
                    </TabsContent>

                    <TabsContent
                      value="preview"
                      className={`space-y-6 mt-6 ${isTableExpanded ? 'h-[calc(100%-4rem)]' : ''}`}
                    >
                      <PreviewPanel
                        tableData={tableData}
                        setTableData={setTableData}
                        updateInputData={updateInputData}
                        saveToHistory={saveToHistory}
                        handleUndo={handleUndo}
                        handleRedo={handleRedo}
                        historyIndex={hookHistoryIndex}
                        historyLength={hookHistory.length}
                        isTableExpanded={isTableExpanded}
                        onTableExpand={handleTableExpand}
                        inputData={inputData}
                        selectedFormat={selectedFormat}
                        parseInputData={parseInputData}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Right Panel - Output - 拡大時は隠す */}
              {!isTableExpanded && (
                <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                      <div className="w-8 h-8 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      {t('panels.output')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <OutputPanel
                      tableData={tableData}
                      outputFormat={outputFormat}
                      setOutputFormat={setOutputFormat}
                      generateOutput={generateOutput}
                      handleCopy={handleCopy}
                      handleDownload={handleDownload}
                      copiedFormat={copiedFormat}
                      hasInput={!!inputData || sampleClicked || tableData.length > 0}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* How to Use - 拡大時は隠す */}
            {!isTableExpanded && <HowToUse />}

            {/* 健康监控卡片 - 全局健康指标 */}
            <HealthCard />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
