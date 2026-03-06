'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/utils/helpers';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
}

export default function DashboardNewsPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/news');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setArticles(data.articles);
    } catch {
      /* will show empty state */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/dashboard/news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      alert('Failed to delete article.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">News Management</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {articles.length} article{articles.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/news/create')}>
          + New Article
        </Button>
      </div>

      {/* Empty state */}
      {articles.length === 0 && (
        <div className="rounded-2xl bg-white p-16 text-center shadow-soft">
          <p className="text-lg text-neutral-500">No articles yet.</p>
          <p className="mt-2 text-sm text-neutral-400">Click &quot;+ New Article&quot; to create your first news post.</p>
        </div>
      )}

      {/* Cards grid — 4 per row */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-soft transition-shadow hover:shadow-card"
          >
            {/* Image area */}
            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
              {article.imageUrl ? (
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-primary-300">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}

              {/* Hover overlay with action buttons */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => router.push(`/dashboard/news/${article.id}/edit`)}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-lg transition-transform hover:scale-105"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  disabled={deleting === article.id}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {deleting === article.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant={article.published ? 'success' : 'default'}>
                  {article.published ? 'Published' : 'Draft'}
                </Badge>
                <span className="text-xs text-neutral-400">{formatDate(article.createdAt)}</span>
              </div>
              <h3 className="line-clamp-2 text-sm font-bold text-neutral-900">{article.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{article.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
