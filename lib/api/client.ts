// ============================================================
// नेपाल Hostel Finder — API Client (fetch wrapper)
// ============================================================

import { API_BASE_URL } from "@/lib/constants";
import type { ApiError } from "@/lib/types";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const tokens = localStorage.getItem("auth_tokens");
  if (!tokens) return null;
  try {
    return JSON.parse(tokens).access;
  } catch {
    return null;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // If 401 Unauthorized, tokens are invalid — clear auth
    if (response.status === 401 && typeof window !== "undefined") {
      const tokens = localStorage.getItem("auth_tokens");
      if (tokens) {
        localStorage.removeItem("auth_tokens");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_time");
        // Reload to reset AuthContext state
        window.location.href = "/login";
        return undefined as T;
      }
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
  const { method = "GET", body, headers = {}, isFormData = false } = options;

  const token = getAccessToken();
  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse<T>(response);
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string) => apiClient<T>(endpoint),

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
