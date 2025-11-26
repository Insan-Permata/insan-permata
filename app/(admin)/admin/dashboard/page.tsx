import { Users, Briefcase, Newspaper, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  // Mock statistics - will be replaced with real data later
  const stats = [
    { name: 'Total Children', value: '24', icon: Users, href: '/admin/children', color: 'bg-blue-500' },
    { name: 'Staff Members', value: '8', icon: Briefcase, href: '/admin/staff', color: 'bg-green-500' },
    { name: 'News Articles', value: '15', icon: Newspaper, href: '/admin/news', color: 'bg-purple-500' },
    { name: 'Total Views', value: '1,234', icon: TrendingUp, href: '#', color: 'bg-orange-500' },
  ];

  const quickActions = [
    { name: 'Add New Child', href: '/admin/children/new', color: 'bg-brown' },
    { name: 'Add Staff Member', href: '/admin/staff/new', color: 'bg-brown' },
    { name: 'Create News Article', href: '/admin/news/new', color: 'bg-brown' },
    { name: 'Manage Carousels', href: '/admin/carousels', color: 'bg-brown' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-foreground/60 mt-2">Welcome to the Insan Permata Admin Panel</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 font-medium">{stat.name}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
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