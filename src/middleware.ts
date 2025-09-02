import { auth } from './auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apiAuthPrefix, authRoutes } from './routes'

export async function middleware(req: NextRequest) {
    const { nextUrl } = req
    const session = await auth()
    const isLoggedIn = !!session
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)

    if (isApiAuthRoute) {
        return NextResponse.next()
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            if (session.user.is_verified) {
                return NextResponse.redirect(new URL('/', req.url))
            }
            return NextResponse.redirect(new URL('/onboarding', req.url))
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
