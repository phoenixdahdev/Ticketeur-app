import { env } from '../env'
import { User } from '@useticketeur/db'
import { authConfig } from './auth.config'
import NextAuth, { DefaultSession, Session } from 'next-auth'
import { NextRequest } from 'next/server'

const nextAuth = NextAuth({
    ...authConfig,
    secret: env.AUTH_SECRET,
})

export const handlers: { GET: (req: NextRequest) => Promise<Response>; POST: (req: NextRequest) => Promise<Response> } = nextAuth.handlers
export const auth: () => Promise<Session | null> = nextAuth.auth
export const unstable_update = nextAuth.unstable_update


declare module 'next-auth' {
    interface Session {
        user: User & DefaultSession['user']
    }
}