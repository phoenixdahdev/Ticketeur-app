
import path from 'path';
const emailsDirRelativePath = path.normalize('./emails');
const userProjectLocation = '/home/phoenix/Documents/gigs/tickeur/packages/email';
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_IS_BUILDING: 'true',
    EMAILS_DIR_RELATIVE_PATH: emailsDirRelativePath,
    EMAILS_DIR_ABSOLUTE_PATH: path.resolve(userProjectLocation, emailsDirRelativePath),
    PREVIEW_SERVER_LOCATION: '/home/phoenix/Documents/gigs/tickeur/packages/email/.react-email',
    USER_PROJECT_LOCATION: userProjectLocation
  },
  serverExternalPackages: ['esbuild'],
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    webpackBuildWorker: true
  },
}

export default nextConfig