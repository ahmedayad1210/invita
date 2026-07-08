"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const { login, loading }      = useAdmin();
  const router                  = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const result = await login({ username, password });

    if (!result.success) {
      setError(result.error ?? "Invalid credentials.");
      return;
    }

    // Force a full navigation so the server re-renders with the new cookie.
    router.push("/admin");
    router.refresh();
  };

  return (
    <div
      style={{
        minHeight:       "100svh",
        backgroundColor: "#2C1810",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "2rem",
      }}
    >
      <div
        style={{
          width:           "100%",
          maxWidth:        "400px",
          backgroundColor: "#FAF7F2",
          borderRadius:    "1rem",
          padding:         "3rem 2.5rem",
          boxShadow:       "0 24px 80px rgba(0,0,0,0.3)",
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p
            style={{
              fontFamily:    "'Cormorant Garamond', Georgia, serif",
              fontSize:      "1.75rem",
              fontWeight:    300,
              color:         "#2C1810",
              letterSpacing: "0.08em",
              marginBottom:  "0.25rem",
            }}
          >
            Invita
          </p>
          <p
            style={{
              fontFamily:    "'DM Sans', sans-serif",
              fontSize:      "0.6875rem",
              fontWeight:    500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color:         "#C4956A",
            }}
          >
            Admin Access
          </p>
        </div>

        {/* Divider */}
        <div className="divider-rose" style={{ marginBottom: "2rem" }} />

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div>
            <label htmlFor="admin-username" className="label-sevres">
              Email
            </label>
            <input
              id="admin-username"
              className="input-sevres"
              type="email"
              placeholder="management@invitadrips.com"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(null); }}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="label-sevres">
              Password
            </label>
            <input
              id="admin-password"
              className="input-sevres"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div
              style={{
                padding:         "0.875rem 1rem",
                backgroundColor: "rgba(196,149,106,0.08)",
                border:          "1px solid rgba(196,149,106,0.25)",
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
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a
            href="/"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize:   "0.8125rem",
              color:      "#8B7355",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C4956A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8B7355")}
          >
            ← Return to site
          </a>
        </div>
      </div>
    </div>
  );
}
