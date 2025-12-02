/**
 * @file 功能页面
 * @description 展示YYC³ Easy Table Converter的11种功能
 * @author YYC³
 * @version 1.0.0
 * @created 2024-10-15
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// 定义功能项类型
interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  features?: string[];
}

export default function FeaturesPage() {
  // 11种功能列表
  const features: FeatureItem[] = [
    {
      id: 1,
      title: '多格式支持',
      description: '支持11种表格格式的相互转换，满足不同场景需求',
      icon: '📋',
      features: [
        'CSV (Comma-Separated Values)',
        'JSON (JavaScript Object Notation)',
        'Markdown Tables',
        'HTML Tables',
        'Excel (XLSX)',
        'TSV (Tab-Separated Values)',
        'SQL',
        'YAML',
        'XML',
        'JSON Lines',
        'NDJSON',
      ],
    },
    {
      id: 2,
      title: '表格数据可视化',
      description: '提供直观的表格视图，支持响应式设计和大数据集优化',
      icon: '📊',
      features: [
        '响应式设计，适配各种设备屏幕',
        '表格缩放功能',
        '大数据集优化处理',
        '性能监控显示',
      ],
    },
    {
      id: 3,
      title: '单元格编辑功能',
      description: '支持双击单元格进行编辑，实时保存编辑内容',
      icon: '✏️',
      features: [
        '双击单元格进行编辑',
        '实时保存编辑内容',
        '键盘快捷键支持（Enter确认，Escape取消）',
        '编辑历史记录',
      ],
    },
    {
      id: 4,
      title: '行和列操作',
      description: '支持行和列的拖拽排序、添加、删除和调整宽度',
      icon: '🔄',
      features: ['行和列的拖拽排序', '添加行/列（上方/下方，左侧/右侧）', '删除行/列', '列宽调整'],
    },
    {
      id: 5,
      title: '表格排序',
      description: '支持按列升序/降序排序，大数据集使用Web Worker加速',
      icon: '📈',
      features: [
        '按列升序/降序排序',
        '大数据集使用Web Worker加速',
        '支持数字和文本排序',
        '排序状态可视化',
      ],
    },
    {
      id: 6,
      title: '搜索功能',
      description: '支持表格内容搜索，实时显示搜索结果并高亮',
      icon: '🔍',
      features: ['表格内容搜索', '实时搜索结果显示', '搜索结果高亮', '大数据集搜索优化'],
    },
    {
      id: 7,
      title: '批量操作',
      description: '支持批量选择行、批量编辑和批量删除',
      icon: '📦',
      features: ['批量选择行', '批量编辑', '批量删除', '全选/取消全选'],
    },
    {
      id: 8,
      title: '数据导出',
      description: '支持多种格式导出，可配置导出选项',
      icon: '💾',
      features: ['多种格式导出', '导出选项配置', '大数据集导出限制', '导出进度显示'],
    },
    {
      id: 9,
      title: '筛选功能',
      description: '支持高级筛选，实时显示筛选结果',
      icon: '🎯',
      features: ['高级筛选（开发中）', '筛选结果实时显示'],
    },
    {
      id: 10,
      title: '键盘快捷键',
      description: '支持丰富的键盘快捷键，提高操作效率',
      icon: '⌨️',
      features: ['单元格导航', '编辑操作', '保存/取消', '选择操作'],
    },
    {
      id: 11,
      title: '数据安全',
      description: '所有数据均在本地处理，确保用户数据隐私安全',
      icon: '🔒',
      features: ['本地数据处理', '数据隐私保护', '历史记录管理'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 font-medium mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回首页</span>
        </Link>

        {/* 页面标题 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">YYC³ Easy Table Converter 功能</h1>
          <p className="text-lg text-gray-600">
            以下是我们支持的11种核心功能，帮助您轻松处理各种表格数据
          </p>
        </header>

        {/* 功能列表 */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-transparent hover:border-blue-200 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col gap-4">
                {/* 功能图标和标题 */}
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{feature.icon}</div>
                  <h2 className="text-xl font-bold text-gray-800">{feature.title}</h2>
                </div>

                {/* 功能描述 */}
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                {/* 功能详情列表 */}
                {feature.features && (
                  <ul className="space-y-2 mt-2">
                    {feature.features.map((subFeature, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-sm">{subFeature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </main>

        {/* 页脚 */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2025 YYC³ Easy Table Converter. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
