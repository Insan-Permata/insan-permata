'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '../../../(components)/ImageUpload';
import { createStaffAction } from '@/lib/actions/staff.actions';

export default function NewStaffPage() {
    const [isUploading, setIsUploading] = useState(false);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/staff"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Add New Staff</h1>
                    <p className="text-foreground/60 mt-1">Create a new staff member profile</p>
                </div>
            </div>

            {/* Form */}
            <form action={createStaffAction} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                        placeholder="Enter staff member's name"
                    />
                </div>

                {/* Role */}
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                        Role <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                        placeholder="e.g., Director, Teacher, House Mother"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent resize-none"
                        placeholder="Tell us about this staff member..."
                    />
                </div>

                {/* Bible Verse */}
                <div>
                    <label htmlFor="bible_verse" className="block text-sm font-medium text-foreground mb-2">
                        Bible Verse
                    </label>
                    <textarea
                        id="bible_verse"
                        name="bible_verse"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent resize-none"
                        placeholder="Favorite Bible verse..."
                    />
                </div>

                {/* Photo Upload */}
                <ImageUpload
                    label="Photo"
                    name="photo_url"
                    folder="staff"
                    onUploadStatusChange={setIsUploading}
                />

                {/* Form Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                    <Link
                        href="/admin/staff"
                        className="px-6 py-2 border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`px-6 py-2 bg-brown text-white rounded-lg hover:opacity-90 transition-opacity font-medium ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUploading ? 'Uploading Image...' : 'Create Staff'}
                    </button>
                </div>
            </form>
        </div>
    );
}
