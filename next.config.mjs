/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  outputFileTracingRoot: process.cwd(),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['bcrypt', 'pg'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3555', 'localhost:5001'],
    },
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-icons'],
  },
  images: {
    unoptimized: true,
    domains: ['cdn.example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdn.example.com',
      },
    ],
  },
  assetPrefix: process.env.CDN_URL || undefined,
  async headers() {
    return [
      // 针对登录API的特殊配置
      {
        source: '/api/auth/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGINS?.split(',')[0] || 'http://localhost:5001',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  webpack: config => {
    return config
  },
}

export default nextConfig
