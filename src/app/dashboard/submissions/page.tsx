'use client';

import { useEffect, useState, useCallback } from 'react';
import SubmissionsTable from '@/components/dashboard/SubmissionsTable';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  requestType: string;
  createdAt: string;
}

interface SubmissionsData {
  submissions: ContactSubmission[];
  total: number;
  page: number;
  totalPages: number;
}

export default function SubmissionsPage() {
  const [data, setData] = useState<SubmissionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
      });
      if (search) params.set('search', search);

      const res = await fetch(`/api/dashboard/submissions?${params}`);
      if (!res.ok) throw new Error('Failed to fetch submissions');
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Contact Submissions</h1>
        <p className="mt-1 text-sm text-neutral-500">
          All contact form submissions from site visitors.
          {data && data.total > 0 && (
            <span className="ml-1 font-medium text-neutral-700">
              ({data.total} total)
            </span>
          )}
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            aria-label="Search submissions"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSearch} size="md">
            Search
          </Button>
          {search && (
            <Button onClick={handleClearSearch} variant="outline" size="md">
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-8 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchSubmissions}
            className="mt-4 text-sm font-medium text-red-600 underline hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      )}

      {/* Data */}
      {!loading && !error && data && (
        <>
          <SubmissionsTable submissions={data.submissions} />

          {/* Pagination */}
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
