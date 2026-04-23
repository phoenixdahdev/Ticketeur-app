import 'dotenv/config'
import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    APP_URL: z.url().optional(),
    APP_URLS: z
      .string()
      .default('http://localhost:3000')
      .transform((val) => val.split(',').map((url) => url.trim())),
    GOOGLE_CLIENT_ID: z.string().optional().default(''),
    GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
    RESEND_API_KEY: z.string().optional(),
    TRIGGER_PROJECT_ID: z.string().optional(),
    TRIGGER_SECRET_KEY: z.string().optional(),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
