'use client';

import { useEffect, useState } from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import SimpleChart from '@/components/dashboard/SimpleChart';
import {
  UsersIcon,
  EyeIcon,
  BarChartIcon,
  InboxIcon,
  MailIcon,
} from '@/components/icons';

interface MonthlyData {
  month: string;
  value: number;
}

interface AnalyticsData {
  totalVisitors: number;
  uniqueUsers: number;
  pageViews: number;
  contactSubmissions: number;
  newsletterSubscriptions: number;
  visitorsByMonth: MonthlyData[];
  pageViewsByMonth: MonthlyData[];
}

export default function DashboardOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/dashboard/analytics');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="rounded-2xl bg-red-50 p-8 text-center">
        <p className="text-red-700">{error || 'Failed to load analytics data.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm font-medium text-red-600 underline hover:text-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Real-time data from your PostgreSQL database.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard
          title="Total Visitors"
          value={analytics.totalVisitors}
          icon={<UsersIcon size={22} />}
        />
        <StatsCard
          title="Unique Users"
          value={analytics.uniqueUsers}
          icon={<EyeIcon size={22} />}
        />
        <StatsCard
          title="Page Views"
          value={analytics.pageViews}
          icon={<BarChartIcon size={22} />}
        />
        <StatsCard
          title="Contact Forms"
          value={analytics.contactSubmissions}
          icon={<InboxIcon size={22} />}
        />
        <StatsCard
          title="Newsletter Subs"
          value={analytics.newsletterSubscriptions}
          icon={<MailIcon size={22} />}
        />
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SimpleChart
          title="Visitors (Last 6 Months)"
          data={analytics.visitorsByMonth}
          color="bg-primary-500"
        />
        <SimpleChart
          title="Page Views (Last 6 Months)"
          data={analytics.pageViewsByMonth}
          color="bg-accent-500"
        />
      </div>
    </>
  );
}
