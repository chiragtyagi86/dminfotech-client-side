// app/admin/login/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Login Page
// Uses hardcoded credentials for now (env vars).
// Replace with DB auth when connecting backend.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials.");
        setLoading(false);
        return;
      }

      // Redirect to admin dashboard on success
      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .admin-login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle at 20% 20%, rgba(153,178,221,0.12) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(233,175,163,0.10) 0%, transparent 40%),
            linear-gradient(160deg, #fffaf7 0%, #fdf3eb 100%);
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle grid background */
        .admin-login-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .login-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 420px;
          background: rgba(255,255,255,0.80);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(104,80,68,0.12);
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 0 24px 64px rgba(58,64,90,0.10);
          animation: loginFadeUp 0.6s ease both;
        }

        @keyframes loginFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Top accent bar */
        .login-card::before {
          content: '';
          position: absolute; top: 0; left: 40px; right: 40px; height: 2px;
          background: linear-gradient(90deg, var(--color-accent-blue, #99b2dd), var(--color-accent-blush, #e9afa3));
          border-radius: 0 0 2px 2px;
        }

        .login-brand {
          text-align: center;
          margin-bottom: 36px;
        }

        .login-brand-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: var(--color-primary, #3a405a);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 600;
          color: #f9dec9;
        }

        .login-brand-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px; font-weight: 400;
          color: var(--color-primary, #3a405a);
          margin: 0 0 4px;
        }

        .login-brand-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 400;
          letter-spacing: 0.10em;
          color: var(--color-text-soft, #685044);
          text-transform: uppercase;
          margin: 0;
        }

        .login-divider {
          height: 1px;
          background: rgba(104,80,68,0.09);
          margin: 0 0 32px;
        }

        .login-form {
          display: flex; flex-direction: column; gap: 18px;
        }

        .login-field {
          display: flex; flex-direction: column; gap: 6px;
        }

        .login-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--color-text-soft, #685044);
        }

        .login-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1px solid rgba(104,80,68,0.15);
          background: rgba(255,255,255,0.70);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 300;
          color: var(--color-primary, #3a405a);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .login-input:focus {
          border-color: rgba(153,178,221,0.60);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.12);
        }

        .login-input::placeholder {
          color: rgba(104,80,68,0.35);
          font-weight: 300;
        }

        .login-error {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 400;
          color: #c0392b;
          background: rgba(192,57,43,0.06);
          border: 1px solid rgba(192,57,43,0.14);
          border-radius: 8px;
          padding: 10px 14px;
          margin: 0;
        }

        .login-btn {
          width: 100%;
          padding: 13px 20px;
          border-radius: 10px;
          border: none;
          background: var(--color-primary, #3a405a);
          color: #f9dec9;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.10em; text-transform: uppercase;
          cursor: pointer;
          margin-top: 4px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(58,64,90,0.20);
        }

        .login-btn:disabled {
          opacity: 0.65; cursor: not-allowed;
        }

        .login-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(249,222,201,0.30);
          border-top-color: #f9dec9;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .login-footer {
          margin-top: 28px; text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 300;
          color: rgba(104,80,68,0.45);
        }
      `}</style>

      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">D</div>
          <h1 className="login-brand-title">Dhanamitra Admin</h1>
          <p className="login-brand-sub">Content Management System</p>
        </div>

        <div className="login-divider" />

        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-field">
            <label className="login-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="login-input"
              placeholder="admin@dhanamitra.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="login-spinner" />
                Signing in…
              </>
            ) : (
              "Sign In to CMS"
            )}
          </button>
        </form>

        <p className="login-footer">
          Dhanamitra Infotech LLP · Admin Access Only
        </p>
      </div>
    </div>
  );
}