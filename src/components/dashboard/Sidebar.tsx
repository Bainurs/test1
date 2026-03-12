'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/utils/helpers';
import {
  BarChartIcon,
  InboxIcon,
  NewspaperIcon,
  MailIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  CloseIcon,
} from '@/components/icons';

const links = [
  { href: '/dashboard', label: 'Overview', icon: BarChartIcon },
  { href: '/dashboard/submissions', label: 'Submissions', icon: InboxIcon },
  { href: '/dashboard/news', label: 'News', icon: NewspaperIcon },
  { href: '/dashboard/subscribers', label: 'Subscribers', icon: MailIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch { /* proceed */ }
    router.push('/dashboard/login');
    router.refresh();
  };

  const navContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-md bg-white px-1.5 py-0.5">
            <Image
              src="/assets/logo.webp"
              alt="ARMEL Group"
              width={80}
              height={28}
              className="h-auto w-auto object-contain"
            />
          </span>
          <span className="text-xs font-medium text-neutral-400">Dashboard</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="inline-flex items-center justify-center rounded-lg p-1.5 text-neutral-400 transition-colors hover:text-neutral-700 lg:hidden"
          aria-label="Close menu"
        >
          <CloseIcon size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Dashboard navigation">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/dashboard'
            ? pathname === href
            : pathname.startsWith(href);
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
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center border-b border-neutral-200 bg-white px-4 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-700 transition-colors hover:bg-neutral-100"
          aria-label="Open menu"
        >
          <MenuIcon size={22} />
        </button>
        <span className="ml-3 text-sm font-semibold text-neutral-800">Dashboard</span>
      </div>

      {/* Desktop sidebar — always visible */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-neutral-200 bg-white lg:flex">
        {navContent}
      </aside>

      {/* Mobile/tablet drawer overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile/tablet drawer */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-screen w-72 flex-col bg-white shadow-elevated transition-transform duration-300 ease-in-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
