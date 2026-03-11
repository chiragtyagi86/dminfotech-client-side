// pages/pages/ContactPageEditor.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../../lib/api";

const EMPTY_CONTENT = {
  eyebrow:          "Get in Touch",
  headline:         "Let's build something great together",
  subheading:       "Reach out for website development, custom software, IT placements, journal publishing, stock market training or any digital solution. We respond within 1 business day.",
  ctaText:          "Book Free Consultation",
  formNameLabel:    "Your Name",
  formEmailLabel:   "Email Address",
  formPhoneLabel:   "Phone Number",
  formMessageLabel: "Your Message",
  formSubmitLabel:  "Send Message",
  formSuccessMsg:   "Thank you! We'll get back to you within 1 business day.",
  phone:            "+91 XXXXX XXXXX",
  email:            "hello@dhanamitra.com",
  address:          "Dhanamitra Infotech LLP, India",
  hours:            "Mon – Sat, 9:00 AM – 6:00 PM IST",
  responseTime:     "We respond within 1 business day",
  seoTitle:         "Contact Dhanamitra Infotech LLP | Get a Free Consultation",
  seoDescription:   "Reach out for website development, custom software, IT placements, journal publishing or any digital solution. We respond within 1 business day.",
};

const TABS = [
  { key: "header",  label: "Page Header" },
  { key: "form",    label: "Form & CTA" },
  { key: "details", label: "Contact Details" },
  { key: "seo",     label: "SEO & Meta" },
];

export default function ContactPageEditor() {
  const [content, setContent]     = useState(EMPTY_CONTENT);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState("");
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => { fetchPage(); }, []);

  async function fetchPage() {
    try {
      setLoading(true);
      const json     = await adminApi.getPage("contact");
      const pageData = json.data ?? json;
      if (pageData?.content && Object.keys(pageData.content).length > 0) {
        setContent({ ...EMPTY_CONTENT, ...pageData.content });
      }
    } catch (err) {
      console.error("Failed to load contact page:", err);
    } finally {
      setLoading(false);
    }
  }

  function set(field, value) {
    setContent((c) => ({ ...c, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      await adminApi.updatePage("contact", { content });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err?.message || "Failed to save page");
    } finally {
      setSaving(false);
    }
  }

  const seoTitleLen = content.seoTitle?.length || 0;
  const seoDescLen  = content.seoDescription?.length || 0;

  if (loading) return <div style={{ padding: "40px", textAlign: "center", fontFamily: "'DM Sans',sans-serif", color: "rgba(104,80,68,0.45)" }}>Loading...</div>;

  return (
    <div className="cpe-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .cpe-root { display: flex; flex-direction: column; gap: 24px; max-width: 860px; animation: cpeFade 0.4s ease both; }
        @keyframes cpeFade { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        .cpe-topbar { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .cpe-back { display: inline-flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400; color: rgba(104,80,68,0.55); text-decoration: none; padding: 7px 13px; border-radius: 8px; border: 1px solid rgba(104,80,68,0.12); background: #ffffff; transition: background 0.2s ease; }
        .cpe-back:hover { background: rgba(104,80,68,0.04); }
        .cpe-heading { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: #3a405a; margin: 0; flex: 1; }
        .cpe-badge { font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(104,80,68,0.45); background: rgba(104,80,68,0.05); border: 1px solid rgba(104,80,68,0.10); padding: 4px 12px; border-radius: 100px; }
        .cpe-error { font-family: 'DM Sans',sans-serif; font-size: 13px; color: #c0392b; background: rgba(192,57,43,0.06); border: 1px solid rgba(192,57,43,0.14); border-radius: 10px; padding: 12px 16px; }
        .cpe-card { background: #ffffff; border: 1px solid rgba(104,80,68,0.09); border-radius: 16px; overflow: hidden; }
        .cpe-tabs { display: flex; border-bottom: 1px solid rgba(104,80,68,0.09); background: rgba(104,80,68,0.02); }
        .cpe-tab { padding: 13px 18px; font-family: 'DM Sans', sans-serif; font-size: 11.5px; font-weight: 400; color: rgba(104,80,68,0.50); border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; transition: color 0.2s ease, border-color 0.2s ease; }
        .cpe-tab.active { color: #3a405a; border-bottom-color: #3a405a; font-weight: 500; }
        .cpe-body { padding: 22px; display: flex; flex-direction: column; gap: 18px; }
        .cpe-field { display: flex; flex-direction: column; gap: 6px; }
        .cpe-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .cpe-row { grid-template-columns: 1fr; } }
        .cpe-label { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.13em; text-transform: uppercase; color: rgba(104,80,68,0.55); display: flex; align-items: center; gap: 6px; }
        .cpe-label-hint { font-size: 9.5px; font-weight: 300; letter-spacing: 0; text-transform: none; color: rgba(104,80,68,0.35); margin-left: auto; }
        .cpe-input, .cpe-textarea { width: 100%; padding: 10px 13px; border-radius: 9px; border: 1px solid rgba(104,80,68,0.14); background: #fdfaf8; font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 300; color: #3a405a; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; box-sizing: border-box; }
        .cpe-input:focus, .cpe-textarea:focus { border-color: rgba(153,178,221,0.55); box-shadow: 0 0 0 3px rgba(153,178,221,0.10); background: #ffffff; }
        .cpe-textarea { resize: vertical; min-height: 80px; line-height: 1.7; }
        .cpe-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 640px) { .cpe-detail-grid { grid-template-columns: 1fr; } }
        .cpe-detail-card { border: 1px solid rgba(104,80,68,0.09); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 8px; background: rgba(104,80,68,0.02); }
        .cpe-detail-icon { font-size: 16px; margin-bottom: 2px; }
        .cpe-char-counter { font-family: 'DM Sans',sans-serif; font-size: 10.5px; font-weight: 300; text-align: right; margin-top: -12px; }
        .cpe-char-ok   { color: rgba(60,160,60,0.70); }
        .cpe-char-warn { color: rgba(200,140,40,0.80); }
        .cpe-char-over { color: #c0392b; }
        .cpe-save-bar { display: flex; align-items: center; gap: 12px; justify-content: flex-end; padding: 16px 22px; background: rgba(255,255,255,0.85); border: 1px solid rgba(104,80,68,0.09); border-radius: 14px; position: sticky; bottom: 16px; backdrop-filter: blur(12px); }
        .cpe-saved-msg { font-family: 'DM Sans',sans-serif; font-size: 12px; color: #3a7a3a; flex: 1; }
        .cpe-save-btn { padding: 10px 24px; border-radius: 9px; border: none; background: #3a405a; color: #f9dec9; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease; display: flex; align-items: center; gap: 8px; }
        .cpe-save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(58,64,90,0.18); }
        .cpe-save-btn:disabled { opacity: 0.60; cursor: not-allowed; }
        .cpe-spinner { width:13px; height:13px; border:2px solid rgba(249,222,201,0.30); border-top-color:#f9dec9; border-radius:50%; animation:cpespin 0.7s linear infinite; }
        @keyframes cpespin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="cpe-topbar">
        <Link to="/admin/pages" className="cpe-back">← Back</Link>
        <h1 className="cpe-heading">Contact Page</h1>
        <span className="cpe-badge">/contact</span>
      </div>

      {error && <p className="cpe-error">⚠ {error}</p>}

      <div className="cpe-card">
        <div className="cpe-tabs">
          {TABS.map((t) => (
            <button key={t.key} type="button"
              className={`cpe-tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "header" && (
          <div className="cpe-body">
            <div className="cpe-field">
              <label className="cpe-label">Eyebrow Text</label>
              <input className="cpe-input" value={content.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
            </div>
            <div className="cpe-field">
              <label className="cpe-label">Page Headline</label>
              <input className="cpe-input" value={content.headline} onChange={(e) => set("headline", e.target.value)} />
            </div>
            <div className="cpe-field">
              <label className="cpe-label">Subheading</label>
              <textarea className="cpe-textarea" rows={4} value={content.subheading} onChange={(e) => set("subheading", e.target.value)} />
            </div>
          </div>
        )}

        {activeTab === "form" && (
          <div className="cpe-body">
            <div className="cpe-field">
              <label className="cpe-label">CTA Button Text</label>
              <input className="cpe-input" value={content.ctaText} onChange={(e) => set("ctaText", e.target.value)} />
            </div>
            <div className="cpe-row">
              <div className="cpe-field">
                <label className="cpe-label">Name Field Label</label>
                <input className="cpe-input" value={content.formNameLabel} onChange={(e) => set("formNameLabel", e.target.value)} />
              </div>
              <div className="cpe-field">
                <label className="cpe-label">Email Field Label</label>
                <input className="cpe-input" value={content.formEmailLabel} onChange={(e) => set("formEmailLabel", e.target.value)} />
              </div>
            </div>
            <div className="cpe-row">
              <div className="cpe-field">
                <label className="cpe-label">Phone Field Label</label>
                <input className="cpe-input" value={content.formPhoneLabel} onChange={(e) => set("formPhoneLabel", e.target.value)} />
              </div>
              <div className="cpe-field">
                <label className="cpe-label">Message Field Label</label>
                <input className="cpe-input" value={content.formMessageLabel} onChange={(e) => set("formMessageLabel", e.target.value)} />
              </div>
            </div>
            <div className="cpe-row">
              <div className="cpe-field">
                <label className="cpe-label">Submit Button Text</label>
                <input className="cpe-input" value={content.formSubmitLabel} onChange={(e) => set("formSubmitLabel", e.target.value)} />
              </div>
              <div className="cpe-field">
                <label className="cpe-label">Response Time Text</label>
                <input className="cpe-input" value={content.responseTime} onChange={(e) => set("responseTime", e.target.value)} />
              </div>
            </div>
            <div className="cpe-field">
              <label className="cpe-label">Form Success Message</label>
              <input className="cpe-input" value={content.formSuccessMsg} onChange={(e) => set("formSuccessMsg", e.target.value)} />
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="cpe-body">
            <div className="cpe-detail-grid">
              <div className="cpe-detail-card">
                <span className="cpe-detail-icon">📞</span>
                <div className="cpe-field">
                  <label className="cpe-label">Phone</label>
                  <input className="cpe-input" value={content.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
              </div>
              <div className="cpe-detail-card">
                <span className="cpe-detail-icon">✉️</span>
                <div className="cpe-field">
                  <label className="cpe-label">Email</label>
                  <input className="cpe-input" value={content.email} onChange={(e) => set("email", e.target.value)} />
                </div>
              </div>
              <div className="cpe-detail-card">
                <span className="cpe-detail-icon">📍</span>
                <div className="cpe-field">
                  <label className="cpe-label">Address</label>
                  <textarea className="cpe-textarea" rows={2} value={content.address} onChange={(e) => set("address", e.target.value)} />
                </div>
              </div>
              <div className="cpe-detail-card">
                <span className="cpe-detail-icon">🕐</span>
                <div className="cpe-field">
                  <label className="cpe-label">Business Hours</label>
                  <input className="cpe-input" value={content.hours} onChange={(e) => set("hours", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="cpe-body">
            <div className="cpe-field">
              <label className="cpe-label">SEO Title <span className="cpe-label-hint">50–60 chars</span></label>
              <input className="cpe-input" value={content.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
              <span className={`cpe-char-counter ${seoTitleLen <= 60 ? "cpe-char-ok" : seoTitleLen <= 70 ? "cpe-char-warn" : "cpe-char-over"}`}>{seoTitleLen} / 60</span>
            </div>
            <div className="cpe-field">
              <label className="cpe-label">SEO Description <span className="cpe-label-hint">120–160 chars</span></label>
              <textarea className="cpe-textarea" rows={3} value={content.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
              <span className={`cpe-char-counter ${seoDescLen <= 160 ? "cpe-char-ok" : seoDescLen <= 180 ? "cpe-char-warn" : "cpe-char-over"}`}>{seoDescLen} / 160</span>
            </div>
            <div style={{ padding: 16, background: "rgba(104,80,68,0.03)", borderRadius: 10, border: "1px solid rgba(104,80,68,0.08)" }}>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "9.5px", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(104,80,68,0.38)", marginBottom: 10 }}>Search Preview</p>
              <p style={{ fontFamily: "arial", fontSize: 18, color: "#1a0dab", marginBottom: 3, lineHeight: 1.3 }}>{content.seoTitle}</p>
              <p style={{ fontFamily: "arial", fontSize: 12, color: "#006621", marginBottom: 4 }}>dhanamitra.com/contact</p>
              <p style={{ fontFamily: "arial", fontSize: 13, color: "#545454", lineHeight: 1.5 }}>{content.seoDescription}</p>
            </div>
          </div>
        )}
      </div>

      <div className="cpe-save-bar">
        {saved && <span className="cpe-saved-msg">✓ Changes saved successfully</span>}
        <button className="cpe-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? <><span className="cpe-spinner" />Saving…</> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}