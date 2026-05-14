-- Migration: Webhook idempotency
-- Stripe retries webhooks on any non-2xx and occasionally double-fires.
-- Without idempotency, a single payment can end up as multiple donation rows.
--
-- Two layers:
--   1. UNIQUE on donations.stripe_session_id (already in create_donations_table.sql)
--      — catches duplicate `checkout.session.completed` deliveries.
--   2. processed_stripe_events keyed on Stripe's event.id
--      — catches any event type (invoice.paid renewals, etc.) once on first
--      successful processing; subsequent retries return early.
--
-- Run this in Supabase SQL Editor.

create table if not exists public.processed_stripe_events (
    event_id text primary key,
    event_type text not null,
    processed_at timestamptz not null default now()
);

-- We only need this table server-side; lock it down.
alter table public.processed_stripe_events enable row level security;
-- No policies — service role bypasses RLS, public has no access.

-- Defense-in-depth on the renewal path: a unique row per Stripe invoice.
-- Allows multiple NULLs (for one-time donations) under Postgres UNIQUE semantics.
alter table public.donations
    add column if not exists stripe_invoice_id text;

create unique index if not exists donations_stripe_invoice_id_unique
    on public.donations (stripe_invoice_id)
    where stripe_invoice_id is not null;
