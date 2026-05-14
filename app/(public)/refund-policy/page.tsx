import LegalPageLayout from '../(component)/LegalPageLayout';

export const metadata = {
    title: 'Refund & Cancellation Policy — Insan Permata',
    description: 'How refunds and recurring-donation cancellations are handled at Insan Permata.',
};

const LAST_UPDATED = 'May 14, 2026';

export default function RefundPolicyPage() {
    return (
        <LegalPageLayout
            title="Refund & Cancellation Policy"
            lastUpdated={LAST_UPDATED}
            intro="We&apos;re grateful for every gift. This policy explains how refunds and monthly-donation cancellations work."
        >
            <section>
                <h2>One-time donations</h2>
                <p>
                    Donations are generally considered final once they have been processed by Stripe and recorded on our side. That said, we understand mistakes happen.
                </p>
                <ul>
                    <li>If you donated by mistake (wrong amount, duplicate charge, or unauthorized use of your payment method), email <a href="mailto:info@insanpermata.org">info@insanpermata.org</a> within <strong>30 days</strong> of the charge with the date, amount, and the email used to donate.</li>
                    <li>We&apos;ll review the request and, if it qualifies, refund the full amount back to your original payment method via Stripe. Refunds typically appear within 5–10 business days, depending on your card issuer.</li>
                    <li>Refunds requested outside the 30-day window are considered on a case-by-case basis and may not be possible if the funds have already been allocated to operational expenses.</li>
                </ul>
            </section>

            <section>
                <h2>Monthly donations</h2>
                <p>
                    You can cancel a monthly donation at any time. Cancellation stops any future charges; it does not retroactively refund previous months.
                </p>
                <p>To cancel:</p>
                <ul>
                    <li>Email <a href="mailto:info@insanpermata.org">info@insanpermata.org</a> from the address on the donation. We&apos;ll cancel the recurring schedule in Stripe and confirm in reply.</li>
                    <li>Or, if you received a billing receipt from Stripe with a customer portal link, use that link to manage or cancel directly.</li>
                </ul>
                <p>
                    If a monthly charge processed after you intended to cancel, contact us within 30 days of that charge and we&apos;ll refund it.
                </p>
            </section>

            <section>
                <h2>Failed renewals</h2>
                <p>
                    If a monthly renewal fails (for example, an expired card), Stripe may attempt to retry the charge a few times. If it cannot recover, the recurring schedule is paused and the donation simply stops. We do not pursue collection of failed donations.
                </p>
            </section>

            <section>
                <h2>Fraud or unauthorized use</h2>
                <p>
                    If you believe your payment method was used to donate without your authorization, please contact your bank or card issuer first to report the charge. Then email us at <a href="mailto:info@insanpermata.org">info@insanpermata.org</a> with the date and amount so we can match the record on our side and cooperate with any chargeback.
                </p>
            </section>

            <section>
                <h2>Tax statements after a refund</h2>
                <p>
                    If a donation is refunded, it will not appear on (or will be removed from) your year-end contribution statement. If you have already filed taxes claiming that donation, please consult your tax advisor about the implications.
                </p>
            </section>

            <section>
                <h2>Contact</h2>
                <p>
                    Email <a href="mailto:info@insanpermata.org">info@insanpermata.org</a> with the donation date, amount, and email used. We aim to respond within three business days.
                </p>
            </section>
        </LegalPageLayout>
    );
}
