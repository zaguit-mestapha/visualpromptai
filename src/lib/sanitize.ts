/**
 * Strip HTML tags from a string to prevent XSS.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Sanitize a user-provided string: trim, strip HTML, limit length.
 */
export function sanitizeString(input: unknown, maxLength = 5000): string | null {
  if (typeof input !== "string") return null;
  const cleaned = stripHtml(input).trim();
  if (cleaned.length === 0) return null;
  return cleaned.slice(0, maxLength);
}

/**
 * Validate that a value is one of a set of allowed values.
 */
export function validateEnum<T extends string>(
  value: unknown,
  allowed: readonly T[]
): T | null {
  if (typeof value !== "string") return null;
  return allowed.includes(value as T) ? (value as T) : null;
}

/**
 * Validate an email address format.
 */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
