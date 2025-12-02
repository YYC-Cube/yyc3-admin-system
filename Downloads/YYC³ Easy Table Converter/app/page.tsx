/**
 * @file 主页面
 * @description YYC³ Easy Table Converter 主页面，包含文本卡片组件
 * @author YYC³
 * @version 1.0.0
 * @created 2024-10-15
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { TextCard } from '@/components/TextCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">YYC³ Easy Table Converter</h1>
          <p className="text-lg text-gray-600">支持11种表格格式的转换和编辑工具</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">快速开始</h2>
            <p className="text-gray-600 mb-6">
              点击下方卡片进入功能页面，体验11种表格格式的转换和编辑功能
            </p>

            <TextCard
              title="表格转换功能"
              description="支持11种表格格式的相互转换，包括CSV、JSON、Markdown、HTML、Excel等"
              featuresCount={11}
              href="/features"
            />
          </section>

          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">功能特点</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>本地数据处理，确保隐私安全</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>支持大数据集优化处理</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>直观的表格可视化界面</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">✓</span>
                <span>丰富的编辑和排序功能</span>
              </li>
            </ul>
          </section>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2025 YYC³ Easy Table Converter. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
