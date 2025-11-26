import { createClient } from '@/lib/utils/supabase/server';
import { Database } from '@/types/database';

export type Staff = Database['public']['Tables']['staff']['Row'];
export type NewStaff = Database['public']['Tables']['staff']['Insert'];
export type UpdateStaff = Database['public']['Tables']['staff']['Update'];

export async function getAllStaff() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name');

    if (error) throw error;
    return data;
}

export async function getStaffById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function createStaff(staff: NewStaff) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('staff')
        .insert(staff)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateStaff(id: string, staff: UpdateStaff) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('staff')
        .update(staff)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteStaff(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
