import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require the user to be logged in (but are not admin-only)
const PROTECTED_PUBLIC_ROUTES = ['/our-children', '/news', '/meet-the-staff', '/my-account', '/welcome']

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        // Not logged in → redirect to login
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // Logged in but hit /admin root → redirect to dashboard
        if (pathname === '/admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/admin/dashboard'
            return NextResponse.redirect(url)
        }

        // Logged in — check role and status
        const { data: profile } = await supabase
            .from('users')
            .select('role, status')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin' || profile.status !== 'active') {
            const url = request.nextUrl.clone()
            url.pathname = '/unauthorized'
            return NextResponse.redirect(url)
        }
    }

    // Protect member-only public routes — redirect to /unauthorized if not authenticated
    const isProtectedRoute = PROTECTED_PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + '/')
    )
    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/unauthorized'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
