// ============================================================
// Hostels API Service
// ============================================================

import { api } from "./client";
import type {
  ApiResponse,
  City,
  Hostel,
  HostelFilters,
  HostelFormData,
  HostelSummary,
  PaginatedResponse,
  Review,
  ReviewEligibility,
} from "@/lib/types";
import { buildQueryString } from "@/lib/utils";

export const hostelsApi = {
  list: (filters?: HostelFilters) =>
    api.get<PaginatedResponse<HostelSummary>>(
      `/hostels/${buildQueryString(filters as Record<string, string | number>)}`
    ),

  featured: () =>
    api.get<ApiResponse<HostelSummary[]>>("/hostels/featured/"),

  getBySlug: (slug: string) =>
    api.get<ApiResponse<Hostel>>(`/hostels/${slug}/`),

  // Host endpoints
  myListings: () =>
    api.get<PaginatedResponse<HostelSummary>>("/hostels/my-listings/"),

  create: (data: FormData) => api.upload<ApiResponse<Hostel>>("/hostels/", data),

  update: (id: string, data: FormData) =>
    api.upload<ApiResponse<Hostel>>(`/hostels/${id}/`, data),

  delete: (id: string) => api.delete(`/hostels/${id}/`),

  // Reviews
  getReviews: (hostelId: string) =>
    api.get<PaginatedResponse<Review>>(`/hostels/${hostelId}/reviews/`),

  addReview: (hostelId: string, data: { rating: number; comment: string }) =>
    api.post<ApiResponse<Review>>(`/hostels/${hostelId}/reviews/`, data),

  reviewEligibility: (hostelId: string) =>
    api.get<ApiResponse<ReviewEligibility>>(`/hostels/${hostelId}/reviews/eligibility/`),

  // Cities (from City model)
  getCities: () => api.get<ApiResponse<City[]>>("/cities/"),

  // Legacy: distinct cities from hostels
  getHostelCities: () => api.get<ApiResponse<string[]>>("/hostels/cities/"),

  // Get available amenities
  getAmenities: () => api.get<ApiResponse<string[]>>("/hostels/amenities/"),

  // Nearby hostels
  nearby: (lat: number, lng: number, radius?: number) =>
    api.get<ApiResponse<HostelSummary[]>>(
      `/hostels/nearby/?lat=${lat}&lng=${lng}${radius ? `&radius=${radius}` : ""}`
    ),
};
