import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletter } from '@/services/newsletterService';
import { trackEvent } from '@/services/analyticsService';
import { validateNewsletterEmail } from '@/utils/serverValidation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { error, email } = validateNewsletterEmail(body);

    if (error || !email) {
      return NextResponse.json(
        { success: false, message: error },
        { status: 400 },
      );
    }

    const { subscriber, isNew } = await subscribeNewsletter(email);

    if (isNew) {
      await trackEvent({
        event: 'newsletter_sub',
        metadata: { email: subscriber.email },
      }).catch(() => {});
    }

    return NextResponse.json(
      {
        success: true,
        message: isNew ? 'Successfully subscribed!' : 'You are already subscribed.',
        isNew,
      },
      { status: isNew ? 201 : 200 },
    );
  } catch (error) {
    console.error('[API] Newsletter error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
