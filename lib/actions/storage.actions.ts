'use server'

import { getStorageStats } from '@/lib/utils/supabase/storage-stats';

export async function getStorageStatsAction() {
    try {
        const stats = await getStorageStats();
        return { success: true, data: stats };
    } catch (error: unknown) {
        console.error('Error fetching storage stats:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
