import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/services/authService';
import { getAnalyticsOverview } from '@/services/analyticsService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const analytics = await getAnalyticsOverview();
    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('[API] Dashboard analytics error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
