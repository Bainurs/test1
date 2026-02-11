'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  const isLoginPage = pathname === '/dashboard/login';

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoginPage) {
        // On login page, check if already authenticated
        try {
          const res = await fetch('/api/auth/check');
          const data = await res.json();
          if (data.authenticated) {
            router.replace('/dashboard');
            return;
          }
        } catch {
          /* not authenticated, stay on login */
        }
        setIsReady(true);
        return;
      }

      // Protected routes — check auth
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/dashboard/login');
          return;
        }
      } catch {
        router.replace('/dashboard/login');
        return;
      }

      setIsReady(true);
    };

    checkAuth();
  }, [router, isLoginPage, pathname]);

  /* Show loading spinner while checking auth */
  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  /* Login page has its own layout */
  if (isLoginPage) {
    return <>{children}</>;
  }

  /* Authenticated dashboard layout */
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
