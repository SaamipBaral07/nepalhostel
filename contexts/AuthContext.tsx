"use client";

// ============================================================
// नेपाल Hostel Finder — Auth Context
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import type {
  AuthState,
  AuthTokens,
  LoginFormData,
  RegisterFormData,
  User,
} from "@/lib/types";

interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isHost: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_tokens";
const USER_KEY = "auth_user";
const AUTH_TIME_KEY = "auth_time"; // Track when tokens were issued

// Maximum session age: 24 hours of inactivity
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000;

function persistAuth(user: User, tokens: AuthTokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_TIME_KEY, Date.now().toString());
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_TIME_KEY);
}

/** Decode a JWT payload without a library (base64url → JSON). */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

/** Returns true if the token's `exp` claim is in the past (or within 30s). */
function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  // Treat as expired 30 seconds early to avoid race conditions
  return payload.exp * 1000 <= Date.now() + 30_000;
}

function loadStoredAuth(): { user: User | null; tokens: AuthTokens | null } {
  if (typeof window === "undefined") return { user: null, tokens: null };
  try {
    const tokens = JSON.parse(localStorage.getItem(TOKEN_KEY) || "null");
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");

    // Check maximum session age
    const authTime = localStorage.getItem(AUTH_TIME_KEY);
    if (authTime) {
      const elapsed = Date.now() - parseInt(authTime, 10);
      if (elapsed > MAX_SESSION_AGE_MS) {
        clearAuth();
        return { user: null, tokens: null };
      }
    }

    return { user, tokens };
  } catch {
    return { user: null, tokens: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isLoading: true,
    isAuthenticated: false,
  });

  /** Try to refresh the access token using the refresh token. */
  const tryRefresh = useCallback(
    async (tokens: AuthTokens): Promise<AuthTokens | null> => {
      if (!tokens.refresh || isTokenExpired(tokens.refresh)) {
        return null;
      }
      try {
        const res = await authApi.refreshToken(tokens.refresh);
        const newTokens: AuthTokens = {
          access: res.access,
          refresh: tokens.refresh,
        };
        return newTokens;
      } catch {
        return null;
      }
    },
    []
  );

  /** Schedule the next access-token refresh ~1 minute before it expires. */
  const scheduleRefresh = useCallback(
    (tokens: AuthTokens) => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      const payload = decodeJwtPayload(tokens.access);
      if (!payload || typeof payload.exp !== "number") return;

      // Refresh 60 seconds before expiry
      const msUntilExpiry = payload.exp * 1000 - Date.now() - 60_000;
      if (msUntilExpiry <= 0) return; // already expired or about to

      refreshTimerRef.current = setTimeout(async () => {
        const newTokens = await tryRefresh(tokens);
        if (newTokens) {
          setState((prev) => {
            if (prev.user) persistAuth(prev.user, newTokens);
            return { ...prev, tokens: newTokens };
          });
          scheduleRefresh(newTokens);
        } else {
          // Refresh failed — force logout
          clearAuth();
          setState({
            user: null,
            tokens: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }, msUntilExpiry);
    },
    [tryRefresh]
  );

  // Hydrate from localStorage on mount — validate tokens
  useEffect(() => {
    const hydrate = async () => {
      const { user, tokens } = loadStoredAuth();

      if (!user || !tokens) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      // Access token still valid
      if (!isTokenExpired(tokens.access)) {
        setState({
          user,
          tokens,
          isLoading: false,
          isAuthenticated: true,
        });
        scheduleRefresh(tokens);
        return;
      }

      // Access expired — try refreshing
      const newTokens = await tryRefresh(tokens);
      if (newTokens) {
        persistAuth(user, newTokens);
        setState({
          user,
          tokens: newTokens,
          isLoading: false,
          isAuthenticated: true,
        });
        scheduleRefresh(newTokens);
      } else {
        // Both tokens expired — log out
        clearAuth();
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    hydrate();

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (data: LoginFormData) => {
      const response = await authApi.login(data);
      const { user, tokens } = response.data;
      persistAuth(user, tokens);
      setState({
        user,
        tokens,
        isLoading: false,
        isAuthenticated: true,
      });
      scheduleRefresh(tokens);
      router.push("/account");
    },
    [router, scheduleRefresh]
  );

  const register = useCallback(
    async (data: RegisterFormData) => {
      const response = await authApi.register(data);
      const { user, tokens } = response.data;
      persistAuth(user, tokens);
      setState({
        user,
        tokens,
        isLoading: false,
        isAuthenticated: true,
      });
      scheduleRefresh(tokens);
      router.push("/account");
    },
    [router, scheduleRefresh]
  );

  const googleLogin = useCallback(
    async (credential: string) => {
      const response = await authApi.googleLogin(credential);
      const { user, tokens } = response.data;
      persistAuth(user, tokens);
      setState({
        user,
        tokens,
        isLoading: false,
        isAuthenticated: true,
      });
      scheduleRefresh(tokens);
      router.push("/account");
    },
    [router, scheduleRefresh]
  );

  const logout = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    clearAuth();
    setState({
      user: null,
      tokens: null,
      isLoading: false,
      isAuthenticated: false,
    });
    router.push("/");
  }, [router]);

  const updateUser = useCallback((updatedUser: User) => {
    setState((prev) => {
      // Update localStorage
      if (prev.tokens) {
        persistAuth(updatedUser, prev.tokens);
      }
      return {
        ...prev,
        user: updatedUser,
      };
    });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
    isHost: state.user?.role === "host",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
