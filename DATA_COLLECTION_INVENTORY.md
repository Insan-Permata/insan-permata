# Data Collection Inventory — Insan Permata

Source-of-truth list for drafting `/privacy`, `/terms`, `/refund-policy`, and `/child-protection-policy`. Drawn from the actual code paths (forms, DB schemas, webhook handler, middleware, third-party SDKs in `package.json`). Scoped to US donors — Indonesia UU PDP framing intentionally omitted.

---

## A. Data collected directly from visitors

### A1. Donation form — `/support`
Source: `app/(public)/support/page.tsx`, sent to `app/api/stripe/create-checkout-session/route.ts`

| Field | Purpose | Required |
|---|---|---|
| Email | Receipt, donor account invite, statement delivery | Yes |
| Full legal name | Year-end contribution statement (not card name) | Yes |
| Donation amount (USD) | Charge amount | Yes |
| Donation type (one-time / monthly) | Stripe mode | Yes |

### A2. Stripe Checkout (off-site)
Stripe collects on its hosted page — never touches our servers:
- Payment card number, expiration, CVC
- Cardholder name
- Billing postal code / address (we set `billing_address_collection: 'auto'`, so Stripe collects address only when the card brand requires it — typically US cards: ZIP only)
- IP address and device fingerprint (used by Stripe Radar for fraud detection)

What we get back from Stripe and store: `stripe_customer_id`, `stripe_session_id`, `stripe_subscription_id`, donation amount, currency, paid status.

### A3. Donor account — `/welcome`
Source: `app/welcome/WelcomeForm.tsx`, Supabase Auth

| Field | Purpose |
|---|---|
| Password (hashed by Supabase Auth, bcrypt) | Login credential |
| Email confirmation timestamp | Account activation tracking |

### A4. Login — `/login`
- Email + password

### A5. Statement generation — `/my-account/statement`
No new visitor input. Reads donor's existing email + donor_name from prior donations.

### A6. Contact page — `/contact`
**No form** — page only opens external links (WhatsApp, mailto, Instagram). No data collection on our side, though those third parties will record contact details once the visitor reaches them.

---

## B. Data stored in our database (Supabase)

### B1. `donations` table
`id, email, donor_name, amount, currency, type, stripe_session_id, stripe_customer_id, stripe_subscription_id, status, created_at, updated_at`

### B2. `users` table
`id, email, role (admin/donor), status (active/expired/suspended), credentials_expiry_date, last_donation_time, last_donation_amount, email_confirmed_at, created_at, updated_at`

### B3. `contribution_statements` table
`id, user_id, email, donor_name, year, donation_ids[], total_amount, currency, generated_at`

### B4. Supabase Auth tables (managed)
`auth.users` — email, hashed password, email-verification status, last sign-in timestamps, invite tokens.

### B5. Content about minors and staff (org-published, not visitor-submitted)
- `children`: name, date of birth, gender, photo URL, story, interests, educational stage, bible verse, joined date
- `staff`: name, role, photo URL, description, bible verse

Worth calling out in the privacy / child-protection policy: this is PII about minors. The supporting `/our-children` route is currently gated behind donor login (see `PROTECTED_PUBLIC_ROUTES`).

---

## C. Data collected automatically (logs / infrastructure)

We don't write code to capture these, but our hosts do by default:

- **Vercel access logs** — IP address, user-agent, referrer, request path, timestamp, geographic region (city/country level), response codes. Retained per Vercel's defaults (~30 days on Hobby/Pro).
- **Supabase logs** — request IP, timestamps for auth events and API calls. Retained per Supabase tier.
- **Stripe** — IP address and device fingerprint at time of payment (for Radar fraud scoring).

---

## D. Cookies

| Cookie | Set by | Purpose | Category |
|---|---|---|---|
| `sb-<project>-auth-token` (and variants) | Supabase SSR | Stores the encrypted auth session for logged-in donors/admins | Strictly necessary |

**No analytics, advertising, or third-party tracking cookies.** No Google Analytics, no Meta Pixel, no PostHog/Sentry — confirmed by grep across the codebase.

---

## E. Third-party processors (sub-processors for the privacy policy)

| Vendor | Role | Data shared | Location |
|---|---|---|---|
| **Stripe, Inc.** | Payment processing | Email, donor name, card data, billing ZIP/address, IP | US |
| **Supabase Inc.** | Database, auth, email invites, file storage | All data in §B; auth emails sent to donors | US (Supabase hosts vary; confirm region of your project) |
| **Vercel Inc.** | Web hosting, image optimization | Request metadata (IP, UA, path); served images | US |

Notes:
- **Google Fonts is NOT a runtime third party.** `app/layout.tsx` uses `next/font/google` with `Geist` / `Geist_Mono`, which Next.js downloads at build time and self-hosts on Vercel. No browser requests go to Google's CDN. You can drop the "Google Fonts" item the audit listed.
- Email delivery for donor invites + password resets currently rides on Supabase Auth's built-in email provider (no separate SendGrid/Resend integration in code).

---

## F. Retention — recommended defaults to write into `/privacy`

Code doesn't enforce any of these today; these are reasonable starting points to declare:

- **Donation records and contribution statements** — retained 7 years (US IRS recordkeeping recommendation for charitable contributions).
- **Donor account (`users`)** — retained while account is active; deleted on request.
- **Auth session cookies** — expire on Supabase's default session lifetime.
- **Server logs (Vercel, Supabase)** — per provider defaults; not under direct control.
- **Stripe records** — per Stripe's retention policy (effectively long-term, for compliance).

---

## G. Things NOT collected (worth saying explicitly)

- No phone numbers
- No physical address other than what Stripe captures for cards that require it
- No SSN / tax ID from donors
- No browsing/behavioral analytics
- No marketing-list opt-in
- No data from minors (children's data is org-published, not collected from visitors)

---

## H. US-specific notes (since you're targeting US donors)

- **CCPA/CPRA (California)**: applies if you have CA donors and meet thresholds; you'd need a "Do Not Sell or Share My Personal Information" link and a process for access/deletion requests. The site doesn't sell or share data, so the disclosure can be a simple statement.
- **State comprehensive privacy laws** (VA, CO, CT, UT, TX, etc.): similar — disclose collection categories, purposes, third parties, and offer access/deletion.
- **Tax-deductible claim** — the FAQ on `/support` claims donations are tax-deductible. This is only legally accurate if a US 501(c)(3) entity is issuing the receipts. Until that's confirmed, the privacy/terms drafting should either (a) name the 501(c)(3) sponsor + EIN on every receipt and FAQ, or (b) soften the FAQ language. (Cross-reference: audit C-3.)
- **Children's photos / stories** — even though `/our-children` is login-gated, US donors will expect a stated child-protection / image-use policy. COPPA itself doesn't apply (no collection *from* under-13s), but reputational expectation is the same.
