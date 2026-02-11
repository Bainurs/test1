import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, setAuthSession } from '@/services/authService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 },
      );
    }

    if (!validateCredentials(username, password)) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 },
      );
    }

    await setAuthSession();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[API] Auth login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
