import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getAllChildren } from '@/lib/repositories/children.repository';
import { deleteChildAction } from '@/lib/actions/children.actions';

export const dynamic = 'force-dynamic';

export default async function ChildrenPage() {
    const children = await getAllChildren();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Children</h1>
                    <p className="text-foreground/60 mt-1">Manage children profiles</p>
                </div>
                <Link
                    href="/admin/children/new"
                    className="flex items-center gap-2 px-4 py-2 bg-brown text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add New Child
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-foreground">Name</th>
                            <th className="px-6 py-4 font-semibold text-foreground">Date of Birth</th>
                            <th className="px-6 py-4 font-semibold text-foreground">Gender</th>
                            <th className="px-6 py-4 font-semibold text-foreground">Educational Stage</th>
                            <th className="px-6 py-4 font-semibold text-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {children.map((child) => (
                            <tr key={child.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-foreground">{child.name}</td>
                                <td className="px-6 py-4 text-foreground/80">
                                    {new Date(child.date_of_birth).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-foreground/80 capitalize">{child.gender}</td>
                                <td className="px-6 py-4 text-foreground/80 capitalize">
                                    {child.educational_stage?.replace('_', ' ') || '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/children/${child.id}/edit`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <form action={deleteChildAction.bind(null, child.id)}>
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
                        {children.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-foreground/40">
                                    No children found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
