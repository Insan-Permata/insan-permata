import Link from 'next/link';
import StorageUsageCard from './StorageUsageCard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {

  const quickActions = [
    { name: 'Add New Child', href: '/admin/children/new', color: 'bg-brown' },
    { name: 'Add Staff Member', href: '/admin/staff/new', color: 'bg-brown' },
    { name: 'Create News Article', href: '/admin/news/new', color: 'bg-brown' },
    { name: 'Manage Carousels', href: '/admin/carousels', color: 'bg-brown' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-foreground/60 mt-1">Welcome to Insan Permata admin panel</p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`${action.color} text-white rounded-lg p-4 text-center font-semibold hover:opacity-90 transition-opacity`}
            >
              {action.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Storage Usage */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Storage Monitor</h2>
        <StorageUsageCard />
      </div>

      {/* Recent Activity - Placeholder */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-foreground/60 text-center py-8">
            Activity feed coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}