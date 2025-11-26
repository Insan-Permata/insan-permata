'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '../../../(components)/ImageUpload';

export default function NewStaffPage() {
    const router = useRouter();
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: Implement create functionality with Supabase
        const formData = new FormData(e.currentTarget);
        console.log('Form data:', Object.fromEntries(formData));
        console.log('Photo:', photoFile);

        router.push('/admin/staff');
    };

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
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
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
                    onImageChange={setPhotoFile}
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
                        className="px-6 py-2 bg-brown text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                        Create Staff Member
                    </button>
                </div>
            </form>
        </div>
    );
}
