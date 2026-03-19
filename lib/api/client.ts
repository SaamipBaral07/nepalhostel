// ============================================================
// নেপাল Hostel Finder — API Client (fetch wrapper with secure auth)
// ============================================================
// 
// Security improvements:
// - Tokens stored in memory only (not localStorage)
// - HTTP-only cookies for automatic token sending
// - CSRF protection for state-changing requests
// - Credentials passed automatically
// - XSS protection via CSP

import { API_BASE_URL } from "@/lib/constants";
import type { ApiError } from "@/lib/types";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
  isFormData?: boolean;
  skipCSRF?: boolean;  // Skip CSRF for non-state-changing requests
}

// In-memory token storage (only during this session)
// Cleared on page reload for maximum security
let inMemoryAccessToken: string | null = null;

/**
 * Set the access token in memory.
 * Only called after successful login/registration.
 * Previously stored in localStorage (XSS vulnerable).
 */
export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

/**
 * Get the current access token from memory.
 * Returns null if not authenticated or page was reloaded.
 */
function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

/**
 * Get CSRF token from cookie or meta tag.
 * Used for state-changing requests (POST, PUT, PATCH, DELETE).
 */
function getCSRFToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1. Try to get from cookie
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrftoken") {
      return decodeURIComponent(value);
    }
  }

  // 2. Try to get from meta tag (set by Django in HTML)
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag) {
    return metaTag.getAttribute("content");
  }

  return null;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // 401 Unauthorized — clear auth
    if (response.status === 401 && typeof window !== "undefined") {
      inMemoryAccessToken = null;
      
      // Only redirect to login if not already on login page to avoid loops
      if (!window.location.pathname.includes("/login") && 
          !window.location.pathname.includes("/register")) {
        window.location.href = "/login";
      }
      
      return undefined as T;
    }

    const errorData = await response.json().catch(() => ({}));
    const apiError: ApiError = {
      message: errorData.message || errorData.detail || "Something went wrong",
      errors: errorData.errors,
      status: response.status,
    };
    throw apiError;
  }

  // Handle 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json();
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, isFormData = false, skipCSRF = false } = options;

  const token = getAccessToken();
  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  // Add Bearer token if available
  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Add CSRF token for state-changing requests
  if (!skipCSRF && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      requestHeaders["X-CSRFToken"] = csrfToken;
    }
  }

  if (!isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
    // Important: Include cookies in requests (needed for HTTP-only cookie auth)
    credentials: "include",
  };

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse<T>(response);
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string) => apiClient<T>(endpoint, { skipCSRF: true }),

  post: <T>(endpoint: string, body?: unknown) =>
    apiClient<T>(endpoint, { method: "POST", body }),

  put: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: "PUT", body }),

  patch: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: "PATCH", body }),

  delete: <T>(endpoint: string) =>
    apiClient<T>(endpoint, { method: "DELETE" }),

  upload: <T>(endpoint: string, formData: FormData) =>
    apiClient<T>(endpoint, {
      method: "POST",
      body: formData,
      isFormData: true,
    }),
};
