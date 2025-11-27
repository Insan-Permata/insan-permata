import { createClient } from '@/lib/utils/supabase/server';
import { Database } from '@/types/database';

export type Carousel = Database['public']['Tables']['carousels']['Row'];
export type NewCarousel = Database['public']['Tables']['carousels']['Insert'];
export type UpdateCarousel = Database['public']['Tables']['carousels']['Update'];

export async function getAllCarousels() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('carousels')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) throw error;
    return data;
}

export async function getCarouselsByType(type: 'background' | 'story') {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('carousels')
        .select('*')
        .eq('type', type)
        .order('sort_order', { ascending: true });

    if (error) throw error;
    return data;
}

import { createAdminClient } from '@/lib/utils/supabase/admin';

export async function createCarousel(carousel: NewCarousel) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('carousels')
        .insert(carousel)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateCarousel(id: string, carousel: UpdateCarousel) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('carousels')
        .update(carousel)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteCarousel(id: string) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('carousels')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
