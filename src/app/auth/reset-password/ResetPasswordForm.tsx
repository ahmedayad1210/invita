"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthForm from "@/components/auth/AuthForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";

type ResetPasswordFormProps = {
  initialError?: string | null;
};

export default function ResetPasswordForm({ initialError = null }: ResetPasswordFormProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(!initialError);
  const [sessionError, setSessionError] = useState<string | null>(initialError);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialError) return;

    const supabase = createClient();
    let cancelled = false;

    async function establishRecoverySession() {
      // Implicit flow — tokens in URL hash (some mobile mail clients)
      const hash = window.location.hash.replace(/^#/, "");
      if (hash.includes("access_token")) {
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (accessToken && refreshToken && type === "recovery") {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          window.history.replaceState(null, "", window.location.pathname);
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      if (session) {
        setSessionError(null);
        setChecking(false);
        return;
      }

      // Wait briefly for PASSWORD_RECOVERY event from Supabase client
      await new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, 2500);
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, nextSession) => {
          if (event === "PASSWORD_RECOVERY" || nextSession) {
            clearTimeout(timer);
            subscription.unsubscribe();
            resolve();
          }
        });
      });

      if (cancelled) return;

      const {
        data: { session: retrySession },
      } = await supabase.auth.getSession();

      if (retrySession) {
        setSessionError(null);
      } else {
        setSessionError(
          "Invalid or expired reset link. Please request a new one from the forgot password page."
        );
      }
      setChecking(false);
    }

    establishRecoverySession().catch(() => {
      if (!cancelled) {
        setSessionError("Could not verify reset link. Please try again.");
        setChecking(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [initialError]);

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
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await supabase.auth.signOut();
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2500);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
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

  if (sessionError) {
    return (
      <AuthForm
        title="Link Expired"
        subtitle={sessionError}
        footer={
          <Link href="/auth/forgot-password" style={{ color: "#D9B344" }}>
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
        <Link href="/auth/login" style={{ color: "#6B7A94", fontSize: "0.875rem" }}>
          Back to Sign In
        </Link>
      }
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        <div>
          <label className="label-sevres" htmlFor="reset-password">
            New Password
          </label>
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
          <label className="label-sevres" htmlFor="reset-confirm">
            Confirm Password
          </label>
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
