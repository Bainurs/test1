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
        try {
          const res = await fetch('/api/auth/check');
          const data = await res.json();
          if (data.authenticated) {
            router.replace('/dashboard');
            return;
          }
        } catch { /* not authenticated, stay on login */ }
        setIsReady(true);
        return;
      }

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

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
