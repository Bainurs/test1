'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CreateNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim() || undefined,
          published: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to create article.');
        return;
      }

      router.push('/dashboard/news');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          &larr; Back to News
        </button>
        <h1 className="text-2xl font-bold text-neutral-900">Create New Article</h1>
        <p className="mt-1 text-sm text-neutral-500">Fill in the details below to publish a news article.</p>
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
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className="bg-green-600 px-12 hover:bg-green-700 active:bg-green-800"
            size="lg"
          >
            {loading ? 'Publishing...' : 'Publish Article'}
          </Button>
        </div>
      </form>
    </>
  );
}
