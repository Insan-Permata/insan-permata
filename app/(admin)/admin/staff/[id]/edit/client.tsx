'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import ImageUpload from '../../../../(components)/ImageUpload';
import DeleteModal from '../../../../(components)/DeleteModal';
import { updateStaffAction, deleteStaffAction } from '@/lib/actions/staff.actions';
import { Staff } from '@/lib/repositories/staff.repository';

export default function EditStaffClient({ staff }: { staff: Staff }) {
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/staff"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Edit Staff</h1>
                        <p className="text-foreground/60 mt-1">Update staff member profile</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </button>
            </div>

            {/* Form */}
            <form action={updateStaffAction.bind(null, staff.id)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
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
                        defaultValue={staff.name}
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
                        defaultValue={staff.role}
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
                        defaultValue={staff.description || ''}
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
                        defaultValue={staff.bible_verse || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent resize-none"
                        placeholder="Favorite Bible verse..."
                    />
                </div>

                {/* Photo Upload */}
                <ImageUpload
                    label="Photo"
                    name="photo"
                    currentImage={staff.photo_url || undefined}
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
                        Save Changes
                    </button>
                </div>
            </form>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={() => {
                    deleteStaffAction(staff.id);
                    setDeleteModal(false);
                }}
                itemName={staff.name}
                itemType="Staff Member"
            />
        </div>
    );
}
