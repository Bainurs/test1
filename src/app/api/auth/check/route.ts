import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/services/authService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authed = await isAuthenticated();
    return NextResponse.json({ authenticated: authed }, { status: 200 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
