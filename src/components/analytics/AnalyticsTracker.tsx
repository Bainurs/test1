'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Client-side analytics tracker.
 * Sends page_view and visit events to the API.
 * Uses a stable visitor ID stored in localStorage.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const visitTracked = useRef(false);

  // Get or create a persistent visitor ID
  const getVisitorId = (): string => {
    const key = 'armel_visitor_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem(key, id);
    }
    return id;
  };

  // Track initial visit (once per session)
  useEffect(() => {
    if (visitTracked.current) return;
    visitTracked.current = true;

    try {
      const visitorId = getVisitorId();
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'visit', page: pathname, visitorId }),
      }).catch(() => {});
    } catch {
      /* analytics should never break the app */
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track page views on route changes
  useEffect(() => {
    try {
      const visitorId = getVisitorId();
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'page_view', page: pathname, visitorId }),
      }).catch(() => {});
    } catch {
      /* non-critical */
    }
  }, [pathname]);

  return null;
}
