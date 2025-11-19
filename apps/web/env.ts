import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string(),
    APP_NAME: z.string(),
    VERCEL_URL: z.string().optional(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
  },
  experimental__runtimeEnv: process.env,
})
