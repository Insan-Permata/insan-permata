'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
    const router = useRouter()
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
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        async function handleCallback() {
            const url = new URL(window.location.href)
            const code = url.searchParams.get('code')
            const queryError = url.searchParams.get('error_description') ?? url.searchParams.get('error')
            const hash = window.location.hash
            const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.substring(1) : hash)
            const hashError = hashParams.get('error_description') ?? hashParams.get('error')

            try {
                // Supabase puts errors (expired token, etc.) in the hash for implicit flow
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

                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    })
                    if (error) throw error

                    // Clear the hash so tokens don't linger in the address bar / history
                    window.history.replaceState(null, '', window.location.pathname + window.location.search)
                } else {
                    throw new Error('No auth payload on callback URL. The invitation link may have already been used.')
                }

                // Session cookies are now set. Push to next, and refresh so the
                // server middleware re-reads cookies for the protected route.
                router.replace(next)
                router.refresh()
            } catch (err) {
                console.error('[Auth callback]', err)
                const message = err instanceof Error ? err.message : 'Unknown error'
                setErrorMessage(
                    `This invitation link is invalid or has already been used (${message}). Please donate again or contact support to receive a new invite.`
                )
            }
        }

        handleCallback()
    }, [router, next])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="text-center max-w-md">
                {errorMessage ? (
                    <>
                        <h1 className="text-xl font-bold text-foreground mb-3">
                            Couldn&apos;t verify your invitation
                        </h1>
                        <p className="text-foreground/60 mb-6">{errorMessage}</p>
                        <a
                            href="/login"
                            className="inline-flex items-center justify-center bg-brown text-white font-semibold px-5 py-3 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Go to Sign In
                        </a>
                    </>
                ) : (
                    <>
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brown border-t-transparent mb-4" />
                        <p className="text-foreground/60">Verifying your invitation…</p>
                    </>
                )}
            </div>
        </div>
    )
}
