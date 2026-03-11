import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../lib/api";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await adminApi.login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f0eb;
          padding: 24px;
        }

        .login-card {
          background: #ffffff;
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 20px;
          padding: 48px 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 8px 40px rgba(58,64,90,0.08);
          animation: loginFade 0.4s ease both;
        }

        @keyframes loginFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 400;
          color: #3a405a;
          margin: 0 0 4px;
        }

        .login-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(104,80,68,0.40);
          margin: 0 0 36px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .login-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(104,80,68,0.55);
        }

        .login-input {
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(104,80,68,0.14);
          background: #fdfaf8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: #3a405a;
          outline: none;
          width: 100%;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .login-input:focus {
          border-color: rgba(153,178,221,0.55);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.12);
          background: #ffffff;
        }

        .login-error {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          color: #c0392b;
          background: rgba(192,57,43,0.06);
          border: 1px solid rgba(192,57,43,0.14);
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 16px;
        }

        .login-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          background: #3a405a;
          color: #f9dec9;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(58,64,90,0.20);
        }

        .login-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .login-spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(249,222,201,0.30);
          border-top-color: #f9dec9;
          border-radius: 50%;
          animation: lspin 0.7s linear infinite;
        }

        @keyframes lspin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="login-card">
        <h1 className="login-logo">Dhanamitra</h1>
        <p className="login-sub">Admin Panel</p>

        {error && <p className="login-error">⚠ {error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="login-spinner" /> Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}