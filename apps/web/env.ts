import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
    VERCEL_URL: z.string().optional(),
    APP_NAME: z.string(),
    DATABASE_URL: z.string(),
  },
  experimental__runtimeEnv: process.env,
})
