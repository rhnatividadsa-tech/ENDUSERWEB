"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_verified: boolean;
  [key: string]: unknown;
};

type AuthUser = {
  id: string;
  email: string;
  profile: UserProfile | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (formData: FormData) => Promise<void>;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "bayanihub-web-auth";
const TOKEN_STORAGE_KEY = "bayanihub-web-token";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) {
      return null;
    }

    return storedToken;
  });
  const isReady = true;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isReady,

      // ── LOGIN: call Nest.js backend ──
      login: async (email, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "Invalid credentials.");
        }

        const data = await res.json();

        const nextUser: AuthUser = {
          id: data.user.id,
          email: data.user.email,
          profile: data.user.profile,
        };

        setUser(nextUser);
        setToken(data.access_token);
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
        window.localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      },

      // ── SIGNUP: send multipart/form-data to Nest.js backend ──
      signup: async (formData: FormData) => {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          body: formData, // multipart — do NOT set Content-Type manually
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "Registration failed.");
        }

        // Registration returns a message + userId. The user still needs
        // to verify their email before they can log in.
      },

      logout: () => {
        setUser(null);
        setToken(null);
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      },
    }),
    [isReady, user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
