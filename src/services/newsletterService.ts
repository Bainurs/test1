import { prisma } from '@/lib/prisma';
import type { NewsletterSubscriber } from '@prisma/client';

/** Subscribe an email to the newsletter */
export async function subscribeNewsletter(email: string): Promise<{ subscriber: NewsletterSubscriber; isNew: boolean }> {
  const normalized = email.trim().toLowerCase();

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: normalized },
  });

  if (existing) {
    return { subscriber: existing, isNew: false };
  }

  const subscriber = await prisma.newsletterSubscriber.create({
    data: { email: normalized },
  });

  return { subscriber, isNew: true };
}

/** Get total newsletter subscriber count */
export async function getNewsletterCount(): Promise<number> {
  return prisma.newsletterSubscriber.count();
}

/** Get all newsletter subscribers (for admin) */
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  return prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: 'desc' },
  });
}
