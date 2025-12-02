/**
 * @file 文本卡片组件
 * @description 用于展示功能卡片，点击进入详细功能页面
 * @author YYC³
 * @version 1.0.0
 * @created 2024-10-15
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface TextCardProps {
  title: string;
  description: string;
  featuresCount: number;
  href: string;
}

export const TextCard: React.FC<TextCardProps> = ({ title, description, featuresCount, href }) => {
  return (
    <Link
      href={href}
      className="block group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-transparent hover:border-blue-200 transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
            {featuresCount} 种功能
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed">{description}</p>

        <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
          <span>查看详情</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
