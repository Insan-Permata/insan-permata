'use server'

import { createCarousel, deleteCarousel } from '@/lib/repositories/carousels.repository';
import { uploadImage } from '@/lib/utils/supabase/storage';
import { revalidatePath } from 'next/cache';

export async function createCarouselAction(formData: FormData) {
    const type = formData.get('type') as 'background' | 'story';
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) return;

    // Upload all images
    const uploadPromises = files.map(async (file) => {
        if (file.size > 0) {
            const image_url = await uploadImage(file, 'carousels');
            return createCarousel({
                image_url,
                type,
                sort_order: 0,
            });
        }
    });

    await Promise.all(uploadPromises);

    revalidatePath('/admin/carousels');
}

export async function deleteCarouselAction(id: string) {
    await deleteCarousel(id);
    revalidatePath('/admin/carousels');
}
