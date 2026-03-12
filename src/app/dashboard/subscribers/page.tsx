'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

interface SubscribersData {
  subscribers: Subscriber[];
  total: number;
  page: number;
  totalPages: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SubscribersPage() {
  const [data, setData] = useState<SubscribersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);

      const res = await fetch(`/api/dashboard/subscribers?${params}`);
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage newsletter subscribers and send campaigns.
            {data && data.total > 0 && (
              <span className="ml-1 font-medium text-neutral-700">
                ({data.total} total)
              </span>
            )}
          </p>
        </div>
        <Link href="/dashboard/subscribers/send">
          <Button size="sm">Send Newsletter</Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Search by email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            aria-label="Search subscribers"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSearch} size="md">Search</Button>
          {search && (
            <Button onClick={handleClearSearch} variant="outline" size="md">Clear</Button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-8 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchSubscribers}
            className="mt-4 text-sm font-medium text-red-600 underline hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {loading && !error && (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      )}

      {!loading && !error && data && (
        <>
          {data.subscribers.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-soft">
              <p className="text-neutral-500">No subscribers yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl bg-white shadow-soft">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-neutral-200 bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold text-neutral-600">#</th>
                    <th className="px-6 py-3.5 font-semibold text-neutral-600">Email</th>
                    <th className="px-6 py-3.5 font-semibold text-neutral-600">Subscribed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {data.subscribers.map((sub, i) => (
                    <tr key={sub.id} className="transition-colors hover:bg-neutral-50">
                      <td className="whitespace-nowrap px-6 py-3.5 text-neutral-400">
                        {(data.page - 1) * 20 + i + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3.5 font-medium text-neutral-900">
                        {sub.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3.5 text-neutral-500">
                        {formatDate(sub.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                Page {data.page} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
