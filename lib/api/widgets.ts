// ============================================================
// नेपाल Hostel Finder — Social Links & Chatbot API
// ============================================================

import { api } from "./client";
import type {
  ApiResponse,
  SocialLink,
  ChatbotQA,
  ChatbotUserQuery,
} from "@/lib/types";

export const widgetsApi = {
  getSocialLinks: () => api.get<ApiResponse<SocialLink[]>>("/social-links/"),

  getChatbotQuestions: () =>
    api.get<ApiResponse<ChatbotQA[]>>("/chatbot/questions/"),

  submitChatbotQuery: (question: string) =>
    api.post<ApiResponse<ChatbotUserQuery>>("/chatbot/query/", { question }),

  getMyChatbotQueries: (params?: { onlyReplied?: boolean }) => {
    const query = params?.onlyReplied ? "?onlyReplied=true" : "";
    return api.get<ApiResponse<ChatbotUserQuery[]>>(`/chatbot/my-queries/${query}`);
  },

  markChatbotReplySeen: (queryId: string) =>
    api.patch<ApiResponse<ChatbotUserQuery>>(`/chatbot/mark-seen/${queryId}/`, {}),
};
