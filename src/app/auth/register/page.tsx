// src/app/auth/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/auth/AuthForm";
import Toast from "@/components/ui/Toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    email:     "",
    phone:     "",
    password:  "",
    confirm:   "",
  });
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);

  const { signUp, loading, user, initialized } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");
  const loginHref = refCode
    ? `/auth/login?redirectTo=${encodeURIComponent(`/auth/register?ref=${refCode}`)}`
    : "/auth/login";

  useEffect(() => {
    if (initialized && user) router.push("/");
  }, [user, initialized, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    const result = await signUp(
      form.email,
      form.password,
      form.full_name,
      form.phone || undefined
    );

    if (!result.success) {
      setError(result.error ?? "Registration failed.");
      return;
    }

    if (result.needsEmailConfirmation) {
      setPendingVerification(true);
      setToast("Account created. Check your email to verify before signing in.");
      return;
    }

    if (refCode) {
      await fetch("/api/user/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref_code: refCode }),
      }).catch(() => null);
    }

    setToast("Account created. Welcome to Invita");
    setTimeout(() => { router.refresh(); router.push("/"); }, 1500);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setError(null);
  };

  return (
    <>
      <AuthForm
        title="Create your account"
        subtitle="Join Invita and start your wellness journey."
        footer={
          <>
            Already have an account?{" "}
            <Link
              href={loginHref}
              style={{ color: "#0FB5A8", fontWeight: 500 }}
            >
              Sign in
            </Link>
          </>
        }
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}
        >
          <div>
            <label className="label-sevres" htmlFor="register-name">Full Name *</label>
            <input
              id="register-name"
              className="input-sevres"
              type="text"
              placeholder="Your full name"
              value={form.full_name}
              onChange={update("full_name")}
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className="label-sevres" htmlFor="register-email">Email Address *</label>
            <input
              id="register-email"
              className="input-sevres"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={update("email")}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="label-sevres" htmlFor="register-phone">Phone (optional)</label>
            <input
              id="register-phone"
              className="input-sevres"
              type="tel"
              placeholder="+964 770 000 0000"
              value={form.phone}
              onChange={update("phone")}
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="label-sevres" htmlFor="register-password">Password *</label>
            <input
              id="register-password"
              className="input-sevres"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={update("password")}
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label className="label-sevres" htmlFor="register-confirm">Confirm Password *</label>
            <input
              id="register-confirm"
              className="input-sevres"
              type="password"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={update("confirm")}
              autoComplete="new-password"
              required
            />
          </div>

          {pendingVerification && (
            <div
              style={{
                padding:         "0.875rem 1rem",
                backgroundColor: "rgba(15,35,65,0.06)",
                border:          "1px solid rgba(15,35,65,0.12)",
                borderRadius:    "0.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize:   "0.875rem",
                  color:      "#0C2430",
                  lineHeight: 1.65,
                  margin:     0,
                }}
              >
                We sent a verification link to <strong>{form.email}</strong>.
                Please confirm your email, then{" "}
                <Link href="/auth/login" style={{ color: "#0FB5A8", fontWeight: 500 }}>
                  sign in
                </Link>
                .
              </p>
            </div>
          )}

          {error && (
            <div
              style={{
                padding:         "0.875rem 1rem",
                backgroundColor: "rgba(15,181,168,0.08)",
                border:          "1px solid rgba(15,181,168,0.25)",
                borderRadius:    "0.5rem",
              }}
            >
              <p className="error-text" style={{ marginTop: 0 }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width:     "100%",
              opacity:   loading ? 0.7 : 1,
              cursor:    loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize:   "0.8rem",
              color:      "#6B7A94",
              textAlign:  "center",
              lineHeight: 1.6,
            }}
          >
            By creating an account you agree to our{" "}
            <Link href="/terms" style={{ color: "#0FB5A8" }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" style={{ color: "#0FB5A8" }}>
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </AuthForm>

      {toast && (
        <Toast
          message={toast}
          type="success"
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}