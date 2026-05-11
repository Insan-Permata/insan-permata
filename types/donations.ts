export type DonationType = 'one_time' | 'subscription';
export type DonationStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export interface DonationRow {
    id: string;
    email: string;
    donor_name: string | null;
    amount: number;
    currency: string;
    type: DonationType;
    stripe_session_id: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    status: DonationStatus;
    created_at: string;
    updated_at: string;
}
