// ============================================================
// Contact API Service
// ============================================================

import { api } from "./client";
import type { ApiResponse, ContactEnquiry, ContactFormData } from "@/lib/types";

export const contactApi = {
  submit: (data: ContactFormData) =>
    api.post<ApiResponse<ContactEnquiry>>("/contact/", data),
};
