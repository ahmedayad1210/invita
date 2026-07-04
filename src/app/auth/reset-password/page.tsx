// src/app/auth/reset-password/page.tsx
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthForm from "@/components/auth/AuthForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [exchanging, setExchanging] = useState(true);
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent exchangeCodeForSession from running multiple times
  const hasExchanged = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    const code = searchParams.get("code");

    // =========================
    // PKCE FLOW
    // =========================
    if (code && !hasExchanged.current) {
      hasExchanged.current = true;

      supabase.auth.verifyOtp({
        token_hash: code,
        type: "recovery",
      }).then(({ error }) => {
        if (error) {
          console.error("Reset password exchange error:", error);
          setExchangeError(
            "This reset link has expired or is invalid. Please request a new one."
          );
        }

        setExchanging(false);
      });

      return;
    }

    // =========================
    // IMPLICIT FLOW
    // =========================
    // Supabase may return tokens in the URL hash.
    // We wait for either:
    // 1. PASSWORD_RECOVERY event
    // 2. Existing session

    let resolved = false;

    const resolve = (error?: string) => {
      if (resolved) return;

      resolved = true;

      if (error) {
        setExchangeError(error);
      }

      setExchanging(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        resolve();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        resolve();
      }
    });

    // Increased timeout to avoid false expired-link errors
    const timer = setTimeout(() => {
      resolve("Invalid or expired reset link. Please request a new one.");
      subscription.unsubscribe();
    }, 10000);

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Clear recovery session
      await supabase.auth.signOut();

      setSuccess(true);

      // Redirect to login page
      setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  if (exchanging) {
    return (
      <div
        style={{
          minHeight: "100svh",
          backgroundColor: "#FAF7F2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner message="Verifying reset link…" />
      </div>
    );
  }

  if (exchangeError) {
    return (
      <AuthForm
        title="Link Expired"
        subtitle={exchangeError}
        footer={
          <Link href="/auth/forgot-password" style={{ color: "#C4956A" }}>
            Request a new reset link
          </Link>
        }
      >
        <div />
      </AuthForm>
    );
  }

  if (success) {
    return (
      <AuthForm
        title="Password Updated"
        subtitle="Your password has been changed. Redirecting you to sign in…"
      >
        <div />
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Set New Password"
      subtitle="Choose a strong password for your account."
      footer={
        <Link
          href="/auth/login"
          style={{ color: "#8B7355", fontSize: "0.875rem" }}
        >
          Back to Sign In
        </Link>
      }
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <div>
          <label className="label-sevres" htmlFor="reset-password">New Password</label>
          <input
            id="reset-password"
            className="input-sevres"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            autoComplete="new-password"
            required
          />
        </div>

        <div>
          <label className="label-sevres" htmlFor="reset-confirm">Confirm Password</label>
          <input
            id="reset-confirm"
            className="input-sevres"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setError(null);
            }}
            autoComplete="new-password"
            required
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "0.5rem",
          }}
        >
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </AuthForm>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100svh",
            backgroundColor: "#FAF7F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingSpinner message="Loading…" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
