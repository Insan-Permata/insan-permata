-- Migration: Create donations table
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)

create table if not exists public.donations (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    amount integer not null,           -- in cents, e.g. 1000 = $10.00
    currency text not null default 'usd',
    type text not null check (type in ('one_time', 'subscription')),
    stripe_session_id text unique,     -- Stripe Checkout Session ID
    stripe_customer_id text,           -- Stripe Customer ID
    stripe_subscription_id text,       -- only for recurring donations
    status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Index for quick lookup by email (e.g. when creating donor accounts)
create index if not exists donations_email_idx on public.donations (email);

-- Index for stripe session ID lookups from webhooks
create index if not exists donations_stripe_session_idx on public.donations (stripe_session_id);

-- Index for subscription ID lookups (for invoice.paid renewals)
create index if not exists donations_stripe_subscription_idx on public.donations (stripe_subscription_id);

-- Trigger to keep updated_at current
create or replace function public.update_updated_at_column()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger donations_updated_at
    before update on public.donations
    for each row
    execute function public.update_updated_at_column();

-- Row Level Security: Donations contain PII — no public access.
-- Only the service role (server-side) can read/write.
alter table public.donations enable row level security;

-- No public SELECT/INSERT/UPDATE/DELETE policies.
-- All access goes through the service role client (bypasses RLS).
-- This ensures donor data (email, amount) is never exposed to the client.
