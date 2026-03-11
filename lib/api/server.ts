// ============================================================
// Server-side API helper for server components
// ============================================================

import { API_BASE_URL } from "@/lib/constants";

/**
 * Fetch from the backend API in server components.
 * No auth — only for public endpoints.
 */
export async function serverFetch<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
