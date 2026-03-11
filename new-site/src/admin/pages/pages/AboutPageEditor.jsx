// pages/pages/AboutPageEditor.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../../lib/api";

const EMPTY_CONTENT = {
  heroEyebrow:   "About Dhanamitra Infotech LLP",
  heroHeadline:  "Digital excellence, built on trust",
  heroSub:       "We are an ISO 9001:2015 certified digital solutions company helping businesses grow through technology, design and strategy.",
  introHeadline: "We build digital businesses",
  introBody:     "Dhanamitra Infotech LLP is a full-service digital solutions company delivering websites, software, IT placements, research publishing and financial education. We work with businesses that want to grow with technology.",
  introCert:     "ISO 9001:2015 Certified",
  missionLabel:  "Our Mission",
  missionText:   "To empower businesses with reliable, high-quality digital solutions that drive measurable growth and long-term success.",
  visionLabel:   "Our Vision",
  visionText:    "To become the most trusted digital solutions partner for modern businesses across India and beyond.",
  trustHeadline: "Why businesses trust us",
  trustSub:      "Our credentials, certifications and track record speak for the quality we deliver.",
  trustBadge1:    "ISO 9001:2015",
  trustBadge1Sub: "Quality Management Certified",
  trustBadge2:    "5+ Years",
  trustBadge2Sub: "Delivering digital excellence",
  trustBadge3:    "Multi-domain",
  trustBadge3Sub: "Web, Software, Finance, Publishing",
  philoHeadline:  "How we work",
  philoBody:      "We believe great digital work comes from clarity, craftsmanship and collaboration. Every project begins with understanding your business — not just your brief.",
  seoTitle:       "About Dhanamitra Infotech LLP | ISO Certified Digital Solutions",
  seoDescription: "Dhanamitra Infotech LLP is an ISO 9001:2015 certified digital solutions company delivering website development, custom software and business growth services.",
};

const SECTIONS = [
  { key: "hero",    label: "Hero Section" },
  { key: "intro",   label: "Intro / Brand" },
  { key: "mission", label: "Mission & Vision" },
  { key: "trust",   label: "Trust & Credentials" },
  { key: "seo",     label: "SEO & Meta" },
];

export default function AboutPageEditor() {
  const [content, setContent]     = useState(EMPTY_CONTENT);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState("");
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => { fetchPage(); }, []);

  async function fetchPage() {
    try {
      setLoading(true);
      const json     = await adminApi.getPage("about");
      const pageData = json.data ?? json;
      if (pageData?.content && Object.keys(pageData.content).length > 0) {
        setContent({ ...EMPTY_CONTENT, ...pageData.content });
      }
    } catch (err) {
      console.error("Failed to load about page:", err);
      // Keep defaults on error — page may not exist yet
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
      await adminApi.updatePage("about", { content });
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
    <div className="ape-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .ape-root { display: flex; flex-direction: column; gap: 24px; max-width: 860px; animation: apeFade 0.4s ease both; }
        @keyframes apeFade { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        .ape-topbar { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .ape-back { display: inline-flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400; color: rgba(104,80,68,0.55); text-decoration: none; padding: 7px 13px; border-radius: 8px; border: 1px solid rgba(104,80,68,0.12); background: #ffffff; transition: background 0.2s ease; }
        .ape-back:hover { background: rgba(104,80,68,0.04); }
        .ape-heading { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: #3a405a; margin: 0; flex: 1; }
        .ape-badge { font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(104,80,68,0.45); background: rgba(104,80,68,0.05); border: 1px solid rgba(104,80,68,0.10); padding: 4px 12px; border-radius: 100px; }
        .ape-error { font-family: 'DM Sans',sans-serif; font-size: 13px; color: #c0392b; background: rgba(192,57,43,0.06); border: 1px solid rgba(192,57,43,0.14); border-radius: 10px; padding: 12px 16px; }
        .ape-card { background: #ffffff; border: 1px solid rgba(104,80,68,0.09); border-radius: 16px; overflow: hidden; }
        .ape-tabs { display: flex; border-bottom: 1px solid rgba(104,80,68,0.09); background: rgba(104,80,68,0.02); overflow-x: auto; }
        .ape-tab { padding: 13px 18px; font-family: 'DM Sans', sans-serif; font-size: 11.5px; font-weight: 400; color: rgba(104,80,68,0.50); border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; transition: color 0.2s ease, border-color 0.2s ease; }
        .ape-tab.active { color: #3a405a; border-bottom-color: #3a405a; font-weight: 500; }
        .ape-body { padding: 22px; display: flex; flex-direction: column; gap: 18px; }
        .ape-section-label { font-family: 'DM Sans', sans-serif; font-size: 9.5px; font-weight: 500; letter-spacing: 0.20em; text-transform: uppercase; color: rgba(104,80,68,0.35); padding-bottom: 8px; border-bottom: 1px solid rgba(104,80,68,0.07); margin-bottom: -6px; }
        .ape-field { display: flex; flex-direction: column; gap: 6px; }
        .ape-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .ape-row { grid-template-columns: 1fr; } }
        .ape-label { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.13em; text-transform: uppercase; color: rgba(104,80,68,0.55); display: flex; align-items: center; gap: 6px; }
        .ape-label-hint { font-size: 9.5px; font-weight: 300; letter-spacing: 0; text-transform: none; color: rgba(104,80,68,0.35); margin-left: auto; }
        .ape-input, .ape-textarea { width: 100%; padding: 10px 13px; border-radius: 9px; border: 1px solid rgba(104,80,68,0.14); background: #fdfaf8; font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 300; color: #3a405a; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; box-sizing: border-box; }
        .ape-input:focus, .ape-textarea:focus { border-color: rgba(153,178,221,0.55); box-shadow: 0 0 0 3px rgba(153,178,221,0.10); background: #ffffff; }
        .ape-textarea { resize: vertical; min-height: 80px; line-height: 1.7; }
        .ape-badge-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
        @media (max-width: 640px) { .ape-badge-grid { grid-template-columns: 1fr; } }
        .ape-badge-card { border: 1px solid rgba(104,80,68,0.09); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px; background: rgba(104,80,68,0.02); }
        .ape-badge-num { font-family: 'Cormorant Garamond',serif; font-size: 11px; font-weight: 300; letter-spacing: 0.14em; color: rgba(104,80,68,0.35); }
        .ape-char-counter { font-family: 'DM Sans',sans-serif; font-size: 10.5px; font-weight: 300; text-align: right; margin-top: -12px; }
        .ape-char-ok   { color: rgba(60,160,60,0.70); }
        .ape-char-warn { color: rgba(200,140,40,0.80); }
        .ape-char-over { color: #c0392b; }
        .ape-save-bar { display: flex; align-items: center; gap: 12px; justify-content: flex-end; padding: 16px 22px; background: rgba(255,255,255,0.85); border: 1px solid rgba(104,80,68,0.09); border-radius: 14px; position: sticky; bottom: 16px; backdrop-filter: blur(12px); }
        .ape-saved-msg { font-family: 'DM Sans',sans-serif; font-size: 12px; color: #3a7a3a; flex: 1; }
        .ape-save-btn { padding: 10px 24px; border-radius: 9px; border: none; background: #3a405a; color: #f9dec9; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease; display: flex; align-items: center; gap: 8px; }
        .ape-save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(58,64,90,0.18); }
        .ape-save-btn:disabled { opacity: 0.60; cursor: not-allowed; }
        .ape-spinner { width:13px; height:13px; border:2px solid rgba(249,222,201,0.30); border-top-color:#f9dec9; border-radius:50%; animation:apespin 0.7s linear infinite; }
        @keyframes apespin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ape-topbar">
        <Link to="/admin/pages" className="ape-back">← Back</Link>
        <h1 className="ape-heading">About Page</h1>
        <span className="ape-badge">/about</span>
      </div>

      {error && <p className="ape-error">⚠ {error}</p>}

      <div className="ape-card">
        <div className="ape-tabs">
          {SECTIONS.map((s) => (
            <button key={s.key} type="button"
              className={`ape-tab ${activeTab === s.key ? "active" : ""}`}
              onClick={() => setActiveTab(s.key)}>
              {s.label}
            </button>
          ))}
        </div>

        {activeTab === "hero" && (
          <div className="ape-body">
            <div className="ape-field">
              <label className="ape-label">Eyebrow Text</label>
              <input className="ape-input" value={content.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} />
            </div>
            <div className="ape-field">
              <label className="ape-label">Hero Headline</label>
              <input className="ape-input" value={content.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} />
            </div>
            <div className="ape-field">
              <label className="ape-label">Hero Subheading</label>
              <textarea className="ape-textarea" rows={3} value={content.heroSub} onChange={(e) => set("heroSub", e.target.value)} />
            </div>
          </div>
        )}

        {activeTab === "intro" && (
          <div className="ape-body">
            <div className="ape-field">
              <label className="ape-label">Intro Headline</label>
              <input className="ape-input" value={content.introHeadline} onChange={(e) => set("introHeadline", e.target.value)} />
            </div>
            <div className="ape-field">
              <label className="ape-label">Intro Body Text</label>
              <textarea className="ape-textarea" rows={4} value={content.introBody} onChange={(e) => set("introBody", e.target.value)} />
            </div>
            <div className="ape-field">
              <label className="ape-label">Certification Badge Text</label>
              <input className="ape-input" value={content.introCert} onChange={(e) => set("introCert", e.target.value)} />
            </div>
          </div>
        )}

        {activeTab === "mission" && (
          <div className="ape-body">
            <p className="ape-section-label">Mission</p>
            <div className="ape-field">
              <label className="ape-label">Mission Label</label>
              <input className="ape-input" value={content.missionLabel} onChange={(e) => set("missionLabel", e.target.value)} />
            </div>
            <div className="ape-field">
              <label className="ape-label">Mission Statement</label>
              <textarea className="ape-textarea" rows={3} value={content.missionText} onChange={(e) => set("missionText", e.target.value)} />
            </div>
            <p className="ape-section-label">Vision</p>
            <div className="ape-field">
              <label className="ape-label">Vision Label</label>
              <input className="ape-input" value={content.visionLabel} onChange={(e) => set("visionLabel", e.target.value)} />
            </div>
            <div className="ape-field">
              <label className="ape-label">Vision Statement</label>
              <textarea className="ape-textarea" rows={3} value={content.visionText} onChange={(e) => set("visionText", e.target.value)} />
            </div>
          </div>
        )}

        {activeTab === "trust" && (
          <div className="ape-body">
            <div className="ape-field">
              <label className="ape-label">Section Headline</label>
              <input className="ape-input" value={content.trustHeadline} onChange={(e) => set("trustHeadline", e.target.value)} />
            </div>
            <div className="ape-field">
              <label className="ape-label">Section Subheading</label>
              <textarea className="ape-textarea" rows={2} value={content.trustSub} onChange={(e) => set("trustSub", e.target.value)} />
            </div>
            <p className="ape-section-label">3 Trust Credential Badges</p>
            <div className="ape-badge-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="ape-badge-card">
                  <p className="ape-badge-num">Badge {n}</p>
                  <div className="ape-field">
                    <label className="ape-label">Title</label>
                    <input className="ape-input" value={content[`trustBadge${n}`] || ""} onChange={(e) => set(`trustBadge${n}`, e.target.value)} />
                  </div>
                  <div className="ape-field">
                    <label className="ape-label">Subtitle</label>
                    <input className="ape-input" value={content[`trustBadge${n}Sub`] || ""} onChange={(e) => set(`trustBadge${n}Sub`, e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="ape-body">
            <div className="ape-field">
              <label className="ape-label">SEO Title <span className="ape-label-hint">50–60 chars</span></label>
              <input className="ape-input" value={content.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
              <span className={`ape-char-counter ${seoTitleLen <= 60 ? "ape-char-ok" : seoTitleLen <= 70 ? "ape-char-warn" : "ape-char-over"}`}>{seoTitleLen} / 60</span>
            </div>
            <div className="ape-field">
              <label className="ape-label">SEO Description <span className="ape-label-hint">120–160 chars</span></label>
              <textarea className="ape-textarea" rows={3} value={content.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
              <span className={`ape-char-counter ${seoDescLen <= 160 ? "ape-char-ok" : seoDescLen <= 180 ? "ape-char-warn" : "ape-char-over"}`}>{seoDescLen} / 160</span>
            </div>
            <div style={{ padding: 16, background: "rgba(104,80,68,0.03)", borderRadius: 10, border: "1px solid rgba(104,80,68,0.08)" }}>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "9.5px", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(104,80,68,0.38)", marginBottom: 10 }}>Search Preview</p>
              <p style={{ fontFamily: "arial", fontSize: 18, color: "#1a0dab", marginBottom: 3, lineHeight: 1.3 }}>{content.seoTitle}</p>
              <p style={{ fontFamily: "arial", fontSize: 12, color: "#006621", marginBottom: 4 }}>dhanamitra.com/about</p>
              <p style={{ fontFamily: "arial", fontSize: 13, color: "#545454", lineHeight: 1.5 }}>{content.seoDescription}</p>
            </div>
          </div>
        )}
      </div>

      <div className="ape-save-bar">
        {saved && <span className="ape-saved-msg">✓ Changes saved successfully</span>}
        <button className="ape-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? <><span className="ape-spinner" />Saving…</> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}