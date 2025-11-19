import { env } from '../env'
import { User } from '@useticketeur/db'
import { authConfig } from './auth.config'
import NextAuth, { DefaultSession } from 'next-auth'

export const {
    handlers: { GET, POST },
    auth,
    signOut,
    unstable_update,
} = NextAuth({
    ...authConfig,
    secret: env.AUTH_SECRET,
})


declare module 'next-auth' {
    interface Session {
        user: User &
        DefaultSession['user']
    }
}