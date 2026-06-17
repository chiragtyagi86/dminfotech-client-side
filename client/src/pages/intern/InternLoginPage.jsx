import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { internApi } from "../../lib/api";

export default function InternLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      setMessage("");
      await internApi.login(email, password);
      navigate(location.state?.from || "/intern/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  async function requestReset() {
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await internApi.forgotPassword(email);
      setResetToken(res.resetToken || "");
      setMessage(res.resetToken ? "Reset token generated for local testing." : "If the email exists, a reset link will be sent.");
    } catch (err) {
      setError(err?.message || "Unable to request reset.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      await internApi.resetPassword(resetToken, newPassword);
      setMessage("Password reset. You can sign in now.");
      setPassword("");
      setNewPassword("");
      setResetToken("");
    } catch (err) {
      setError(err?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="in-login">
      <style>{`
        .in-login{min-height:100vh;display:grid;place-items:center;background:#f5f0eb;padding:24px;font-family:'DM Sans',sans-serif;color:#3a405a;}
        .in-card{width:min(420px,100%);background:#fff;border:1px solid rgba(104,80,68,.1);border-radius:8px;padding:28px;box-shadow:0 18px 45px rgba(58,64,90,.08);}
        .in-title{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:400;margin:0 0 4px;color:#3a405a;}
        .in-sub{margin:0 0 22px;color:rgba(104,80,68,.58);font-size:13px;}
        .in-form{display:flex;flex-direction:column;gap:14px;}
        .in-field{display:flex;flex-direction:column;gap:6px;}
        .in-field label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(104,80,68,.45);}
        .in-field input{border:1px solid rgba(104,80,68,.15);border-radius:8px;padding:12px;font:inherit;color:#3a405a;}
        .in-btn{border:0;border-radius:8px;background:#3a405a;color:#f9dec9;padding:12px 16px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;}
        .in-btn:disabled{opacity:.7;cursor:not-allowed;}
        .in-error{background:rgba(192,57,43,.08);color:#c0392b;border-radius:8px;padding:10px 12px;font-size:13px;}
        .in-message{background:rgba(39,174,96,.1);color:#238b4b;border-radius:8px;padding:10px 12px;font-size:13px;}
        .in-link{border:0;background:none;color:#3a405a;text-decoration:underline;padding:0;font:inherit;font-size:12px;cursor:pointer;text-align:left;}
      `}</style>
      <section className="in-card">
        <h1 className="in-title">Intern Login</h1>
        <p className="in-sub">Access attendance, reports, tasks, and your profile.</p>
        <form className="in-form" onSubmit={handleSubmit}>
          {error && <div className="in-error">{error}</div>}
          {message && <div className="in-message">{message}</div>}
          <div className="in-field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="in-field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <button className="in-btn" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
          <button type="button" className="in-link" onClick={requestReset} disabled={loading}>Forgot password</button>
        </form>

        {resetToken && (
          <form className="in-form" onSubmit={handleReset} style={{ marginTop: 18 }}>
            <div className="in-field">
              <label>Reset Token</label>
              <input value={resetToken} onChange={(e) => setResetToken(e.target.value)} required />
            </div>
            <div className="in-field">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
            </div>
            <button className="in-btn" disabled={loading}>Reset Password</button>
          </form>
        )}
      </section>
    </main>
  );
}
