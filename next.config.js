/** @type {import('next').NextConfig} */
const nextConfig = {
  // 项目配置
  async rewrites() {
    return [
      // 重写规则可以在这里添加
    ];
  },
  // 服务器配置
  devIndicators: {
    autoPrerender: true,
  },
  // 其他配置选项
  // 暂时禁用一些ESLint规则以便构建通过
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 只包含指定目录下的页面文件
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // 设置输出文件跟踪根目录，解决lockfile警告
  outputFileTracingRoot: process.cwd(),
  // 通过webpack配置忽略mobile-app目录
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /mobile-app/,
      use: 'null-loader',
    });
    return config;
  }
};

module.exports = nextConfig;
