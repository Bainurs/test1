import { NextResponse } from 'next/server';
import { clearAuthSession } from '@/services/authService';

export async function POST() {
  try {
    await clearAuthSession();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[API] Auth logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
