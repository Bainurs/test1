'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SendNewsletterPage() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    sent?: number;
    failed?: number;
    total?: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/dashboard/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subject.trim(), content: content.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ success: false, message: data.message || 'Failed to send' });
      } else {
        setResult({
          success: true,
          message: data.message,
          sent: data.sent,
          failed: data.failed,
          total: data.total,
        });
      }
    } catch {
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <button
          onClick={() => router.push('/dashboard/subscribers')}
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-primary-500 transition-colors hover:text-primary-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Subscribers
        </button>
        <h1 className="text-2xl font-bold text-neutral-900">Send Newsletter</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Compose and send an email to all newsletter subscribers.
        </p>
      </div>

      {result && (
        <div
          className={`mb-6 rounded-xl p-4 ${
            result.success
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          <p className="font-medium">{result.message}</p>
          {result.success && result.total !== undefined && (
            <p className="mt-1 text-sm opacity-80">
              Sent: {result.sent} &middot; Failed: {result.failed} &middot; Total: {result.total}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-soft sm:p-8">
          <Input
            label="Subject"
            placeholder="Enter email subject line..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <div className="mt-6 flex flex-col gap-1.5">
            <label htmlFor="newsletter-content" className="text-sm font-medium text-neutral-700">
              Content
            </label>
            <textarea
              id="newsletter-content"
              rows={12}
              placeholder="Write your newsletter content here...&#10;&#10;Each line will become a paragraph in the email."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <p className="text-xs text-neutral-400">
              Each new line will be converted to a paragraph. Empty lines create spacing.
            </p>
          </div>
        </div>

        {/* Preview */}
        {(subject.trim() || content.trim()) && (
          <div className="rounded-2xl bg-white p-6 shadow-soft sm:p-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">
              Preview
            </h3>
            <div className="rounded-xl border border-neutral-200 overflow-hidden">
              <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 px-6 py-5 text-center">
                <p className="text-lg font-bold text-white">ARMEL Group</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/60">Newsletter</p>
              </div>
              <div className="px-6 py-6">
                {subject.trim() && (
                  <h2 className="mb-4 text-xl font-bold text-neutral-900">{subject}</h2>
                )}
                <div className="space-y-3 text-sm leading-relaxed text-neutral-700">
                  {content.split('\n').map((line, i) =>
                    line.trim() === '' ? (
                      <br key={i} />
                    ) : (
                      <p key={i}>{line}</p>
                    ),
                  )}
                </div>
              </div>
              <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-4 text-center">
                <p className="text-xs text-neutral-400">350 Fifth Avenue, Suite 4200, New York, NY 10118</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading || !subject.trim() || !content.trim()}
            size="lg"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending...
              </>
            ) : (
              'Send to All Subscribers'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.push('/dashboard/subscribers')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}
