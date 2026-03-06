import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/services/authService';
import { getNewsById, updateNews, deleteNews } from '@/services/newsService';
import { sanitize } from '@/utils/serverValidation';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: { id: string };
}

/** GET — single article by id (admin) */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const article = await getNewsById(params.id);
    if (!article) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ article }, { status: 200 });
  } catch (error) {
    console.error('[API] News get error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/** PUT — update a news article */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const title = sanitize(body.title);
      if (title.length < 3) {
        return NextResponse.json({ message: 'Title must be at least 3 characters' }, { status: 400 });
      }
      updateData.title = title;
    }

    if (body.description !== undefined) {
      const desc = typeof body.description === 'string' ? body.description.trim() : '';
      if (desc.length < 10) {
        return NextResponse.json({ message: 'Description must be at least 10 characters' }, { status: 400 });
      }
      updateData.description = desc;
    }

    if (body.imageUrl !== undefined) {
      updateData.imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '';
    }

    if (body.published !== undefined) {
      updateData.published = body.published === true;
    }

    const article = await updateNews(params.id, updateData);
    return NextResponse.json({ article }, { status: 200 });
  } catch (error) {
    console.error('[API] News update error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/** DELETE — delete a news article */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await deleteNews(params.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[API] News delete error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
