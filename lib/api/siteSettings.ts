// ============================================================
// Site Settings API Service (admin-managed key/value content)
// ============================================================

import { api } from "./client";
import type { ApiResponse, SiteSettingsMap } from "@/lib/types";

export const siteSettingsApi = {
  list: () => api.get<ApiResponse<SiteSettingsMap>>("/site-settings/"),
};
