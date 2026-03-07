const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const PHONE_REGEX = /^[+]?[\d\s\-()]{7,20}$/;

const NAME_REGEX = /^[a-zA-ZÀ-ÿ\u0400-\u04FF\s'\-]+$/;

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address';
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return 'Phone number is required';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return 'Phone number is too short';
  if (!PHONE_REGEX.test(phone.trim())) return 'Please enter a valid phone number';
  return null;
}

export function validateName(name: string): string | null {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (!NAME_REGEX.test(name.trim())) return 'Name can only contain letters, spaces, hyphens and apostrophes';
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return `${fieldName} is required`;
  return null;
}
