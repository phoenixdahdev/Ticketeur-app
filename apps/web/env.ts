import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().optional(),
    APP_NAME: z.string().optional(),
    VERCEL_URL: z.string().optional(),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),
    DATABASE_URL: z.string().optional(),
    TRIGGER_SECRET_KEY: z.string().optional(),
    TRIGGER_PROJECT_ID: z.string().optional(),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
    VERCEL_OIDC_TOKEN: z.string().optional()
  },
  experimental__runtimeEnv: process.env,
})
