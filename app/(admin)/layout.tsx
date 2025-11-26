import AdminSidebar from './(components)/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
