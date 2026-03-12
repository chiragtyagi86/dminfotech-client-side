// app/admin/services/_components/ServiceForm.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared form for creating and editing services.
// Added: Quill rich text editor for full HTML content (used on /services/[slug]).
// Fields match ServicesGrid.tsx + ServiceBlocks.tsx + service detail page.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
export type Highlight = {
  label:  string;
  detail: string;
};

export type ServiceFormData = {
  // ServicesGrid fields
  num:       string;
  slug:      string;
  title:     string;
  tag:       string;
  tagline:   string;
  desc:      string;   // short card description
  features:  string;   // comma-separated
  keywords:  string;
  accent:    string;
  // ServiceBlocks fields
  subtitle:   string;
  fullDesc:   string;  // rich HTML — shown on /services/[slug]
  highlights: Highlight[];
  // Meta
  status:     "active" | "inactive";
  order:      number;
  // SEO
  seoTitle:       string;
  seoDescription: string;
};

type Props = {
  initialData?: Partial<ServiceFormData>;
  onSubmit:     (data: ServiceFormData) => void;
  isSaving:     boolean;
};

const ACCENT_PRESETS = [
  { label: "Blue",   value: "rgba(153,178,221,0.25)" },
  { label: "Blush",  value: "rgba(233,175,163,0.22)" },
  { label: "Peach",  value: "rgba(249,222,201,0.45)" },
  { label: "Soft B", value: "rgba(153,178,221,0.18)" },
  { label: "Soft R", value: "rgba(233,175,163,0.18)" },
  { label: "Warm",   value: "rgba(249,222,201,0.38)" },
  { label: "Muted",  value: "rgba(153,178,221,0.20)" },
];

function toSlug(str: string) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const EMPTY_HIGHLIGHT: Highlight = { label: "", detail: "" };

// ── Quill Editor Component ────────────────────────────────────────────────────

type QuillEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function QuillEditor({ value, onChange, placeholder }: QuillEditorProps) {
  const editorRef  = useRef<HTMLDivElement>(null);
  const quillRef   = useRef<any>(null);
  const isUpdating = useRef(false);

  useEffect(() => {
    // Dynamically load Quill so it doesn't SSR
    const loadQuill = async () => {
      if (quillRef.current || !editorRef.current) return;

      // Load Quill CSS
      if (!document.querySelector('link[href*="quill"]')) {
        const link = document.createElement("link");
        link.rel  = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
        document.head.appendChild(link);
      }

      // Load Quill JS
      const Quill = await import("quill" as any).catch(async () => {
        // Fallback: load via script tag
        await new Promise<void>((resolve) => {
          if ((window as any).Quill) { resolve(); return; }
          const script  = document.createElement("script");
          script.src    = "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js";
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
        return { default: (window as any).Quill };
      });

      const Q = Quill.default || (window as any).Quill;
      if (!Q || !editorRef.current) return;

      quillRef.current = new Q(editorRef.current, {
        theme:       "snow",
        placeholder: placeholder ?? "Write detailed service description here…",
        modules: {
          toolbar: [
            [{ header: [2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "link"],
            ["clean"],
          ],
        },
      });

      // Set initial value
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Listen for changes
      quillRef.current.on("text-change", () => {
        if (isUpdating.current) return;
        const html = quillRef.current.root.innerHTML;
        onChange(html === "<p><br></p>" ? "" : html);
      });
    };

    loadQuill();
  }, []); // eslint-disable-line

  // Sync external value changes (e.g. loading draft)
  useEffect(() => {
    if (!quillRef.current) return;
    const current = quillRef.current.root.innerHTML;
    if (current !== value && !quillRef.current.hasFocus()) {
      isUpdating.current = true;
      quillRef.current.root.innerHTML = value || "";
      isUpdating.current = false;
    }
  }, [value]);

  return (
    <div className="sf-quill-wrap">
      <div ref={editorRef} className="sf-quill-editor" />
      <style>{`
        .sf-quill-wrap {
          border: 1px solid rgba(104,80,68,0.14);
          border-radius: 9px;
          overflow: hidden;
          background: #fdfaf8;
        }
        .sf-quill-wrap .ql-toolbar {
          border: none;
          border-bottom: 1px solid rgba(104,80,68,0.10);
          background: rgba(104,80,68,0.02);
          font-family: 'DM Sans', sans-serif;
          padding: 8px 12px;
        }
        .sf-quill-wrap .ql-container {
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 300;
          color: #3a405a;
          min-height: 220px;
        }
        .sf-quill-wrap .ql-editor {
          padding: 14px 16px;
          line-height: 1.80;
          min-height: 220px;
        }
        .sf-quill-wrap .ql-editor p { margin-bottom: 12px; }
        .sf-quill-wrap .ql-editor h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 600;
          color: #3a405a; margin: 20px 0 10px;
        }
        .sf-quill-wrap .ql-editor h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 600;
          color: #3a405a; margin: 16px 0 8px;
        }
        .sf-quill-wrap .ql-editor ul,
        .sf-quill-wrap .ql-editor ol {
          padding-left: 20px; margin-bottom: 12px;
        }
        .sf-quill-wrap .ql-editor li { margin-bottom: 6px; }
        .sf-quill-wrap .ql-editor blockquote {
          border-left: 3px solid rgba(153,178,221,0.60);
          padding: 8px 16px; margin: 16px 0;
          background: rgba(153,178,221,0.06);
          border-radius: 0 8px 8px 0;
          font-style: italic;
        }
        .sf-quill-wrap .ql-editor a { color: #3a405a; }
        .sf-quill-wrap .ql-editor.ql-blank::before {
          color: rgba(104,80,68,0.30);
          font-style: normal;
          font-size: 13px;
        }
        .sf-quill-wrap .ql-toolbar .ql-stroke { stroke: rgba(104,80,68,0.55); }
        .sf-quill-wrap .ql-toolbar .ql-fill   { fill:   rgba(104,80,68,0.55); }
        .sf-quill-wrap .ql-toolbar button:hover .ql-stroke,
        .sf-quill-wrap .ql-toolbar button.ql-active .ql-stroke { stroke: #3a405a; }
        .sf-quill-wrap .ql-toolbar button:hover .ql-fill,
        .sf-quill-wrap .ql-toolbar button.ql-active .ql-fill   { fill:   #3a405a; }
        .sf-quill-wrap .ql-toolbar .ql-picker-label { color: rgba(104,80,68,0.55); }
        .sf-quill-wrap .ql-toolbar .ql-picker-label:hover { color: #3a405a; }
        .sf-quill-wrap:focus-within {
          border-color: rgba(153,178,221,0.55);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.10);
        }
      `}</style>
    </div>
  );
}

// ── Main Form Component ───────────────────────────────────────────────────────

export default function ServiceForm({ initialData, onSubmit, isSaving }: Props) {
  const [form, setForm] = useState<ServiceFormData>({
    num:            initialData?.num            ?? "",
    slug:           initialData?.slug           ?? "",
    title:          initialData?.title          ?? "",
    tag:            initialData?.tag            ?? "",
    tagline:        initialData?.tagline        ?? "",
    desc:           initialData?.desc           ?? "",
    features:       initialData?.features       ?? "",
    keywords:       initialData?.keywords       ?? "",
    accent:         initialData?.accent         ?? ACCENT_PRESETS[0].value,
    subtitle:       initialData?.subtitle       ?? "",
    fullDesc:       initialData?.fullDesc       ?? "",
    highlights:     initialData?.highlights     ?? [{ ...EMPTY_HIGHLIGHT }],
    status:         initialData?.status         ?? "active",
    order:          initialData?.order          ?? 1,
    seoTitle:       initialData?.seoTitle       ?? "",
    seoDescription: initialData?.seoDescription ?? "",
  });

  const [slugLocked, setSlugLocked] = useState(!!initialData?.slug);
  const [activeTab,  setActiveTab]  = useState<"basic" | "detail" | "seo">("basic");

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

  function set(field: keyof ServiceFormData, value: string | number | Highlight[]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function setHighlight(idx: number, key: keyof Highlight, val: string) {
    const updated = form.highlights.map((h, i) => i === idx ? { ...h, [key]: val } : h);
    set("highlights", updated);
  }

  function addHighlight() {
    set("highlights", [...form.highlights, { ...EMPTY_HIGHLIGHT }]);
  }

  function removeHighlight(idx: number) {
    set("highlights", form.highlights.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const seoTitleLen = form.seoTitle.length;
  const seoDescLen  = form.seoDescription.length;

  return (
    <form className="sf-root" onSubmit={handleSubmit}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .sf-root { display: flex; flex-direction: column; gap: 24px; }

        .sf-card {
          background: #ffffff;
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 16px;
          overflow: hidden;
        }

        .sf-tabs {
          display: flex;
          border-bottom: 1px solid rgba(104,80,68,0.09);
          background: rgba(104,80,68,0.02);
        }

        .sf-tab {
          padding: 13px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 400;
          color: rgba(104,80,68,0.50);
          border: none; background: none; cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color 0.2s ease, border-color 0.2s ease;
        }

        .sf-tab.active {
          color: var(--color-primary, #3a405a);
          border-bottom-color: var(--color-primary, #3a405a);
          font-weight: 500;
        }

        .sf-card-body {
          padding: 22px;
          display: flex; flex-direction: column; gap: 18px;
        }

        .sf-field { display: flex; flex-direction: column; gap: 6px; }

        .sf-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .sf-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) {
          .sf-row, .sf-row-3 { grid-template-columns: 1fr; }
        }

        .sf-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 500;
          letter-spacing: 0.13em; text-transform: uppercase;
          color: rgba(104,80,68,0.55);
          display: flex; align-items: center; gap: 6px;
        }

        .sf-label-required { color: #c0392b; font-size: 12px; }

        .sf-label-hint {
          font-size: 9.5px; font-weight: 300;
          letter-spacing: 0; text-transform: none;
          color: rgba(104,80,68,0.38);
          margin-left: auto;
        }

        .sf-input, .sf-select, .sf-textarea {
          width: 100%;
          padding: 10px 13px;
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

        .sf-input:focus, .sf-select:focus, .sf-textarea:focus {
          border-color: rgba(153,178,221,0.55);
          box-shadow: 0 0 0 3px rgba(153,178,221,0.10);
          background: #ffffff;
        }

        .sf-input::placeholder, .sf-textarea::placeholder { color: rgba(104,80,68,0.30); }
        .sf-textarea { resize: vertical; min-height: 100px; line-height: 1.7; }

        .sf-select {
          cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23685044' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 13px center;
          padding-right: 36px;
        }

        .sf-slug-wrap { display: flex; gap: 8px; align-items: center; }
        .sf-slug-wrap .sf-input { flex: 1; font-size: 12.5px; color: rgba(58,64,90,0.70); }

        .sf-slug-lock {
          padding: 10px 13px; border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.13);
          background: rgba(104,80,68,0.04);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          color: rgba(104,80,68,0.55);
          cursor: pointer; white-space: nowrap;
          transition: background 0.2s ease;
        }
        .sf-slug-lock:hover { background: rgba(104,80,68,0.08); }

        .sf-preview-url {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 300;
          color: rgba(104,80,68,0.40);
          padding: 5px 10px;
          background: rgba(104,80,68,0.04);
          border-radius: 6px;
        }

        .sf-status-group { display: flex; gap: 8px; }

        .sf-status-btn {
          flex: 1; padding: 9px 12px; border-radius: 9px;
          border: 1px solid rgba(104,80,68,0.13);
          background: transparent; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 400;
          color: rgba(104,80,68,0.55);
          transition: all 0.2s ease;
        }
        .sf-status-btn.active-active {
          background: rgba(100,180,100,0.10);
          border-color: rgba(100,180,100,0.25);
          color: #3a7a3a; font-weight: 500;
        }
        .sf-status-btn.active-inactive {
          background: rgba(192,57,43,0.06);
          border-color: rgba(192,57,43,0.14);
          color: #c0392b; font-weight: 500;
        }

        .sf-accent-grid { display: flex; flex-wrap: wrap; gap: 8px; }

        .sf-accent-swatch {
          width: 36px; height: 36px; border-radius: 8px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease;
          position: relative;
        }
        .sf-accent-swatch:hover { transform: scale(1.1); }
        .sf-accent-swatch.selected {
          border-color: var(--color-primary, #3a405a);
          transform: scale(1.1);
        }
        .sf-accent-swatch.selected::after {
          content: '✓';
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: var(--color-primary, #3a405a); font-weight: 700;
        }

        .sf-hl-list { display: flex; flex-direction: column; gap: 12px; }

        .sf-hl-item {
          display: grid; grid-template-columns: 1fr 1fr auto;
          gap: 10px; align-items: start;
          padding: 14px;
          background: rgba(104,80,68,0.03);
          border: 1px solid rgba(104,80,68,0.08);
          border-radius: 10px;
        }
        @media (max-width: 640px) { .sf-hl-item { grid-template-columns: 1fr; } }

        .sf-hl-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px; font-weight: 300;
          letter-spacing: 0.12em;
          color: rgba(104,80,68,0.35); margin-bottom: 4px;
        }

        .sf-hl-remove {
          width: 30px; height: 30px; border-radius: 7px;
          border: 1px solid rgba(192,57,43,0.15);
          background: rgba(192,57,43,0.05);
          color: #c0392b; font-size: 14px;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: background 0.2s ease;
          flex-shrink: 0; margin-top: 20px;
        }
        .sf-hl-remove:hover { background: rgba(192,57,43,0.12); }

        .sf-add-hl-btn {
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
        .sf-add-hl-btn:hover {
          background: rgba(104,80,68,0.04);
          border-color: rgba(104,80,68,0.30);
          color: var(--color-primary, #3a405a);
        }

        .sf-char-counter {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px; font-weight: 300;
          text-align: right; margin-top: -12px;
        }
        .sf-char-ok   { color: rgba(60,160,60,0.70); }
        .sf-char-warn { color: rgba(200,140,40,0.80); }
        .sf-char-over { color: #c0392b; }

        .sf-features-preview { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .sf-feature-chip {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 400;
          color: var(--color-primary, #3a405a);
          border: 1px solid rgba(104,80,68,0.14);
          background: rgba(255,255,255,0.70);
          border-radius: 6px; padding: 3px 10px;
        }

        /* ── Rich text section divider ── */
        .sf-section-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 4px 0;
        }
        .sf-section-divider-line {
          flex: 1; height: 1px; background: rgba(104,80,68,0.08);
        }
        .sf-section-divider-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(104,80,68,0.35);
          white-space: nowrap;
        }

        /* ── Content type notice ── */
        .sf-notice {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 14px; border-radius: 10px;
          background: rgba(153,178,221,0.08);
          border: 1px solid rgba(153,178,221,0.20);
        }
        .sf-notice-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
        .sf-notice-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 300; line-height: 1.6;
          color: rgba(58,64,90,0.75);
        }
        .sf-notice-text strong { font-weight: 500; color: #3a405a; }

        .sf-submit-bar {
          display: flex; align-items: center; gap: 12px; justify-content: flex-end;
          padding: 18px 22px;
          background: rgba(255,255,255,0.80);
          border: 1px solid rgba(104,80,68,0.09);
          border-radius: 16px;
          position: sticky; bottom: 16px;
          backdrop-filter: blur(12px);
        }

        .sf-submit-btn {
          padding: 10px 24px; border-radius: 9px;
          border: none;
          background: var(--color-primary, #3a405a);
          color: #f9dec9;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          display: flex; align-items: center; gap: 8px;
        }
        .sf-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(58,64,90,0.18);
        }
        .sf-submit-btn:disabled { opacity: 0.60; cursor: not-allowed; }

        .sf-spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(249,222,201,0.30);
          border-top-color: #f9dec9;
          border-radius: 50%;
          animation: sfspin 0.7s linear infinite;
        }
        @keyframes sfspin { to { transform: rotate(360deg); } }

        .sf-accent-preview {
          height: 48px; border-radius: 10px;
          border: 1px solid rgba(104,80,68,0.10);
          display: flex; align-items: center;
          padding: 0 14px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px; font-weight: 600;
          color: var(--color-primary, #3a405a);
          position: relative; overflow: hidden;
        }
        .sf-accent-preview-blob {
          position: absolute; top: -20px; right: -20px;
          width: 80px; height: 80px; border-radius: 50%;
          pointer-events: none;
        }
      `}</style>

      {/* ── Card with tabs ── */}
      <div className="sf-card">
        <div className="sf-tabs">
          {(["basic", "detail", "seo"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`sf-tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t === "basic" ? "Basic Info" : t === "detail" ? "Detail & Content" : "SEO & Meta"}
            </button>
          ))}
        </div>

        {/* ── Tab: Basic Info ── */}
        {activeTab === "basic" && (
          <div className="sf-card-body">
            <div className="sf-row-3">
              <div className="sf-field">
                <label className="sf-label">
                  Number <span className="sf-label-required">*</span>
                  <span className="sf-label-hint">e.g. 01</span>
                </label>
                <input className="sf-input" type="text" placeholder="01"
                  value={form.num} onChange={(e) => set("num", e.target.value)} required />
              </div>
              <div className="sf-field">
                <label className="sf-label">Display Order</label>
                <input className="sf-input" type="number" min={1}
                  value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
              </div>
              <div className="sf-field">
                <label className="sf-label">Status</label>
                <div className="sf-status-group">
                  <button type="button"
                    className={`sf-status-btn ${form.status === "active" ? "active-active" : ""}`}
                    onClick={() => set("status", "active")}>● Active</button>
                  <button type="button"
                    className={`sf-status-btn ${form.status === "inactive" ? "active-inactive" : ""}`}
                    onClick={() => set("status", "inactive")}>○ Off</button>
                </div>
              </div>
            </div>

            <div className="sf-field">
              <label className="sf-label">Title <span className="sf-label-required">*</span></label>
              <input className="sf-input" type="text" placeholder="e.g. Website Development"
                value={form.title} onChange={(e) => set("title", e.target.value)} required />
            </div>

            <div className="sf-field">
              <label className="sf-label">
                Slug
                <span className="sf-label-hint">{slugLocked ? "🔒 locked" : "auto from title"}</span>
              </label>
              <div className="sf-slug-wrap">
                <input className="sf-input" type="text" value={form.slug}
                  onChange={(e) => set("slug", toSlug(e.target.value))}
                  readOnly={!slugLocked} placeholder="auto-generated" />
                <button type="button" className="sf-slug-lock"
                  onClick={() => setSlugLocked((v) => !v)}>
                  {slugLocked ? "Unlock" : "Edit"}
                </button>
              </div>
              {form.slug && <span className="sf-preview-url">/services/{form.slug}</span>}
            </div>

            <div className="sf-row">
              <div className="sf-field">
                <label className="sf-label">
                  Tag <span className="sf-label-required">*</span>
                  <span className="sf-label-hint">e.g. "Web"</span>
                </label>
                <input className="sf-input" type="text" placeholder="Web"
                  value={form.tag} onChange={(e) => set("tag", e.target.value)} required />
              </div>
              <div className="sf-field">
                <label className="sf-label">
                  Tagline <span className="sf-label-required">*</span>
                  <span className="sf-label-hint">short phrase</span>
                </label>
                <input className="sf-input" type="text"
                  placeholder="Business websites that convert"
                  value={form.tagline} onChange={(e) => set("tagline", e.target.value)} required />
              </div>
            </div>

            <div className="sf-field">
              <label className="sf-label">
                Card Description <span className="sf-label-required">*</span>
                <span className="sf-label-hint">shown on /services grid card</span>
              </label>
              <textarea className="sf-textarea" rows={3}
                placeholder="Fast, responsive and conversion-focused business websites…"
                value={form.desc} onChange={(e) => set("desc", e.target.value)} required />
            </div>

            <div className="sf-field">
              <label className="sf-label">
                Features
                <span className="sf-label-hint">comma separated chips</span>
              </label>
              <input className="sf-input" type="text"
                placeholder="Business Websites, Corporate Portals, Landing Pages"
                value={form.features} onChange={(e) => set("features", e.target.value)} />
              {form.features && (
                <div className="sf-features-preview">
                  {form.features.split(",").map((f) => f.trim()).filter(Boolean).map((f) => (
                    <span key={f} className="sf-feature-chip">{f}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="sf-field">
              <label className="sf-label">
                Keywords
                <span className="sf-label-hint">internal matching</span>
              </label>
              <input className="sf-input" type="text"
                placeholder="website development company, business website design"
                value={form.keywords} onChange={(e) => set("keywords", e.target.value)} />
            </div>

            <div className="sf-field">
              <label className="sf-label">Card Accent Colour</label>
              <div className="sf-accent-grid">
                {ACCENT_PRESETS.map((p) => (
                  <div key={p.value}
                    className={`sf-accent-swatch ${form.accent === p.value ? "selected" : ""}`}
                    style={{ background: `radial-gradient(circle, ${p.value}, transparent 80%)`, border: "1px solid rgba(104,80,68,0.15)" }}
                    onClick={() => set("accent", p.value)}
                    title={p.label}
                  />
                ))}
              </div>
              <div className="sf-accent-preview"
                style={{ background: `radial-gradient(circle at 80% 50%, ${form.accent}, transparent 70%)` }}>
                <div className="sf-accent-preview-blob"
                  style={{ background: `radial-gradient(circle, ${form.accent}, transparent 70%)` }} />
                <span style={{ position: "relative", zIndex: 1 }}>{form.title || "Service Title"}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Detail & Content ── */}
        {activeTab === "detail" && (
          <div className="sf-card-body">

            <div className="sf-notice">
              <span className="sf-notice-icon">ℹ️</span>
              <p className="sf-notice-text">
                <strong>Full Description</strong> is shown on the individual service page
                (<code>/services/{form.slug || "slug"}</code>).
                Use the rich editor below to write detailed, formatted content with headings,
                lists and highlights. The <strong>Card Description</strong> (Basic Info tab)
                is only shown on the services grid.
              </p>
            </div>

            {/* Subtitle */}
            <div className="sf-field">
              <label className="sf-label">
                Subtitle
                <span className="sf-label-hint">shown below title on service page</span>
              </label>
              <input className="sf-input" type="text"
                placeholder="Business websites that perform and convert"
                value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
            </div>

            {/* ── Rich text editor ── */}
            <div className="sf-section-divider">
              <div className="sf-section-divider-line" />
              <span className="sf-section-divider-label">Full Page Content — Rich Text Editor</span>
              <div className="sf-section-divider-line" />
            </div>

            <div className="sf-field">
              <label className="sf-label">
                Full Description
                <span className="sf-label-hint">rich HTML — rendered on /services/[slug]</span>
              </label>
              <QuillEditor
                value={form.fullDesc}
                onChange={(html) => set("fullDesc", html)}
                placeholder="Write detailed service description here… Add headings, bullet points, and formatted content."
              />
            </div>

            {/* Divider before highlights */}
            <div className="sf-section-divider">
              <div className="sf-section-divider-line" />
              <span className="sf-section-divider-label">Highlights — Sidebar Quick Facts</span>
              <div className="sf-section-divider-line" />
            </div>

            {/* Highlights */}
            <div className="sf-field">
              <label className="sf-label">
                Highlights
                <span className="sf-label-hint">label + detail pairs in sidebar</span>
              </label>
              <div className="sf-hl-list">
                {form.highlights.map((hl, i) => (
                  <div key={i} className="sf-hl-item">
                    <div className="sf-field">
                      <p className="sf-hl-num">0{i + 1} — Label</p>
                      <input className="sf-input" type="text"
                        placeholder="Delivery Timeline"
                        value={hl.label} onChange={(e) => setHighlight(i, "label", e.target.value)} />
                    </div>
                    <div className="sf-field">
                      <p className="sf-hl-num">0{i + 1} — Detail</p>
                      <input className="sf-input" type="text"
                        placeholder="2–6 weeks depending on scope"
                        value={hl.detail} onChange={(e) => setHighlight(i, "detail", e.target.value)} />
                    </div>
                    <button type="button" className="sf-hl-remove"
                      onClick={() => removeHighlight(i)}
                      disabled={form.highlights.length <= 1}
                      title="Remove">×</button>
                  </div>
                ))}
              </div>
              {form.highlights.length < 6 && (
                <button type="button" className="sf-add-hl-btn" onClick={addHighlight}>
                  + Add Highlight
                </button>
              )}
            </div>

          </div>
        )}

        {/* ── Tab: SEO ── */}
        {activeTab === "seo" && (
          <div className="sf-card-body">
            <div className="sf-field">
              <label className="sf-label">
                SEO Title
                <span className="sf-label-hint">ideal: 50–60 chars</span>
              </label>
              <input className="sf-input" type="text"
                placeholder="Website Development | Dhanamitra Infotech LLP"
                value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
              <span className={`sf-char-counter ${
                seoTitleLen === 0 ? "" :
                seoTitleLen <= 60 ? "sf-char-ok" :
                seoTitleLen <= 70 ? "sf-char-warn" : "sf-char-over"
              }`}>{seoTitleLen} / 60 chars</span>
            </div>

            <div className="sf-field">
              <label className="sf-label">
                SEO Description
                <span className="sf-label-hint">ideal: 120–160 chars</span>
              </label>
              <textarea className="sf-textarea" rows={3}
                placeholder="Fast, responsive and conversion-focused business websites…"
                value={form.seoDescription}
                onChange={(e) => set("seoDescription", e.target.value)} />
              <span className={`sf-char-counter ${
                seoDescLen === 0 ? "" :
                seoDescLen <= 160 ? "sf-char-ok" :
                seoDescLen <= 180 ? "sf-char-warn" : "sf-char-over"
              }`}>{seoDescLen} / 160 chars</span>
            </div>

            {(form.seoTitle || form.seoDescription) && (
              <div style={{
                padding: "16px", background: "rgba(104,80,68,0.03)",
                borderRadius: "10px", border: "1px solid rgba(104,80,68,0.08)",
              }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9.5px", fontWeight: 500,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "rgba(104,80,68,0.38)", marginBottom: "10px" }}>
                  Search Preview
                </p>
                <p style={{ fontFamily: "arial", fontSize: "18px", color: "#1a0dab",
                  marginBottom: "3px", lineHeight: 1.3 }}>
                  {form.seoTitle || form.title}
                </p>
                <p style={{ fontFamily: "arial", fontSize: "12px", color: "#006621", marginBottom: "4px" }}>
                  dhanamitra.com/services/{form.slug}
                </p>
                <p style={{ fontFamily: "arial", fontSize: "13px", color: "#545454", lineHeight: 1.5 }}>
                  {form.seoDescription || form.desc}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Submit bar ── */}
      <div className="sf-submit-bar">
        <button type="submit" className="sf-submit-btn" disabled={isSaving}>
          {isSaving
            ? <><span className="sf-spinner" /> Saving…</>
            : "Save Service"
          }
        </button>
      </div>
    </form>
  );
}