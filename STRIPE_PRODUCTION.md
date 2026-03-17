# Stripe — Going to Production

This guide covers everything you need to change when you're ready to go live with real payments.

---

## 1. Replace API Keys

In your production environment variables (e.g. Vercel dashboard, or your server's `.env`), swap the test keys for live keys:

| Variable | Test value | Production value |
|----------|-----------|-----------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (CLI) | `whsec_...` (Dashboard) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://yourdomain.com` |

> **⚠️ Never commit live keys to git.** Add `.env.local` to `.gitignore` (already done) and use your hosting platform's secret manager for production.

---

## 2. Register a Production Webhook in Stripe Dashboard

The `STRIPE_WEBHOOK_SECRET` for production does **not** come from the CLI — it comes from the Stripe Dashboard:

1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Click **Add endpoint**
3. Set the URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select these events to listen for:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click **Add endpoint**, then reveal and copy the **Signing secret** (`whsec_...`)
6. Set it as `STRIPE_WEBHOOK_SECRET` in your production environment

---

## 3. Set `NEXT_PUBLIC_SITE_URL`

The checkout session uses this to build success/cancel redirect URLs. In `.env.local` (dev) it defaults to `http://localhost:3000`. In production, add:

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 4. Activate Your Stripe Account

Before live keys work, Stripe requires you to:

1. Complete **business verification** (Stripe Dashboard → Settings → Account details)
2. Add a **bank account** for payouts
3. Complete **identity verification** if prompted

Until this is done, live keys won't process real payments.

---

## 5. Enable Stripe Test Mode Toggle (Optional but Recommended)

Consider keeping a `STRIPE_TEST_MODE=true` flag in your env to make it obvious which mode is active and to guard against accidentally using live keys in dev:

```ts
// In route.ts, you could add a safety check:
if (process.env.NODE_ENV === 'development' && !process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
  throw new Error('Do not use live Stripe keys in development!')
}
```

---

## 6. Deployment Checklist

- [ ] Live `STRIPE_SECRET_KEY` (`sk_live_...`) set in production env
- [ ] Live `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_live_...`) set in production env
- [ ] Production webhook endpoint registered in Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` from Dashboard (not CLI) set in production env
- [ ] `NEXT_PUBLIC_SITE_URL` set to your real domain
- [ ] Stripe account fully verified and bank account connected
- [ ] `donations` table migration run on production Supabase project
- [ ] Tested a real payment end-to-end on staging before going live

---

## What Does NOT Need to Change

- **No code changes required** — all keys are read from environment variables
- The `donations` table schema, RLS policies, and API route logic are identical for test and live
- The webhook handler works the same — just the signing secret differs
