import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@ticketur/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  allowedDevOrigins: ['192.168.0.67'],
}

export default nextConfig
