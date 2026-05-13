import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import AdminSidebar from './(components)/AdminSidebar';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('users')
        .select('role, status')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin' || profile.status !== 'active') {
        redirect('/unauthorized');
    }

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
