'use client';

import { useState, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { validateEmail } from '@/utils/validation';
import { CheckCircleIcon } from '@/components/icons';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-primary-500 py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Stay in the Loop
        </h2>
        <p className="mt-4 text-lg text-primary-100">
          Subscribe to our newsletter for the latest company news, insights, and opportunities.
        </p>

        {success ? (
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-white">
            <CheckCircleIcon size={20} />
            <span className="font-medium">Thank you for subscribing!</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            noValidate
          >
            <div className="w-full max-w-sm">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                error={error}
                className="bg-white/95"
                aria-label="Email address"
              />
            </div>
            <Button type="submit" variant="secondary" size="md" className="shrink-0" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
