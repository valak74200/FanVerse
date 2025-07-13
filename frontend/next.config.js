/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './'),
      '@/components': require('path').resolve(__dirname, './components'),
      '@/lib': require('path').resolve(__dirname, './lib'),
      '@/hooks': require('path').resolve(__dirname, './hooks'),
      '@/services': require('path').resolve(__dirname, './services'),
      '@/utils': require('path').resolve(__dirname, './utils'),
      '@/styles': require('path').resolve(__dirname, './styles'),
    }
    return config
  },
}

module.exports = nextConfig
