'use server';

import { createClient } from '@/lib/utils/supabase/server';
import { getMyDonationsForYear } from '@/lib/repositories/donations.repository';
import { createStatement } from '@/lib/repositories/statements.repository';

export type GenerateStatementResult =
    | { success: true; statementId: string }
    | { success: false; error: string };

export async function generateStatement(year: number): Promise<GenerateStatementResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    const donations = await getMyDonationsForYear(year);

    if (donations.length === 0) {
        return { success: false, error: `No paid donations found for ${year}.` };
    }

    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0) / 100;
    const currency = donations[0].currency;
    const donationIds = donations.map(d => d.id);
    const donorName = donations.find(d => d.donor_name)?.donor_name ?? null;

    const { data: profile } = await supabase
        .from('users')
        .select('email')
        .eq('id', user.id)
        .single();

    const email = profile?.email ?? user.email ?? '';

    try {
        const statementId = await createStatement({
            email,
            donorName,
            year,
            donationIds,
            totalAmount,
            currency,
        });

        return { success: true, statementId };
    } catch (err) {
        console.error('[generateStatement]', err);
        return { success: false, error: 'Failed to generate statement. Please try again.' };
    }
}
