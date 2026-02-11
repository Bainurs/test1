/** Email validation regex */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Phone validation — allows +, digits, spaces, dashes, parentheses */
const PHONE_REGEX = /^[+]?[\d\s\-()]{7,20}$/;

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address';
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return 'Phone number is required';
  if (!PHONE_REGEX.test(phone)) return 'Please enter a valid phone number';
  return null;
}

export function validateName(name: string): string | null {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return `${fieldName} is required`;
  return null;
}
