// src/app/(admin)/admin/blog/_components/BlogForm.tsx
"use client";

import { useState, useEffect, useRef } from "react";

export type BlogFormData = {
  title:           string;
  slug:            string;
  excerpt:         string;
  content:         string;
  category:        string;
  tags:            string;
  author:          string;
  status:          "published" | "draft";
  featuredImage:   string;
  readTime:        number;
  seoTitle:        string;
  seoDescription:  string;
  seoKeywords:     string;
  ogImage:         string;
  publishDate:     string;
};

type Props = {
  initialData?: Partial<BlogFormData>;
  onSubmit:     (data: BlogFormData) => void;
  isSaving:     boolean;
};

const CATEGORIES = [
  "Technology", "Business", "Web Development", "Software",
  "Digital Marketing", "Case Study", "News", "Other",
];

function toSlug(str: string) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogForm({ initialData, onSubmit, isSaving }: Props) {
  const [form, setForm] = useState<BlogFormData>({
    title:          initialData?.title          ?? "",
    slug:           initialData?.slug           ?? "",
    excerpt:        initialData?.excerpt        ?? "",
    content:        initialData?.content        ?? "",
    category:       initialData?.category       ?? "",
    tags:           initialData?.tags           ?? "",
    author:         initialData?.author         ?? "Dhanamitra Infotech LLP",
    status:         initialData?.status         ?? "draft",
    featuredImage:  initialData?.featuredImage  ?? "",
    readTime:       initialData?.readTime       ?? 5,
    seoTitle:       initialData?.seoTitle       ?? "",
    seoDescription: initialData?.seoDescription ?? "",
    seoKeywords:    initialData?.seoKeywords    ?? "",
    ogImage:        initialData?.ogImage        ?? "",
    publishDate:    initialData?.publishDate    ?? new Date().toISOString().slice(0, 10),
  });

  const [slugLocked,      setSlugLocked]      = useState(!!initialData?.slug);
  const [activeTab,       setActiveTab]       = useState<"content" | "seo">("content");
  const [uploadingCover,  setUploadingCover]  = useState(false);
  const [uploadingOg,     setUploadingOg]     = useState(false);
  const [uploadError,     setUploadError]     = useState("");

  const coverInputRef = useRef<HTMLInputElement>(null);
  const ogInputRef    = useRef<HTMLInputElement>(null);

  // Auto-generate slug
  useEffect(() => {
    if (!slugLocked && form.title) {
      setForm(f => ({ ...f, slug: toSlug(f.title) }));
    }
  }, [form.title, slugLocked]);

  // Auto-fill SEO title
  useEffect(() => {
    if (!form.seoTitle && form.title) {
      setForm(f => ({ ...f, seoTitle: `${f.title} | Dhanamitra Infotech LLP` }));
    }
  }, [form.title]);

  // Auto-fill SEO description
  useEffect(() => {
    if (!form.seoDescription && form.excerpt) {
      setForm(f => ({ ...f, seoDescription: f.excerpt.slice(0, 160) }));
    }
  }, [form.excerpt]);

  const set = (field: keyof BlogFormData, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }));

  // ── Image Upload ────────────────────────────────────────────────────────────
  async function handleUpload(
    file: File,
    field: "featuredImage" | "ogImage",
    setUploading: (v: boolean) => void
  ) {
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Upload failed.");
      set(field, json.url);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const seoTitleLen = form.seoTitle.length;
  const seoDescLen  = form.seoDescription.length;

  // ── Image Field Component ───────────────────────────────────────────────────
  const ImageUploadField = ({
    label, hint, field, value, uploading, inputRef,
  }: {
    label: string; hint: string;
    field: "featuredImage" | "ogImage";
    value: string; uploading: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => (
    <div className="bf-field">
      <label className="bf-label">
        {label}
        <span className="bf-label-hint">{hint}</span>
      </label>

      {/* Preview */}
      {value && (
        <div style={{ position: "relative", display: "inline-block", marginBottom: 8 }}>
          <img
            src={value} alt="preview"
            style={{ height: 80, maxWidth: 240, objectFit: "cover", borderRadius: 8, display: "block" }}
          />
          <button
            type="button"
            onClick={() => set(field, "")}
            style={{
              position: "absolute", top: -6, right: -6,
              width: 20, height: 20, borderRadius: "50%",
              background: "#c0392b", color: "#fff",
              border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>
      )}

      {/* Upload button */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            padding: "8px 16px", borderRadius: 9,
            background: "#3a405a", color: "#f9dec9",
            border: "none", cursor: uploading ? "not-allowed" : "pointer",
            fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 500,
            opacity: uploading ? 0.6 : 1,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {uploading ? (
            <><span style={spinnerStyle} />Uploading…</>
          ) : (
            value ? "↑ Change Image" : "↑ Upload Image"
          )}
        </button>
        <span style={{ fontSize: 11, color: "rgba(104,80,68,0.40)" }}>or paste URL below</span>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        style={{ display: "none" }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file, field, field === "featuredImage" ? setUploadingCover : setUploadingOg);
          e.target.value = "";
        }}
      />

      {/* URL fallback */}
      <input
        className="bf-input"
        type="url"
        placeholder="https://… or leave blank"
        value={value}
        onChange={e => set(field, e.target.value)}
        style={{ fontSize: 12 }}
      />
    </div>
  );

  return (
    <form className="bf-root" onSubmit={handleSubmit}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .bf-root { display:flex; flex-direction:column; gap:24px; }

        .bf-card {
          background:#ffffff; border:1px solid rgba(104,80,68,0.09);
          border-radius:16px; overflow:hidden;
        }
        .bf-card-header {
          padding:16px 22px; border-bottom:1px solid rgba(104,80,68,0.07);
          background:rgba(104,80,68,0.02);
        }
        .bf-card-title {
          font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500;
          letter-spacing:0.18em; text-transform:uppercase; color:rgba(104,80,68,0.55);
        }
        .bf-card-body { padding:22px; display:flex; flex-direction:column; gap:18px; }

        .bf-field { display:flex; flex-direction:column; gap:6px; }
        .bf-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:640px){ .bf-row{ grid-template-columns:1fr; } }

        .bf-label {
          font-family:'DM Sans',sans-serif; font-size:10.5px; font-weight:500;
          letter-spacing:0.13em; text-transform:uppercase; color:rgba(104,80,68,0.55);
          display:flex; align-items:center; gap:6px;
        }
        .bf-label-required { color:#c0392b; font-size:12px; }
        .bf-label-hint {
          font-size:9.5px; font-weight:300; letter-spacing:0; text-transform:none;
          color:rgba(104,80,68,0.38); margin-left:auto;
        }

        .bf-input, .bf-select, .bf-textarea {
          width:100%; padding:10px 13px; border-radius:9px;
          border:1px solid rgba(104,80,68,0.14); background:#fdfaf8;
          font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:300;
          color:#3a405a; outline:none;
          transition:border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing:border-box;
        }
        .bf-input:focus,.bf-select:focus,.bf-textarea:focus {
          border-color:rgba(153,178,221,0.55);
          box-shadow:0 0 0 3px rgba(153,178,221,0.10);
          background:#ffffff;
        }
        .bf-input::placeholder,.bf-textarea::placeholder { color:rgba(104,80,68,0.30); }
        .bf-textarea { resize:vertical; min-height:100px; line-height:1.7; }
        .bf-textarea-content { min-height:280px; font-size:13px; line-height:1.8; }
        .bf-select {
          cursor:pointer; appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23685044' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:right 13px center; padding-right:36px;
        }

        .bf-slug-wrap { display:flex; gap:8px; align-items:center; }
        .bf-slug-wrap .bf-input { flex:1; font-size:12.5px; color:rgba(58,64,90,0.70); }
        .bf-slug-lock {
          padding:10px 13px; border-radius:9px;
          border:1px solid rgba(104,80,68,0.13); background:rgba(104,80,68,0.04);
          font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500;
          color:rgba(104,80,68,0.55); cursor:pointer; white-space:nowrap;
          transition:background 0.2s ease;
        }
        .bf-slug-lock:hover { background:rgba(104,80,68,0.08); }

        .bf-status-group { display:flex; gap:8px; }
        .bf-status-btn {
          flex:1; padding:9px 12px; border-radius:9px;
          border:1px solid rgba(104,80,68,0.13); background:transparent; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:12px; font-weight:400;
          color:rgba(104,80,68,0.55); transition:all 0.2s ease;
        }
        .bf-status-btn.active-published { background:rgba(100,180,100,0.10); border-color:rgba(100,180,100,0.25); color:#3a7a3a; font-weight:500; }
        .bf-status-btn.active-draft     { background:rgba(200,160,60,0.10);  border-color:rgba(200,160,60,0.25);  color:#7a5a10; font-weight:500; }

        .bf-char-counter { font-family:'DM Sans',sans-serif; font-size:10.5px; font-weight:300; text-align:right; margin-top:-12px; }
        .bf-char-ok   { color:rgba(60,160,60,0.70); }
        .bf-char-warn { color:rgba(200,140,40,0.80); }
        .bf-char-over { color:#c0392b; }

        .bf-tabs { display:flex; border-bottom:1px solid rgba(104,80,68,0.09); background:rgba(104,80,68,0.02); }
        .bf-tab {
          padding:13px 20px; font-family:'DM Sans',sans-serif; font-size:11.5px; font-weight:400;
          color:rgba(104,80,68,0.50); border:none; background:none; cursor:pointer;
          border-bottom:2px solid transparent; margin-bottom:-1px; transition:color 0.2s ease, border-color 0.2s ease;
        }
        .bf-tab.active { color:#3a405a; border-bottom-color:#3a405a; font-weight:500; }

        .bf-submit-bar {
          display:flex; align-items:center; gap:12px; justify-content:flex-end;
          padding:18px 22px; background:rgba(255,255,255,0.80);
          border:1px solid rgba(104,80,68,0.09); border-radius:16px;
          position:sticky; bottom:16px; backdrop-filter:blur(12px);
        }
        .bf-save-draft-btn {
          padding:10px 20px; border-radius:9px; border:1px solid rgba(104,80,68,0.15);
          background:transparent; cursor:pointer; font-family:'DM Sans',sans-serif;
          font-size:12.5px; font-weight:400; color:#685044; transition:background 0.2s ease;
        }
        .bf-save-draft-btn:hover { background:rgba(104,80,68,0.05); }
        .bf-submit-btn {
          padding:10px 24px; border-radius:9px; border:none;
          background:#3a405a; color:#f9dec9;
          font-family:'DM Sans',sans-serif; font-size:12.5px; font-weight:500;
          letter-spacing:0.08em; text-transform:uppercase; cursor:pointer;
          transition:transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          display:flex; align-items:center; gap:8px;
        }
        .bf-submit-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 18px rgba(58,64,90,0.18); }
        .bf-submit-btn:disabled { opacity:0.60; cursor:not-allowed; }

        .bf-upload-error {
          padding:10px 14px; border-radius:9px;
          background:rgba(192,57,43,0.06); border:1px solid rgba(192,57,43,0.14);
          color:#c0392b; font-family:'DM Sans',sans-serif; font-size:12px;
        }

        .bf-preview-url {
          font-family:'DM Sans',sans-serif; font-size:11px; font-weight:300;
          color:rgba(104,80,68,0.40); padding:6px 10px;
          background:rgba(104,80,68,0.04); border-radius:6px; word-break:break-all;
        }

        @keyframes bf-spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* Upload error */}
      {uploadError && <p className="bf-upload-error">⚠ {uploadError}</p>}

      {/* ── Basic Info ── */}
      <div className="bf-card">
        <div className="bf-card-header">
          <span className="bf-card-title">Basic Information</span>
        </div>
        <div className="bf-card-body">

          <div className="bf-field">
            <label className="bf-label">Title <span className="bf-label-required">*</span></label>
            <input className="bf-input" type="text"
              placeholder="e.g. Why Every Business Needs a Modern Website"
              value={form.title} onChange={e => set("title", e.target.value)} required />
          </div>

          <div className="bf-field">
            <label className="bf-label">
              Slug
              <span className="bf-label-hint">{slugLocked ? "🔒 locked" : "auto-generated from title"}</span>
            </label>
            <div className="bf-slug-wrap">
              <input className="bf-input" type="text"
                value={form.slug} onChange={e => set("slug", toSlug(e.target.value))}
                readOnly={!slugLocked} placeholder="auto-generated" />
              <button type="button" className="bf-slug-lock" onClick={() => setSlugLocked(v => !v)}>
                {slugLocked ? "Unlock" : "Edit"}
              </button>
            </div>
            {form.slug && <span className="bf-preview-url">/blog/{form.slug}</span>}
          </div>

          <div className="bf-field">
            <label className="bf-label">Excerpt <span className="bf-label-required">*</span>
              <span className="bf-label-hint">shown on blog listing</span>
            </label>
            <textarea className="bf-textarea" rows={3}
              placeholder="A short summary of the article (1–2 sentences)…"
              value={form.excerpt} onChange={e => set("excerpt", e.target.value)} required />
          </div>

          <div className="bf-row">
            <div className="bf-field">
              <label className="bf-label">Category <span className="bf-label-required">*</span></label>
              <select className="bf-select" value={form.category}
                onChange={e => set("category", e.target.value)} required>
                <option value="">Select category…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="bf-field">
              <label className="bf-label">Author</label>
              <input className="bf-input" type="text" placeholder="Author name"
                value={form.author} onChange={e => set("author", e.target.value)} />
            </div>
          </div>

          <div className="bf-row">
            <div className="bf-field">
              <label className="bf-label">Tags <span className="bf-label-hint">comma separated</span></label>
              <input className="bf-input" type="text" placeholder="website, SEO, business"
                value={form.tags} onChange={e => set("tags", e.target.value)} />
            </div>
            <div className="bf-field">
              <label className="bf-label">Read Time (mins)</label>
              <input className="bf-input" type="number" min={1} max={60}
                value={form.readTime} onChange={e => set("readTime", Number(e.target.value))} />
            </div>
          </div>

          <div className="bf-row">
            <div className="bf-field">
              <label className="bf-label">Publish Date</label>
              <input className="bf-input" type="date"
                value={form.publishDate} onChange={e => set("publishDate", e.target.value)} />
            </div>
            <div className="bf-field">
              <label className="bf-label">Status</label>
              <div className="bf-status-group">
                <button type="button"
                  className={`bf-status-btn ${form.status === "published" ? "active-published" : ""}`}
                  onClick={() => set("status", "published")}>● Published</button>
                <button type="button"
                  className={`bf-status-btn ${form.status === "draft" ? "active-draft" : ""}`}
                  onClick={() => set("status", "draft")}>○ Draft</button>
              </div>
            </div>
          </div>

          {/* Featured Image Upload */}
          <ImageUploadField
            label="Featured Image"
            hint="shown at top of post and in listing"
            field="featuredImage"
            value={form.featuredImage}
            uploading={uploadingCover}
            inputRef={coverInputRef}
          />

        </div>
      </div>

      {/* ── Content + SEO tabs ── */}
      <div className="bf-card">
        <div className="bf-tabs">
          <button type="button" className={`bf-tab ${activeTab === "content" ? "active" : ""}`}
            onClick={() => setActiveTab("content")}>Article Content</button>
          <button type="button" className={`bf-tab ${activeTab === "seo" ? "active" : ""}`}
            onClick={() => setActiveTab("seo")}>SEO & Meta</button>
        </div>

        {activeTab === "content" && (
          <div className="bf-card-body">
            <div className="bf-field">
              <label className="bf-label">Full Article Content <span className="bf-label-required">*</span>
                <span className="bf-label-hint">plain text or markdown</span>
              </label>
              <textarea className="bf-textarea bf-textarea-content"
                placeholder={"Write the full article here…\n\n## Heading\n**bold**, _italic_\n\nParagraphs separated by blank lines."}
                value={form.content} onChange={e => set("content", e.target.value)} required />
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="bf-card-body">
            <div className="bf-field">
              <label className="bf-label">SEO Title <span className="bf-label-hint">ideal: 50–60 chars</span></label>
              <input className="bf-input" type="text"
                placeholder="Article Title | Dhanamitra Infotech LLP"
                value={form.seoTitle} onChange={e => set("seoTitle", e.target.value)} />
              <span className={`bf-char-counter ${seoTitleLen === 0 ? "" : seoTitleLen <= 60 ? "bf-char-ok" : seoTitleLen <= 70 ? "bf-char-warn" : "bf-char-over"}`}>
                {seoTitleLen} / 60 chars
              </span>
            </div>

            <div className="bf-field">
              <label className="bf-label">SEO Description <span className="bf-label-hint">ideal: 120–160 chars</span></label>
              <textarea className="bf-textarea" rows={3}
                placeholder="A concise description for search engines…"
                value={form.seoDescription} onChange={e => set("seoDescription", e.target.value)} />
              <span className={`bf-char-counter ${seoDescLen === 0 ? "" : seoDescLen <= 160 ? "bf-char-ok" : seoDescLen <= 180 ? "bf-char-warn" : "bf-char-over"}`}>
                {seoDescLen} / 160 chars
              </span>
            </div>

            <div className="bf-field">
              <label className="bf-label">SEO Keywords <span className="bf-label-hint">comma separated</span></label>
              <input className="bf-input" type="text"
                placeholder="website development, SEO, digital presence"
                value={form.seoKeywords} onChange={e => set("seoKeywords", e.target.value)} />
            </div>

            {/* OG Image Upload */}
            <ImageUploadField
              label="Open Graph Image"
              hint="shown when shared on social — 1200×630px"
              field="ogImage"
              value={form.ogImage}
              uploading={uploadingOg}
              inputRef={ogInputRef}
            />

            {/* Search Preview */}
            {(form.seoTitle || form.seoDescription) && (
              <div style={{ padding:16, background:"rgba(104,80,68,0.03)", borderRadius:10, border:"1px solid rgba(104,80,68,0.08)" }}>
                <p style={{ fontFamily:"DM Sans,sans-serif", fontSize:"9.5px", fontWeight:500, letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(104,80,68,0.38)", marginBottom:10 }}>
                  Search Preview
                </p>
                <p style={{ fontFamily:"arial,sans-serif", fontSize:18, color:"#1a0dab", marginBottom:3, lineHeight:1.3 }}>
                  {form.seoTitle || form.title}
                </p>
                <p style={{ fontFamily:"arial,sans-serif", fontSize:12, color:"#006621", marginBottom:4 }}>
                  dhanamitra.com/blog/{form.slug}
                </p>
                <p style={{ fontFamily:"arial,sans-serif", fontSize:13, color:"#545454", lineHeight:1.5 }}>
                  {form.seoDescription || form.excerpt}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Submit bar ── */}
      <div className="bf-submit-bar">
        <button type="button" className="bf-save-draft-btn"
          onClick={() => { set("status", "draft"); setTimeout(() => onSubmit({ ...form, status: "draft" }), 0); }}
          disabled={isSaving}>
          Save as Draft
        </button>
        <button type="submit" className="bf-submit-btn" disabled={isSaving}>
          {isSaving
            ? <><span style={spinnerStyle} />Saving…</>
            : form.status === "published" ? "Publish Post" : "Save Post"
          }
        </button>
      </div>
    </form>
  );
}

const spinnerStyle: React.CSSProperties = {
  width: 13, height: 13, borderRadius: "50%",
  border: "2px solid rgba(249,222,201,0.30)",
  borderTopColor: "#f9dec9",
  animation: "bf-spin 0.7s linear infinite",
  display: "inline-block",
};