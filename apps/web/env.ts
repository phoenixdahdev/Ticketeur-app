import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  server: {
    RESEND_KEY: z.string().min(1),
    MONGO_URL: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
})
