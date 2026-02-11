import { NextRequest, NextResponse } from 'next/server';
import { createContact } from '@/services/contactService';
import { trackEvent } from '@/services/analyticsService';
import { validateContactData } from '@/utils/serverValidation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { errors, data } = validateContactData(body);

    if (errors.length > 0 || !data) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 },
      );
    }

    const submission = await createContact(data);

    // Track analytics event
    await trackEvent({
      event: 'form_submit',
      page: '/contact',
      metadata: { requestType: data.requestType },
    }).catch(() => {
      /* non-critical — don't fail the request */
    });

    return NextResponse.json(
      { success: true, submission: { id: submission.id } },
      { status: 201 },
    );
  } catch (error) {
    console.error('[API] Contact submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
