# Legal & Tax Review — Insan Permata / Acts Ministries International

**Reviewer perspective:** CPA / attorney review of donor-facing legal pages and the
year-end contribution statement.
**Date:** 2026-05-18
**Scope reviewed:**

- `app/(public)/terms/page.tsx`
- `app/(public)/privacy/page.tsx`
- `app/(public)/refund-policy/page.tsx`
- `app/(public)/child-protection-policy/page.tsx`
- `app/(public)/support/page.tsx` (donation form + FAQ)
- `app/(public)/support/success/page.tsx`
- `lib/pdf/StatementDocument.tsx` (the IRS substantiation document)
- `lib/actions/statement.actions.ts`, `lib/repositories/donations.repository.ts`
- `app/api/stripe/webhook/route.ts`, `app/api/stripe/create-checkout-session/route.ts`

> Status: findings only. No code has been changed.

---

## 🔴 High priority — the org cannot currently honor what it promises

### 1. Refunded donations still appear on the tax statement (policy ↔ code contradiction)

- **What is promised:** Refund Policy states "If a donation is refunded, it will not
  appear on (or will be removed from) your year-end contribution statement."
  (`app/(public)/refund-policy/page.tsx:68`). Privacy reinforces that the statement is
  an accurate tax record.
- **What the code does:** The statement only pulls rows where `status = 'paid'`
  (`lib/repositories/donations.repository.ts:49`, consumed by
  `lib/actions/statement.actions.ts`). The Stripe webhook
  (`app/api/stripe/webhook/route.ts`) only handles `checkout.session.completed`,
  `invoice.paid`, and `invoice.payment_failed`. There is **no `charge.refunded` or
  `charge.dispute.closed` handler**, so a refund issued in Stripe never flips the DB
  status. The donation remains `'paid'` and **will be included on the donor's IRS
  contribution statement.**
- **Why it matters:** This produces an inaccurate IRC §170(f)(8) substantiation
  document that overstates the donor's deductible amount for a gift the charity
  returned, and it breaks a written, published policy (unfair-practices exposure).
  This is the most serious issue on the list.

---

## 🟠 Medium priority — substantiation and consistency defects

### 2. Single gifts ≥ $250 may lack a compliant contemporaneous acknowledgment

IRC §170(f)(8) requires donors of **$250+ single gifts** to hold a written
acknowledgment that (a) states the amount, (b) states whether goods/services were
provided, and (c) is obtained before filing. The compliant language ("No goods or
services were provided…", EIN) lives **only in the on-demand PDF statement**
(`lib/pdf/StatementDocument.tsx:188`), which a donor sees only if they create an
account and generate it. Checkout sets only a product `description`
(`app/api/stripe/create-checkout-session/route.ts:99`) — no `invoice_creation`, no
custom receipt text — so Stripe's default email receipt does not carry the EIN or the
no-goods-or-services statement. A one-time $250+ donor who never creates an account
therefore has no compliant acknowledgment.
**Recommendation:** automated per-gift acknowledgment email containing the required
language, or at minimum surface this gap to the organization.

### 3. Identity/contact inconsistency between the legal pages and the tax document

- All donor-facing legal pages use `info@insanpermata.org` and the brand "Insan
  Permata."
- The **contribution statement PDF** uses `info@amichurches.com` and
  `amichurches.com` (`lib/pdf/StatementDocument.tsx:107`, `131`, `206`).

The legally operative tax receipt and the policies describing it point to different
contact channels and domains. This invites donor confusion and undercuts the
carefully drafted "AMI is the donee" narrative. Choose one authoritative contact and
use it consistently, or explain the relationship on the statement.

### 4. Org address should be verified and made consistent

`1380 S. Sanderson Ave, Anaheim, CA 92806` appears in both
`app/(public)/privacy/page.tsx:150` and the PDF
(`lib/pdf/StatementDocument.tsx:106`). The address cannot be confirmed from the
codebase and looks internally inconsistent (street name not typically associated with
that city/ZIP). Because this sits on an IRS substantiation document and in the
privacy "controller" notice, verify it against AMI's IRS determination letter /
registered address and make it identical everywhere.

### 5. EIN fallback prints an invalid receipt

`const EIN = process.env.EMPLOYER_IDENTIFICATION_NUMBER ?? 'EIN Not Set'`
(`lib/pdf/StatementDocument.tsx:105`). If the env var is unset in production, the tax
document renders **"EIN: EIN Not Set"** — a non-compliant acknowledgment delivered to
a donor. Statement generation should hard-fail rather than emit a defective receipt.

### 6. International donors are invited but the privacy policy is US-only

Privacy and Terms explicitly contemplate non-US donors, and the donation form has no
geo restriction. The privacy policy addresses only CCPA/CPRA and named US state laws
— there is **no GDPR/UK-GDPR lawful basis, no international-transfer mechanism (e.g.,
SCCs), and no mention of the right to lodge a complaint with a supervisory
authority.** If EU/UK donors are knowingly accepted, add a short GDPR section or, at
minimum, a lawful-basis + transfer statement.

---

## 🟡 Low priority — wording / hedging

- **"No goods or services were provided" is stated as absolute**
  (`lib/pdf/StatementDocument.tsx:188`). Donors receive access to the private donor
  area / stories. This is almost certainly an insubstantial / intangible benefit the
  IRS disregards, so the statement is likely fine — but the org should consciously
  confirm that position. The Terms' softer "generally tax-deductible to the extent
  allowed by law" is the correct register.
- **Conduit/earmarking language is strong.** The "discretion and control," "not
  earmarked as a pass-through to a foreign organization," and "we do not direct a
  specific donation to a specific child" language across Terms §3–4, Privacy, and the
  PDF is well-drafted and materially reduces foreign-conduit deductibility risk. Do
  not dilute it.
- **Policy-change notice inconsistency:** Privacy says material changes are emailed to
  active accounts; Terms says continued use constitutes acceptance. Align the two.
- **Child Protection "donor agrees not to screenshot"**
  (`app/(public)/child-protection-policy/page.tsx:69`) is not practically
  enforceable, but acceptable as a stated expectation with the account-revocation
  remedy already noted.
- **`LAST_UPDATED` is hardcoded** on all four pages — fine now, but manual; easy to
  forget to bump on real edits, which weakens the "continued use = acceptance"
  mechanic.

---

## Suggested order of remediation

1. **Finding #1** (refund webhook + statement) — accuracy of a tax document and a
   broken written promise.
2. **Findings #3, #4, #5** — integrity of the official receipt (contact, address, EIN
   guard).
3. **Finding #2** — per-gift $250 acknowledgment.
4. **Finding #6** — GDPR coverage if non-US donors are in scope.
5. Low-priority wording cleanup.

> Note: #3 and #4 require confirmation of AMI's registered details before editing —
> these should not be guessed on a tax document.
