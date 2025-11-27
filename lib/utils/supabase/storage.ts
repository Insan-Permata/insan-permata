import { createAdminClient } from '@/lib/utils/supabase/admin';

export async function uploadImage(file: File, folder: string): Promise<string> {
    const supabase = createAdminClient();
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET_NAME;

    console.log('--- Uploading Image ---');
    console.log('Bucket Name:', bucketName);
    console.log('Folder:', folder);
    console.log('File Name:', file.name);
    console.log('File Size:', file.size);

    if (!bucketName) {
        console.error('Bucket name is missing!');
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
        console.error('Supabase Upload Error:', uploadError);
        throw new Error(`Error uploading image: ${uploadError.message}`);
    }

    console.log('Upload Success:', data);

    const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

    console.log('Public URL:', publicUrlData.publicUrl);

    return publicUrlData.publicUrl;
}
