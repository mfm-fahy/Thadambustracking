'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Truck, MapPin, AlertCircle, Users, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: 'Vehicles',
    href: '/admin/vehicles',
    icon: <Truck className="w-5 h-5" />,
  },
  {
    label: 'Routes',
    href: '/admin/routes',
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    label: 'Alerts',
    href: '/admin/alerts',
    icon: <AlertCircle className="w-5 h-5" />,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col sticky top-0">
      {/* Logo */}
      <Link href="/admin" className="p-6 border-b border-sidebar-border flex items-center gap-2 hover:bg-sidebar-accent/10 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Truck className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <span className="font-bold text-sidebar-foreground">Thadam</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/20',
                pathname === item.href && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
              )}
            >
              {item.icon}
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-sidebar-border">
        <Link href="/">
          <Button variant="outline" className="w-full gap-2" size="sm">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
