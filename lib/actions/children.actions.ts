'use server'

import { createChild, updateChild, deleteChild } from '@/lib/repositories/children.repository';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createChildAction(formData: FormData) {
    const name = formData.get('name') as string;
    const date_of_birth = formData.get('date_of_birth') as string;
    const gender = formData.get('gender') as 'male' | 'female';
    const educational_stage = formData.get('educational_stage') as any;
    const interestsStr = formData.get('interests') as string;
    const story = formData.get('story') as string;
    const bible_verse = formData.get('bible_verse') as string;
    const joined_date = formData.get('joined_date') as string;
    const photo_url = formData.get('photo_url') as string;

    let interests: string[] = [];
    try {
        interests = JSON.parse(interestsStr || '[]');
    } catch (e) {
        console.error('Error parsing interests:', e);
    }

    await createChild({
        name,
        date_of_birth,
        gender,
        educational_stage: educational_stage === '-' ? null : educational_stage,
        interests,
        story,
        photo_url: photo_url || null,
        joined_date: joined_date || null,
        bible_verse,
    });

    revalidatePath('/admin/children');
    redirect('/admin/children');
}

export async function updateChildAction(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const date_of_birth = formData.get('date_of_birth') as string;
    const gender = formData.get('gender') as 'male' | 'female';
    const educational_stage = formData.get('educational_stage') as any;
    const interestsStr = formData.get('interests') as string;
    const story = formData.get('story') as string;
    const bible_verse = formData.get('bible_verse') as string;
    const joined_date = formData.get('joined_date') as string;
    const photo_url = formData.get('photo_url') as string;

    let interests: string[] | undefined = undefined;
    if (interestsStr) {
        try {
            interests = JSON.parse(interestsStr);
        } catch (e) {
            console.error('Error parsing interests:', e);
        }
    }

    await updateChild(id, {
        name,
        date_of_birth,
        gender,
        educational_stage: educational_stage === '-' ? null : educational_stage,
        interests,
        story,
        bible_verse,
        ...(photo_url ? { photo_url } : {}),
        joined_date: joined_date || null,
    });

    revalidatePath('/admin/children');
    revalidatePath(`/admin/children/${id}/edit`);
    redirect('/admin/children');
}

export async function deleteChildAction(id: string) {
    await deleteChild(id);
    revalidatePath('/admin/children');
}
