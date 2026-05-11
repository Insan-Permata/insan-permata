import Link from 'next/link'
import Stripe from 'stripe'
import { Mail, MailOpen, UserCircle } from 'lucide-react'
import PageHero from '../../(component)/PageHero'
import { createAdminClient } from '@/lib/utils/supabase/admin'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
})

type AccountState = 'confirmed' | 'pending' | 'new' | 'unknown'

async function getDonationContext(sessionId: string | undefined): Promise<{
    email: string | null
    state: AccountState
}> {
    if (!sessionId) return { email: null, state: 'unknown' }

    let email: string | null = null
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        email =
            session.customer_email ||
            (session.customer_details?.email ?? null) ||
            (session.metadata?.donor_email ?? null)
    } catch (err) {
        console.error('[Success] Failed to retrieve Stripe session:', err)
        return { email: null, state: 'unknown' }
    }

    if (!email) return { email: null, state: 'unknown' }

    const admin = createAdminClient()
    const { data, error } = await admin
        .from('users')
        .select('id, email_confirmed_at')
        .eq('email', email.toLowerCase())
        .maybeSingle()

    if (error) {
        console.error('[Success] User lookup failed:', error)
        return { email, state: 'unknown' }
    }

    if (!data) return { email, state: 'new' }
    if (data.email_confirmed_at) return { email, state: 'confirmed' }
    return { email, state: 'pending' }
}

export default async function DonationSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>
}) {
    const { session_id } = await searchParams
    const { email, state } = await getDonationContext(session_id)

    return (
        <div className="min-h-screen bg-[#F5F5F3]">
            <PageHero
                imageSrc="/home_bg_photos/2.jpg"
                imageAlt="Thank you for your donation"
                title="Thank You!"
                height="40vh"
                overlayOpacity={0.5}
            />

            <section className="max-w-2xl mx-auto px-6 py-20 text-center">
                {/* Success icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-[#292826] mb-4">
                    Your donation was received!
                </h2>
                <p className="text-lg text-[#292826] opacity-70 mb-8 leading-relaxed">
                    Thank you so much for your generosity. Your support directly impacts the lives of the children at Panti Asuhan Insan Permata.
                </p>

                {/* Account-status message */}
                {state === 'confirmed' && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10 text-left flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#355872]/10 flex items-center justify-center flex-shrink-0">
                            <UserCircle className="w-5 h-5 text-[#355872]" />
                        </div>
                        <div>
                            <p className="font-semibold text-[#292826] mb-1">
                                You already have an account
                            </p>
                            <p className="text-sm text-[#292826] opacity-70 leading-relaxed">
                                {email ? <>This donation is linked to <span className="font-medium">{email}</span>. </> : null}
                                Sign in to view this contribution alongside your full donation history.
                            </p>
                            <Link
                                href="/my-account"
                                className="inline-flex items-center gap-1.5 text-[#355872] font-semibold text-sm mt-3 hover:underline"
                            >
                                View donation history →
                            </Link>
                        </div>
                    </div>
                )}

                {state === 'pending' && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10 text-left flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <MailOpen className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                            <p className="font-semibold text-[#292826] mb-1">
                                Check your inbox for your invitation
                            </p>
                            <p className="text-sm text-[#292826] opacity-70 leading-relaxed">
                                We previously sent an invitation to <span className="font-medium">{email}</span>.
                                Open it to finish setting up your account — once you&apos;re in, you&apos;ll
                                see this donation and any future contributions in your history.
                            </p>
                        </div>
                    </div>
                )}

                {state === 'new' && email && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10 text-left flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#355872]/10 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-[#355872]" />
                        </div>
                        <div>
                            <p className="font-semibold text-[#292826] mb-1">
                                Your invitation is on the way
                            </p>
                            <p className="text-sm text-[#292826] opacity-70 leading-relaxed">
                                We&apos;ve sent an invitation to <span className="font-medium">{email}</span> so
                                you can set up an account. Once you accept, you&apos;ll be able to view
                                this donation and any future contributions in your account.
                            </p>
                        </div>
                    </div>
                )}

                {state === 'unknown' && (
                    <p className="text-[#292826] opacity-60 mb-10">
                        We&apos;ve emailed a receipt to the address you provided. Check your inbox
                        for next steps.
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="bg-[#355872] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#7AAACE] transition-colors"
                    >
                        Return Home
                    </Link>
                    <Link
                        href="/support"
                        className="bg-white text-[#355872] border-2 border-[#355872] px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Donate Again
                    </Link>
                </div>
            </section>
        </div>
    )
}
