/* ──────────────────────────────────────────────
   Global type definitions for the ARMEL project
   ────────────────────────────────────────────── */

/** Contact form request types */
export type RequestType = 'quote' | 'inquiry' | 'career';

/** Service card displayed on the landing */
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

/** News / update card */
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  slug: string;
}

/** Navigation link */
export interface NavLink {
  label: string;
  href: string;
}

/** Monthly chart data point */
export interface MonthlyData {
  month: string;
  value: number;
}

/** API error response */
export interface ApiError {
  success: false;
  message?: string;
  errors?: { field: string; message: string }[];
}

/** API success response */
export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
}
