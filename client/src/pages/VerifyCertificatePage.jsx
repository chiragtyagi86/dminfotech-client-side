import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "";

export default function VerifyCertificatePage() {
  const [params, setParams] = useSearchParams();
  const [value, setValue] = useState(params.get("token") || params.get("certificateId") || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  // Read a QR-code token only on the first page load.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (value) verify(value); }, []);
  async function verify(candidate = value) {
    if (!candidate.trim()) return;
    setLoading(true); setResult(null);
    try { const response = await fetch(`${API}/api/intern/verify-certificate?token=${encodeURIComponent(candidate)}`); setResult(await response.json()); setParams({ token: candidate }); }
    catch { setResult({ valid: false }); }
    finally { setLoading(false); }
  }
  const certificate = result?.certificate;
  return (
    <main className="vc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
        .vc-root{min-height:75vh;display:grid;place-items:center;padding:32px 16px;background:#f5f0eb;font-family:'DM Sans',sans-serif;}
        .vc-card{width:min(560px,100%);background:#fff;border:1px solid rgba(104,80,68,.1);border-radius:14px;padding:32px;color:#3a405a;box-shadow:0 18px 45px -20px rgba(58,64,90,.3);}
        .vc-brand{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
        .vc-logo{height:26px;width:26px;object-fit:contain;}
        .vc-eyebrow{margin:0;color:rgba(104,80,68,.55);font-size:12px;text-transform:uppercase;letter-spacing:.12em;}
        .vc-title{font-family:'Cormorant Garamond',serif;font-weight:600;margin:8px 0 22px;font-size:30px;color:#3a405a;}
        .vc-form{display:flex;gap:8px;}
        .vc-form input{flex:1;border:1px solid rgba(104,80,68,.15);border-radius:8px;padding:12px;font:inherit;color:#3a405a;background:#fbfaf8;}
        .vc-form input:focus{outline:2px solid rgba(58,64,90,.25);border-color:#3a405a;}
        .vc-form button{border:0;border-radius:8px;padding:0 18px;background:#3a405a;color:#f9dec9;font-weight:600;font-size:13px;letter-spacing:.04em;cursor:pointer;}
        .vc-form button:disabled{opacity:.6;cursor:not-allowed;}
        .vc-result{margin-top:22px;padding:18px;border-radius:10px;}
        .vc-result.valid{background:rgba(31,157,85,.1);color:#176b3a;}
        .vc-result.invalid{background:rgba(233,175,163,.25);color:#a43b22;}
        .vc-detail{margin-top:14px;color:#3a405a;display:grid;gap:7px;font-size:14px;}
      `}</style>
      <section className="vc-card">
        <div className="vc-brand">
          <img className="vc-logo" src="/logo.svg" alt="DM Infotech" />
          <p className="vc-eyebrow">DM Infotech</p>
        </div>
        <h1 className="vc-title">Certificate Verification</h1>
        <form className="vc-form" onSubmit={(e) => { e.preventDefault(); verify(); }}>
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Certificate ID" />
          <button disabled={loading}>{loading ? "Checking..." : "Verify"}</button>
        </form>
        {result && (
          <div className={`vc-result ${result.valid ? "valid" : "invalid"}`}>
            <strong>{result.valid ? "Valid Certificate" : "Invalid or Revoked Certificate"}</strong>
            {result.valid && (
              <div className="vc-detail">
                <span><b>Name:</b> {certificate.intern_name}</span>
                <span><b>Role:</b> {certificate.role || "Intern"}</span>
                <span><b>Duration:</b> {String(certificate.start_date).slice(0, 10)} to {String(certificate.end_date).slice(0, 10)}</span>
                <span><b>Issue Date:</b> {String(certificate.issued_at).slice(0, 10)}</span>
                <span><b>Certificate ID:</b> {certificate.certificate_id}</span>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
