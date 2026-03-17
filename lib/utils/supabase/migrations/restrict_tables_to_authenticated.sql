-- Migration: Restrict read access on children, staff, and news to authenticated users only
-- Previously these tables were publicly readable by anyone (no login required).
-- This migration drops the old public read policies and replaces them with
-- authenticated-only SELECT policies.

DROP POLICY IF EXISTS "Enable read access for all users" ON public.children;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.staff;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.news;

-- Only logged-in users can read
CREATE POLICY "Authenticated users can view children"
  ON public.children FOR SELECT
  USING ( auth.role() = 'authenticated' );

CREATE POLICY "Authenticated users can view staff"
  ON public.staff FOR SELECT
  USING ( auth.role() = 'authenticated' );

CREATE POLICY "Authenticated users can view news"
  ON public.news FOR SELECT
  USING ( auth.role() = 'authenticated' );
