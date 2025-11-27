import { createAdminClient } from '@/lib/utils/supabase/admin';

export interface StorageStats {
    totalBytes: number;
    totalMB: number;
    limitMB: number;
    percentageUsed: number;
    fileCount: number;
}

export async function getStorageStats(): Promise<StorageStats> {
    const supabase = createAdminClient();
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET_NAME;
    const limitMB = parseInt(process.env.STORAGE_LIMIT_MB || '500', 10);

    if (!bucketName) {
        throw new Error('Bucket name not configured');
    }

    try {
        // List all files in the bucket
        const { data: files, error } = await supabase.storage
            .from(bucketName)
            .list('', {
                limit: 10000, // Adjust if you have more files
                sortBy: { column: 'name', order: 'asc' }
            });

        if (error) {
            throw new Error(`Error fetching storage files: ${error.message}`);
        }

        // Recursively get all files from all folders
        const allFiles: any[] = [];
        const folders = ['children', 'staff', 'news', 'carousels'];

        for (const folder of folders) {
            const { data: folderFiles, error: folderError } = await supabase.storage
                .from(bucketName)
                .list(folder, {
                    limit: 10000,
                    sortBy: { column: 'name', order: 'asc' }
                });

            if (!folderError && folderFiles) {
                allFiles.push(...folderFiles);
            }
        }

        // Calculate total size
        const totalBytes = allFiles.reduce((sum, file) => {
            return sum + (file.metadata?.size || 0);
        }, 0);

        const totalMB = totalBytes / (1024 * 1024);
        const percentageUsed = (totalMB / limitMB) * 100;

        return {
            totalBytes,
            totalMB: parseFloat(totalMB.toFixed(2)),
            limitMB,
            percentageUsed: parseFloat(percentageUsed.toFixed(2)),
            fileCount: allFiles.length
        };
    } catch (error: any) {
        console.error('Error calculating storage stats:', error);
        throw error;
    }
}
