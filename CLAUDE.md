# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A Next.js website for **Insan Permata** (Panti Asuhan Insan Permata), a Christian children's home/orphanage in Pekanbaru, Indonesia. Donations are processed through **Acts Ministries International (AMI)**, a U.S. 501(c)(3) nonprofit (EIN required for PDF statement generation). The site lets donors give via Stripe, manage their donor account, and download year-end tax contribution statements.

## Commands

```bash
npm run dev       # Start dev server (Next.js)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
```

There are no automated tests.

## Architecture overview

### Route groups

- `app/(public)/` — public website with shared header/footer (`HeaderComponent`, `FooterComponent`)
- `app/(admin)/` — admin dashboard with sidebar; requires `users.role = 'admin'` AND `users.status = 'active'`
- `app/api/stripe/` — Stripe checkout session creation and webhook handler
- `app/api/statement/[statementId]/download/` — streams a generated PDF to the browser
- `app/login/`, `app/welcome/`, `app/auth/callback/` — auth flows

### Data layer

All database access lives in `lib/repositories/`. These are server-only modules that call Supabase directly. Server Actions in `lib/actions/` wrap repositories and handle revalidation/redirects.

### Supabase clients — use the right one

| File | Key used | Purpose |
|---|---|---|
| `lib/utils/supabase/server.ts` | anon key + cookies | All user-scoped reads/writes (respects RLS) |
| `lib/utils/supabase/admin.ts` | service role key | Webhook handler, invite flow — bypasses RLS |
| `lib/utils/supabase/middleware.ts` | anon key | Session refresh + route protection in middleware |

Never use `createAdminClient()` in public-facing routes or server actions — it bypasses all RLS policies.

### Auth and access control

Middleware (`lib/utils/supabase/middleware.ts`) protects two classes of routes:
- `/admin/*` — redirects unauthenticated users to `/login`; redirects non-admins to `/unauthorized`
- `/our-children`, `/news`, `/meet-the-staff`, `/my-account`, `/welcome` — redirects unauthenticated users to `/unauthorized`

Admin layout (`app/(admin)/layout.tsx`) double-checks role/status server-side as an extra guard.

**Donor onboarding flow**: Stripe checkout completes → webhook (`app/api/stripe/webhook/route.ts`) records donation → calls `inviteUserByEmail` → donor receives email → `/auth/callback?next=/welcome` → donor sets password at `/welcome` → redirected to `/my-account`.

### PDF generation

`lib/pdf/StatementDocument.tsx` uses `@react-pdf/renderer` to build year-end contribution statements. `getRequiredEIN()` throws at render time if `EMPLOYER_IDENTIFICATION_NUMBER` is not set — this is intentional to prevent generating non-compliant IRS §170(f)(8) acknowledgments.

### Stripe webhook idempotency

The webhook records each processed Stripe event ID in `processed_stripe_events` before returning 200. Events `checkout.session.completed` and `invoice.paid` both upsert on their unique Stripe IDs (`stripe_session_id`, `stripe_invoice_id`) as a second line of defense against duplicate processing.

### Contribution statements

Statements are immutable once created (DB trigger prevents UPDATE/DELETE). IDs follow the format `INSANPERMATA-YEC-{year}-{000001}`. The `create_contribution_statement` Postgres function is `SECURITY DEFINER` and verifies `auth.uid()` internally.

## Key environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
EMPLOYER_IDENTIFICATION_NUMBER       # AMI's EIN — required; PDF generation hard-fails without it
NEXT_PUBLIC_TURNSTILE_SITE_KEY       # Cloudflare Turnstile (optional; skipped if unset)
TURNSTILE_SECRET_KEY                 # Cloudflare Turnstile (optional; skipped if unset)
DONATION_AMOUNT_MAX_USD              # Default: 10000
```

## Database schema (Supabase)

Core tables: `children`, `staff`, `news`, `carousels`, `donations`, `contribution_statements`, `users`, `processed_stripe_events`.

`public.users` is a shadow of `auth.users` kept in sync via triggers. It adds `role` (`admin` | `donor`) and `status` (`active` | `inactive`) columns used for access control. See `lib/utils/supabase/migrations/` for all migrations.

## Styling

Tailwind CSS v4. Brand colors: navy `#355872`, off-white/cream `#F5F5F3`, near-black `#292826`. These are used directly as Tailwind arbitrary values throughout — there is no separate design token file.
