import type { User } from '@useticketeur/db';
import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { inDevEnvironment } from "@useticketeur/ui/in-dev"
import { get_user_by_email, google_login, login } from './app/(auth)/action';



const authConfig: NextAuthConfig = {
    providers: [
        Google({
            checks: ['none'],
        }),
        Credentials({
            async authorize(credentials) {
                if (credentials.from_onboarding) {
                    const data = await get_user_by_email(credentials.email as string)
                    if (!data.success || !data.user) {
                        return null
                    } else {
                        const user = {
                            ...data.user,
                            id: data.user.id,
                            email: data.user.email
                        }
                        return user
                    }
                } else {
                    const data = await login({ email: credentials.email as string, password: credentials.password as string })
                    if (!data.success || !data.user) {
                        return null
                    } else {
                        const user = {
                            ...data.user,
                            id: data.user.id,
                            email: data.user.email
                        }
                        return user
                    }
                }
            }
        })
    ],
    basePath: '/api/auth',
    session: {
        strategy: 'jwt',
    },
    debug: inDevEnvironment,
    trustHost: true,
    callbacks: {
        async signIn({ account, profile, user }) {
            if (account?.provider === 'google' && profile?.email) {
                return true
            }
            return !!user
        },
        async jwt({ token, user, account, profile, trigger, session }) {
            if (trigger === 'update') {
                token = { ...token, ...session }
                return token
            }
            if (trigger === 'signIn' && account?.provider === 'credentials' && user) {
                return { ...token, ...user }
            }
            if (account && account.provider === 'google') {
                if (!profile?.email) {
                    return null
                }
                const res = await google_login({
                    email: profile.email,
                    name: profile?.name as string,
                    avatar: profile.picture

                })
                if (!res.success) {
                    return null
                }
                const user = {
                    ...res.user,
                    email: profile.email,
                    name: profile?.name,
                    profile_image: profile.picture
                }
                return { ...token, user, ...res }
            }
            return { ...token, user }
        },
        async session({ session, token }) {
            session.user = {
                ...session,
                ...token as unknown as User,
                emailVerified: (token.email_verified_at as Date) ?? new Date()
            }
            return session
        }

    }
}


export { authConfig }