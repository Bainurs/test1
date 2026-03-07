/**
 * Server-side validation for API routes.
 * Mirrors client-side validation + additional sanitization.
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+]?[\d\s\-()]{7,20}$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\u0400-\u04FF\s'\-]+$/;
const VALID_REQUEST_TYPES = ['quote', 'inquiry', 'career'];

export interface ValidationError {
  field: string;
  message: string;
}

/** Sanitize a string — trim and remove dangerous characters */
export function sanitize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/<[^>]*>/g, '');
}

/** Validate contact form data (server-side) */
export function validateContactData(body: Record<string, unknown>): {
  errors: ValidationError[];
  data: { name: string; phone: string; email: string; requestType: string } | null;
} {
  const errors: ValidationError[] = [];

  const name = sanitize(body.name);
  const phone = sanitize(body.phone);
  const email = sanitize(body.email);
  const requestType = sanitize(body.requestType);

  if (!name || name.length < 2) {
    errors.push({ field: 'name', message: 'Name is required and must be at least 2 characters' });
  } else if (!NAME_REGEX.test(name)) {
    errors.push({ field: 'name', message: 'Name can only contain letters, spaces, hyphens and apostrophes' });
  } else if (name.length > 200) {
    errors.push({ field: 'name', message: 'Name is too long' });
  }

  const phoneDigits = phone.replace(/\D/g, '');
  if (!phone || phoneDigits.length < 7 || !PHONE_REGEX.test(phone)) {
    errors.push({ field: 'phone', message: 'A valid phone number is required' });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }
  if (email.length > 320) {
    errors.push({ field: 'email', message: 'Email is too long' });
  }

  if (!requestType || !VALID_REQUEST_TYPES.includes(requestType)) {
    errors.push({ field: 'requestType', message: 'A valid request type is required' });
  }

  if (errors.length > 0) {
    return { errors, data: null };
  }

  return {
    errors: [],
    data: { name, phone, email, requestType },
  };
}

/** Validate newsletter email (server-side) */
export function validateNewsletterEmail(body: Record<string, unknown>): {
  error: string | null;
  email: string | null;
} {
  const email = sanitize(body.email);

  if (!email || !EMAIL_REGEX.test(email)) {
    return { error: 'A valid email address is required', email: null };
  }
  if (email.length > 320) {
    return { error: 'Email is too long', email: null };
  }

  return { error: null, email };
}
