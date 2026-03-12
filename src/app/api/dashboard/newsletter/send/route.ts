import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/services/authService';
import { getNewsletterSubscribers } from '@/services/newsletterService';
import { sendNewsletter } from '@/services/emailService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, content, recipientEmails } = body as {
      subject?: string;
      content?: string;
      recipientEmails?: string[];
    };

    if (!subject?.trim()) {
      return NextResponse.json({ message: 'Subject is required' }, { status: 400 });
    }

    if (!content?.trim()) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    let emails: string[];

    if (recipientEmails && recipientEmails.length > 0) {
      emails = recipientEmails;
    } else {
      const subscribers = await getNewsletterSubscribers();
      emails = subscribers.map((s) => s.email);
    }

    if (emails.length === 0) {
      return NextResponse.json({ message: 'No subscribers to send to' }, { status: 400 });
    }

    const htmlContent = content
      .split('\n')
      .map((line: string) => (line.trim() === '' ? '<br/>' : `<p style="margin:0 0 12px;">${line}</p>`))
      .join('');

    const result = await sendNewsletter(emails, subject.trim(), htmlContent);

    return NextResponse.json({
      success: true,
      message: `Sent to ${result.sent} of ${result.total} subscribers`,
      ...result,
    });
  } catch (error) {
    console.error('[API] Newsletter send error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
