// app/admin/pages/home/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Home page content editor.
// Fields map directly to app/components/home/Hero.tsx content.
// CMS NOTE: Replace defaultContent with DB fetch. On save, write to DB/CMS.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import Link from "next/link";

// ── Default content matches Hero.tsx exactly ──────────────────────────────────
const defaultContent = {
  // Eyebrow
  eyebrow: "Premium Digital Solutions",

  // Hero headline — split into parts for italic/bold control
  headlinePart1: "Build",
  headlineItalic: "Powerful",
  headlinePart2: "Websites,",
  headlinePart3: "Software &",
  headlineBold: "Growth Systems",
  headlinePart4: "for Modern Brands",

  // Subheading
  subheading: "Dhanamitra Infotech LLP helps businesses grow with modern websites, software solutions, digital strategy, and performance-focused user experiences.",

  // CTA buttons
  ctaPrimary:   "Get Free Consultation",
  ctaSecondary: "Explore Services",

  // Stat cards (3 cards)
  stat1Top:    "ISO",
  stat1Bottom: "9001:2015 Certified\nProcess Standards",

  stat2Top:    "UI/UX",
  stat2Bottom: "Modern, responsive &\nconversion-ready design",

  stat3Top:    "SEO",
  stat3Bottom: "Architecture built for\nvisibility & growth",

  // SEO
  seoTitle:       "Dhanamitra Infotech LLP — Digital Solutions, Website Development & Software",
  seoDescription: "Dhanamitra Infotech LLP helps businesses grow with modern websites, software solutions, digital strategy, and performance-focused user experiences.",
};

type ContentType = typeof defaultContent;

export default function HomePageEditor() {
  const [content, setContent] = useState<ContentType>(defaultContent);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "stats" | "seo">("hero");

  function set(field: keyof ContentType, value: string) {
    setContent((c) => ({ ...c, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    // CMS NOTE: POST /api/admin/pages/home with content
    await new Promise((r) => setTimeout(r, 600)); // placeholder
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const seoTitleLen = content.seoTitle.length;
  const seoDescLen  = content.seoDescription.length;

  return (
    <div className="hpe-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .hpe-root { display: flex; flex-direction: column; gap: 24px; max-width: 860px; animation: hpeFade 0.4s ease both; }
        @keyframes hpeFade { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }

        .hpe-topbar { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }

        .hpe-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400;
          color: rgba(104,80,68,0.55); text-decoration: none;
          padding: 7px 13px; border-radius: 8px;
          border: 1px solid rgba(104,80,68,0.12); background: #ffffff;
          transition: background 0.2s ease;
        }
        .hpe-back:hover { background: rgba(104,80,68,0.04); }

        .hpe-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 400;
          color: var(--color-primary, #3a405a); margin: 0; flex: 1;
        }

        .hpe-badge {
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 400;
          color: rgba(104,80,68,0.45); background: rgba(104,80,68,0.05);
          border: 1px solid rgba(104,80,68,0.10); padding: 4px 12px; border-radius: 100px;
        }

        .hpe-card {
          background: #ffffff; border: 1px solid rgba(104,80,68,0.09);
          border-radius: 16px; overflow: hidden;
        }

        .hpe-tabs {
          display: flex; border-bottom: 1px solid rgba(104,80,68,0.09);
          background: rgba(104,80,68,0.02);
        }

        .hpe-tab {
          padding: 13px 20px; font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 400; color: rgba(104,80,68,0.50);
          border: none; background: none; cursor: pointer;
          border-bottom: 2px solid transparent; margin-bottom: -1px;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .hpe-tab.active {
          color: var(--color-primary, #3a405a);
          border-bottom-color: var(--color-primary, #3a405a); font-weight: 500;
        }

        .hpe-body { padding: 22px; display: flex; flex-direction: column; gap: 18px; }

        .hpe-section-label {
          font-family: 'DM Sans', sans-serif; font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.20em; text-transform: uppercase;
          color: rgba(104,80,68,0.35);
          padding-bottom: 8px; border-bottom: 1px solid rgba(104,80,68,0.07);
          margin-bottom: -6px;
        }

        .hpe-field { display: flex; flex-direction: column; gap: 6px; }
        .hpe-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .hpe-row { grid-template-columns: 1fr; } }

        .hpe-label {
          font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.13em; text-transform: uppercase;
          color: rgba(104,80,68,0.55);
          display: flex; align-items: center; gap: 6px;
        }

        .hpe-label-hint {
          font-size: 9.5px; font-weight: 300;
          letter-spacing: 0; text-transform: none;
          color: rgba(104,80,68,0.35); margin-left: auto;
        }

        .hpe-input, .hpe-textarea {
          width: 100%; padding: 10px 13px; border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.14); background: #fdfaf8;
          font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 300;
          color: var(--color-primary, #3a405a); outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }
        .hpe-input:focus, .hpe-textarea:focus {
          border-color: rgba(153,178,221,0.55);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.10); background: #ffffff;
        }
        .hpe-textarea { resize: vertical; min-height: 80px; line-height: 1.7; }

        /* Stat card editor */
        .hpe-stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 640px) { .hpe-stat-grid { grid-template-columns: 1fr; } }

        .hpe-stat-card {
          border: 1px solid rgba(104,80,68,0.09); border-radius: 12px;
          padding: 14px; display: flex; flex-direction: column; gap: 10px;
          background: rgba(104,80,68,0.02);
        }

        .hpe-stat-num {
          font-family: 'Cormorant Garamond', serif; font-size: 11px; font-weight: 300;
          letter-spacing: 0.14em; color: rgba(104,80,68,0.35); margin-bottom: 2px;
        }

        /* Live hero preview */
        .hpe-preview {
          background: linear-gradient(160deg, #fffaf7 0%, #fdf3eb 100%);
          border: 1px solid rgba(104,80,68,0.09); border-radius: 14px;
          padding: 28px 24px; text-align: center;
          position: relative; overflow: hidden;
        }

        .hpe-preview-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--color-primary, #3a405a);
          background: rgba(255,255,255,0.80); border: 1px solid rgba(104,80,68,0.12);
          padding: 4px 14px; border-radius: 100px; margin-bottom: 16px;
        }

        .hpe-preview-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 4vw, 36px); font-weight: 300; line-height: 1.15;
          color: var(--color-primary, #3a405a); margin: 0 0 12px;
        }

        .hpe-preview-sub {
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 300;
          color: rgba(104,80,68,0.65); max-width: 480px; margin: 0 auto 16px;
          line-height: 1.65;
        }

        .hpe-preview-btns { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }

        .hpe-preview-btn-p {
          padding: 8px 18px; border-radius: 4px;
          background: var(--color-primary, #3a405a); color: #f9dec9;
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500;
          letter-spacing: 0.09em; text-transform: uppercase;
        }

        .hpe-preview-btn-s {
          padding: 8px 18px; border-radius: 4px;
          background: transparent; color: var(--color-primary, #3a405a);
          border: 1px solid rgba(58,64,90,0.25);
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500;
          letter-spacing: 0.09em; text-transform: uppercase;
        }

        /* SEO char counter */
        .hpe-char-counter {
          font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 300;
          text-align: right; margin-top: -12px;
        }
        .hpe-char-ok   { color: rgba(60,160,60,0.70); }
        .hpe-char-warn { color: rgba(200,140,40,0.80); }
        .hpe-char-over { color: #c0392b; }

        /* Save bar */
        .hpe-save-bar {
          display: flex; align-items: center; gap: 12px; justify-content: flex-end;
          padding: 16px 22px; background: rgba(255,255,255,0.85);
          border: 1px solid rgba(104,80,68,0.09); border-radius: 14px;
          position: sticky; bottom: 16px; backdrop-filter: blur(12px);
        }

        .hpe-saved-msg {
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400;
          color: #3a7a3a; flex: 1;
        }

        .hpe-save-btn {
          padding: 10px 24px; border-radius: 9px; border: none;
          background: var(--color-primary, #3a405a); color: #f9dec9;
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          display: flex; align-items: center; gap: 8px;
        }
        .hpe-save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(58,64,90,0.18); }
        .hpe-save-btn:disabled { opacity: 0.60; cursor: not-allowed; }

        .hpe-spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(249,222,201,0.30); border-top-color: #f9dec9;
          border-radius: 50%; animation: hpespin 0.7s linear infinite;
        }
        @keyframes hpespin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Top bar */}
      <div className="hpe-topbar">
        <Link href="/admin/pages" className="hpe-back">← Back</Link>
        <h1 className="hpe-heading">Home Page</h1>
        <span className="hpe-badge">/ (root)</span>
      </div>

      {/* Live preview */}
      <div className="hpe-preview">
        <div className="hpe-preview-eyebrow">
          <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--color-accent-blush,#e9afa3)", display:"inline-block" }} />
          {content.eyebrow}
        </div>
        <h2 className="hpe-preview-h1">
          {content.headlinePart1} <em style={{ fontStyle:"italic", color:"var(--color-primary-2,#685044)" }}>{content.headlineItalic}</em> {content.headlinePart2}
          <br />{content.headlinePart3} <strong style={{ fontWeight:600 }}>{content.headlineBold}</strong>
          <br />{content.headlinePart4}
        </h2>
        <p className="hpe-preview-sub">{content.subheading}</p>
        <div className="hpe-preview-btns">
          <span className="hpe-preview-btn-p">{content.ctaPrimary}</span>
          <span className="hpe-preview-btn-s">{content.ctaSecondary}</span>
        </div>
      </div>

      {/* Editor card */}
      <div className="hpe-card">
        <div className="hpe-tabs">
          {(["hero", "stats", "seo"] as const).map((t) => (
            <button key={t} type="button"
              className={`hpe-tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}>
              {t === "hero" ? "Hero Section" : t === "stats" ? "Stat Cards" : "SEO & Meta"}
            </button>
          ))}
        </div>

        {/* ── Hero tab ── */}
        {activeTab === "hero" && (
          <div className="hpe-body">
            <p className="hpe-section-label">Eyebrow</p>
            <div className="hpe-field">
              <label className="hpe-label">Eyebrow Text</label>
              <input className="hpe-input" value={content.eyebrow}
                onChange={(e) => set("eyebrow", e.target.value)} />
            </div>

            <p className="hpe-section-label">Headline — maps to H1 in Hero.tsx</p>
            <div className="hpe-row">
              <div className="hpe-field">
                <label className="hpe-label">Part 1 <span className="hpe-label-hint">plain text</span></label>
                <input className="hpe-input" value={content.headlinePart1}
                  onChange={(e) => set("headlinePart1", e.target.value)} />
              </div>
              <div className="hpe-field">
                <label className="hpe-label">Italic Word <span className="hpe-label-hint">{"<em>"}</span></label>
                <input className="hpe-input" value={content.headlineItalic}
                  onChange={(e) => set("headlineItalic", e.target.value)} />
              </div>
            </div>
            <div className="hpe-row">
              <div className="hpe-field">
                <label className="hpe-label">Part 2</label>
                <input className="hpe-input" value={content.headlinePart2}
                  onChange={(e) => set("headlinePart2", e.target.value)} />
              </div>
              <div className="hpe-field">
                <label className="hpe-label">Part 3</label>
                <input className="hpe-input" value={content.headlinePart3}
                  onChange={(e) => set("headlinePart3", e.target.value)} />
              </div>
            </div>
            <div className="hpe-row">
              <div className="hpe-field">
                <label className="hpe-label">Bold Phrase <span className="hpe-label-hint">{"<strong>"}</span></label>
                <input className="hpe-input" value={content.headlineBold}
                  onChange={(e) => set("headlineBold", e.target.value)} />
              </div>
              <div className="hpe-field">
                <label className="hpe-label">Part 4 <span className="hpe-label-hint">last line</span></label>
                <input className="hpe-input" value={content.headlinePart4}
                  onChange={(e) => set("headlinePart4", e.target.value)} />
              </div>
            </div>

            <p className="hpe-section-label">Subheading</p>
            <div className="hpe-field">
              <label className="hpe-label">Subheading Paragraph</label>
              <textarea className="hpe-textarea" rows={3} value={content.subheading}
                onChange={(e) => set("subheading", e.target.value)} />
            </div>

            <p className="hpe-section-label">CTA Buttons</p>
            <div className="hpe-row">
              <div className="hpe-field">
                <label className="hpe-label">Primary Button</label>
                <input className="hpe-input" value={content.ctaPrimary}
                  onChange={(e) => set("ctaPrimary", e.target.value)} />
              </div>
              <div className="hpe-field">
                <label className="hpe-label">Secondary Button</label>
                <input className="hpe-input" value={content.ctaSecondary}
                  onChange={(e) => set("ctaSecondary", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ── Stats tab ── */}
        {activeTab === "stats" && (
          <div className="hpe-body">
            <p className="hpe-section-label">3 Stat Cards — shown below hero headline</p>
            <div className="hpe-stat-grid">
              {([1, 2, 3] as const).map((n) => (
                <div key={n} className="hpe-stat-card">
                  <p className="hpe-stat-num">Card {n}</p>
                  <div className="hpe-field">
                    <label className="hpe-label">Top Label</label>
                    <input className="hpe-input"
                      value={content[`stat${n}Top` as keyof ContentType]}
                      onChange={(e) => set(`stat${n}Top` as keyof ContentType, e.target.value)} />
                  </div>
                  <div className="hpe-field">
                    <label className="hpe-label">Bottom Text <span className="hpe-label-hint">use \n for line break</span></label>
                    <textarea className="hpe-textarea" rows={2}
                      value={content[`stat${n}Bottom` as keyof ContentType]}
                      onChange={(e) => set(`stat${n}Bottom` as keyof ContentType, e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            {/* Stat preview */}
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              {([1, 2, 3] as const).map((n) => (
                <div key={n} style={{
                  flex:1, background:"rgba(255,255,255,0.80)",
                  border:"1px solid rgba(104,80,68,0.10)",
                  borderRadius:12, padding:"14px 12px", textAlign:"center",
                }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:300, color:"#3a405a" }}>
                    {content[`stat${n}Top` as keyof ContentType]}
                  </div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:300, color:"#685044", marginTop:4, lineHeight:1.5 }}>
                    {String(content[`stat${n}Bottom` as keyof ContentType]).replace(/\\n/g, "\n")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SEO tab ── */}
        {activeTab === "seo" && (
          <div className="hpe-body">
            <div className="hpe-field">
              <label className="hpe-label">SEO Title <span className="hpe-label-hint">50–60 chars ideal</span></label>
              <input className="hpe-input" value={content.seoTitle}
                onChange={(e) => set("seoTitle", e.target.value)} />
              <span className={`hpe-char-counter ${seoTitleLen <= 60 ? "hpe-char-ok" : seoTitleLen <= 70 ? "hpe-char-warn" : "hpe-char-over"}`}>
                {seoTitleLen} / 60
              </span>
            </div>
            <div className="hpe-field">
              <label className="hpe-label">SEO Description <span className="hpe-label-hint">120–160 chars ideal</span></label>
              <textarea className="hpe-textarea" rows={3} value={content.seoDescription}
                onChange={(e) => set("seoDescription", e.target.value)} />
              <span className={`hpe-char-counter ${seoDescLen <= 160 ? "hpe-char-ok" : seoDescLen <= 180 ? "hpe-char-warn" : "hpe-char-over"}`}>
                {seoDescLen} / 160
              </span>
            </div>
            {/* Search preview */}
            <div style={{ padding:16, background:"rgba(104,80,68,0.03)", borderRadius:10, border:"1px solid rgba(104,80,68,0.08)" }}>
              <p style={{ fontFamily:"'DM Sans'", fontSize:"9.5px", fontWeight:500, letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(104,80,68,0.38)", marginBottom:10 }}>Search Preview</p>
              <p style={{ fontFamily:"arial", fontSize:18, color:"#1a0dab", marginBottom:3, lineHeight:1.3 }}>{content.seoTitle}</p>
              <p style={{ fontFamily:"arial", fontSize:12, color:"#006621", marginBottom:4 }}>dhanamitra.com</p>
              <p style={{ fontFamily:"arial", fontSize:13, color:"#545454", lineHeight:1.5 }}>{content.seoDescription}</p>
            </div>
          </div>
        )}
      </div>

      {/* Save bar */}
      <div className="hpe-save-bar">
        {saved && <span className="hpe-saved-msg">✓ Changes saved successfully</span>}
        <button className="hpe-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? <><span className="hpe-spinner" />Saving…</> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}