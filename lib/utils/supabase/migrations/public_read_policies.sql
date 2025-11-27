-- Policies for Children Table
-- Allow everyone (public) to view children
CREATE POLICY "Enable read access for all users" ON "public"."children"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Allow authenticated users (admins) to do everything
CREATE POLICY "Enable all access for authenticated users" ON "public"."children"
AS PERMISSIVE FOR ALL
TO authenticated
USING (true);


-- Policies for Staff Table
-- Allow everyone (public) to view staff
CREATE POLICY "Enable read access for all users" ON "public"."staff"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Allow authenticated users (admins) to do everything
CREATE POLICY "Enable all access for authenticated users" ON "public"."staff"
AS PERMISSIVE FOR ALL
TO authenticated
USING (true);


-- Policies for News Table
-- Allow everyone (public) to view news
CREATE POLICY "Enable read access for all users" ON "public"."news"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Allow authenticated users (admins) to do everything
CREATE POLICY "Enable all access for authenticated users" ON "public"."news"
AS PERMISSIVE FOR ALL
TO authenticated
USING (true);
