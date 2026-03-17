-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('admin', 'donor');
CREATE TYPE user_status AS ENUM ('active', 'expired', 'suspended');

-- 2. Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role DEFAULT 'donor' NOT NULL,
  status user_status DEFAULT 'active' NOT NULL,
  credentials_expiry_date TIMESTAMP WITH TIME ZONE,
  last_donation_time TIMESTAMP WITH TIME ZONE,
  last_donation_amount NUMERIC(15, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an active admin.
-- SECURITY DEFINER means it runs with the function owner's privileges,
-- bypassing RLS on the users table to avoid infinite recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
      AND role = 'admin'
      AND status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
USING ( auth.uid() = id );

-- Admins have full access on the users table (uses the helper to avoid recursion)
CREATE POLICY "Admins have full access on users"
ON public.users
FOR ALL
USING ( public.is_admin() );

-- 4. Auto-sync trigger from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    'donor', -- default to donor; promote to admin manually if needed
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Replace overly broad policies with role-based admin policies.
-- The previous migration (public_read_policies.sql) granted ALL authenticated users
-- full write access. Drop those before adding proper role-based policies.

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.news;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.children;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.staff;

-- For news (admin only mutations)
CREATE POLICY "Admins can insert news" ON public.news FOR INSERT WITH CHECK ( public.is_admin() );
CREATE POLICY "Admins can update news" ON public.news FOR UPDATE USING ( public.is_admin() );
CREATE POLICY "Admins can delete news" ON public.news FOR DELETE USING ( public.is_admin() );

-- For children (admin only mutations)
CREATE POLICY "Admins can insert children" ON public.children FOR INSERT WITH CHECK ( public.is_admin() );
CREATE POLICY "Admins can update children" ON public.children FOR UPDATE USING ( public.is_admin() );
CREATE POLICY "Admins can delete children" ON public.children FOR DELETE USING ( public.is_admin() );

-- For staff (admin only mutations)
CREATE POLICY "Admins can insert staff" ON public.staff FOR INSERT WITH CHECK ( public.is_admin() );
CREATE POLICY "Admins can update staff" ON public.staff FOR UPDATE USING ( public.is_admin() );
CREATE POLICY "Admins can delete staff" ON public.staff FOR DELETE USING ( public.is_admin() );
