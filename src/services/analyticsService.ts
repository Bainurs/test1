import { prisma } from '@/lib/prisma';

export type EventType = 'page_view' | 'visit' | 'form_submit' | 'newsletter_sub';

export interface TrackEventInput {
  event: EventType;
  page?: string;
  visitorId?: string;
  metadata?: Record<string, unknown>;
}

/** Track an analytics event */
export async function trackEvent(data: TrackEventInput): Promise<void> {
  await prisma.analyticsEvent.create({
    data: {
      event: data.event,
      page: data.page ?? null,
      visitorId: data.visitorId ?? null,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    },
  });
}

/** Get overview analytics for the dashboard */
export async function getAnalyticsOverview() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalPageViews,
    totalVisits,
    uniqueVisitors,
    contactCount,
    newsletterCount,
    monthlyPageViews,
    monthlyVisitors,
  ] = await Promise.all([
    // Total page views
    prisma.analyticsEvent.count({
      where: { event: 'page_view' },
    }),

    // Total visits
    prisma.analyticsEvent.count({
      where: { event: 'visit' },
    }),

    // Unique visitors (distinct visitorId)
    prisma.analyticsEvent.groupBy({
      by: ['visitorId'],
      where: {
        event: 'visit',
        visitorId: { not: null },
      },
    }).then((groups) => groups.length),

    // Contact form submissions
    prisma.contactSubmission.count(),

    // Newsletter subscribers
    prisma.newsletterSubscriber.count(),

    // Monthly page views for last 6 months
    getMonthlyEventCounts('page_view', sixMonthsAgo),

    // Monthly visitors for last 6 months
    getMonthlyVisitorCounts(sixMonthsAgo),
  ]);

  return {
    totalVisitors: totalVisits,
    uniqueUsers: uniqueVisitors,
    pageViews: totalPageViews,
    contactSubmissions: contactCount,
    newsletterSubscriptions: newsletterCount,
    visitorsByMonth: monthlyVisitors,
    pageViewsByMonth: monthlyPageViews,
  };
}

/** Helper: get event counts grouped by month */
async function getMonthlyEventCounts(event: string, since: Date) {
  const events = await prisma.analyticsEvent.findMany({
    where: {
      event,
      createdAt: { gte: since },
    },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  return aggregateByMonth(events.map((e) => e.createdAt));
}

/** Helper: get unique visitor counts grouped by month */
async function getMonthlyVisitorCounts(since: Date) {
  const events = await prisma.analyticsEvent.findMany({
    where: {
      event: 'visit',
      createdAt: { gte: since },
      visitorId: { not: null },
    },
    select: { createdAt: true, visitorId: true },
    orderBy: { createdAt: 'asc' },
  });

  // Group by month, count unique visitors per month
  const monthMap = new Map<string, Set<string>>();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (const e of events) {
    const key = `${e.createdAt.getFullYear()}-${e.createdAt.getMonth()}`;
    if (!monthMap.has(key)) monthMap.set(key, new Set());
    if (e.visitorId) monthMap.get(key)!.add(e.visitorId);
  }

  // Fill last 6 months
  const result: { month: string; value: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    result.push({
      month: monthNames[d.getMonth()],
      value: monthMap.get(key)?.size ?? 0,
    });
  }

  return result;
}

/** Aggregate dates into month buckets for the last 6 months */
function aggregateByMonth(dates: Date[]) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const countMap = new Map<string, number>();

  for (const date of dates) {
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    countMap.set(key, (countMap.get(key) ?? 0) + 1);
  }

  const result: { month: string; value: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    result.push({
      month: monthNames[d.getMonth()],
      value: countMap.get(key) ?? 0,
    });
  }

  return result;
}
