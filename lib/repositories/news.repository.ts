import { createClient } from '@/lib/utils/supabase/server';
import { Database } from '@/types/database';

export type News = Database['public']['Tables']['news']['Row'];
export type NewNews = Database['public']['Tables']['news']['Insert'];
export type UpdateNews = Database['public']['Tables']['news']['Update'];

export async function getAllNews() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getNewsById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

import { createAdminClient } from '@/lib/utils/supabase/admin';

export async function createNews(news: NewNews) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('news')
        .insert(news)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateNews(id: string, news: UpdateNews) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('news')
        .update(news)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteNews(id: string) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
