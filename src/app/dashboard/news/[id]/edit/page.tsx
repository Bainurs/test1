'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  published: boolean;
}

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/dashboard/news/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        const article: NewsArticle = data.article;
        setTitle(article.title);
        setDescription(article.description);
        setImageUrl(article.imageUrl || '');
        setPublished(article.published);
      } catch {
        setError('Article not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters.');
      return;
    }
    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim() || undefined,
          published,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to update article.');
        return;
      }

      router.push('/dashboard/news');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="rounded-2xl bg-red-50 p-8 text-center">
        <p className="text-red-700">{error}</p>
        <button onClick={() => router.back()} className="mt-4 text-sm font-medium text-red-600 underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          &larr; Back to News
        </button>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Article</h1>
        <p className="mt-1 text-sm text-neutral-500">Update the article details below.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-soft"
        noValidate
      >
        <div className="space-y-6">
          <Input
            label="Title"
            placeholder="Enter article headline..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            label="Image URL"
            placeholder="https://example.com/image.jpg (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-neutral-700">
              Article Content
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your article content here..."
              rows={12}
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-600 peer-checked:after:translate-x-full" />
            </label>
            <span className="text-sm font-medium text-neutral-700">
              {published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            type="submit"
            disabled={saving}
            className="bg-green-600 px-12 hover:bg-green-700 active:bg-green-800"
            size="lg"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </>
  );
}
