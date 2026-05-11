-- Migration: track donor name on donations
--
-- We capture the donor's stated name at checkout (not the cardholder name)
-- because the legal donor and the card owner are frequently different
-- (spouse paying, parent paying for child, corporate card, etc.).
-- The donor-provided name is what appears on year-end tax statements.
--
-- Run this in the Supabase SQL Editor.

alter table public.donations
    add column if not exists donor_name text;
