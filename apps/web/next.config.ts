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
}

export default nextConfig
