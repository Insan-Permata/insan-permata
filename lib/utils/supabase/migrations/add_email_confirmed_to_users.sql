-- Migration: track email confirmation status on public.users
--
-- The Stripe webhook invites donors who don't already have an account.
-- We need to distinguish "invited but never accepted" from "confirmed"
-- so we don't tell unconfirmed donors to sign in (they can't yet).
--
-- Run this in the Supabase SQL Editor.

alter table public.users
    add column if not exists email_confirmed_at timestamptz;

-- Update the new-user trigger to copy email_confirmed_at on creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, role, status, email_confirmed_at)
    values (
        new.id,
        new.email,
        'donor',
        'active',
        new.email_confirmed_at
    );
    return new;
end;
$$ language plpgsql security definer;

-- Sync subsequent confirmation events (user accepts invite, etc.)
create or replace function public.handle_user_email_confirmed()
returns trigger as $$
begin
    update public.users
        set email_confirmed_at = new.email_confirmed_at
        where id = new.id;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_email_confirmed on auth.users;
create trigger on_auth_user_email_confirmed
    after update of email_confirmed_at on auth.users
    for each row
    when (old.email_confirmed_at is distinct from new.email_confirmed_at)
    execute function public.handle_user_email_confirmed();

-- Backfill existing rows from auth.users
update public.users u
    set email_confirmed_at = au.email_confirmed_at
    from auth.users au
    where u.id = au.id
      and u.email_confirmed_at is distinct from au.email_confirmed_at;
