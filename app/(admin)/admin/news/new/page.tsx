'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '../../../(components)/ImageUpload';
import { createNewsAction } from '@/lib/actions/news.actions';

export default function NewNewsPage() {
    const [isUploading, setIsUploading] = useState(false);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/news"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Add New Article</h1>
                    <p className="text-foreground/60 mt-1">Create a new news article</p>
                </div>
            </div>

            {/* Form */}
            <form action={createNewsAction} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                        placeholder="Author name"
                    />
                </div>

                {/* Image Upload */}
                <ImageUpload
                    label="Featured Image"
                    name="image_url"
                    folder="news"
                    onUploadStatusChange={setIsUploading}
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
                        disabled={isUploading}
                        className={`px-6 py-2 bg-brown text-white rounded-lg hover:opacity-90 transition-opacity font-medium ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUploading ? 'Uploading Image...' : 'Publish Article'}
                    </button>
                </div>
            </form>
        </div>
    );
}
