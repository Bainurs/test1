import { NextRequest, NextResponse } from 'next/server';
import { getNewsBySlug } from '@/services/newsService';

export const dynamic = 'force-dynamic';

/** GET — single published article by slug (public) */
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const article = await getNewsBySlug(params.slug);
    if (!article || !article.published) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ article }, { status: 200 });
  } catch (error) {
    console.error('[API] Public news slug error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
