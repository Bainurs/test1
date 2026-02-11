/** Generate a unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/** Format a date string to a human-readable format */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Smooth scroll to element by id */
export function scrollToElement(id: string): void {
  const el = document.getElementById(id.replace('#', ''));
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/** Classname merge helper (simple version) */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
