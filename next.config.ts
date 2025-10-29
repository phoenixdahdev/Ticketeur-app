import type { NextConfig } from 'next'
import { inDevEnvironment } from '~/lib/utils'

const nextConfig: NextConfig = {
  typedRoutes: true,
  cacheComponents: true,
  compiler: {
    removeConsole: !inDevEnvironment
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
    browserDebugInfoInTerminal: true,
    typedEnv: true,
  }
}

export default nextConfig
