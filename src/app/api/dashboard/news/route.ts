import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/services/authService';
import { getAllNews, createNews } from '@/services/newsService';
import { sanitize } from '@/utils/serverValidation';

export const dynamic = 'force-dynamic';

/** GET — list all news articles (admin) */
export async function GET() {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const articles = await getAllNews();
    return NextResponse.json({ articles }, { status: 200 });
  } catch (error) {
    console.error('[API] News list error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/** POST — create a new news article */
export async function POST(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const title = sanitize(body.title);
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '';
    const published = body.published === true;

    if (!title || title.length < 3) {
      return NextResponse.json({ message: 'Title must be at least 3 characters' }, { status: 400 });
    }
    if (!description || description.length < 10) {
      return NextResponse.json({ message: 'Description must be at least 10 characters' }, { status: 400 });
    }

    const article = await createNews({ title, description, imageUrl, published });
    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error('[API] News create error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
