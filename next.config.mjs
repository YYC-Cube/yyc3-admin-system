/** @type {import('next').NextConfig} */
const isStaticExport = process.env.BUILD_MODE === 'static'

const nextConfig = {
  output: isStaticExport ? 'export' : 'standalone',
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  devIndicators: {
    autoPrerender: true,
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV !== 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV !== 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-icons'],
  },
  images: {
    unoptimized: true,
  },
  ...(isStaticExport
    ? {}
    : {
        outputFileTracingRoot: process.cwd(),
        serverExternalPackages: ['bcrypt'],
        experimental: {
          ...(!isStaticExport && {
            serverActions: {
              allowedOrigins: ['localhost:3000', 'localhost:3555', 'localhost:5001', 'admin.yyc3.top'],
            },
          }),
          optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-icons'],
        },
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-XSS-Protection', value: '1; mode=block' },
                { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
              ],
            },
          ]
        },
      }),
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /mobile-app/,
      use: 'null-loader',
    })

    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 5,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1]
              return `npm.${packageName?.replace('@', '')}`
            },
            priority: 10,
            reuseExistingChunk: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-hook-form)[\\/]/,
            name: 'react-vendors',
            priority: 20,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|framer-motion)[\\/]/,
            name: 'ui-vendors',
            priority: 15,
          },
        },
      }
    }
    return config
  },
}

export default nextConfig
