import { createClient } from '@/lib/utils/supabase/server';

export type ContributionStatement = {
    id: string;
    user_id: string;
    email: string;
    donor_name: string | null;
    year: number;
    donation_ids: string[];
    total_amount: number; // in dollars (e.g. 481.00)
    currency: string;
    generated_at: string;
};

export async function getMyStatements(): Promise<ContributionStatement[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('contribution_statements')
        .select('*')
        .order('generated_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as ContributionStatement[];
}

export async function getMyStatementsByYear(year: number): Promise<ContributionStatement[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('contribution_statements')
        .select('*')
        .eq('year', year)
        .order('generated_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as ContributionStatement[];
}

export async function createStatement(params: {
    email: string;
    donorName: string | null;
    year: number;
    donationIds: string[];
    totalAmount: number;
    currency: string;
}): Promise<string> {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('create_contribution_statement', {
        p_email: params.email,
        p_donor_name: params.donorName,
        p_year: params.year,
        p_donation_ids: params.donationIds,
        p_total_amount: params.totalAmount,
        p_currency: params.currency,
    });

    if (error) throw error;
    return data as string;
}
