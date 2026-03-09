// app/admin/portfolio/_components/PortfolioForm.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared form for creating and editing portfolio projects.
// Fields match ProjectGrid.tsx + PortfolioIndustries.tsx (case study) exactly.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
export type CaseStudyResult = {
  metric: string;
  label:  string;
};

export type PortfolioFormData = {
  // ProjectGrid fields
  slug:        string;
  title:       string;
  category:    string;
  industry:    string;
  desc:        string;
  accent:      string;
  year:        string;
  featured:    boolean;
  image:       string;   // URL — replaces placeholder
  projectLink: string;   // external live URL
  status:      "published" | "draft";
  // Case study fields (PortfolioIndustries)
  caseStudyEnabled: boolean;
  problem:     string;
  solution:    string;
  results:     CaseStudyResult[];
  // SEO
  seoTitle:       string;
  seoDescription: string;
};

type Props = {
  initialData?: Partial<PortfolioFormData>;
  onSubmit:     (data: PortfolioFormData) => void;
  isSaving:     boolean;
};

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Web Development", "UI/UX Design", "Digital Strategy",
  "Software", "Branding", "E-Commerce", "Other",
];

const INDUSTRIES = [
  "Education", "Healthcare", "Finance", "Startups",
  "Professional Services", "Research & Academia", "Other",
];

const ACCENT_PRESETS = [
  { label: "Blue",   value: "rgba(153,178,221,0.30)" },
  { label: "Blush",  value: "rgba(233,175,163,0.28)" },
  { label: "Peach",  value: "rgba(249,222,201,0.50)" },
  { label: "Soft B", value: "rgba(153,178,221,0.20)" },
  { label: "Soft R", value: "rgba(233,175,163,0.22)" },
  { label: "Warm",   value: "rgba(249,222,201,0.40)" },
];

const EMPTY_RESULT: CaseStudyResult = { metric: "", label: "" };

function toSlug(str: string) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PortfolioForm({ initialData, onSubmit, isSaving }: Props) {
  const [form, setForm] = useState<PortfolioFormData>({
    slug:             initialData?.slug             ?? "",
    title:            initialData?.title            ?? "",
    category:         initialData?.category         ?? "",
    industry:         initialData?.industry         ?? "",
    desc:             initialData?.desc             ?? "",
    accent:           initialData?.accent           ?? ACCENT_PRESETS[0].value,
    year:             initialData?.year             ?? new Date().getFullYear().toString(),
    featured:         initialData?.featured         ?? false,
    image:            initialData?.image            ?? "",
    projectLink:      initialData?.projectLink      ?? "",
    status:           initialData?.status           ?? "draft",
    caseStudyEnabled: initialData?.caseStudyEnabled ?? false,
    problem:          initialData?.problem          ?? "",
    solution:         initialData?.solution         ?? "",
    results:          initialData?.results          ?? [{ ...EMPTY_RESULT }],
    seoTitle:         initialData?.seoTitle         ?? "",
    seoDescription:   initialData?.seoDescription   ?? "",
  });

  const [slugLocked, setSlugLocked] = useState(!!initialData?.slug);
  const [activeTab,  setActiveTab]  = useState<"basic" | "casestudy" | "seo">("basic");

  useEffect(() => {
    if (!slugLocked && form.title) {
      setForm((f) => ({ ...f, slug: toSlug(f.title) }));
    }
  }, [form.title, slugLocked]);

  useEffect(() => {
    if (!form.seoTitle && form.title) {
      setForm((f) => ({ ...f, seoTitle: f.title + " | Dhanamitra Infotech LLP" }));
    }
  }, [form.title]);

  useEffect(() => {
    if (!form.seoDescription && form.desc) {
      setForm((f) => ({ ...f, seoDescription: f.desc.slice(0, 160) }));
    }
  }, [form.desc]);

  function set<K extends keyof PortfolioFormData>(field: K, value: PortfolioFormData[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function setResult(idx: number, key: keyof CaseStudyResult, val: string) {
    const updated = form.results.map((r, i) => i === idx ? { ...r, [key]: val } : r);
    set("results", updated);
  }

  function addResult() {
    if (form.results.length < 4) set("results", [...form.results, { ...EMPTY_RESULT }]);
  }

  function removeResult(idx: number) {
    set("results", form.results.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const seoTitleLen = form.seoTitle.length;
  const seoDescLen  = form.seoDescription.length;

  return (
    <form className="pf-root" onSubmit={handleSubmit}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .pf-root { display: flex; flex-direction: column; gap: 24px; }

        .pf-card {
          background: #ffffff;
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 16px; overflow: hidden;
        }

        .pf-tabs {
          display: flex;
          border-bottom: 1px solid rgba(104,80,68,0.09);
          background: rgba(104,80,68,0.02);
        }

        .pf-tab {
          padding: 13px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 400;
          color: rgba(104,80,68,0.50);
          border: none; background: none; cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color 0.2s ease, border-color 0.2s ease;
        }

        .pf-tab.active {
          color: var(--color-primary, #3a405a);
          border-bottom-color: var(--color-primary, #3a405a);
          font-weight: 500;
        }

        .pf-card-body {
          padding: 22px;
          display: flex; flex-direction: column; gap: 18px;
        }

        .pf-field { display: flex; flex-direction: column; gap: 6px; }

        .pf-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .pf-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) {
          .pf-row, .pf-row-3 { grid-template-columns: 1fr; }
        }

        .pf-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.13em; text-transform: uppercase;
          color: rgba(104,80,68,0.55);
          display: flex; align-items: center; gap: 6px;
        }

        .pf-label-required { color: #c0392b; font-size: 12px; }
        .pf-label-hint {
          font-size: 9.5px; font-weight: 300;
          letter-spacing: 0; text-transform: none;
          color: rgba(104,80,68,0.38); margin-left: auto;
        }

        .pf-input, .pf-select, .pf-textarea {
          width: 100%; padding: 10px 13px;
          border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.14);
          background: #fdfaf8;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 300;
          color: var(--color-primary, #3a405a);
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .pf-input:focus, .pf-select:focus, .pf-textarea:focus {
          border-color: rgba(153,178,221,0.55);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.10);
          background: #ffffff;
        }

        .pf-input::placeholder, .pf-textarea::placeholder { color: rgba(104,80,68,0.30); }
        .pf-textarea { resize: vertical; min-height: 90px; line-height: 1.7; }

        .pf-select {
          cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23685044' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 13px center;
          padding-right: 36px;
        }

        /* Slug */
        .pf-slug-wrap { display: flex; gap: 8px; align-items: center; }
        .pf-slug-wrap .pf-input { flex: 1; font-size: 12.5px; color: rgba(58,64,90,0.70); }
        .pf-slug-lock {
          padding: 10px 13px; border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.13);
          background: rgba(104,80,68,0.04);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          color: rgba(104,80,68,0.55); cursor: pointer; white-space: nowrap;
          transition: background 0.2s ease;
        }
        .pf-slug-lock:hover { background: rgba(104,80,68,0.08); }
        .pf-preview-url {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 300;
          color: rgba(104,80,68,0.40);
          padding: 5px 10px; background: rgba(104,80,68,0.04); border-radius: 6px;
        }

        /* Status + featured toggles */
        .pf-toggle-group { display: flex; gap: 8px; }
        .pf-toggle-btn {
          flex: 1; padding: 9px 12px; border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.13);
          background: transparent; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 400;
          color: rgba(104,80,68,0.55);
          transition: all 0.2s ease;
        }
        .pf-toggle-btn.active-published {
          background: rgba(100,180,100,0.10); border-color: rgba(100,180,100,0.25);
          color: #3a7a3a; font-weight: 500;
        }
        .pf-toggle-btn.active-draft {
          background: rgba(200,160,60,0.10); border-color: rgba(200,160,60,0.25);
          color: #7a5a10; font-weight: 500;
        }
        .pf-toggle-btn.active-yes {
          background: rgba(153,178,221,0.15); border-color: rgba(153,178,221,0.35);
          color: #3a405a; font-weight: 500;
        }

        /* Accent picker */
        .pf-accent-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .pf-accent-swatch {
          width: 36px; height: 36px; border-radius: 8px;
          border: 2px solid transparent; cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease;
          position: relative;
        }
        .pf-accent-swatch:hover { transform: scale(1.1); }
        .pf-accent-swatch.selected { border-color: var(--color-primary, #3a405a); transform: scale(1.1); }
        .pf-accent-swatch.selected::after {
          content: '✓'; position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: var(--color-primary, #3a405a); font-weight: 700;
        }

        /* Card preview */
        .pf-card-preview {
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(104,80,68,0.10);
          margin-top: 4px;
        }
        .pf-preview-img {
          height: 80px; position: relative;
        }
        .pf-preview-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(58,64,90,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58,64,90,0.06) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .pf-preview-body {
          padding: 12px 14px;
          background: rgba(255,255,255,0.80);
        }
        .pf-preview-cat {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #685044; margin-bottom: 4px;
        }
        .pf-preview-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px; font-weight: 600;
          color: #3a405a; margin: 0;
        }

        /* Case study toggle */
        .pf-cs-toggle {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px; border-radius: 10px;
          background: rgba(104,80,68,0.03);
          border: 1px solid rgba(104,80,68,0.09);
          cursor: pointer;
        }
        .pf-cs-toggle-check {
          width: 20px; height: 20px; border-radius: 6px;
          border: 1.5px solid rgba(104,80,68,0.25);
          background: #ffffff;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: var(--color-primary, #3a405a);
          flex-shrink: 0;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .pf-cs-toggle-check.checked {
          background: var(--color-primary, #3a405a);
          border-color: var(--color-primary, #3a405a);
          color: #f9dec9;
        }
        .pf-cs-toggle-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 400;
          color: var(--color-primary, #3a405a);
        }
        .pf-cs-toggle-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 300;
          color: rgba(104,80,68,0.45);
        }

        /* Results */
        .pf-results-list { display: flex; flex-direction: column; gap: 10px; }
        .pf-result-item {
          display: grid; grid-template-columns: 1fr 1fr auto;
          gap: 10px; align-items: center;
          padding: 12px 14px;
          background: rgba(58,64,90,0.04);
          border: 1px solid rgba(104,80,68,0.08);
          border-radius: 10px;
        }
        @media (max-width: 640px) { .pf-result-item { grid-template-columns: 1fr; } }

        .pf-result-preview {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 600;
          color: var(--color-primary, #3a405a);
          padding: 8px 0;
          text-align: center;
          background: var(--color-primary, #3a405a);
          color: #f9dec9;
          border-radius: 8px;
          margin-top: 4px;
        }

        .pf-remove-btn {
          width: 30px; height: 30px; border-radius: 7px;
          border: 1px solid rgba(192,57,43,0.15);
          background: rgba(192,57,43,0.05);
          color: #c0392b; font-size: 14px;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }
        .pf-remove-btn:hover { background: rgba(192,57,43,0.12); }
        .pf-remove-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .pf-add-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 9px;
          border: 1px dashed rgba(104,80,68,0.20);
          background: transparent; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 400;
          color: rgba(104,80,68,0.55);
          transition: background 0.2s ease, border-color 0.2s ease;
          width: 100%;
        }
        .pf-add-btn:hover {
          background: rgba(104,80,68,0.04);
          border-color: rgba(104,80,68,0.30);
          color: var(--color-primary, #3a405a);
        }

        /* SEO */
        .pf-char-counter {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 300;
          text-align: right; margin-top: -12px;
        }
        .pf-char-ok   { color: rgba(60,160,60,0.70); }
        .pf-char-warn { color: rgba(200,140,40,0.80); }
        .pf-char-over { color: #c0392b; }

        /* Submit bar */
        .pf-submit-bar {
          display: flex; align-items: center; gap: 12px; justify-content: flex-end;
          padding: 18px 22px;
          background: rgba(255,255,255,0.80);
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 16px;
          position: sticky; bottom: 16px;
          backdrop-filter: blur(12px);
        }

        .pf-draft-btn {
          padding: 10px 20px; border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.15);
          background: transparent; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 400;
          color: var(--color-text-soft, #685044);
          transition: background 0.2s ease;
        }
        .pf-draft-btn:hover { background: rgba(104,80,68,0.05); }

        .pf-submit-btn {
          padding: 10px 24px; border-radius: 9px;
          border: none; background: var(--color-primary, #3a405a);
          color: #f9dec9;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          display: flex; align-items: center; gap: 8px;
        }
        .pf-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(58,64,90,0.18);
        }
        .pf-submit-btn:disabled { opacity: 0.60; cursor: not-allowed; }

        .pf-spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(249,222,201,0.30);
          border-top-color: #f9dec9; border-radius: 50%;
          animation: pfspin 0.7s linear infinite;
        }
        @keyframes pfspin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="pf-card">
        <div className="pf-tabs">
          {(["basic", "casestudy", "seo"] as const).map((t) => (
            <button key={t} type="button"
              className={`pf-tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t === "basic" ? "Basic Info" : t === "casestudy" ? "Case Study" : "SEO & Meta"}
            </button>
          ))}
        </div>

        {/* ── Tab: Basic Info ── */}
        {activeTab === "basic" && (
          <div className="pf-card-body">

            {/* Title */}
            <div className="pf-field">
              <label className="pf-label">Title <span className="pf-label-required">*</span></label>
              <input className="pf-input" type="text"
                placeholder="e.g. Corporate Website Redesign"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
            </div>

            {/* Slug */}
            <div className="pf-field">
              <label className="pf-label">
                Slug
                <span className="pf-label-hint">{slugLocked ? "🔒 locked" : "auto from title"}</span>
              </label>
              <div className="pf-slug-wrap">
                <input className="pf-input" type="text"
                  value={form.slug}
                  onChange={(e) => set("slug", toSlug(e.target.value))}
                  readOnly={!slugLocked}
                  placeholder="auto-generated"
                />
                <button type="button" className="pf-slug-lock"
                  onClick={() => setSlugLocked((v) => !v)}>
                  {slugLocked ? "Unlock" : "Edit"}
                </button>
              </div>
              {form.slug && <span className="pf-preview-url">/portfolio/{form.slug}</span>}
            </div>

            {/* Category + Industry */}
            <div className="pf-row">
              <div className="pf-field">
                <label className="pf-label">Category <span className="pf-label-required">*</span></label>
                <select className="pf-select" value={form.category}
                  onChange={(e) => set("category", e.target.value)} required>
                  <option value="">Select…</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="pf-field">
                <label className="pf-label">Industry <span className="pf-label-required">*</span></label>
                <select className="pf-select" value={form.industry}
                  onChange={(e) => set("industry", e.target.value)} required>
                  <option value="">Select…</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>

            {/* Year + Status + Featured */}
            <div className="pf-row-3">
              <div className="pf-field">
                <label className="pf-label">Year</label>
                <input className="pf-input" type="text"
                  placeholder="2024" value={form.year}
                  onChange={(e) => set("year", e.target.value)} />
              </div>
              <div className="pf-field">
                <label className="pf-label">Status</label>
                <div className="pf-toggle-group">
                  <button type="button"
                    className={`pf-toggle-btn ${form.status === "published" ? "active-published" : ""}`}
                    onClick={() => set("status", "published")}>● Live</button>
                  <button type="button"
                    className={`pf-toggle-btn ${form.status === "draft" ? "active-draft" : ""}`}
                    onClick={() => set("status", "draft")}>○ Draft</button>
                </div>
              </div>
              <div className="pf-field">
                <label className="pf-label">Featured</label>
                <div className="pf-toggle-group">
                  <button type="button"
                    className={`pf-toggle-btn ${form.featured ? "active-yes" : ""}`}
                    onClick={() => set("featured", true)}>★ Yes</button>
                  <button type="button"
                    className={`pf-toggle-btn ${!form.featured ? "active-draft" : ""}`}
                    onClick={() => set("featured", false)}>☆ No</button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pf-field">
              <label className="pf-label">
                Description <span className="pf-label-required">*</span>
                <span className="pf-label-hint">shown on grid card</span>
              </label>
              <textarea className="pf-textarea" rows={3}
                placeholder="Full brand presence rebuild with modern UI…"
                value={form.desc}
                onChange={(e) => set("desc", e.target.value)}
                required />
            </div>

            {/* Image + Project link */}
            <div className="pf-row">
              <div className="pf-field">
                <label className="pf-label">
                  Image URL
                  <span className="pf-label-hint">file upload coming later</span>
                </label>
                <input className="pf-input" type="url"
                  placeholder="https://…"
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)} />
              </div>
              <div className="pf-field">
                <label className="pf-label">Live Project URL</label>
                <input className="pf-input" type="url"
                  placeholder="https://…"
                  value={form.projectLink}
                  onChange={(e) => set("projectLink", e.target.value)} />
              </div>
            </div>

            {/* Accent colour */}
            <div className="pf-field">
              <label className="pf-label">Card Accent Colour</label>
              <div className="pf-accent-grid">
                {ACCENT_PRESETS.map((p) => (
                  <div key={p.value}
                    className={`pf-accent-swatch ${form.accent === p.value ? "selected" : ""}`}
                    style={{ background: `radial-gradient(circle, ${p.value}, transparent 80%)`, border: "1px solid rgba(104,80,68,0.15)" }}
                    onClick={() => set("accent", p.value)}
                    title={p.label} />
                ))}
              </div>
              {/* Live card preview */}
              <div className="pf-card-preview">
                <div className="pf-preview-img"
                  style={{ background: `linear-gradient(145deg, ${form.accent}, rgba(255,250,247,0.45))` }}>
                  <div className="pf-preview-grid" />
                </div>
                <div className="pf-preview-body">
                  <p className="pf-preview-cat">{form.category || "Category"} · {form.industry || "Industry"}</p>
                  <p className="pf-preview-title">{form.title || "Project Title"}</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── Tab: Case Study ── */}
        {activeTab === "casestudy" && (
          <div className="pf-card-body">

            {/* Enable toggle */}
            <div className="pf-cs-toggle"
              onClick={() => set("caseStudyEnabled", !form.caseStudyEnabled)}>
              <div className={`pf-cs-toggle-check ${form.caseStudyEnabled ? "checked" : ""}`}>
                {form.caseStudyEnabled && "✓"}
              </div>
              <div>
                <p className="pf-cs-toggle-text">Include Case Study</p>
                <p className="pf-cs-toggle-sub">Adds problem, solution and results to this project</p>
              </div>
            </div>

            {form.caseStudyEnabled && (
              <>
                {/* Problem */}
                <div className="pf-field">
                  <label className="pf-label">The Problem</label>
                  <textarea className="pf-textarea" rows={4}
                    placeholder="Describe the client's challenge before working with you…"
                    value={form.problem}
                    onChange={(e) => set("problem", e.target.value)} />
                </div>

                {/* Solution */}
                <div className="pf-field">
                  <label className="pf-label">Our Solution</label>
                  <textarea className="pf-textarea" rows={4}
                    placeholder="Describe what you built or delivered to solve the problem…"
                    value={form.solution}
                    onChange={(e) => set("solution", e.target.value)} />
                </div>

                {/* Results */}
                <div className="pf-field">
                  <label className="pf-label">
                    Results
                    <span className="pf-label-hint">metric + label pairs (max 4)</span>
                  </label>
                  <div className="pf-results-list">
                    {form.results.map((r, i) => (
                      <div key={i} className="pf-result-item">
                        <div className="pf-field">
                          <span style={{ fontFamily: "'DM Sans'", fontSize: "9.5px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(104,80,68,0.40)" }}>Metric</span>
                          <input className="pf-input" type="text"
                            placeholder="3×"
                            value={r.metric}
                            onChange={(e) => setResult(i, "metric", e.target.value)} />
                        </div>
                        <div className="pf-field">
                          <span style={{ fontFamily: "'DM Sans'", fontSize: "9.5px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(104,80,68,0.40)" }}>Label</span>
                          <input className="pf-input" type="text"
                            placeholder="Increase in session time"
                            value={r.label}
                            onChange={(e) => setResult(i, "label", e.target.value)} />
                        </div>
                        <button type="button" className="pf-remove-btn"
                          onClick={() => removeResult(i)}
                          disabled={form.results.length <= 1}>×</button>
                      </div>
                    ))}
                  </div>
                  {form.results.length < 4 && (
                    <button type="button" className="pf-add-btn" onClick={addResult}>
                      + Add Result
                    </button>
                  )}
                </div>
              </>
            )}

          </div>
        )}

        {/* ── Tab: SEO ── */}
        {activeTab === "seo" && (
          <div className="pf-card-body">

            <div className="pf-field">
              <label className="pf-label">
                SEO Title
                <span className="pf-label-hint">ideal: 50–60 chars</span>
              </label>
              <input className="pf-input" type="text"
                placeholder="Project Title | Dhanamitra Infotech LLP"
                value={form.seoTitle}
                onChange={(e) => set("seoTitle", e.target.value)} />
              <span className={`pf-char-counter ${
                seoTitleLen === 0 ? "" :
                seoTitleLen <= 60 ? "pf-char-ok" :
                seoTitleLen <= 70 ? "pf-char-warn" : "pf-char-over"
              }`}>{seoTitleLen} / 60 chars</span>
            </div>

            <div className="pf-field">
              <label className="pf-label">
                SEO Description
                <span className="pf-label-hint">ideal: 120–160 chars</span>
              </label>
              <textarea className="pf-textarea" rows={3}
                placeholder="Short description for search engines…"
                value={form.seoDescription}
                onChange={(e) => set("seoDescription", e.target.value)} />
              <span className={`pf-char-counter ${
                seoDescLen === 0 ? "" :
                seoDescLen <= 160 ? "pf-char-ok" :
                seoDescLen <= 180 ? "pf-char-warn" : "pf-char-over"
              }`}>{seoDescLen} / 160 chars</span>
            </div>

            {/* Search preview */}
            {(form.seoTitle || form.seoDescription) && (
              <div style={{ padding: "16px", background: "rgba(104,80,68,0.03)", borderRadius: "10px", border: "1px solid rgba(104,80,68,0.08)" }}>
                <p style={{ fontFamily: "'DM Sans'", fontSize: "9.5px", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(104,80,68,0.38)", marginBottom: "10px" }}>Search Preview</p>
                <p style={{ fontFamily: "arial", fontSize: "18px", color: "#1a0dab", marginBottom: "3px", lineHeight: 1.3 }}>{form.seoTitle || form.title}</p>
                <p style={{ fontFamily: "arial", fontSize: "12px", color: "#006621", marginBottom: "4px" }}>dhanamitra.com/portfolio/{form.slug}</p>
                <p style={{ fontFamily: "arial", fontSize: "13px", color: "#545454", lineHeight: 1.5 }}>{form.seoDescription || form.desc}</p>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Submit bar */}
      <div className="pf-submit-bar">
        <button type="button" className="pf-draft-btn"
          onClick={() => { set("status", "draft"); setTimeout(() => onSubmit({ ...form, status: "draft" }), 0); }}
          disabled={isSaving}>
          Save as Draft
        </button>
        <button type="submit" className="pf-submit-btn" disabled={isSaving}>
          {isSaving ? <><span className="pf-spinner" />Saving…</> : "Save Project"}
        </button>
      </div>

    </form>
  );
}