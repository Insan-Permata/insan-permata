'use client'

import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteModal from '../../(components)/DeleteModal';

export default function StaffPage() {
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; staffId: string; staffName: string }>({
        isOpen: false,
        staffId: '',
        staffName: '',
    });

    // Mock data - will be replaced with real data from Supabase
    const staff = [
        {
            id: '1',
            name: 'John Smith',
            role: 'Director',
            photoUrl: '/placeholder-staff.jpg',
        },
        {
            id: '2',
            name: 'Mary Johnson',
            role: 'House Mother',
            photoUrl: '/placeholder-staff.jpg',
        },
        {
            id: '3',
            name: 'David Lee',
            role: 'Teacher',
            photoUrl: '/placeholder-staff.jpg',
        },
    ];

    const handleDelete = (id: string, name: string) => {
        setDeleteModal({ isOpen: true, staffId: id, staffName: name });
    };

    const confirmDelete = () => {
        // TODO: Implement delete functionality
        console.log('Deleting staff:', deleteModal.staffId);
        setDeleteModal({ isOpen: false, staffId: '', staffName: '' });
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Staff</h1>
                    <p className="text-foreground/60 mt-1">Manage staff members</p>
                </div>
                <Link
                    href="/admin/staff/new"
                    className="flex items-center gap-2 bg-brown text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add New Staff
                </Link>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {staff.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                                            <span className="font-medium text-foreground">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-foreground/80">
                                        {member.role}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/staff/${member.id}/edit`}
                                                className="p-2 text-brown hover:bg-brown/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(member.id, member.name)}
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
                onClose={() => setDeleteModal({ isOpen: false, staffId: '', staffName: '' })}
                onConfirm={confirmDelete}
                itemName={deleteModal.staffName}
                itemType="Staff Member"
            />
        </div>
    );
}
