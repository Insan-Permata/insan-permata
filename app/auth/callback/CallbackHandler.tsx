'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

/**
 * Auth callback page.
 *
 * Supabase redirects here after the donor clicks their invite email link.
 * Two flows can land here depending on the project's auth configuration:
 *
 *   1. Implicit flow → tokens in the URL hash: #access_token=…&refresh_token=…
 *      (default for `auth.admin.inviteUserByEmail`)
 *   2. PKCE flow    → one-time code in the query: ?code=…
 *
 * The URL hash never reaches the server, so this has to run on the client.
 * We parse whichever payload is present, establish the session (writes the
 * auth cookie via @supabase/ssr), then redirect to `next` (default /my-account).
 */
export default function CallbackHandler() {
    const searchParams = useSearchParams()
    const next = searchParams.get('next') ?? '/my-account'
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    // Guard against React strict mode running the effect twice — the first run
    // consumes the hash (via setSession + replaceState), and we don't want the
    // second run to think the URL is empty and overwrite UI state.
    const hasRun = useRef(false)

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                // We parse the invite payload (tokens / error) out of the URL ourselves
                // below. Disable auth-js's own URL detection so it doesn't race us —
                // otherwise it can clear the hash or fire a duplicate SIGNED_IN that
                // resolves our onAuthStateChange wait before the session is committed.
                auth: { detectSessionInUrl: false },
            }
        )

        async function handleCallback() {
            const url = new URL(window.location.href)
            const code = url.searchParams.get('code')
            const queryError = url.searchParams.get('error_description') ?? url.searchParams.get('error')
            const hash = window.location.hash
            const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.substring(1) : hash)
            const hashError = hashParams.get('error_description') ?? hashParams.get('error')

            try {
                if (hashError || queryError) {
                    throw new Error(hashError || queryError || 'Unknown error')
                }

                if (code) {
                    // PKCE flow
                    const { error } = await supabase.auth.exchangeCodeForSession(code)
                    if (error) throw error
                } else if (hashParams.get('access_token')) {
                    // Implicit flow — parse tokens out of the URL fragment
                    const accessToken = hashParams.get('access_token')!
                    const refreshToken = hashParams.get('refresh_token')
                    if (!refreshToken) throw new Error('Missing refresh_token in invite link.')

                    // Wait for onAuthStateChange to confirm the session is committed
                    // to cookies before navigating — avoids a race where the middleware
                    // reads cookies before @supabase/ssr has written them.
                    await new Promise<void>((resolve, reject) => {
                        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
                            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                                subscription.unsubscribe()
                                resolve()
                            }
                        })
                        supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        }).then(({ error }) => {
                            if (error) {
                                subscription.unsubscribe()
                                reject(error)
                            }
                        })
                    })

                    // Clear the hash so tokens don't linger in the address bar / history
                    window.history.replaceState(null, '', window.location.pathname + window.location.search)
                } else {
                    throw new Error('No auth payload on callback URL. The invitation link may have already been used.')
                }

                // Hard navigate so the browser sends the new auth cookies on a fresh
                // request — avoids any client-router race with refresh/replace.
                window.location.replace(next)
            } catch (err) {
                console.error('[Auth callback]', err)
                setErrorMessage('expired')
            }
        }

        handleCallback()
    }, [next])

    if (!errorMessage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brown border-t-transparent mb-4" />
                    <p className="text-foreground/60">Verifying your invitation…</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="text-center max-w-md">
                <h1 className="text-xl font-bold text-foreground mb-3">
                    Invitation link expired
                </h1>
                <p className="text-foreground/60 mb-6">
                    This link has already been used or has expired. Email us at{' '}
                    <a href="mailto:info@insanpermata.org" className="text-brown hover:underline">
                        info@insanpermata.org
                    </a>{' '}
                    and we&apos;ll send you a new one.
                </p>
                <a
                    href="/login"
                    className="inline-flex items-center justify-center bg-brown text-white font-semibold px-5 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Sign in
                </a>
            </div>
        </div>
    )
}
