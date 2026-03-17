import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

// Always use test key — sk_test_... will be in .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
})

type CheckoutBody = {
    email: string
    amount: number  // in dollars (e.g. 25)
    type: 'once' | 'monthly'
}

export async function POST(request: NextRequest) {
    try {
        const body: CheckoutBody = await request.json()
        const { email, amount, type } = body

        // --- Validation ---
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
        }
        if (!amount || amount < 5) {
            return NextResponse.json({ error: 'Minimum donation amount is $5' }, { status: 400 })
        }
        if (type !== 'once' && type !== 'monthly') {
            return NextResponse.json({ error: 'Invalid donation type' }, { status: 400 })
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
            // Pass email through metadata as a backup for webhook correlation
            metadata: {
                donor_email: email,
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
