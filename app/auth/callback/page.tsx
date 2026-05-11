import { Suspense } from 'react'
import CallbackHandler from './CallbackHandler'

export const dynamic = 'force-dynamic'

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<CallbackLoading />}>
            <CallbackHandler />
        </Suspense>
    )
}

function CallbackLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brown border-t-transparent mb-4" />
                <p className="text-foreground/60">Verifying your invitation…</p>
            </div>
        </div>
    )
}
