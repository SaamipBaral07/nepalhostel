// ============================================================
// नेपाल Hostel Finder — Utility Functions
// ============================================================

import { type ClassValue, clsx } from "clsx";

/** Merge Tailwind classes safely (lightweight alternative to cn) */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Format price in Nepali Rupees */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-NP")}`;
}

/** Format date to readable string */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Get initials from a full name */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Pluralize a word */
export function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : plural || `${singular}s`;
}

/** Build query string from filters object */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>
): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      searchParams.set(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Generate star rating array */
export function getStarRating(rating: number): ("full" | "half" | "empty")[] {
  const stars: ("full" | "half" | "empty")[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push("full");
    else if (rating >= i - 0.5) stars.push("half");
    else stars.push("empty");
  }
  return stars;
}
