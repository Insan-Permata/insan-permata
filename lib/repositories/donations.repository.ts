import { createClient } from '@/lib/utils/supabase/server';
import { createAdminClient } from '@/lib/utils/supabase/admin';
import { DonationRow } from '@/types/donations';

export type Donation = DonationRow;

/**
 * Fetch all donations belonging to the currently authenticated user
 * (matched by email). Returns an empty list if not signed in.
 *
 * The `donations` table has RLS that blocks all client access, so we
 * use the service-role admin client after verifying the auth session
 * server-side.
 */
export async function getMyDonations(): Promise<Donation[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return [];

    const admin = createAdminClient();
    const { data, error } = await admin
        .from('donations')
        .select('*')
        .eq('email', user.email.toLowerCase())
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as Donation[];
}

/**
 * Fetch the authenticated user's donations for a specific calendar year.
 * Used by the year-end contribution statement.
 */
export async function getMyDonationsForYear(year: number): Promise<Donation[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return [];

    const start = new Date(Date.UTC(year, 0, 1)).toISOString();
    const end = new Date(Date.UTC(year + 1, 0, 1)).toISOString();

    const admin = createAdminClient();
    const { data, error } = await admin
        .from('donations')
        .select('*')
        .eq('email', user.email.toLowerCase())
        .eq('status', 'paid')
        .gte('created_at', start)
        .lt('created_at', end)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as Donation[];
}
