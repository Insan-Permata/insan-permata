import LegalPageLayout from '../(component)/LegalPageLayout';

export const metadata = {
    title: 'Child Protection Policy — Insan Permata',
    description: 'How Insan Permata safeguards the children in our care when sharing their stories with supporters.',
};

const LAST_UPDATED = 'May 18, 2026';

export default function ChildProtectionPolicyPage() {
    return (
        <LegalPageLayout
            title="Child Protection Policy"
            lastUpdated={LAST_UPDATED}
            intro="Telling the story of our home means telling the stories of the children in our care. We do this with care, with consent, and with intentional limits on what we share publicly. This policy sets out the safeguards we follow."
        >
            <section>
                <h2>Our commitment</h2>
                <p>
                    Every child living at Panti Asuhan Insan Permata has a right to safety, dignity, and privacy. This website and its donor area are operated by Acts Ministries International (&quot;AMI&quot;) in partnership with the home; AMI raises funds in support of the home, and AMI and the home together apply the safeguards in this policy. When we share photos or stories about the children — to communicate the work of the home to supporters — those rights come first, and the supporter relationship comes second. We will always choose to share less rather than to share more.
                </p>
            </section>

            <section>
                <h2>What information we share</h2>
                <ul>
                    <li><strong>First name (or a chosen pseudonym) only.</strong> We never publish a child&apos;s full legal name on a page that is reachable from the public internet.</li>
                    <li><strong>Age range, not exact age or date of birth.</strong> A child&apos;s profile shows a range (for example, &quot;6 to 8 years old&quot;), not a precise birthday.</li>
                    <li><strong>General educational stage and interests.</strong> We share enough for supporters to know the child as a person, without details that could be used to identify them outside the home.</li>
                    <li><strong>Photos that show dignity.</strong> We do not share images that depict children unclothed, in distress, or in vulnerable situations. We do not share images that include identifying environmental details (school uniforms with legible names, addresses, vehicle plates, etc.) where we can avoid it.</li>
                    <li><strong>No medical, legal, or family-history details.</strong> We do not publish information about a child&apos;s biological family, the circumstances that led them to the home, medical conditions, or any government identifiers.</li>
                </ul>
            </section>

            <section>
                <h2>Where we share it</h2>
                <p>
                    Individual children&apos;s profiles (with first name, age range, and story) are visible only inside our private donor area, which requires a signed-in account created after a donation. The public-facing pages of the site do not list named children or individual stories.
                </p>
                <p>
                    We also share photos and updates on our public social media accounts (Instagram, YouTube). On those channels we follow the same first-name-only and dignity standards described above, and we avoid posting any information that could enable a child to be located outside the home.
                </p>
            </section>

            <section>
                <h2>Technical safeguards</h2>
                <ul>
                    <li>The donor area (where named profiles live) is gated by authentication. A signed-in session is required to load any page that shows a child&apos;s profile.</li>
                    <li>Photos uploaded to the site are validated server-side for type and size; non-image files are rejected.</li>
                    <li>Search engines are instructed not to index donor-area pages, the news area, the meet-the-staff detail pages, or any URL containing children&apos;s information.</li>
                    <li>We periodically review the content of the donor area to ensure it complies with this policy.</li>
                </ul>
            </section>

            <section>
                <h2>Consent</h2>
                <p>
                    We obtain consent from each child&apos;s legal guardian before any photo or story is published on the site or shared on social media. Consent can be withdrawn at any time; if it is, we will remove the content from the site within a reasonable period.
                </p>
            </section>

            <section>
                <h2>Donor responsibilities</h2>
                <p>
                    Access to the donor area is granted on the understanding that you will treat the children&apos;s photos and stories with the same care that we do. Specifically, by signing in you agree:
                </p>
                <ul>
                    <li>Not to republish, repost, or forward photos or stories from the donor area to any third party.</li>
                    <li>Not to take screenshots of children&apos;s profiles for use outside your personal viewing.</li>
                    <li>Not to attempt to identify a child by combining details from the donor area with information from any other source.</li>
                </ul>
                <p>
                    Donors who breach these terms may have their account access revoked, and we may take further action where the safety of a child has been put at risk.
                </p>
            </section>

            <section>
                <h2>Volunteers, staff, and visitors</h2>
                <p>
                    Anyone with in-person access to the children — whether staff, long-term volunteers, or visitors — is briefed on our safeguarding standards before they begin and is expected to follow them. Visits are by prior arrangement only and are supervised. We do not allow unaccompanied one-on-one contact between visitors and individual children.
                </p>
            </section>

            <section>
                <h2>Reporting a concern</h2>
                <p>
                    If you see content on our site or social media that you feel is inconsistent with this policy, or if you have any other concern about the safety of a child in our care, please email us at <a href="mailto:info@insanpermata.org">info@insanpermata.org</a>. Reports are read by the home&apos;s leadership and acted on promptly. Anonymous reports are accepted.
                </p>
            </section>

            <section>
                <h2>Review</h2>
                <p>
                    We review this policy at least annually and whenever there is a material change to how we share information about the children. The &quot;Last updated&quot; date at the top of this page reflects the latest review.
                </p>
            </section>
        </LegalPageLayout>
    );
}
