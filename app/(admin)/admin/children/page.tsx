'use client'

import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteModal from '../../(components)/DeleteModal';

export default function ChildrenPage() {
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; childId: string; childName: string }>({
        isOpen: false,
        childId: '',
        childName: '',
    });

    // Mock data - will be replaced with real data from Supabase
    const children = [
        {
            id: '1',
            name: 'Sarah Johnson',
            ageRange: '6-8 years',
            gender: 'Female',
            educationalStage: 'Elementary',
            photoUrl: '/placeholder-child.jpg',
        },
        {
            id: '2',
            name: 'Michael Chen',
            ageRange: '3-5 years',
            gender: 'Male',
            educationalStage: 'Kindergarten',
            photoUrl: '/placeholder-child.jpg',
        },
        {
            id: '3',
            name: 'Emma Rodriguez',
            ageRange: '6-8 years',
            gender: 'Female',
            educationalStage: 'Elementary',
            photoUrl: '/placeholder-child.jpg',
        },
    ];

    const handleDelete = (id: string, name: string) => {
        setDeleteModal({ isOpen: true, childId: id, childName: name });
    };

    const confirmDelete = () => {
        // TODO: Implement delete functionality
        console.log('Deleting child:', deleteModal.childId);
        setDeleteModal({ isOpen: false, childId: '', childName: '' });
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Children</h1>
                    <p className="text-foreground/60 mt-1">Manage children profiles</p>
                </div>
                <Link
                    href="/admin/children/new"
                    className="flex items-center gap-2 bg-brown text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add New Child
                </Link>
            </div>

            {/* Children Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Age Range
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Gender
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Educational Stage
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {children.map((child) => (
                                <tr key={child.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                                            <span className="font-medium text-foreground">{child.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-foreground/80">
                                        {child.ageRange}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-foreground/80">
                                        {child.gender}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-foreground/80">
                                        {child.educationalStage}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/children/${child.id}/edit`}
                                                className="p-2 text-brown hover:bg-brown/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(child.id, child.name)}
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
                onClose={() => setDeleteModal({ isOpen: false, childId: '', childName: '' })}
                onConfirm={confirmDelete}
                itemName={deleteModal.childName}
                itemType="Child"
            />
        </div>
    );
}
