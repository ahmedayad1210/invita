// src/hooks/useAdmin.ts
// Admin session hook — cookie-based auth, no localStorage.
// login() calls the API which sets an HttpOnly JWT cookie.
// logout() calls the API which clears it.

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface AdminLoginCredentials {
  username: string;
  password: string;
}

export interface AdminLoginResult {
  success: boolean;
  error?:  string;
}

export interface UseAdminReturn {
  loading:  boolean;
  login:    (credentials: AdminLoginCredentials) => Promise<AdminLoginResult>;
  logout:   () => Promise<void>;
}

export function useAdmin(): UseAdminReturn {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = useCallback(
    async (credentials: AdminLoginCredentials): Promise<AdminLoginResult> => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/login", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            username: credentials.username.trim(),
            password: credentials.password,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          return {
            success: false,
            error:   json.error ?? "Invalid credentials. Please try again.",
          };
        }

        return { success: true };
      } catch {
        return {
          success: false,
          error:   "An unexpected error occurred. Please try again.",
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      // Hard-navigate so the server renders the login page
      // without any stale client state.
      router.push("/admin");
      router.refresh();
    }
  }, [router]);

  return { loading, login, logout };
}
