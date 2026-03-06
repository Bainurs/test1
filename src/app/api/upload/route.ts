import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/services/authService';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, AVIF' },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: 'File too large. Max 5 MB' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueName = `news/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Vercel Blob (production) or local filesystem (dev)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const blob = await put(uniqueName, file, {
        access: 'public',
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url }, { status: 201 });
    }

    // Local filesystem fallback
    const { writeFile, mkdir } = await import('fs/promises');
    const path = await import('path');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'news');
    await mkdir(uploadsDir, { recursive: true });
    const bytes = new Uint8Array(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, uniqueName.replace('news/', '')), bytes);
    return NextResponse.json({ url: `/uploads/news/${uniqueName.replace('news/', '')}` }, { status: 201 });
  } catch (error) {
    console.error('[API] Upload error:', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
