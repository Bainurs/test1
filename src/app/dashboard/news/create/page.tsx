'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CreateNewsPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const uploadImage = async (): Promise<string | undefined> => {
    if (!imageFile) return undefined;
    const formData = new FormData();
    formData.append('file', imageFile);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Image upload failed');
    }
    const data = await res.json();
    return data.url;
  };

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
      const imageUrl = await uploadImage();

      const res = await fetch('/api/dashboard/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          imageUrl,
          published: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to create article.');
        return;
      }

      router.push('/dashboard/news');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
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

          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Cover Image <span className="text-neutral-400">(optional)</span>
            </label>

            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl border border-neutral-200">
                <div className="relative aspect-[16/9] w-full bg-neutral-100">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-2">
                  <span className="truncate text-sm text-neutral-600">{imageFile?.name}</span>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="shrink-0 text-sm font-medium text-red-500 transition-colors hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-neutral-500 transition-colors hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-sm font-medium">Click to select an image</span>
                <span className="text-xs text-neutral-400">JPEG, PNG, WebP, GIF — max 5 MB</span>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

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
