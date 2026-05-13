# 🛡️ Pre-Launch Audit Report — Insan Permata Donation Platform

**Date:** 2026-05-13
**Auditor:** Senior Launch Auditor (AI)
**Repo HEAD:** `c97d0c5`

---

## 1. Executive Summary

Insan Permata is a Next.js 16 / Supabase / Stripe donation site for an Indonesian orphanage. The architecture is reasonable: server actions + repository pattern, middleware-gated admin routes, webhook-validated Stripe ingestion, and an invite-flow that auto-provisions donor accounts after payment.

However, **the platform is not yet ready to accept real money or be publicly indexed.** The audit found one show-stopping **secret-leak risk in the codebase** (live service-role JWT and Stripe test secret sitting in tracked working tree even though `.gitignore` covers them — confirmed not currently in git history, but they were exposed during the conversation), several **critical legal/compliance gaps** (no Privacy Policy, no Terms of Service, no Donation/Refund Policy, no Indonesian organizational legitimacy disclosure), **a stated-but-not-implemented child privacy guarantee** (the public profile shows children's exact age, full name, and personal story even though the docs promise age ranges only), and a **broken core feature** (the year-end contribution statement says "PDF download will be available soon" — i.e. it is not actually downloadable, contradicting the user-facing "tax-deductible" promise).

Multiple medium-severity issues touch security headers (none configured), rate limiting (none), abuse prevention on the public checkout endpoint, donor-data isolation (currently relies on email match through service-role bypass with no defense-in-depth), and operational readiness (no Stripe-webhook idempotency, no monitoring, no error-tracking SDK, no backups validated).

**Launch Readiness Score: 38 / 100**
**Recommendation: 🔴 NO-GO for public launch.** Address the items in §11 first; many are 1–4 hour fixes.

---

## 2. Critical Risks (must fix before launch)

### C-1. Live Supabase service-role key & Stripe test secret are in the working tree

- **Severity:** Critical
- **Where:** `.env.local` lines 17–24 — contains real `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (JWT expires 2036), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
- **Status:** `.gitignore` correctly excludes `.env*` and `git ls-files` shows only `.env.example` tracked — **so it is NOT in git history today.** But the values were shared into this AI session and likely have been pasted into other tools/agents.
- **Risk impact:** The service-role JWT bypasses every RLS policy in the Supabase project. Anyone with that key can read/write the entire `donations`, `users`, `children`, `staff`, `news` tables; create/delete auth users; delete every file in storage. The Stripe `whsec_` lets an attacker forge webhook signatures and insert fake "paid" donations into the donor record.
- **Reproduction:** `cat .env.local` — keys visible.
- **Fix:**
  1. **Immediately rotate** all four secrets in the Supabase Dashboard (Settings → API → "Reset service role key" + reset JWT secret) and Stripe Dashboard (Developers → API Keys → Roll, and Webhooks → reveal/rotate the signing secret).
  2. After rotation, set the new values only in Vercel project env (or whichever host).
  3. Add a `pre-commit` hook with `gitleaks` or similar to block secret reintroduction.
  4. Audit any place the old values may have leaked (chat history, shared screens, prior PRs).

---

### C-2. No Privacy Policy, Terms of Service, Donation Policy, Refund Policy, or Cookie Policy

- **Severity:** Critical (legal / compliance)
- **Where:** No `/privacy`, `/terms`, `/refund`, `/donation-policy`, `/cookies` routes exist. Footer has no links to any policy.
- **Risk impact:**
  - Indonesia's **UU PDP (Personal Data Protection Law, 2022)** requires a privacy notice and lawful basis at the point of personal-data collection. The support form collects email + legal name + (via Stripe) billing address — without a notice this is non-compliant.
  - Stripe's TOS requires a refund policy be published before live mode is approved for charities.
  - The site's marketing copy ("Is my donation tax-deductible? Yes!") is a tax statement made without supporting policy or proof of nonprofit registration → exposure for misrepresentation.
- **Fix:** Author and publish at minimum:
  - `/privacy` — list every data field collected (email, name, donation history, child photos, IP via Vercel, Stripe customer ID), the lawful basis, retention period, third parties (Stripe, Supabase, Vercel, Google Fonts), contact for data requests.
  - `/terms` — donation terms, no refund unless requested within X days, recurring-donation cancellation instructions, dispute process.
  - `/refund-policy` — explicit, even if "all donations final" — Stripe requires this to be present.
  - `/child-protection-policy` — the safeguarding stance for using children's photos and stories.
  - Add links to all of these to `FooterComponent.tsx`.

---

### C-3. "Tax-deductible" claim on the donation page is not backed by any legal disclosure

- **Severity:** Critical (compliance / fraud-risk)
- **Where:** `app/(public)/support/page.tsx:478-483` — FAQ answer states "Yes!" without naming the legal entity that issues receipts. No nonprofit-registration number (NPWP / SK Kemenkumham / Akta Yayasan number) anywhere on the site. No US-style EIN. The receipt logic (`createStatement`) records a `donor_name`, `email`, `year`, `total_amount`, and `currency` only — it never names the issuing entity or its registration ID.
- **Risk impact:** A donor cannot legally claim tax deduction without an entity name + registration ID + statement that no goods/services were exchanged. Misrepresentation could violate Indonesian and U.S. consumer protection statutes.
- **Fix:** Either (a) remove the "tax-deductible" language until paperwork is in place, or (b) finalize the legal entity (Yayasan registration in Indonesia, or 501(c)(3) sponsor in the U.S.) and include name + registration ID + "no goods/services exchanged" boilerplate on every receipt, success page, and the FAQ.

---

### C-4. Children's exact age + full real name + personal story shown publicly — contradicts stated privacy guarantee

- **Severity:** Critical (child-safeguarding)
- **Where:** `app/(public)/our-children/[id]/page.tsx:30-42, 89-122`. The page calls `calculateAge(child.date_of_birth)` and renders `{age} years old` plus the child's full `name`, `story`, `interests`, etc.
- **Discrepancy:** `PROJECT_WALKTHROUGH.md:65-71` and `README.md:191-199` **explicitly promise** "Age Ranges, Not Birthdays" and "(e.g., '6-8 years old')". The implementation never uses age ranges. This is the **single most important safeguarding control** advertised by the project, and it isn't on.
- **Risk impact:** Identifying minors in care by exact age + full name + life story is a serious safeguarding red flag (and arguably a violation of Indonesian UU PDP, which classifies children's data as "specific personal data" requiring extra safeguards). Also a reputational fuse with donors who read the docs.
- **Reproduction:** Visit `/our-children/<id>` while authenticated as a donor — full name + exact age + life story are rendered.
- **Fix:**
  1. Add a `getAgeRange(dob)` helper and use it instead of `calculateAge` in the public page.
  2. Use first name or pseudonym only on the public detail page. Keep the full name in admin only.
  3. Strip EXIF/GPS metadata from uploaded photos in `lib/utils/supabase/storage.ts` before storing.
  4. Confirm `/our-children/*` is actually behind login (it is — see `PROTECTED_PUBLIC_ROUTES`) and document that in the privacy policy.

---

### C-5. Stripe webhook has no idempotency — duplicate deliveries create duplicate donation rows

- **Severity:** Critical
- **Where:** `app/api/stripe/webhook/route.ts:139-149` and `:201-211`.
- **Issue:** Stripe **explicitly retries** webhooks on any non-2xx response, and even fires duplicates during failover. The handler unconditionally `INSERT`s a row keyed on a generated UUID. If Stripe retries (or a single delivery is double-fired), the donor sees the same donation twice in `/my-account` and on their year-end statement.
- **Risk impact:** Donor confusion ("I was charged twice"), incorrect tax statement totals (which the system advertises as suitable for tax filing), reconciliation pain.
- **Fix:** Add a `UNIQUE` constraint on `(stripe_session_id)` for one-time donations and on `(stripe_subscription_id, invoice_id)` for renewals. Switch the inserts to `.upsert(..., { onConflict: 'stripe_session_id', ignoreDuplicates: true })`. Optionally check `event.id` against a `processed_stripe_events` table for full idempotency.

---

### C-6. `/api/stripe/create-checkout-session` is unauthenticated, unrate-limited, and CSRF-able

- **Severity:** Critical
- **Where:** `app/api/stripe/create-checkout-session/route.ts:16-86`.
- **Issues:**
  - No origin check / no CSRF token / no captcha. Any site or bot can POST `{email, fullName, amount, type}` and get a Stripe Checkout URL with an arbitrary email pre-filled.
  - This is the **account-invitation vector**: completing payment triggers `inviteDonorIfNew(...)` which creates an auth user keyed on whatever email the attacker sent. While the bot can't make the donor actually pay, it can use the platform to spam the Stripe checkout system, and the success page enumerates "this email already has an account" (see C-9).
  - There is no rate limit per IP/email — an attacker can hammer this endpoint.
- **Risk impact:** Spam, infrastructure cost (Stripe API calls are counted), account-enumeration, potential reputation hit if abused to send phishing-style invitation emails (because the invite email comes from Supabase Auth and looks legitimate, but only fires *after* a real payment — so the actual abuse vector is more "bot harassment of Stripe").
- **Fix:**
  - Add a Cloudflare Turnstile / hCaptcha to the donate form and verify in the route.
  - Rate-limit per IP (e.g. Upstash / Vercel KV) — at most ~5 attempts/min.
  - Validate `Origin` header against `NEXT_PUBLIC_SITE_URL`.
  - Cap `amount` from above too (currently the only bound is `>= 5` — a typo could submit `5000000`).

---

## 3. High-Priority Issues

### H-1. No security headers (CSP, HSTS, X-Frame-Options, etc.)

- **Where:** `next.config.ts:7-27` — only `images` and `serverActions.bodySizeLimit` configured. No `headers()` block.
- **Risk:** Without `Content-Security-Policy`, an XSS that lands somewhere (e.g. user-controlled `news.content`, which is rendered as HTML in some flows) executes freely; without `X-Frame-Options: DENY` the donate page can be iframed for clickjacking; without `Strict-Transport-Security` the first request can be downgraded to HTTP.
- **Fix:** Add a `headers()` async in `next.config.ts` returning:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - A strict `Content-Security-Policy` allowing `js.stripe.com`, `*.supabase.co`, `'self'`.

### H-2. Donor-data isolation relies solely on email match; no defense-in-depth

- **Where:** `lib/repositories/donations.repository.ts:15-30` — `getMyDonations()` filters `donations` by `user.email.toLowerCase()` using the **service-role** client (bypasses RLS). If the email mapping is ever wrong (e.g., user changes email in `auth.users` and the `donations.email` is the old one; or `auth.users.email` becomes `null` momentarily), or if the auth session is forged, every donation is reachable. There's no `auth.uid()` join in the query.
- **Fix:**
  - Add a `user_id uuid REFERENCES auth.users(id)` column to `donations`, backfill it via webhook (look up the user by email at insert time, write the id), then query by id instead of email.
  - Enable RLS on `donations` with `using (user_id = auth.uid())` and stop using the admin client for donor reads — use the normal authed client.

### H-3. Webhook re-uses success-page `auth.admin.deleteUser` flow — abuse vector

- **Where:** `app/api/stripe/webhook/route.ts:57-74`. If a confirmed donor's `email_confirmed_at` is somehow nulled (manual SQL, restored backup), the next donation deletes their auth row. Also, if the attacker can get two different people to donate using the **same email** (typo or intentional), the second donation could wipe the first donor's account.
- **Fix:** Only delete when `email_confirmed_at IS NULL` AND `created_at + 24h < now()` — already gated, but tighten the precondition (the `existing?.email_confirmed_at` guard is checked, so this is mostly defense-in-depth). Also log this as a separate audit event.

### H-4. The `/welcome` set-password flow uses an 8-char minimum and no strength check

- **Where:** `app/welcome/actions.ts:11-15`. Min length 8, no zxcvbn, no uppercase/digit requirement. `'password'` is accepted.
- **Risk:** A donor account, once compromised, leaks year-end tax statements (donor name, total amount, all donation dates and amounts) and the private `/our-children` and `/news` content.
- **Fix:** Raise minimum to 12 characters, add `zxcvbn-ts` server-side check, block common passwords. (Or: rely on Supabase's built-in HIBP check by enabling it in Auth settings.)

### H-5. No brute-force protection on `/login`

- **Where:** `app/login/page.tsx` + `lib/actions/auth.actions.ts:7-36`. Supabase Auth has built-in rate limits, but there is no per-account or per-IP backoff in app code and no captcha.
- **Risk:** Credential stuffing against donor accounts.
- **Fix:** Enable Supabase Auth's built-in rate limit (Dashboard → Authentication → Rate Limits), and add Turnstile to the login form after N failures.

### H-6. File-upload accepts any file via `accept="image/*"` UI hint — no server-side MIME/extension/size enforcement and no EXIF stripping

- **Where:** `lib/utils/supabase/storage.ts:3-30` and `lib/actions/upload.actions.ts`. The upload action takes whatever `File` the form sends. There's no MIME whitelist, no `file.size` check, no extension whitelist, no image-content sniff. The 10MB note in the UI is decorative.
- **Risk:**
  - An admin (or compromised admin session) can upload an `.svg` containing `<script>` that runs against the storage domain.
  - Uploaded child photos retain EXIF GPS — leaking the orphanage's location (already public — Pekanbaru — but for individual outings/visits this could be sensitive).
  - No max size = a single upload can consume the 500 MB Supabase free-tier limit.
- **Fix:** In `uploadImage`, validate `file.type` ∈ {`image/jpeg`, `image/png`, `image/webp`}; validate `file.size <= 10*1024*1024`; reject SVG outright; strip EXIF using `sharp` before upload.

### H-7. `data-hero` markup leaks raw apostrophes that look like CMS placeholders

- **Where:** `app/(public)/page.tsx:32-35`, `support/page.tsx:482`, etc. Unescaped curly apostrophes (`God’s`) is fine, but the **smart quotes inside JSX attribute strings** in support/page.tsx FAQ trigger React's `react/no-unescaped-entities` lint and look unprofessional under certain renderers. Minor trust signal.
- **Fix:** Run `npm run lint` and address.

### H-8. PDF download for the contribution statement is **not implemented**

- **Where:** `app/(public)/my-account/statement/page.tsx:73-75` ("Downloads are generated as PDF") and `StatementForm.tsx:84-88` ("PDF download will be available soon.") + commit `c97d0c5` ("TODO: pdf generation").
- **Risk:** Donors are explicitly told tax statements are available "to be used as a record for tax-deductible contributions" but they cannot actually download anything. This is functionally a lie at launch.
- **Fix:** Either ship the PDF generation (e.g. `@react-pdf/renderer` server-side) or remove the entire feature/copy until it works. Do not launch with a stub.

### H-9. `inviteDonorIfNew` and `getDonationContext` enumerate accounts by email

- **Where:** `app/(public)/support/success/page.tsx:36-49`. The success page tells the visitor "You already have an account" or "Your invitation is on the way" — leaking whether an email is registered. An attacker who pays $5 once with `victim@example.com` learns the registration state.
- **Fix:** Show a generic message regardless of state ("If this email isn't yet on file, we've sent an invitation. Check your inbox.") — match how login error messages should be uniform.

### H-10. The home page hero copywriting promises "transparency" the site doesn't yet provide

- **Where:** `/support` page text "100% Goes to Children" is commented out (good), but support FAQ still claims a private supporter page where "we share updates and stories about the children and daily life" — which means donors are paying for ongoing access. There is no SLA on update cadence, no archive of past updates, no auditable financial report.
- **Risk:** Donor-trust erosion if reality doesn't match the promise. Also material misrepresentation if a donor disputes the charge.
- **Fix:** Either commit to a cadence (e.g. monthly newsletter) and publish a financial-transparency page, or temper the language.

---

## 4. Medium-Priority Issues

| #    | Issue                                                                                                                                                                              | Where                                                          | Fix                                                                                                                                                                       |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M-1  | No `not-found.tsx` / 404 page configured                                                                                                                                           | top-level `app/`                                               | Add `app/not-found.tsx` with a branded message + nav back home                                                                                                            |
| M-2  | No `robots.txt` / `sitemap.ts`                                                                                                                                                     | none exist                                                     | Add `app/robots.ts` and `app/sitemap.ts`. **Disallow** `/admin`, `/auth`, `/welcome`, `/my-account`, `/our-children/*`, `/news/*`, `/meet-the-staff/*` from indexing for safeguarding |
| M-3  | Root `<Metadata>` is `{title:"Insan Permata", description:"Insan Permata"}`                                                                                                        | `app/layout.tsx:15-18`                                         | Set descriptive title template, description, OG image, Twitter card, canonical URL                                                                                        |
| M-4  | No favicon variants for iOS/Android                                                                                                                                                | only `app/favicon.ico`                                         | Add `apple-icon.png`, `icon.png`, `manifest.json`                                                                                                                         |
| M-5  | `dynamic = 'force-dynamic'` everywhere defeats caching                                                                                                                             | many pages                                                     | Use route-segment revalidation where the data is not user-specific (carousels, public news index)                                                                         |
| M-6  | `revalidatePath('/', 'layout')` after login forces a full layout re-render and re-fetch                                                                                            | `lib/actions/auth.actions.ts:29`                               | Acceptable but consider scoped revalidation                                                                                                                               |
| M-7  | `globals.css` and `next.config.ts` allow images from any quality/format but only one remote pattern                                                                                | `next.config.ts:8-20`                                          | Restrict `remotePatterns` to the exact Supabase storage path used                                                                                                         |
| M-8  | `lib/repositories/users.repository.ts:31-40` claims "Only accessible to admin users (enforced by RLS)" but the call uses the server client which trusts the JWT — if RLS is **not** enabled on `users`, any signed-in user could read all users | DB                                                             | Verify RLS is on the `users` table and the policy is `using (auth.uid() = id OR role_is_admin())`                                                                         |
| M-9  | Free-form `educational_stage` enum includes `"-"` as a value                                                                                                                       | `types/database.ts`                                            | Replace with `NULL`; the dash sentinel is fragile                                                                                                                         |
| M-10 | `app/welcome/page.tsx` does no role/state check — if an `admin` happens to land here, they're prompted to set a password and redirected to `/my-account`, then bounced back by middleware | `app/welcome/page.tsx:7-16`                                    | Check `users.role` and redirect admins to dashboard                                                                                                                       |
| M-11 | `console.log` of donor emails in webhook                                                                                                                                            | `app/api/stripe/webhook/route.ts:62, 73, 86, 157, 218`         | Move PII out of logs or hash it; logs go to Vercel and Supabase by default                                                                                                |
| M-12 | `bodySizeLimit: '5mb'` on Server Actions but image upload UI says "up to 10MB"                                                                                                     | `next.config.ts:24` + `ImageUpload.tsx:136`                    | Align — pick one limit and enforce it                                                                                                                                     |
| M-13 | Statement is stored in `contribution_statements` table but no `user_id` column visible in the type; uniqueness by year/email not enforced                                          | `lib/repositories/statements.repository.ts`                    | Add `UNIQUE(user_id, year)` so the donor can't generate duplicate statements for the same year                                                                            |
| M-14 | Footer phone `+62 812 3456 7890` and contact page WhatsApp `6281234567890` are placeholder numbers                                                                                 | `FooterComponent.tsx:11`, `ContactPage:5`                      | Replace with real numbers before launch — current numbers will misroute donors                                                                                            |
| M-15 | `STRIPE_PRODUCTION.md` is missing from `.gitignore`/policies but contains a sample env-check that throws in production rather than dev — copy-paste hazard                          | `STRIPE_PRODUCTION.md:64-69`                                   | Not load-bearing; correct the snippet                                                                                                                                     |

---

## 5. Low-Priority Improvements

- L-1. Add `loading.tsx` / `error.tsx` boundaries for each route group.
- L-2. Add `app/api/health` for uptime monitoring.
- L-3. Use `next/image` `priority` only on above-the-fold images (currently used on every detail page).
- L-4. Replace inline SVG icons in support page with `lucide-react` (already imported in other files).
- L-5. The Stripe checkout `description: 'Supporting children at Panti Asuhan Insan Permata'` will appear on donor's credit-card statement; double-check this matches the registered business name.
- L-6. Add a "Resend invite" button on the success page when state is `pending` and the cooldown has expired.
- L-7. Currency is hardcoded `usd` but the site is Indonesian — confirm USD is what donors actually want, otherwise add IDR + multi-currency display.
- L-8. Add the year on the FAQ "Yes" answer to make it more concrete.
- L-9. Replace `alert('Image upload failed.')` in `ImageUpload.tsx:58` with a toast/inline error.
- L-10. Switch to `<a>` → `<Link>` for the email/instagram buttons in `ContactPage` (currently using `window.location.href` which forces a full reload).

---

## 6. Compliance Gaps Summary

| Area                                  | Status                       | Required Action                                                                                          |
| ------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| Indonesian UU PDP (PDP Law)           | ❌ Missing                   | Privacy notice at collection point, retention policy, contact for data rights                            |
| Stripe Production TOS                 | ❌ Missing                   | Published refund policy required to activate live mode                                                   |
| Tax-deductible receipts               | ❌ Implied without basis     | Either remove claim or attach entity registration + boilerplate                                          |
| Child-protection                      | ❌ Promised, not implemented | Age range + first-name-only + EXIF strip + content review                                                |
| Cookie consent (if EU donors)         | ❌ Missing                   | Cookie policy + consent banner if you plan to accept EU donors                                           |
| Email marketing (CAN-SPAM-equivalent) | ⚠️ Risk                       | Donor invitation email is transactional (OK), but if a marketing list is added later it needs unsubscribe handling |
| Accessibility (WCAG 2.1 AA)           | ⚠️ Unknown                    | No alt-text audit run; some `<button>`s lack aria-labels; color contrast on `#355872` vs background unverified |

---

## 7. Security Findings (consolidated)

- ✅ Stripe webhook signature is verified — good.
- ✅ Service-role key is only used server-side (admin client never imported into client component).
- ✅ Middleware correctly gates `/admin` by role + status, and `/admin/*` also has a server-side check in the layout (defense-in-depth ✓).
- ✅ Cookies are managed by `@supabase/ssr` with HttpOnly/Secure/SameSite defaults — good.
- ✅ `.env.local` is in `.gitignore` (verified via `git check-ignore`).
- ❌ No CSP / HSTS / XFO / nosniff / referrer-policy headers.
- ❌ No rate limiting on `/login`, `/api/stripe/create-checkout-session`, or `/welcome`.
- ❌ No idempotency on Stripe webhook.
- ❌ Account-enumeration on `/support/success`.
- ❌ No CSRF / origin-check on Stripe checkout endpoint.
- ❌ Donor data isolation depends on service-role + email match (no `user_id` FK).
- ❌ Image upload has no server-side MIME/size validation and no EXIF stripping.
- ⚠️ The `(invoice.parent as { subscription_details?: ... })?.subscription_details?.subscription` cast in the webhook is fragile across Stripe API versions — if the shape ever changes you silently stop writing subscription renewals.

---

## 8. Privacy Findings (consolidated)

- ❌ No privacy policy → can't tell donor what data you collect.
- ❌ Child profiles show full name + exact age + life story + interests publicly to any logged-in donor (any donor can become a logged-in member by donating $5).
- ❌ No image metadata stripping → potential GPS leak.
- ❌ `donations.email` is stored in lowercase but `users` table also stores email — duplicated PII increases breach surface.
- ❌ Logs print donor email + amount in plaintext.
- ⚠️ The site loads Geist from Google Fonts (`app/layout.tsx:5-13`) — Next/font handles this server-side and avoids the GDPR Google-Fonts issue, but document it in the privacy notice.

---

## 9. Launch Readiness Score Breakdown

| Dimension                     | Score      | Notes                                                            |
| ----------------------------- | ---------- | ---------------------------------------------------------------- |
| Security                      | 4 / 10     | Stripe verification ✓, RBAC ✓, but headers/idempotency/rate-limiting all missing |
| Privacy                       | 2 / 10     | Stated guarantees not implemented; no policy                     |
| Legal/compliance              | 1 / 10     | No PDP notice, no refund policy, no tax claim backup             |
| Trustworthiness               | 5 / 10     | Branding consistent; copy is professional; broken feature lowers trust |
| Operational readiness         | 3 / 10     | No monitoring, no backup proof, no incident process              |
| Scalability                   | 7 / 10     | Stack scales fine for the expected volume                        |
| Abuse prevention              | 2 / 10     | Public POST endpoint with no captcha or rate limit               |
| Financial transparency        | 3 / 10     | Donation page is clean, but no published financials or impact report |
| Accessibility                 | 5 / 10     | Basic semantic HTML; no formal audit                             |
| Reliability                   | 5 / 10     | Webhook isn't idempotent; no retry visibility                    |
| **Total (weighted average)**  | **38 / 100** |                                                                  |

---

## 10. Simulated Attacker / Abuse Scenarios

1. **Malicious donor / bot:**
   - POST `{email:"victim@x.com", amount:5, type:"once"}` repeatedly to `/api/stripe/create-checkout-session`. No rate limit → Stripe API quota burned.
   - Pay $5 once with the victim's email → Supabase Auth sends a real invite to the victim; if they click it, the attacker has primed an account they don't control. Mitigated only by the fact that the *attacker* never sees the link, but it's still harassment.
2. **Webhook spoof:**
   - Stripe signature is verified — ✓ blocked.
3. **Stripe replay:**
   - Replaying a `checkout.session.completed` event for an already-recorded session → currently **creates a duplicate row** (no UNIQUE constraint or event-id table). Donor sees a $X charge twice on `/my-account`.
4. **Admin mistake:**
   - Admin opens `ImageUpload`, drops an SVG with `<script>` in it. It's uploaded and served from the Supabase public bucket. If anyone embeds the URL with `<img>`, it's safe — but if linked directly in a browser tab, scripts run with the bucket's origin. Mitigation: deny SVG, set `cache-control: private`, set the bucket to JPEG-only.
5. **Account-enumeration:**
   - `/support/success?session_id=…` discloses if `email` already has an account.
6. **Spam/bot signup:**
   - The only way to create an account is via Stripe payment + invite email — relatively spam-resistant, but the public POST endpoint can be abused without payment to enumerate Stripe error responses.

---

## 11. ⚡ Suggested Immediate Fixes Before Launch (in priority order)

1. **Rotate every secret in `.env.local`** in Supabase and Stripe dashboards, then redeploy. (C-1) — 30 min.
2. **Switch children's public page from exact age → age range**, change full name to first name, strip EXIF in `uploadImage`. (C-4) — 1–2 h.
3. **Add a UNIQUE constraint on `donations.stripe_session_id`** and switch the webhook insert to `.upsert(..., {onConflict: 'stripe_session_id', ignoreDuplicates: true})`. (C-5) — 30 min.
4. **Either ship PDF download for the year-end statement, or remove the entire feature/copy.** Do not launch with "PDF download will be available soon." (H-8) — 4–6 h or 10 min depending on choice.
5. **Publish Privacy Policy, Terms, Refund Policy, Child Protection Policy** and link them in the footer. (C-2) — 2–4 h (use templates + customize).
6. **Remove or substantiate the "tax-deductible" claim.** (C-3) — 5 min copy edit, or full registration paperwork.
7. **Add Turnstile + per-IP rate limit + Origin check to `/api/stripe/create-checkout-session`.** (C-6) — 1–2 h.
8. **Add security headers (`headers()` in `next.config.ts`).** (H-1) — 30 min.
9. **Add a `user_id` column to `donations`, backfill via webhook, switch reads to authed client with RLS.** (H-2) — 2–3 h.
10. **Server-side validate uploaded image MIME/extension/size.** (H-6) — 30 min.
11. **Replace placeholder phone/WhatsApp numbers** in footer and contact page. (M-14) — 5 min.
12. **Add `app/not-found.tsx`, `app/robots.ts` (Disallow `/admin`, `/auth`, `/welcome`, `/my-account`, `/our-children/*`, `/news/*`, `/meet-the-staff/*`), `app/sitemap.ts`, and proper root metadata.** (M-1 / M-2 / M-3) — 30 min.
13. **Generic message on `/support/success`** (no enumeration). (H-9) — 10 min.
14. **Run `npm run lint`** and fix all warnings. — 30 min.

---

## 12. Improvements After Launch

- Set up PostHog / Sentry (you already have a PostHog plugin available) for error tracking + product analytics; gate the analytics behind a cookie banner.
- Add a financial-transparency page with quarterly impact reports.
- Add a real PDF generator (e.g. `@react-pdf/renderer`) with a stable receipt template.
- Implement child-sponsorship in the roadmap and tie it to donor profiles.
- Add automated backups verification (test restore in staging quarterly).
- Add `app/api/health` and uptime monitoring (UptimeRobot / Better Uptime).
- Add a Stripe-disputes / refunds admin view.
- Set up a recurring "stale invite cleanup" job: delete `users` rows where `email_confirmed_at IS NULL AND created_at < now() - 30 days`.
- Add support for IDR + multi-currency, and check Indonesian payment methods (QRIS, BCA VA) via Xendit/Midtrans if the donor base is primarily local.
- Add a content-moderation / draft workflow for `news` posts.
- Add WCAG audit (Axe DevTools / Pa11y), screen-reader test the donate flow.
- Add a `data subject access request` form in the privacy policy.

---

## 13. Go / No-Go Recommendation

🔴 **NO-GO** for public launch in the current state.

The blocker set is small and tractable — most fixes are ≤2 hours. With items C-1 through C-6 and H-1 through H-8 addressed (estimate ~2 focused days of work), the platform clears to **🟡 Soft-launch / private-beta** with a small trusted donor group while §12 items roll out. Full **🟢 GO** is reasonable after another sprint on monitoring, transparency content, and the policy/legal paperwork in §6.

---

**End of report.** All findings are based on the working tree at commit `c97d0c5` (May 13). I did not run the dev server or interact with the live Supabase project; database-side findings (RLS policies, table constraints, triggers) assume the project documentation reflects reality and should be verified before remediation.
