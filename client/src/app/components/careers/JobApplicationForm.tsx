"use client";
// app/components/careers/JobApplicationForm.tsx

import { useState, useRef } from "react";

export default function JobApplicationForm({
  jobId,
  jobTitle,
}: {
  jobId: number;
  jobTitle: string;
}) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", linkedinUrl: "",
  });
  const [resume, setResume]       = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  }

  async function handleSubmit() {
    // Basic client validation
    if (!form.name.trim())  return setError("Please enter your name.");
    if (!form.email.trim()) return setError("Please enter your email.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setError("Please enter a valid email address.");
    if (!resume) return setError("Please attach your resume (PDF or Word).");

    try {
      setSubmitting(true);
      setError("");

      const fd = new FormData();
      fd.append("jobId",       String(jobId));
      fd.append("name",        form.name.trim());
      fd.append("email",       form.email.trim());
      fd.append("phone",       form.phone.trim());
      fd.append("linkedinUrl", form.linkedinUrl.trim());
      fd.append("resume",      resume);

      const res  = await fetch("/api/careers/apply", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) {
        setError(json.message || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600&family=DM+Sans:wght@300;400;500&display=swap');

        .jaf-wrap {
          position: sticky; top: 96px;
          border-radius: 22px;
          border: 1px solid rgba(104,80,68,0.09);
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(14px);
          overflow: hidden;
        }
        .jaf-top-bar {
          height: 3px;
          background: linear-gradient(90deg, var(--color-accent-blue, #99b2dd), var(--color-accent-blush, #e9afa3));
        }
        .jaf-body { padding: 28px 28px 32px; }

        .jaf-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px; font-weight: 600; line-height: 1.15;
          color: var(--color-primary, #3a405a); margin: 0 0 4px;
        }
        .jaf-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 300;
          color: var(--color-text-soft, #685044); margin: 0 0 24px;
        }
        .jaf-sub strong { font-weight: 500; color: var(--color-primary, #3a405a); }

        .jaf-fields { display: flex; flex-direction: column; gap: 14px; }

        .jaf-field { display: flex; flex-direction: column; gap: 5px; }
        .jaf-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(104,80,68,0.55);
        }
        .jaf-label span { color: #c0392b; margin-left: 2px; }

        .jaf-input {
          width: 100%; padding: 11px 13px; border-radius: 8px;
          border: 1px solid rgba(104,80,68,0.16); background: #fdfaf8;
          font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 300;
          color: var(--color-primary, #3a405a); outline: none; box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .jaf-input:focus {
          border-color: rgba(153,178,221,0.60);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.12);
          background: #ffffff;
        }

        /* ── Resume upload ── */
        .jaf-upload-zone {
          border: 1.5px dashed rgba(104,80,68,0.20);
          border-radius: 10px; padding: 20px 16px;
          text-align: center; cursor: pointer;
          background: rgba(153,178,221,0.04);
          transition: border-color 0.2s, background 0.2s;
        }
        .jaf-upload-zone:hover, .jaf-upload-zone.has-file {
          border-color: rgba(153,178,221,0.50);
          background: rgba(153,178,221,0.07);
        }
        .jaf-upload-icon { font-size: 22px; margin-bottom: 6px; }
        .jaf-upload-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 400;
          color: var(--color-text-soft, #685044);
        }
        .jaf-upload-text strong {
          color: var(--color-primary, #3a405a); font-weight: 500;
        }
        .jaf-upload-hint {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 300;
          color: rgba(104,80,68,0.45); margin-top: 4px;
        }
        .jaf-file-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          color: var(--color-primary, #3a405a);
          margin-top: 6px; display: flex; align-items: center; gap: 6px;
          justify-content: center;
        }
        .jaf-file-remove {
          background: none; border: none; cursor: pointer;
          color: rgba(104,80,68,0.45); font-size: 14px; line-height: 1;
          padding: 0 2px;
        }
        .jaf-file-remove:hover { color: #c0392b; }

        /* ── Error ── */
        .jaf-error {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 400;
          color: #c0392b;
          background: rgba(192,57,43,0.07);
          border: 1px solid rgba(192,57,43,0.18);
          border-radius: 8px;
          padding: 10px 14px;
        }

        /* ── Submit button ── */
        .jaf-submit {
          width: 100%; padding: 13px 24px; border-radius: 8px; border: none;
          background: var(--color-primary, #3a405a);
          color: var(--color-surface, #fffaf7);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; margin-top: 4px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.22s ease, box-shadow 0.22s ease, opacity 0.2s;
        }
        .jaf-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(58,64,90,0.22);
        }
        .jaf-submit:disabled { opacity: 0.62; cursor: not-allowed; }
        .jaf-spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(255,250,247,0.25);
          border-top-color: var(--color-surface, #fffaf7);
          animation: jafSpin 0.7s linear infinite;
        }
        @keyframes jafSpin { to { transform: rotate(360deg); } }

        /* ── Success ── */
        .jaf-success {
          padding: 36px 28px; text-align: center;
        }
        .jaf-success-icon { font-size: 40px; margin-bottom: 14px; }
        .jaf-success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 600;
          color: var(--color-primary, #3a405a); margin: 0 0 10px;
        }
        .jaf-success-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 300;
          line-height: 1.75; color: var(--color-text-soft, #685044); margin: 0;
        }
        .jaf-privacy {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 300;
          color: rgba(104,80,68,0.38); margin-top: 14px; text-align: center; line-height: 1.5;
        }
      `}</style>

      <div className="jaf-wrap">
        <div className="jaf-top-bar" />

        {success ? (
          <div className="jaf-success">
            <div className="jaf-success-icon">🎉</div>
            <h3 className="jaf-success-title">Application submitted!</h3>
            <p className="jaf-success-text">
              Thanks for applying for <strong>{jobTitle}</strong>. We review every application and will reach out if there's a fit.
            </p>
          </div>
        ) : (
          <div className="jaf-body">
            <h2 className="jaf-heading">Apply for this role</h2>
            <p className="jaf-sub">Position: <strong>{jobTitle}</strong></p>

            <div className="jaf-fields">
              {/* Name */}
              <div className="jaf-field">
                <label className="jaf-label">Full Name <span>*</span></label>
                <input type="text" className="jaf-input" placeholder="Your full name"
                  value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>

              {/* Email */}
              <div className="jaf-field">
                <label className="jaf-label">Email Address <span>*</span></label>
                <input type="email" className="jaf-input" placeholder="you@email.com"
                  value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>

              {/* Phone */}
              <div className="jaf-field">
                <label className="jaf-label">Phone Number</label>
                <input type="tel" className="jaf-input" placeholder="+91 98765 43210"
                  value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>

              {/* LinkedIn */}
              <div className="jaf-field">
                <label className="jaf-label">LinkedIn URL</label>
                <input type="url" className="jaf-input" placeholder="linkedin.com/in/yourprofile"
                  value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} />
              </div>

              {/* Resume upload */}
              <div className="jaf-field">
                <label className="jaf-label">Resume / CV <span>*</span></label>
                <input
                  ref={fileRef} type="file" style={{ display: "none" }}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { setResume(f); setError(""); }
                  }}
                />
                <div
                  className={`jaf-upload-zone ${resume ? "has-file" : ""}`}
                  onClick={() => fileRef.current?.click()}
                >
                  {resume ? (
                    <>
                      <div className="jaf-upload-icon">📄</div>
                      <div className="jaf-file-name">
                        {resume.name}
                        <button
                          className="jaf-file-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            setResume(null);
                            if (fileRef.current) fileRef.current.value = "";
                          }}
                        >✕</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="jaf-upload-icon">📎</div>
                      <div className="jaf-upload-text"><strong>Click to upload</strong> your resume</div>
                      <div className="jaf-upload-hint">PDF or Word · Max 5MB</div>
                    </>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && <div className="jaf-error">{error}</div>}

              {/* Submit */}
              <button className="jaf-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <><span className="jaf-spinner" />Submitting…</>
                ) : (
                  "Submit Application →"
                )}
              </button>

              <p className="jaf-privacy">
                Your information is stored securely and used only for recruitment purposes.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}