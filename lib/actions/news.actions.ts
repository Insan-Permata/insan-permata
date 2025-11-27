'use server'

import { createNews, updateNews, deleteNews } from '@/lib/repositories/news.repository';
import { uploadImage } from '@/lib/utils/supabase/storage';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createNewsAction(formData: FormData) {
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const imageFile = formData.get('image') as File; // Note: 'image' not 'photo' for news

    let image_url = null;
    if (imageFile && imageFile.size > 0) {
        image_url = await uploadImage(imageFile, 'news');
    }

    await createNews({
        title,
        excerpt,
        content,
        author,
        image_url,
        published_at: new Date().toISOString(),
    });

    revalidatePath('/admin/news');
    redirect('/admin/news');
}

export async function updateNewsAction(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const imageFile = formData.get('image') as File;

    let image_url = undefined;
    if (imageFile && imageFile.size > 0) {
        image_url = await uploadImage(imageFile, 'news');
    }

    await updateNews(id, {
        title,
        excerpt,
        content,
        author,
        ...(image_url ? { image_url } : {}),
    });

    revalidatePath('/admin/news');
    revalidatePath(`/admin/news/${id}/edit`);
    redirect('/admin/news');
}

export async function deleteNewsAction(id: string) {
    await deleteNews(id);
    revalidatePath('/admin/news');
}
