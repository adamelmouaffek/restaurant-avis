export function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}

export function validatePositiveInt(value: unknown, max: number): number | null {
  const num = typeof value === "number" ? value : parseInt(String(value), 10);
  if (isNaN(num) || num < 1 || num > max) return null;
  return Math.floor(num);
}

export const MAX_LENGTHS = {
  notes: 500,
  itemNotes: 200,
  comment: 2000,
  name: 100,
  rejectionReason: 500,
  description: 500,
} as const;
