import { createClient } from '@/lib/utils/supabase/server';
import { createAdminClient } from '@/lib/utils/supabase/admin';

import { Database } from '@/types/database';

export type Child = Database['public']['Tables']['children']['Row'];
export type NewChild = Database['public']['Tables']['children']['Insert'];
export type UpdateChild = Database['public']['Tables']['children']['Update'];

export async function getAllChildren() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('name');

    if (error) throw error;
    return data;
}

export async function getChildById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function createChild(child: NewChild) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('children')
        .insert(child)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateChild(id: string, child: UpdateChild) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('children')
        .update(child)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteChild(id: string) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
