'use server'

import { getStorageStats } from '@/lib/utils/supabase/storage-stats';

export async function getStorageStatsAction() {
    try {
        const stats = await getStorageStats();
        return { success: true, data: stats };
    } catch (error: any) {
        console.error('Error fetching storage stats:', error);
        return { success: false, error: error.message };
    }
}
