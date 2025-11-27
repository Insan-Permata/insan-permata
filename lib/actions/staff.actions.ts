'use server'

import { createStaff, updateStaff, deleteStaff } from '@/lib/repositories/staff.repository';
import { uploadImage } from '@/lib/utils/supabase/storage';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createStaffAction(formData: FormData) {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const description = formData.get('description') as string;
    const bible_verse = formData.get('bible_verse') as string;
    const photoFile = formData.get('photo') as File;

    let photo_url = null;
    if (photoFile && photoFile.size > 0) {
        photo_url = await uploadImage(photoFile, 'staff');
    }

    await createStaff({
        name,
        role,
        description,
        bible_verse,
        photo_url,
    });

    revalidatePath('/admin/staff');
    redirect('/admin/staff');
}

export async function updateStaffAction(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const description = formData.get('description') as string;
    const bible_verse = formData.get('bible_verse') as string;
    const photoFile = formData.get('photo') as File;

    let photo_url = undefined;
    if (photoFile && photoFile.size > 0) {
        photo_url = await uploadImage(photoFile, 'staff');
    }

    await updateStaff(id, {
        name,
        role,
        description,
        bible_verse,
        ...(photo_url ? { photo_url } : {}),
    });

    revalidatePath('/admin/staff');
    revalidatePath(`/admin/staff/${id}/edit`);
    redirect('/admin/staff');
}

export async function deleteStaffAction(id: string) {
    await deleteStaff(id);
    revalidatePath('/admin/staff');
}
