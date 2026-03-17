/**
 * Supplementary type definitions for the `users` table.
 *
 * These types mirror the `users` table created in the
 * `create_users_table_and_rls.sql` migration.
 *
 * NOTE: Once the Supabase CLI is used to regenerate `types/database.ts`,
 * these types will be auto-generated there and this file can be removed.
 * Simply run:
 *   npx supabase gen types typescript --linked > types/database.ts
 */

export type UserRole = 'admin' | 'donor';
export type UserStatus = 'active' | 'expired' | 'suspended';

export interface UserRow {
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    credentials_expiry_date: string | null;
    last_donation_time: string | null;
    last_donation_amount: number | null;
    created_at: string;
    updated_at: string;
}

export interface UserInsert {
    id: string;
    email: string;
    role?: UserRole;
    status?: UserStatus;
    credentials_expiry_date?: string | null;
    last_donation_time?: string | null;
    last_donation_amount?: number | null;
    created_at?: string;
    updated_at?: string;
}

export interface UserUpdate {
    email?: string;
    role?: UserRole;
    status?: UserStatus;
    credentials_expiry_date?: string | null;
    last_donation_time?: string | null;
    last_donation_amount?: number | null;
    updated_at?: string;
}
