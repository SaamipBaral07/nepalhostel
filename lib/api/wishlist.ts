// ============================================================
// Wishlist API Service
// ============================================================

import { api } from "./client";
import type { ApiResponse, WishlistItem } from "@/lib/types";

export const wishlistApi = {
  list: () => api.get<ApiResponse<WishlistItem[]>>("/wishlist/"),

  toggle: (hostelId: string) =>
    api.post<ApiResponse<{ wishlisted: boolean }>>("/wishlist/toggle/", {
      hostelId,
    }),

  check: (hostelId: string) =>
    api.get<ApiResponse<{ wishlisted: boolean }>>(
      `/wishlist/check/?hostelId=${hostelId}`
    ),

  /** Returns a flat array of hostel UUIDs currently wishlisted. */
  ids: () => api.get<ApiResponse<string[]>>("/wishlist/ids/"),
};
