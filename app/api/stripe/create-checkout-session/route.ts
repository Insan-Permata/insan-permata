import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
})

const MAX_AMOUNT_USD = Number(process.env.DONATION_AMOUNT_MAX_USD ?? 10000)
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

type CheckoutBody = {
    email: string
    fullName: string
    amount: number  // in dollars (e.g. 25)
    type: 'once' | 'monthly'
    turnstileToken?: string | null
}

async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean> {
    if (!TURNSTILE_SECRET) return true // not configured — skip
    try {
        const form = new URLSearchParams()
        form.append('secret', TURNSTILE_SECRET)
        form.append('response', token)
        if (remoteIp) form.append('remoteip', remoteIp)

        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: form,
        })
        const data = (await res.json()) as { success: boolean }
        return Boolean(data.success)
    } catch (err) {
        console.error('[Turnstile] verification request failed:', err)
        return false
    }
}

export async function POST(request: NextRequest) {
    try {
        // --- Origin check (cheap CSRF guard) ---
        if (SITE_URL) {
            const origin = request.headers.get('origin')
            if (origin && origin !== SITE_URL) {
                return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
            }
        }

        const body: CheckoutBody = await request.json()
        const { email, fullName, amount, type, turnstileToken } = body

        // --- Validation ---
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
        }
        const trimmedName = (fullName ?? '').trim()
        if (!trimmedName) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }
        if (!amount || amount < 5) {
            return NextResponse.json({ error: 'Minimum donation amount is $5' }, { status: 400 })
        }
        if (amount > MAX_AMOUNT_USD) {
            return NextResponse.json(
                { error: `Maximum donation amount is $${MAX_AMOUNT_USD.toLocaleString()}. For larger gifts, please contact us.` },
                { status: 400 }
            )
        }
        if (type !== 'once' && type !== 'monthly') {
            return NextResponse.json({ error: 'Invalid donation type' }, { status: 400 })
        }

        // --- Turnstile (only enforced when a secret is configured) ---
        if (TURNSTILE_SECRET) {
            if (!turnstileToken) {
                return NextResponse.json({ error: 'Security check missing. Please refresh and try again.' }, { status: 400 })
            }
            const remoteIp = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
            const ok = await verifyTurnstile(turnstileToken, remoteIp)
            if (!ok) {
                return NextResponse.json({ error: 'Security check failed. Please refresh and try again.' }, { status: 400 })
            }
        }

        // Convert dollars → cents (Stripe uses smallest currency unit)
        const unitAmount = Math.round(amount * 100)

        const isSubscription = type === 'monthly'

        // Build line item dynamically — no pre-created products needed
        const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
            quantity: 1,
            price_data: {
                currency: 'usd',
                unit_amount: unitAmount,
                product_data: {
                    name: isSubscription ? 'Monthly Donation – Insan Permata' : 'One-time Donation – Insan Permata',
                    description: 'Supporting children at Panti Asuhan Insan Permata',
                },
                ...(isSubscription && {
                    recurring: { interval: 'month' },
                }),
            },
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

        const session = await stripe.checkout.sessions.create({
            mode: isSubscription ? 'subscription' : 'payment',
            customer_email: email,
            line_items: [lineItem],
            // Pass email + donor name through metadata so the webhook can record
            // them on the donations row (used for year-end statements)
            metadata: {
                donor_email: email,
                donor_name: trimmedName,
                donation_type: type,
            },
            success_url: `${baseUrl}/support/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/support/cancel`,
            // Allow promotion codes on the checkout page (optional)
            allow_promotion_codes: false,
            // Billing address collection — off to keep UX simple
            billing_address_collection: 'auto',
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('[Stripe] create-checkout-session error:', error)
        return NextResponse.json(
            { error: 'Failed to create checkout session. Please try again.' },
            { status: 500 }
        )
    }
}
