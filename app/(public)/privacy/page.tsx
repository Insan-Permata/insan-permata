import LegalPageLayout from '../(component)/LegalPageLayout';

export const metadata = {
    title: 'Privacy Policy — Insan Permata',
    description: 'How Insan Permata collects, uses, and protects your personal information.',
};

const LAST_UPDATED = 'May 18, 2026';

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout
            title="Privacy Policy"
            lastUpdated={LAST_UPDATED}
            intro="This policy describes what personal information we collect when you donate or interact with this site, how we use it, who we share it with, and the choices you have."
        >
            <section>
                <h2>Who we are</h2>
                <p>
                    This website is operated by <strong>Acts Ministries International</strong> (&quot;AMI&quot;, also referred to as &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), a 501(c)(3) nonprofit organization based in Anaheim, California, United States, in partnership with Panti Asuhan Insan Permata, a children&apos;s home in Pekanbaru, Indonesia. All donations are received and processed by AMI, and AMI is the controller of the personal information described in this policy. AMI raises and grants funds in support of the home. You can reach us by email at <a href="mailto:info@insanpermata.org">info@insanpermata.org</a> for any privacy-related question or request described in this policy.
                </p>
            </section>

            <section>
                <h2>Information we collect</h2>

                <h3>Information you provide directly</h3>
                <ul>
                    <li><strong>Donation form:</strong> your email address, full legal name, donation amount (USD), and donation type (one-time or monthly).</li>
                    <li><strong>Stripe Checkout:</strong> your payment card details, cardholder name, and (when the card brand requires it) billing postal address are collected directly by Stripe on its hosted checkout page. We do not see or store your card information.</li>
                    <li><strong>Account setup:</strong> a password you choose, which is hashed by Supabase Auth and never stored in readable form.</li>
                </ul>

                <h3>Information we receive from Stripe</h3>
                <p>
                    After a successful donation, Stripe sends AMI a confirmation that includes: your donation amount, currency, paid status, a Stripe customer identifier, a session identifier, and (for monthly donations) a subscription identifier. We store these alongside your email and donor name to issue receipts and prepare your year-end contribution statement.
                </p>

                <h3>Information collected automatically</h3>
                <ul>
                    <li><strong>Server and access logs:</strong> our hosting provider (Vercel) and database provider (Supabase) automatically log standard request metadata such as IP address, browser type, request path, response code, and timestamp. These logs are kept for short retention windows per the providers&apos; defaults.</li>
                    <li><strong>Authentication cookies:</strong> if you create a donor account, a session cookie (set by Supabase) keeps you signed in. It is strictly necessary for the site to function and is not used for tracking or advertising.</li>
                </ul>

                <h3>What we do NOT collect</h3>
                <ul>
                    <li>No analytics or advertising tracking. We do not run Google Analytics, Meta Pixel, or any third-party tracker.</li>
                    <li>No phone numbers, government IDs, or tax IDs are collected on our donation form.</li>
                    <li>We do not knowingly collect any information from children. The profiles of children featured on our website are published by us with the consent of their guardians, not collected from visitors.</li>
                </ul>
            </section>

            <section>
                <h2>How we use your information</h2>
                <ul>
                    <li>To process your donation and send you a payment receipt.</li>
                    <li>To create an optional donor account so you can view your donation history and download a year-end contribution statement.</li>
                    <li>To send you transactional emails related to your account (such as your initial invitation or a password reset).</li>
                    <li>To prepare aggregate financial and operational reports about our work — these reports do not identify you personally.</li>
                    <li>To comply with our legal and tax record-keeping obligations.</li>
                </ul>
                <p>
                    We do not sell or rent your personal information to anyone. We do not share your information with any party for that party&apos;s own marketing purposes.
                </p>
            </section>

            <section>
                <h2>Third-party processors</h2>
                <p>The vendors below process your data on our behalf to keep the site and donations running:</p>
                <ul>
                    <li><strong>Stripe, Inc.</strong> (USA) — payment processing. Stripe receives your email, donor name, card details, billing ZIP/address (when applicable), and your IP for fraud screening. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe&apos;s privacy policy</a>.</li>
                    <li><strong>Supabase Inc.</strong> (USA) — database, authentication, file storage, and transactional invitation/password-reset emails. See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase&apos;s privacy policy</a>.</li>
                    <li><strong>Vercel Inc.</strong> (USA) — web hosting and image delivery. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel&apos;s privacy policy</a>.</li>
                    <li><strong>Cloudflare, Inc.</strong> (USA) — bot-protection challenge on our donation form (Turnstile). See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare&apos;s privacy policy</a>.</li>
                </ul>
            </section>

            <section>
                <h2>Where your data is stored</h2>
                <p>
                    Our processors are based in the United States and your information is stored on infrastructure they operate. If you donate from outside the U.S., your data will be transferred to and processed in the U.S. and other jurisdictions where our processors operate.
                </p>
            </section>

            <section>
                <h2>How long we keep your data</h2>
                <ul>
                    <li><strong>Donation records and contribution statements:</strong> retained for at least seven years to support tax record-keeping recommendations.</li>
                    <li><strong>Donor account:</strong> retained while your account is active. You can request deletion at any time (see your rights below).</li>
                    <li><strong>Server and authentication logs:</strong> retained per our providers&apos; defaults — typically days to weeks for access logs.</li>
                    <li><strong>Stripe records:</strong> retained according to Stripe&apos;s own policies, which we do not control.</li>
                </ul>
            </section>

            <section>
                <h2>Your rights</h2>
                <p>
                    Depending on where you live (including residents of California, Virginia, Colorado, Connecticut, Utah, and Texas under their respective state privacy laws), you may have the right to:
                </p>
                <ul>
                    <li>Access the personal information we hold about you.</li>
                    <li>Request that we correct inaccurate information.</li>
                    <li>Request that we delete your personal information, subject to our legal record-keeping obligations.</li>
                    <li>Receive a copy of your information in a portable format.</li>
                </ul>
                <p>
                    We do not &quot;sell&quot; or &quot;share&quot; your personal information for cross-context behavioral advertising as those terms are defined under the California Consumer Privacy Act (CCPA/CPRA).
                </p>
                <p>
                    To exercise any of these rights, email <a href="mailto:info@insanpermata.org">info@insanpermata.org</a> from the address associated with your donation. We&apos;ll respond within 30 days.
                </p>
            </section>

            <section>
                <h2>Donors in the EU, EEA, and UK</h2>
                <p>
                    If you donate from the European Union, the European Economic Area, or the United Kingdom, the EU/UK General Data Protection Regulation (GDPR) applies to our processing of your personal information, in addition to the rights described above.
                </p>
                <p>
                    <strong>Lawful bases.</strong> We process your personal information on the following bases:
                </p>
                <ul>
                    <li><strong>Performance of a contract</strong> (Art. 6(1)(b)) — to process your donation, issue your receipt, and operate your optional donor account.</li>
                    <li><strong>Legal obligation</strong> (Art. 6(1)(c)) — to keep donation and tax records as required by applicable law.</li>
                    <li><strong>Legitimate interests</strong> (Art. 6(1)(f)) — to secure the site, prevent fraud and abuse, and report on our work in aggregate, balanced against your rights and freedoms.</li>
                </ul>
                <p>
                    <strong>International transfers.</strong> Our processors are located in the United States, so your personal information is transferred to and processed in the U.S. Where we transfer your data to provide the services you request, we rely on the transfer derogation for performance of a contract with you (Art. 49(1)(b)). Our processors additionally apply their own transfer safeguards, including the EU Standard Contractual Clauses where they offer them.
                </p>
                <p>
                    <strong>Your GDPR rights.</strong> In addition to the rights listed above, you have the right to access, rectify, erase, restrict, or object to our processing of your personal information, the right to data portability, and the right to withdraw consent where processing is based on consent (without affecting prior processing). To exercise these rights, email <a href="mailto:info@insanpermata.org">info@insanpermata.org</a>.
                </p>
                <p>
                    <strong>Supervisory authority.</strong> You have the right to lodge a complaint with your local data protection supervisory authority — in the UK, the Information Commissioner&apos;s Office (ICO); in the EU/EEA, the authority in your country of residence — if you believe our processing of your personal information infringes applicable law.
                </p>
            </section>

            <section>
                <h2>Cookies</h2>
                <p>
                    We use a single strictly-necessary cookie set by Supabase to keep you signed in to your donor account. We do not use analytics, advertising, or third-party tracking cookies. Because this cookie is required for the site to function, no consent banner is shown.
                </p>
            </section>

            <section>
                <h2>Children&apos;s privacy</h2>
                <p>
                    Our donation site is not directed to children under 13. We do not knowingly collect personal information from anyone under 13. If you believe a child has provided us with information, please contact us so we can delete it.
                </p>
                <p>
                    Profiles of the children we care for that appear on this site are published by Insan Permata, with the consent of their guardians, to communicate the work of the home to supporters. Those profiles are shown only on pages that require a donor sign-in. See our <a href="/child-protection-policy">Child Protection Policy</a> for the safeguards we apply when telling their stories.
                </p>
            </section>

            <section>
                <h2>Security</h2>
                <p>
                    We use industry-standard safeguards: HTTPS for all traffic, password hashing via Supabase Auth, server-side validation on file uploads, signed Stripe webhooks, and least-privilege server access to the database. No system is perfectly secure, but if we ever learn of unauthorized access to personal information we&apos;ll notify affected donors as required by law.
                </p>
            </section>

            <section>
                <h2>Changes to this policy</h2>
                <p>
                    We may update this policy from time to time. The &quot;Last updated&quot; date at the top of this page reflects the latest revision. Your continued use of the site after a revised policy is posted constitutes your acceptance of the revised policy.
                </p>
            </section>

            <section>
                <h2>Contact</h2>
                <p>
                    Email: <a href="mailto:info@insanpermata.org">info@insanpermata.org</a>
                    <br />
                    Postal: Acts Ministries International, 1380 S. Sanderson Ave, Anaheim, CA 92806, United States
                </p>
            </section>
        </LegalPageLayout>
    );
}
