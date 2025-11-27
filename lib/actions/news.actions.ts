'use server'

import { createNews, updateNews, deleteNews } from '@/lib/repositories/news.repository';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createNewsAction(formData: FormData) {
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const image_url = formData.get('image_url') as string;

    await createNews({
        title,
        excerpt,
        content,
        author,
        image_url: image_url || null,
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
    const image_url = formData.get('image_url') as string;

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
