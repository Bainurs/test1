'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid credentials. Please try again.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            <span className="text-primary-500">ARMEL</span> Admin
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Sign in to access the dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            label="Username"
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
