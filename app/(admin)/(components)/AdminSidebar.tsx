'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, Newspaper, Images, Home, LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth.actions';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Children', href: '/admin/children', icon: Users },
    { name: 'Staff', href: '/admin/staff', icon: Briefcase },
    { name: 'News', href: '/admin/news', icon: Newspaper },
    { name: 'Carousels', href: '/admin/carousels', icon: Images },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-brown">Admin Panel</h1>
                <p className="text-sm text-foreground/60 mt-1">Insan Permata</p>
            </div>

            <nav className="p-4 space-y-1 flex-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive
                                    ? 'bg-brown text-white'
                                    : 'text-foreground hover:bg-off-white'
                                }
              `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200 space-y-2">
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>

                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-off-white transition-colors"
                >
                    <Home className="w-5 h-5" />
                    <span className="font-medium">Back to Website</span>
                </Link>
            </div>
        </aside>
    );
}
