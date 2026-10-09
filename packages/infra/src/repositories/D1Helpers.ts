export function toISO(date: Date | undefined | null): string | null {
  return date ? new Date(date).toISOString() : null;
}

export function fromISO(date: unknown): Date | undefined {
  if (typeof date === 'string' && date.length > 0) return new Date(date);
  return undefined;
}

export function fromISORequired(value: unknown): Date {
  if (typeof value === 'string' && value.length > 0) return new Date(value);
  return new Date();
}

export function jsonQuote(value: unknown): string {
  return JSON.stringify(value ?? null);
}

export function jsonParse<T = unknown>(value: unknown, fallback: T): T {
  if (value == null || value === '') return fallback;
  try {
    return JSON.parse(value as string) as T;
  } catch {
    return fallback;
  }
}

export function uuid(): string {
  return crypto.randomUUID();
}
