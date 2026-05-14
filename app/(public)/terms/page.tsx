import LegalPageLayout from '../(component)/LegalPageLayout';

export const metadata = {
    title: 'Terms of Service — Insan Permata',
    description: 'The terms that apply when you use the Insan Permata website and make a donation.',
};

const LAST_UPDATED = 'May 14, 2026';

export default function TermsPage() {
    return (
        <LegalPageLayout
            title="Terms of Service"
            lastUpdated={LAST_UPDATED}
            intro="By using insanpermata.org or making a donation through our site, you agree to these Terms. Please read them carefully. If you do not agree, please do not use the site."
        >
            <section>
                <h2>1. Who we are</h2>
                <p>
                    The site is operated by Panti Asuhan Insan Permata, a children&apos;s home located in Pekanbaru, Indonesia. References to &quot;we&quot;, &quot;us&quot;, or &quot;our&quot; mean Insan Permata. You can reach us at <a href="mailto:info@insanpermata.org">info@insanpermata.org</a>.
                </p>
            </section>

            <section>
                <h2>2. What the site is for</h2>
                <p>
                    The site exists to share the work of the home with the public, to allow supporters to make donations toward our mission, and to give donors a private space (after sign-in) where they can view donation history and read occasional updates and stories from the children and staff.
                </p>
            </section>

            <section>
                <h2>3. Donations</h2>
                <ul>
                    <li>All donations are processed by Stripe. We never see or store your card details.</li>
                    <li>The minimum donation is $5.00 USD. The maximum that can be donated through the form in a single transaction is $10,000 USD. For larger gifts, please contact us directly.</li>
                    <li>One-time donations are charged once at the time of checkout. Monthly donations are recurring charges that continue until cancelled. You can cancel a monthly donation at any time — see our <a href="/refund-policy">Refund &amp; Cancellation Policy</a>.</li>
                    <li>By submitting a donation, you confirm that you are at least 18 years old and that the payment method belongs to you.</li>
                    <li>Donations are made to support our mission and operations as a whole; we do not direct a specific donation to a specific child unless we explicitly tell you so in a separate written arrangement.</li>
                </ul>
            </section>

            <section>
                <h2>4. Tax treatment</h2>
                <p>
                    Whether your gift is tax-deductible depends on the legal status of the issuing entity and on your local tax law. We display our entity information and any applicable identifier (such as an EIN, for U.S. donors) on receipts and on the year-end contribution statement available from your donor account. Please consult your tax advisor to confirm deductibility for your situation.
                </p>
            </section>

            <section>
                <h2>5. Donor accounts</h2>
                <ul>
                    <li>After your first successful donation, we send an email invitation to set a password and access your donor account.</li>
                    <li>You are responsible for keeping your password confidential. Use a unique password of at least 12 characters; do not share it with anyone.</li>
                    <li>You agree to provide accurate information when creating your account and to keep it up to date.</li>
                    <li>We may suspend or terminate accounts that are inactive, suspected of fraud, or used in violation of these Terms.</li>
                </ul>
            </section>

            <section>
                <h2>6. Acceptable use</h2>
                <p>You agree not to:</p>
                <ul>
                    <li>Attempt to access another donor&apos;s account or any non-public area of the site.</li>
                    <li>Probe, scan, or test the security of the site without permission.</li>
                    <li>Use the donation form to send abusive, unsolicited, or repeated requests, or to enumerate accounts.</li>
                    <li>Copy, redistribute, or republish photos or stories of the children that appear in the private donor area.</li>
                </ul>
            </section>

            <section>
                <h2>7. Intellectual property</h2>
                <p>
                    All text, photos, videos, logos, and branding on the site are owned by Insan Permata or used with permission. You may not reproduce or republish them outside the site without our prior written consent, except for the limited personal sharing permitted on social media of public-facing content.
                </p>
            </section>

            <section>
                <h2>8. Privacy</h2>
                <p>
                    Your use of the site is also governed by our <a href="/privacy">Privacy Policy</a>, which describes the information we collect and how we use it.
                </p>
            </section>

            <section>
                <h2>9. Third-party services</h2>
                <p>
                    The site relies on third-party services including Stripe (payment processing), Supabase (database, authentication, email), Vercel (hosting), and Cloudflare (bot protection). Your use of those features is also subject to the respective providers&apos; terms.
                </p>
            </section>

            <section>
                <h2>10. Disclaimer and limitation of liability</h2>
                <p>
                    The site is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, whether express or implied. To the fullest extent permitted by law, Insan Permata, its volunteers, and its affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the site or from any donation made through it. Nothing in these Terms limits liability that cannot be limited by law.
                </p>
            </section>

            <section>
                <h2>11. Indemnification</h2>
                <p>
                    You agree to indemnify and hold harmless Insan Permata and its staff and volunteers from any claim, loss, or expense (including reasonable attorneys&apos; fees) arising out of your violation of these Terms or your misuse of the site.
                </p>
            </section>

            <section>
                <h2>12. Changes</h2>
                <p>
                    We may update these Terms from time to time. The &quot;Last updated&quot; date at the top of this page reflects the latest revision. Continued use of the site after changes are posted constitutes acceptance of the revised Terms.
                </p>
            </section>

            <section>
                <h2>13. Governing law</h2>
                <p>
                    These Terms are governed by the laws of the Republic of Indonesia, without regard to conflict-of-law principles. Any dispute will be resolved in the competent courts of Pekanbaru, Indonesia, except where a different forum is required by mandatory consumer protection laws applicable in the country where you reside.
                </p>
            </section>

            <section>
                <h2>14. Contact</h2>
                <p>
                    Questions about these Terms? Email <a href="mailto:info@insanpermata.org">info@insanpermata.org</a>.
                </p>
            </section>
        </LegalPageLayout>
    );
}
