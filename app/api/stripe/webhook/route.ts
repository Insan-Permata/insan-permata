import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/utils/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * Invite a donor to create an account, or resend the invite if they were
 * previously invited but never accepted.
 *
 * Three states:
 *   - confirmed user → already has an active account; do nothing
 *   - exists but unconfirmed → delete the stale auth row (invalidates the old
 *     token) and re-invite, so they get a fresh working link
 *   - no row → send a fresh invite
 *
 * Lookups use public.users, kept in sync with auth.users by triggers
 * (see add_email_confirmed_to_users.sql). Failures are logged but never fail
 * the webhook — the donation row is the source of truth.
 */
async function inviteDonorIfNew(supabase: SupabaseClient, email: string) {
    const normalized = email.toLowerCase()

    const { data: existing, error: lookupError } = await supabase
        .from('users')
        .select('id, email_confirmed_at')
        .eq('email', normalized)
        .maybeSingle()

    if (lookupError) {
        console.error('[Webhook] User existence lookup failed:', lookupError)
        return
    }

    if (existing?.email_confirmed_at) {
        // Active account — no invite needed
        return
    }

    // Invite link → Supabase verifies token → /auth/callback exchanges code for a
    // session → /welcome lets the donor set their password → /my-account.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const redirectTo = `${siteUrl}/auth/callback?next=/welcome`

    if (existing) {
        // Previously invited but never accepted — delete the stale auth row so
        // we can issue a brand-new invite. public.users cascades via FK.
        const { error: deleteError } = await supabase.auth.admin.deleteUser(existing.id)
        if (deleteError) {
            console.error(`[Webhook] Failed to clear stale invite for ${normalized}:`, deleteError)
            return
        }
        console.log(`[Webhook] Cleared stale invite for ${normalized}; re-inviting`)
    }

    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        normalized,
        { redirectTo }
    )

    if (inviteError) {
        console.error(`[Webhook] Failed to send invite to ${normalized}:`, inviteError)
        return
    }

    console.log(`[Webhook] ${existing ? 'Re-sent' : 'Sent'} account invite to ${normalized}`)
}

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

                // Donor's stated legal name (from form). Fallback to billing
                // name if metadata is somehow missing — kept nullable in DB.
                const donorName =
                    session.metadata?.donor_name?.trim() ||
                    session.customer_details?.name?.trim() ||
                    null

                const donationType = session.mode === 'subscription' ? 'subscription' : 'one_time'

                const { error } = await supabase.from('donations').insert({
                    email: email.toLowerCase(),
                    donor_name: donorName,
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

                // Invite the donor to create an account if they don't have one
                await inviteDonorIfNew(supabase, email)
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

                // Carry the donor name forward from the original signup donation
                const { data: prior } = await supabase
                    .from('donations')
                    .select('donor_name')
                    .eq('stripe_subscription_id', subscriptionId)
                    .not('donor_name', 'is', null)
                    .order('created_at', { ascending: true })
                    .limit(1)
                    .maybeSingle()

                const { error } = await supabase.from('donations').insert({
                    email: email.toLowerCase(),
                    donor_name: prior?.donor_name ?? null,
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

                // Cheap idempotent check — invite if (somehow) still missing an account
                await inviteDonorIfNew(supabase, email)
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
