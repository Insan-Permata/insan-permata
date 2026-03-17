import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/utils/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
    // Read raw body — CRITICAL: Stripe signature verification needs the raw bytes
    const rawBody = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
        console.error('[Webhook] Missing stripe-signature header')
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // --- Verify event signature (security: prevents spoofed webhook calls) ---
    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch (err) {
        console.error('[Webhook] Signature verification failed:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Use service-role client — bypasses RLS to write to the donations table
    const supabase = createAdminClient()

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session

                // Only process if payment was actually paid (not just opened)
                if (session.payment_status !== 'paid' && session.mode !== 'subscription') {
                    break
                }

                const email =
                    session.customer_email ||
                    (session.metadata?.donor_email ?? null)

                if (!email) {
                    console.warn('[Webhook] checkout.session.completed: no email found in session', session.id)
                    break
                }

                const donationType = session.mode === 'subscription' ? 'subscription' : 'one_time'

                const { error } = await supabase.from('donations').insert({
                    email: email.toLowerCase(),
                    amount: session.amount_total ?? 0,           // in cents
                    currency: session.currency ?? 'usd',
                    type: donationType,
                    stripe_session_id: session.id,
                    stripe_customer_id: session.customer as string | null,
                    stripe_subscription_id: session.subscription as string | null,
                    status: 'paid',
                })

                if (error) {
                    console.error('[Webhook] DB insert error (checkout.session.completed):', error)
                    // Return 500 so Stripe retries the webhook
                    return NextResponse.json({ error: 'DB write failed' }, { status: 500 })
                }

                console.log(`[Webhook] Recorded ${donationType} donation: ${email} — $${((session.amount_total ?? 0) / 100).toFixed(2)}`)
                break
            }

            case 'invoice.paid': {
                // Fired on every successful subscription renewal (after the initial checkout)
                const invoice = event.data.object as Stripe.Invoice

                // Skip the very first invoice — already handled by checkout.session.completed
                if (invoice.billing_reason === 'subscription_create') {
                    break
                }

                const subscriptionId = (invoice.parent as { subscription_details?: { subscription?: string } } | null)?.subscription_details?.subscription ?? null
                const customerId = invoice.customer as string | null

                if (!subscriptionId) break

                // Try to get the email from the customer object
                let email: string | null = null
                if (customerId) {
                    try {
                        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
                        email = customer.email
                    } catch {
                        console.warn('[Webhook] Could not retrieve customer:', customerId)
                    }
                }

                if (!email) break

                const { error } = await supabase.from('donations').insert({
                    email: email.toLowerCase(),
                    amount: invoice.amount_paid,
                    currency: invoice.currency ?? 'usd',
                    type: 'subscription',
                    stripe_session_id: null,
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    status: 'paid',
                })

                if (error) {
                    console.error('[Webhook] DB insert error (invoice.paid):', error)
                    return NextResponse.json({ error: 'DB write failed' }, { status: 500 })
                }

                console.log(`[Webhook] Recorded subscription renewal: ${email} — $${(invoice.amount_paid / 100).toFixed(2)}`)
                break
            }

            case 'invoice.payment_failed': {
                // Subscription renewal failed — useful for alerting/managing access later
                const invoice = event.data.object as Stripe.Invoice
                const failedSubId = (invoice.parent as { subscription_details?: { subscription?: string } } | null)?.subscription_details?.subscription ?? null
                console.warn('[Webhook] Subscription payment failed:', failedSubId)
                // Future: update donation status or trigger notification
                break
            }

            default:
                // Silently ignore unhandled events — Stripe sends many event types
                break
        }
    } catch (err) {
        console.error('[Webhook] Handler error:', err)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }

    // Always return 200 to tell Stripe the webhook was received
    return NextResponse.json({ received: true })
}
