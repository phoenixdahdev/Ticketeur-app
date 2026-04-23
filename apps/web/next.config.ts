import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@ticketur/ui'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  allowedDevOrigins: ['192.168.0.67'],
  async redirects() {
    return [
      {
        source: '/organizers/new',
        destination: '/signup?role=organizer',
        permanent: false,
      },
      {
        source: '/vendors/apply',
        destination: '/signup?role=vendor',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
