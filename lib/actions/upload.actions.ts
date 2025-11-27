'use server'

import { uploadImage } from '@/lib/utils/supabase/storage';

export async function uploadImageAction(formData: FormData) {
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;

    if (!file || !folder) {
        throw new Error('File and folder are required');
    }

    try {
        const publicUrl = await uploadImage(file, folder);
        return { success: true, url: publicUrl };
    } catch (error: any) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
    }
}
