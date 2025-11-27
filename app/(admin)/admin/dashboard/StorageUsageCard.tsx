'use client'

import { Database, HardDrive, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getStorageStatsAction } from '@/lib/actions/storage.actions';

interface StorageStats {
    totalBytes: number;
    totalMB: number;
    limitMB: number;
    percentageUsed: number;
    fileCount: number;
}

export default function StorageUsageCard() {
    const [stats, setStats] = useState<StorageStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const result = await getStorageStatsAction();
                if (result.success && result.data) {
                    setStats(result.data);
                } else {
                    setError(result.error || 'Failed to fetch storage stats');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                        <Database className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Storage Usage</h3>
                        <p className="text-sm text-foreground/60">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                        <Database className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Storage Usage</h3>
                        <p className="text-sm text-red-600">Error loading stats</p>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusColor = () => {
        if (stats.percentageUsed >= 90) return 'red';
        if (stats.percentageUsed >= 70) return 'yellow';
        return 'green';
    };

    const statusColor = getStatusColor();
    const isWarning = stats.percentageUsed >= 90;
    const isCaution = stats.percentageUsed >= 70 && stats.percentageUsed < 90;

    const colorClasses = {
        red: {
            bg: 'bg-red-100',
            icon: 'text-red-600',
            progress: 'bg-red-600',
            text: 'text-red-600'
        },
        yellow: {
            bg: 'bg-yellow-100',
            icon: 'text-yellow-600',
            progress: 'bg-yellow-600',
            text: 'text-yellow-600'
        },
        green: {
            bg: 'bg-green-100',
            icon: 'text-green-600',
            progress: 'bg-green-600',
            text: 'text-green-600'
        }
    };

    const colors = colorClasses[statusColor];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 ${colors.bg} rounded-lg`}>
                    <HardDrive className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Storage Usage</h3>
                    <p className="text-sm text-foreground/60">
                        {stats.totalMB.toFixed(2)} MB / {stats.limitMB} MB
                    </p>
                </div>
                <div className={`text-2xl font-bold ${colors.text}`}>
                    {stats.percentageUsed.toFixed(1)}%
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full ${colors.progress} transition-all duration-300`}
                        style={{ width: `${Math.min(stats.percentageUsed, 100)}%` }}
                    />
                </div>
            </div>

            {/* File Count */}
            <div className="text-sm text-foreground/60 mb-3">
                {stats.fileCount} file{stats.fileCount !== 1 ? 's' : ''} stored
            </div>

            {/* Warning Messages */}
            {isWarning && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-red-900 mb-1">
                            Storage Limit Almost Reached!
                        </p>
                        <p className="text-sm text-red-700">
                            You are using over 90% of your storage capacity. Please contact the developer to increase your storage limit or clean up unused files.
                        </p>
                    </div>
                </div>
            )}

            {isCaution && !isWarning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-yellow-900 mb-1">
                            Storage Usage High
                        </p>
                        <p className="text-sm text-yellow-700">
                            You are using over 70% of your storage capacity. Consider monitoring your usage closely.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
