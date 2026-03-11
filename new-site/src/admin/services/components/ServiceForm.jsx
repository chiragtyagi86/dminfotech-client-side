// src/admin/services/components/ServiceForm.jsx
import { useEffect, useState } from "react";

const ACCENT_SWATCHES = [
  "#e9afa3",
  "#99b2dd",
  "#f9dec9",
  "#3a405a",
  "#c0a882",
  "#8ab4a0",
  "rgba(249,222,201,0.45)",
];

function normalizeHighlightItem(item) {
  if (typeof item === "string") return item;
  if (item == null) return "";
  if (typeof item === "number" || typeof item === "boolean") return String(item);

  if (typeof item === "object") {
    return item.label ?? item.text ?? item.title ?? item.value ?? "";
  }

  return "";
}

function normalizeHighlights(value) {
  if (Array.isArray(value)) {
    const cleaned = value.map(normalizeHighlightItem);
    return cleaned.length ? cleaned : [""];
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [""];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.map(normalizeHighlightItem);
        return cleaned.length ? cleaned : [""];
      }
    } catch {
      return trimmed.includes(",")
        ? trimmed.split(",").map((x) => x.trim()).filter(Boolean)
        : [trimmed];
    }

    return [trimmed];
  }

  return [""];
}

function parseContent(content) {
  if (!content) {
    return {
      tag: "",
      tagline: "",
      subtitle: "",
      fullDesc: "",
      features: "",
      keywords: "",
      accent: "#99b2dd",
      highlights: [""],
    };
  }

  if (typeof content === "object") {
    return {
      tag: content.tag ?? "",
      tagline: content.tagline ?? "",
      subtitle: content.subtitle ?? "",
      fullDesc: content.fullDesc ?? content.contentText ?? content.body ?? content.content ?? "",
      features: content.features ?? "",
      keywords: content.keywords ?? "",
      accent: content.accent ?? "#99b2dd",
      highlights: normalizeHighlights(content.highlights),
    };
  }

  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      return {
        tag: parsed.tag ?? "",
        tagline: parsed.tagline ?? "",
        subtitle: parsed.subtitle ?? "",
        fullDesc: parsed.fullDesc ?? parsed.contentText ?? parsed.body ?? parsed.content ?? "",
        features: parsed.features ?? "",
        keywords: parsed.keywords ?? "",
        accent: parsed.accent ?? "#99b2dd",
        highlights: normalizeHighlights(parsed.highlights),
      };
    } catch {
      return {
        tag: "",
        tagline: "",
        subtitle: "",
        fullDesc: content,
        features: "",
        keywords: "",
        accent: "#99b2dd",
        highlights: [""],
      };
    }
  }

  return {
    tag: "",
    tagline: "",
    subtitle: "",
    fullDesc: "",
    features: "",
    keywords: "",
    accent: "#99b2dd",
    highlights: [""],
  };
}

function normalizeFormData(initialData) {
  const parsedContent = parseContent(initialData?.content);

  return {
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.short_desc ?? initialData?.description ?? "",

    tag: parsedContent.tag ?? "",
    tagline: parsedContent.tagline ?? "",
    subtitle: parsedContent.subtitle ?? "",
    content: parsedContent.fullDesc ?? "",
    features: parsedContent.features ?? "",
    keywords: parsedContent.keywords ?? "",
    accentColor: parsedContent.accent ?? "#99b2dd",

    icon: initialData?.icon ?? "",
    order: initialData?.sort_order ?? initialData?.order ?? 0,
    published:
      typeof initialData?.published === "boolean"
        ? initialData.published
        : initialData?.status === "published" || initialData?.status === "active",

    highlights: normalizeHighlights(parsedContent.highlights),

    metaTitle: initialData?.meta_title ?? initialData?.metaTitle ?? "",
    metaDescription: initialData?.meta_description ?? initialData?.metaDescription ?? "",
  };
}

export default function ServiceForm({ initialData, onSubmit, isSaving }) {
  const isEdit = !!initialData;
  const [form, setForm] = useState(normalizeFormData(initialData));
  const [tab, setTab] = useState("basic");

  useEffect(() => {
    setForm(normalizeFormData(initialData));
  }, [initialData]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setHL(i, value) {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.map((item, idx) => (idx === i ? value : item)),
    }));
  }

  function addHL() {
    setForm((prev) => ({
      ...prev,
      highlights: [...prev.highlights, ""],
    }));
  }

  function remHL(i) {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== i),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const cleanedHighlights = normalizeHighlights(form.highlights)
      .map((h) => String(h || "").trim())
      .filter(Boolean)
      .map((label) => ({ label, detail: "" }));

    const payload = {
      title: form.title,
      slug: form.slug,
      short_desc: form.description,
      icon: form.icon,
      sort_order: Number(form.order || 0),
      status: form.published ? "published" : "draft",
      meta_title: form.metaTitle,
      meta_description: form.metaDescription,
      content: JSON.stringify({
        num: " ",
        tag: form.tag,
        tagline: form.tagline,
        features: form.features,
        keywords: form.keywords,
        accent: form.accentColor,
        subtitle: form.subtitle,
        fullDesc: form.content,
        highlights: cleanedHighlights,
      }),
    };

    onSubmit(payload);
  }

  const inp = {
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    fontWeight: 300,
    color: "#3a405a",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid rgba(104,80,68,0.14)",
    background: "#fdfaf8",
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  };

  const lbl = {
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 10.5,
    fontWeight: 500,
    letterSpacing: "0.13em",
    textTransform: "uppercase",
    color: "rgba(104,80,68,0.55)",
    display: "block",
    marginBottom: 6,
  };

  const fld = { display: "flex", flexDirection: "column", gap: 4, marginBottom: 18 };

  return (
    <form onSubmit={handleSubmit}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .sf-tabs{display:flex;gap:4;margin-bottom:24px;border-bottom:1px solid rgba(104,80,68,0.09);flex-wrap:wrap;}
        .sf-tab{padding:10px 18px;border:none;background:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:400;color:rgba(104,80,68,0.50);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color 0.2s,border-color 0.2s;}
        .sf-tab.active{color:#3a405a;font-weight:500;border-bottom-color:#3a405a;}
        .sf-row2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .sf-swatches{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}
        .sf-swatch{width:28px;height:28px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:transform 0.15s,border-color 0.15s;}
        .sf-swatch.sel{border-color:#3a405a;transform:scale(1.15);}
        .sf-hl-row{display:flex;gap:8px;align-items:center;margin-bottom:8px;}
        .sf-add-hl{padding:8px 16px;border-radius:8px;border:1px dashed rgba(104,80,68,0.20);background:none;font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(104,80,68,0.50);cursor:pointer;margin-top:4px;}
        .sf-save{padding:12px 32px;border-radius:10px;border:none;background:#3a405a;color:#f9dec9;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;}
        .sf-save:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(58,64,90,0.20);}
        .sf-save:disabled{opacity:0.65;cursor:not-allowed;}
        @media (max-width: 768px){.sf-row2{grid-template-columns:1fr;}}
      `}</style>

      <div className="sf-tabs">
        {["basic", "description", "seo"].map((t) => (
          <button
            key={t}
            type="button"
            className={`sf-tab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "basic" ? "Basic" : t === "description" ? "Description" : "SEO"}
          </button>
        ))}
      </div>

      {tab === "basic" && (
        <>
          <div style={fld}>
            <label style={lbl}>Title</label>
            <input style={inp} value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>

          <div className="sf-row2">
            <div style={fld}>
              <label style={lbl}>Slug</label>
              <input style={inp} value={form.slug} onChange={(e) => set("slug", e.target.value)} />
            </div>

            <div style={fld}>
              <label style={lbl}>Order</label>
              <input
                style={inp}
                type="number"
                value={form.order}
                onChange={(e) => set("order", Number(e.target.value))}
              />
            </div>
          </div>

          <div style={fld}>
            <label style={lbl}>Tag</label>
            <input style={inp} value={form.tag} onChange={(e) => set("tag", e.target.value)} placeholder="e.g. web" />
          </div>

          <div style={fld}>
            <label style={lbl}>Tagline</label>
            <input style={inp} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Short tagline" />
          </div>

          <div style={fld}>
            <label style={lbl}>Subtitle</label>
            <input style={inp} value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Business test" />
          </div>

          <div style={fld}>
            <label style={lbl}>Icon</label>
            <input style={inp} value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="emoji or URL" />
          </div>

          <div style={fld}>
            <label style={lbl}>Accent Colour</label>
            <div className="sf-swatches">
              {ACCENT_SWATCHES.map((c) => (
                <div
                  key={c}
                  className={`sf-swatch${form.accentColor === c ? " sel" : ""}`}
                  style={{ background: c }}
                  onClick={() => set("accentColor", c)}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                background: form.published ? "#3a405a" : "rgba(104,80,68,0.15)",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onClick={() => set("published", !form.published)}
            >
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  left: form.published ? 21 : 3,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s",
                }}
              />
            </div>

            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(104,80,68,0.60)" }}>
              {form.published ? "Published" : "Draft"}
            </span>
          </div>
        </>
      )}

      {tab === "description" && (
        <>
          <div style={fld}>
            <label style={lbl}>Short Description</label>
            <textarea
              style={{ ...inp, minHeight: 80, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div style={fld}>
            <label style={lbl}>Features</label>
            <input
              style={inp}
              value={form.features}
              onChange={(e) => set("features", e.target.value)}
              placeholder="comma separated features"
            />
          </div>

          <div style={fld}>
            <label style={lbl}>Keywords</label>
            <input
              style={inp}
              value={form.keywords}
              onChange={(e) => set("keywords", e.target.value)}
              placeholder="seo keywords"
            />
          </div>

          <div style={fld}>
            <label style={lbl}>Full Description (HTML allowed)</label>
            <textarea
              style={{ ...inp, minHeight: 220, resize: "vertical", fontSize: 13 }}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
            />
          </div>

          <div style={fld}>
            <label style={lbl}>Highlights</label>
            {form.highlights.map((h, i) => (
              <div key={i} className="sf-hl-row">
                <input
                  style={{ ...inp }}
                  value={typeof h === "string" ? h : normalizeHighlightItem(h)}
                  onChange={(e) => setHL(i, e.target.value)}
                  placeholder={`Highlight ${i + 1}`}
                />
                {form.highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remHL(i)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid rgba(192,57,43,0.18)",
                      borderRadius: 8,
                      background: "rgba(192,57,43,0.05)",
                      color: "#c0392b",
                      cursor: "pointer",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="sf-add-hl" onClick={addHL}>
              + Add Highlight
            </button>
          </div>
        </>
      )}

      {tab === "seo" && (
        <>
          <div style={fld}>
            <label style={lbl}>Meta Title</label>
            <input
              style={inp}
              value={form.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
            />
          </div>

          <div style={fld}>
            <label style={lbl}>Meta Description</label>
            <textarea
              style={{ ...inp, minHeight: 100, resize: "vertical" }}
              value={form.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
            />
          </div>
        </>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 8,
          borderTop: "1px solid rgba(104,80,68,0.07)",
          marginTop: 8,
        }}
      >
        <button type="submit" className="sf-save" disabled={isSaving}>
          {isSaving ? "Saving…" : isEdit ? "Update Service" : "Create Service"}
        </button>
      </div>
    </form>
  );
}