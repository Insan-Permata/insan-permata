import { createClient } from '@/lib/utils/supabase/server';
import { UserRow, UserInsert, UserUpdate } from '@/types/users';

export type User = UserRow;
export type NewUser = UserInsert;
export type UpdateUser = UserUpdate;

/**
 * Fetch the profile of the currently authenticated user.
 */
export async function getCurrentUser(): Promise<User | null> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) return null;
    return data as User;
}

/**
 * Fetch all users. Only accessible to admin users (enforced by RLS).
 */
export async function getAllUsers(): Promise<User[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as User[];
}

/**
 * Fetch a single user by their ID. Only accessible to admin users (enforced by RLS).
 */
export async function getUserById(id: string): Promise<User> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as User;
}

/**
 * Update a user's profile (role, status, expiry, etc.).
 * Only accessible to admin users (enforced by RLS).
 */
export async function updateUser(id: string, updates: UpdateUser): Promise<User> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as User;
}
