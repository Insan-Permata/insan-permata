import { createAdminClient } from '@/lib/utils/supabase/admin';

export async function uploadImage(file: File, folder: string): Promise<string> {
    const supabase = createAdminClient();
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET_NAME;

    if (!bucketName) {
        throw new Error('Bucket name not found');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
            contentType: file.type,
            upsert: false
        });

    if (uploadError) {
        throw new Error(`Error uploading image: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}
