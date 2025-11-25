'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    const pathname = usePathname();

    let breadcrumbs: BreadcrumbItem[] = [];

    if (items) {
        breadcrumbs = items;
    } else {
        // Default generation logic
        const paths = pathname.split('/').filter((path) => path);

        breadcrumbs = [
            { label: 'Home', href: '/' },
            ...paths.map((path, index) => {
                const href = `/${paths.slice(0, index + 1).join('/')}`;
                // Convert kebab-case to Title Case (e.g., our-children -> Our Children)
                const label = path
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                return { label, href };
            }),
        ];
    }

    // Don't render on home page if generated automatically
    if (!items && pathname === '/') {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb" className="w-full bg-off-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-3">
                <ol className="flex items-center space-x-2">
                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return (
                            <li key={item.href} className="flex items-center">
                                {index > 0 && (
                                    <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                                )}

                                {index === 0 && item.label === 'Home' ? (
                                    <Link
                                        href={item.href}
                                        className="text-gray-500 hover:text-brown transition-colors flex items-center"
                                    >
                                        <Home className="w-4 h-4" />
                                        <span className="sr-only">Home</span>
                                    </Link>
                                ) : isLast ? (
                                    <span className="text-brown font-medium" aria-current="page">
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="text-gray-500 hover:text-brown transition-colors font-medium"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
}
