import { createAdminClient } from '@/lib/utils/supabase/admin';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB — matches the user-facing UI hint

// PNG, JPEG, WebP, GIF magic numbers. SVG and HTML deliberately excluded
// because they can carry executable script when served from a storage bucket.
const MAGIC_NUMBERS: Array<{ mime: string; bytes: number[] }> = [
    { mime: 'image/png',  bytes: [0x89, 0x50, 0x4E, 0x47] },
    { mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] },
    { mime: 'image/gif',  bytes: [0x47, 0x49, 0x46, 0x38] },
    // WebP: "RIFF....WEBP" — RIFF at offset 0, WEBP at offset 8
    { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] },
];

async function sniffImageMime(file: File): Promise<string | null> {
    const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    for (const { mime, bytes } of MAGIC_NUMBERS) {
        if (bytes.every((b, i) => head[i] === b)) {
            if (mime === 'image/webp') {
                const tail = String.fromCharCode(head[8], head[9], head[10], head[11]);
                if (tail !== 'WEBP') continue;
            }
            return mime;
        }
    }
    return null;
}

export async function uploadImage(file: File, folder: string): Promise<string> {
    const supabase = createAdminClient();
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET_NAME;

    if (!bucketName) {
        throw new Error('Bucket name not found');
    }

    // --- Validation ---
    if (!file || file.size === 0) {
        throw new Error('File is empty');
    }
    if (file.size > MAX_FILE_BYTES) {
        throw new Error(`File is too large. Maximum size is ${(MAX_FILE_BYTES / 1024 / 1024).toFixed(0)}MB.`);
    }

    const declaredMime = (file.type || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(declaredMime)) {
        throw new Error('Unsupported file type. Please upload a JPEG, PNG, WebP, or GIF image.');
    }

    const fileExt = (file.name.split('.').pop() ?? '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(fileExt)) {
        throw new Error('Unsupported file extension. Please upload a JPEG, PNG, WebP, or GIF image.');
    }

    // Content sniff — guards against an attacker labeling SVG/HTML as image/png.
    const sniffedMime = await sniffImageMime(file);
    if (!sniffedMime || sniffedMime !== declaredMime) {
        throw new Error('File content does not match its claimed image type.');
    }

    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
            contentType: declaredMime,
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
