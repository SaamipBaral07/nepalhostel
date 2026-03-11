// ============================================================
// Bookings API Service
// ============================================================

import { api } from "./client";
import type {
  ApiResponse,
  Booking,
  BookingFormData,
  PaginatedResponse,
} from "@/lib/types";

export const bookingsApi = {
  myBookings: () =>
    api.get<PaginatedResponse<Booking>>("/bookings/"),

  getById: (id: string) =>
    api.get<ApiResponse<Booking>>(`/bookings/${id}/`),

  create: (data: BookingFormData) =>
    api.post<ApiResponse<Booking>>("/bookings/", data),

  cancel: (id: string) =>
    api.post<ApiResponse<Booking>>(`/bookings/${id}/cancel/`),

  // Host endpoints
  hostelBookings: () =>
    api.get<PaginatedResponse<Booking>>("/bookings/host-requests/"),

  updateStatus: (id: string, status: string) =>
    api.patch<ApiResponse<Booking>>(`/bookings/${id}/status/`, { status }),

  // Payments
  createCheckoutSession: (bookingId: string) =>
    api.post<ApiResponse<{ checkoutUrl: string; sessionId: string }>>(
      `/payments/${bookingId}/checkout/`
    ),
};
