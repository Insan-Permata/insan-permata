'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function AdminHeader() {
    const pathname = usePathname();

    // Generate breadcrumbs from pathname
    const pathSegments = pathname.split('/').filter(Boolean);

    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);

        return { label, href, isLast: index === pathSegments.length - 1 };
    });

    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4">
            <nav className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.href} className="flex items-center gap-2">
                        {index > 0 && <ChevronRight className="w-4 h-4 text-foreground/40" />}
                        {crumb.isLast ? (
                            <span className="font-semibold text-brown">{crumb.label}</span>
                        ) : (
                            <Link
                                href={crumb.href}
                                className="text-foreground/60 hover:text-brown transition-colors"
                            >
                                {crumb.label}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
        </header>
    );
}
