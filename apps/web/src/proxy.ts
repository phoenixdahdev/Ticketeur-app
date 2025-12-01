import { auth } from './auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apiAuthPrefix, authRoutes, publicRoutes } from './routes'
import { trigger_verification_for_user } from './app/(auth)/action'

export async function proxy(req: NextRequest) {
    const { nextUrl } = req
    const session = await auth()
    const isLoggedIn = !!session
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.some(route => nextUrl.pathname.startsWith(route))

    console.log('Proxy check:', {
        pathname: nextUrl.pathname,
        isLoggedIn,
        isAuthRoute,
        isApiAuthRoute,
        isPublicRoute,
        session
    })

    if (isApiAuthRoute) {
        return NextResponse.next()
    }

    if (isPublicRoute) {
        return NextResponse.next()
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            if (session.user.email_verified_at) {
                return NextResponse.redirect(new URL('/', req.url))
            }
            await trigger_verification_for_user(session.user.id)
            return NextResponse.redirect(new URL('/verify-account', req.url))
        }
        return NextResponse.next()
    }

    if (!isLoggedIn) {
        return NextResponse.redirect(
            new URL(`/login?go_to=${nextUrl.pathname}`, req.url),
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!.+\\.[\\w]+$|_next).*)',
        '/',
        '/(api|trpc)(.*)',
    ],
}