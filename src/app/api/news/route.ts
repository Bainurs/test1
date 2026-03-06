import { NextRequest, NextResponse } from 'next/server';
import { getPublishedNews } from '@/services/newsService';

export const dynamic = 'force-dynamic';

/** GET — list published news (public) */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(50, parseInt(limitParam, 10)) : undefined;

    const articles = await getPublishedNews(limit);
    return NextResponse.json({ articles }, { status: 200 });
  } catch (error) {
    console.error('[API] Public news error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
