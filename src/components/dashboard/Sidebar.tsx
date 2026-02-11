'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/utils/helpers';
import {
  BarChartIcon,
  InboxIcon,
  HomeIcon,
  LogOutIcon,
} from '@/components/icons';

const links = [
  { href: '/dashboard', label: 'Overview', icon: BarChartIcon },
  { href: '/dashboard/submissions', label: 'Submissions', icon: InboxIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      /* proceed anyway */
    }
    router.push('/dashboard/login');
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-neutral-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-6">
        <span className="text-xl font-bold text-primary-500">ARMEL</span>
        <span className="text-sm font-medium text-neutral-500">Dashboard</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Dashboard navigation">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-neutral-200 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
        >
          <HomeIcon size={18} />
          Back to Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOutIcon size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
