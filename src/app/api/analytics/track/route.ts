import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/services/analyticsService';
import type { EventType } from '@/services/analyticsService';

const VALID_EVENTS: EventType[] = ['page_view', 'visit'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = body.event as EventType;
    const page = typeof body.page === 'string' ? body.page : undefined;
    const visitorId = typeof body.visitorId === 'string' ? body.visitorId : undefined;

    if (!event || !VALID_EVENTS.includes(event)) {
      return NextResponse.json(
        { success: false, message: 'Invalid event type' },
        { status: 400 },
      );
    }

    await trackEvent({ event, page, visitorId });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('[API] Analytics track error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
