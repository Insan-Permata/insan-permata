import { Users, Briefcase, Newspaper, Images } from 'lucide-react';
import Link from 'next/link';
import { getAllChildren } from '@/lib/repositories/children.repository';
import { getAllStaff } from '@/lib/repositories/staff.repository';
import { getAllNews } from '@/lib/repositories/news.repository';
import { getAllCarousels } from '@/lib/repositories/carousels.repository';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [children, staff, news, carousels] = await Promise.all([
    getAllChildren(),
    getAllStaff(),
    getAllNews(),
    getAllCarousels(),
  ]);

  const stats = [
    {
      label: 'Total Children',
      value: children.length.toString(),
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/children'
    },
    {
      label: 'Staff Members',
      value: staff.length.toString(),
      icon: Briefcase,
      color: 'bg-green-500',
      href: '/admin/staff'
    },
    {
      label: 'News Articles',
      value: news.length.toString(),
      icon: Newspaper,
      color: 'bg-purple-500',
      href: '/admin/news'
    },
    {
      label: 'Carousel Images',
      value: carousels.length.toString(),
      icon: Images,
      color: 'bg-orange-500',
      href: '/admin/carousels'
    },
  ];

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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow block"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/60">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
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