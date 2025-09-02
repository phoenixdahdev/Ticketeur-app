import NextAuth, { DefaultSession } from 'next-auth'
import { authConfig } from './auth.config'
import { User } from './db/schema'

export const {
    handlers: { GET, POST },
    auth,
    signOut,
    unstable_update,
} = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET,
})


declare module 'next-auth' {
    interface Session {
        user: User &
        DefaultSession['user']
    }
}