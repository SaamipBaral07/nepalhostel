// ============================================================
// Site Pages API Service (About, etc.)
// ============================================================

import { api } from "./client";
import type { ApiResponse, SitePage } from "@/lib/types";

export const pagesApi = {
  getBySlug: (slug: string) =>
    api.get<ApiResponse<SitePage>>(`/pages/${slug}/`),
};
