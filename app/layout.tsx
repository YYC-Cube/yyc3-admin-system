import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YYC³ · 简易表格转换器',
  description: 'YYC³ - 支持11种格式的高级表格转换编辑工具',
  generator: 'v0.app',
  icons: {
    icon: '/yyc3-logo.svg',
    shortcut: '/yyc3-logo.svg',
    apple: '/yyc3-logo-white.png',
  },
  openGraph: {
    title: 'YYC³ · 简易表格转换器',
    description: '支持11种格式的高级表格转换编辑工具',
    url: 'https://yyc3.example.com',
    siteName: 'YYC³',
    images: [{ url: '/yyc3-brand-logo.png', width: 1200, height: 630, alt: 'YYC³ 品牌图' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YYC³ · 简易表格转换器',
    description: '支持11种格式的高级表格转换编辑工具',
    images: ['/yyc3-brand-logo.png'],
  },
  // 新增：为 OG/Twitter 等社交解析提供基准域名
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

// 🛡️ E2E/离线环境兼容：仅在显式开启时注入 Vercel Analytics，避免 _vercel/insights/script.js 加载失败导致导航中断
const enableAnalytics = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === 'true';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`font-sans antialiased`}>
        {children}
        {enableAnalytics && <Analytics />}
      </body>
    </html>
  );
}
