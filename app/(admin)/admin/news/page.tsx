'use client'

import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteModal from '../../(components)/DeleteModal';

export default function NewsPage() {
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; newsId: string; newsTitle: string }>({
        isOpen: false,
        newsId: '',
        newsTitle: '',
    });

    // Mock data - will be replaced with real data from Supabase
    const news = [
        {
            id: '1',
            title: 'Welcome to Our New Children',
            author: 'John Smith',
            publishedAt: '2024-11-20',
            imageUrl: '/placeholder-news.jpg',
        },
        {
            id: '2',
            title: 'Annual Charity Event Success',
            author: 'Mary Johnson',
            publishedAt: '2024-11-15',
            imageUrl: '/placeholder-news.jpg',
        },
        {
            id: '3',
            title: 'New Educational Programs',
            author: 'David Lee',
            publishedAt: '2024-11-10',
            imageUrl: '/placeholder-news.jpg',
        },
    ];

    const handleDelete = (id: string, title: string) => {
        setDeleteModal({ isOpen: true, newsId: id, newsTitle: title });
    };

    const confirmDelete = () => {
        // TODO: Implement delete functionality
        console.log('Deleting news:', deleteModal.newsId);
        setDeleteModal({ isOpen: false, newsId: '', newsTitle: '' });
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">News</h1>
                    <p className="text-foreground/60 mt-1">Manage news articles</p>
                </div>
                <Link
                    href="/admin/news/new"
                    className="flex items-center gap-2 bg-brown text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add New Article
                </Link>
            </div>

            {/* News Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Author
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Published Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {news.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-12 rounded bg-gray-200 flex-shrink-0" />
                                            <span className="font-medium text-foreground line-clamp-2">{article.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-foreground/80">
                                        {article.author}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-foreground/80">
                                        {new Date(article.publishedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/news/${article.id}/edit`}
                                                className="p-2 text-brown hover:bg-brown/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(article.id, article.title)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, newsId: '', newsTitle: '' })}
                onConfirm={confirmDelete}
                itemName={deleteModal.newsTitle}
                itemType="News Article"
            />
        </div>
    );
}
