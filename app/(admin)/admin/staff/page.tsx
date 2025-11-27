import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getAllStaff } from '@/lib/repositories/staff.repository';
import { deleteStaffAction } from '@/lib/actions/staff.actions';

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
    const staffMembers = await getAllStaff();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Staff</h1>
                    <p className="text-foreground/60 mt-1">Manage staff members</p>
                </div>
                <Link
                    href="/admin/staff/new"
                    className="flex items-center gap-2 px-4 py-2 bg-brown text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add New Staff
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-foreground">Name</th>
                            <th className="px-6 py-4 font-semibold text-foreground">Role</th>
                            <th className="px-6 py-4 font-semibold text-foreground">Description</th>
                            <th className="px-6 py-4 font-semibold text-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {staffMembers.map((staff) => (
                            <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-foreground">{staff.name}</td>
                                <td className="px-6 py-4 text-foreground/80">{staff.role}</td>
                                <td className="px-6 py-4 text-foreground/80 max-w-md truncate">{staff.description}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/staff/${staff.id}/edit`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <form action={deleteStaffAction.bind(null, staff.id)}>
                                            <button
                                                type="submit"
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {staffMembers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-foreground/40">
                                    No staff members found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
