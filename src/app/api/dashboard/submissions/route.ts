import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/services/authService';
import { getContacts } from '@/services/contactService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);
    const search = searchParams.get('search') ?? undefined;

    const result = await getContacts({ page, limit, search });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[API] Dashboard submissions error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
