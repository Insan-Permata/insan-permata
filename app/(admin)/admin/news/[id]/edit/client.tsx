'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import ImageUpload from '../../../../(components)/ImageUpload';
import DeleteModal from '../../../../(components)/DeleteModal';
import { updateNewsAction, deleteNewsAction } from '@/lib/actions/news.actions';
import { News } from '@/lib/repositories/news.repository';

export default function EditNewsClient({ article }: { article: News }) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/news"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Edit Article</h1>
                        <p className="text-foreground/60 mt-1">Update news article</p>
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
            <form action={updateNewsAction.bind(null, article.id)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                        Title <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        defaultValue={article.title}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                        placeholder="Enter article title"
                    />
                </div>

                {/* Excerpt */}
                <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-2">
                        Excerpt
                    </label>
                    <textarea
                        id="excerpt"
                        name="excerpt"
                        rows={2}
                        defaultValue={article.excerpt || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent resize-none"
                        placeholder="Brief summary of the article..."
                    />
                </div>

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
                        Content <span className="text-red-600">*</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows={12}
                        required
                        defaultValue={article.content}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent resize-none"
                        placeholder="Write your article content here..."
                    />
                </div>

                {/* Author */}
                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-foreground mb-2">
                        Author <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        required
                        defaultValue={article.author}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                        placeholder="Author name"
                    />
                </div>

                {/* Image Upload */}
                <ImageUpload
                    label="Featured Image"
                    name="image"
                    currentImage={article.image_url || undefined}
                    onImageChange={setImageFile}
                />

                {/* Form Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                    <Link
                        href="/admin/news"
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
                    deleteNewsAction(article.id);
                    setDeleteModal(false);
                }}
                itemName={article.title}
                itemType="Article"
            />
        </div>
    );
}
