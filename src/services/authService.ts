import { cookies } from 'next/headers';

const AUTH_COOKIE = 'armel_admin_session';
const SESSION_TOKEN = 'authenticated';

/**
 * Validate admin credentials against env variables.
 * In the future, replace with a proper hashed-password check against the DB.
 */
export function validateCredentials(username: string, password: string): boolean {
  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'ArmelGroup2026!#';
  return username === validUsername && password === validPassword;
}

/** Set auth cookie (server-side) */
export async function setAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

/** Check if user is authenticated (server-side) */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE);
  return session?.value === SESSION_TOKEN;
}

/** Clear auth cookie (server-side) */
export async function clearAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}
