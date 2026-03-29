// ============================================================
// Auth API Service
// ============================================================

import { api } from "./client";
import type {
  ApiResponse,
  AuthTokens,
  EmailVerificationConfirmData,
  EmailVerificationRequestData,
  LoginFormData,
  RegisterFormData,
  User,
} from "@/lib/types";

export const authApi = {
  login: (data: LoginFormData) =>
    api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      "/auth/login/",
      data
    ),

  register: (data: RegisterFormData) => {
    // If avatar is provided, use FormData
    if (data.avatar) {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("role", data.role);
      formData.append("avatar", data.avatar);

      return api.upload<ApiResponse<{ user: User; tokens: AuthTokens }>>(
        "/auth/register/",
        formData
      );
    }

    // Otherwise, use JSON
    return api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      "/auth/register/",
      data
    );
  },

  requestEmailVerification: (data: EmailVerificationRequestData) =>
    api.post<ApiResponse<null>>("/auth/email-verification/request/", data),

  confirmEmailVerification: (data: EmailVerificationConfirmData) =>
    api.post<ApiResponse<null>>("/auth/email-verification/confirm/", data),

  getProfile: () => api.get<ApiResponse<User>>("/auth/profile/"),

  updateProfile: (data: Partial<User>) =>
    api.patch<ApiResponse<User>>("/auth/profile/", data),

  refreshToken: (refresh: string) =>
    api.post<{ access: string }>("/auth/token/refresh/", { refresh }),

  logout: () => api.post("/auth/logout/"),

  googleLogin: (credential: string) =>
    api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      "/auth/google/",
      { credential }
    ),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>("/auth/forgot-password/", { email }),

  resetPassword: (uid: string, token: string, password: string) =>
    api.post<ApiResponse<null>>("/auth/reset-password/", {
      uid,
      token,
      password,
    }),
};
