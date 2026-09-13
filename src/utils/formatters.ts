/**
 * @file formatters.ts
 * @description Pure utility functions for string, date, and text formatting.
 */

/**
 * Format a phone number into readable format +62 81-335-335-304
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('62')) {
    const rest = cleaned.slice(2);
    return `+62 ${rest.slice(0, 2)}-${rest.slice(2, 5)}-${rest.slice(5, 8)}-${rest.slice(8)}`;
  }
  if (cleaned.startsWith('0')) {
    const rest = cleaned.slice(1);
    return `+62 ${rest.slice(0, 2)}-${rest.slice(2, 5)}-${rest.slice(5, 8)}-${rest.slice(8)}`;
  }
  return phone;
}

/**
 * Truncate long text cleanly without breaking in the middle of words.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}
