// src/components/careers/JobApplicationForm.jsx
import { useState, useRef } from "react";
import { api } from "../../lib/api";

export default function JobApplicationForm({ jobId, jobTitle }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", linkedinUrl:"" });
  const [resume, setResume]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const fileRef = useRef();

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setError("File must be under 5 MB."); return; }
    setResume(f); setError("");
  };

  const submit = async () => {
    if (!form.name || !form.email) { setError("Name and email are required."); return; }
    const fd = new FormData();
    fd.append("jobId", jobId);
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("linkedinUrl", form.linkedinUrl);
    if (resume) fd.append("resume", resume);
    setSubmitting(true); setError("");
    try {
      await api.applyJob(fd);
      setSuccess(true);
    } catch (e) {
      setError(e.message || "Submission failed. Please try again.");
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <style>{`
        .jaf-card { border-radius: 20px; border: 1px solid rgba(104,80,68,0.09); background: rgba(255,255,255,0.65); backdrop-filter: blur(10px); padding: 32px 28px; position: relative; overflow: hidden; }
        .jaf-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush)); }
        .jaf-title { font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500; letter-spacing:0.20em; text-transform:uppercase; color:var(--color-primary-2); margin:0 0 8px; }
        .jaf-job { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--color-primary); margin:0 0 24px; }
        .jaf-field { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
        .jaf-label { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500; letter-spacing:0.10em; text-transform:uppercase; color:var(--color-primary); }
        .jaf-input { font-family:'DM Sans',sans-serif; font-size:14px; font-weight:300; color:var(--color-primary); background:var(--color-bg); border:1px solid rgba(104,80,68,0.15); border-radius:10px; padding:11px 14px; outline:none; transition:border-color 0.25s; width:100%; }
        .jaf-input:focus { border-color:var(--color-accent-blue); }
        .jaf-file-zone { border:1.5px dashed rgba(104,80,68,0.20); border-radius:12px; padding:24px 16px; text-align:center; cursor:pointer; transition:background 0.25s,border-color 0.25s; background:rgba(255,255,255,0.40); }
        .jaf-file-zone:hover { background:rgba(153,178,221,0.06); border-color:rgba(153,178,221,0.35); }
        .jaf-file-icon { font-size:24px; margin-bottom:8px; }
        .jaf-file-text { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:400; color:var(--color-primary); margin:0 0 4px; }
        .jaf-file-sub { font-family:'DM Sans',sans-serif; font-size:11px; color:var(--color-text-soft); margin:0; }
        .jaf-file-name { font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; color:var(--color-primary-2); margin-top:8px; }
        .jaf-error { font-family:'DM Sans',sans-serif; font-size:12.5px; color:#e05252; background:rgba(224,82,82,0.06); border:1px solid rgba(224,82,82,0.15); border-radius:8px; padding:10px 14px; margin-bottom:14px; }
        .jaf-submit { width:100%; padding:13px 24px; border-radius:3px; background:var(--color-primary); color:white; font-family:'DM Sans',sans-serif; font-size:12.5px; font-weight:500; letter-spacing:0.09em; text-transform:uppercase; border:none; cursor:pointer; margin-top:14px; transition:opacity 0.25s,transform 0.25s; }
        .jaf-submit:hover:not(:disabled) { transform:translateY(-1px); opacity:0.88; }
        .jaf-submit:disabled { opacity:0.5; cursor:not-allowed; }
        .jaf-success { text-align:center; padding:32px 0; }
        .jaf-success-icon { font-size:40px; margin-bottom:12px; }
        .jaf-success-title { font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:300; color:var(--color-primary); margin:0 0 8px; }
        .jaf-success-sub { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:300; color:var(--color-text-soft); }
      `}</style>
      <div className="jaf-card">
        {success ? (
          <div className="jaf-success">
            <div className="jaf-success-icon">🎉</div>
            <h3 className="jaf-success-title">Application submitted!</h3>
            <p className="jaf-success-sub">We'll review your application and be in touch soon.</p>
          </div>
        ) : (
          <>
            <p className="jaf-title">Apply for this role</p>
            <p className="jaf-job">{jobTitle}</p>
            <div className="jaf-field"><label className="jaf-label">Full Name *</label><input className="jaf-input" name="name" value={form.name} onChange={update} placeholder="Your full name" /></div>
            <div className="jaf-field"><label className="jaf-label">Email *</label><input className="jaf-input" name="email" type="email" value={form.email} onChange={update} placeholder="your@email.com" /></div>
            <div className="jaf-field"><label className="jaf-label">Phone</label><input className="jaf-input" name="phone" value={form.phone} onChange={update} placeholder="+91 98765 43210" /></div>
            <div className="jaf-field"><label className="jaf-label">LinkedIn URL</label><input className="jaf-input" name="linkedinUrl" value={form.linkedinUrl} onChange={update} placeholder="https://linkedin.com/in/yourname" /></div>
            <div className="jaf-field">
              <label className="jaf-label">Resume (PDF / DOC)</label>
              <div className="jaf-file-zone" onClick={() => fileRef.current.click()}>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={onFile} />
                <div className="jaf-file-icon">📄</div>
                <p className="jaf-file-text">{resume ? resume.name : "Click to upload resume"}</p>
                <p className="jaf-file-sub">PDF, DOC, DOCX · Max 5 MB</p>
              </div>
            </div>
            {error && <p className="jaf-error">{error}</p>}
            <button className="jaf-submit" onClick={submit} disabled={submitting}>{submitting ? "Submitting…" : "Submit Application →"}</button>
          </>
        )}
      </div>
    </>
  );
}