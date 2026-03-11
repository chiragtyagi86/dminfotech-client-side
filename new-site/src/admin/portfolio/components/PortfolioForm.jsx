// src/admin/portfolio/components/PortfolioForm.jsx
import { useEffect, useState } from "react";

const ACCENT_SWATCHES = ["#e9afa3", "#99b2dd", "#f9dec9", "#3a405a", "#c0a882", "#8ab4a0", "#d4a5c9", "#f2c97e"];

function parseContent(content) {
  const fallback = {
    industry: "",
    accent: "#e9afa3",
    year: "",
    featured: false,
    projectLink: "",
    caseStudyEnabled: false,
    problem: "",
    solution: "",
    results: [],
  };

  if (!content) return fallback;

  if (typeof content === "string") {
    try {
      return { ...fallback, ...JSON.parse(content) };
    } catch {
      return fallback;
    }
  }

  if (typeof content === "object") {
    return { ...fallback, ...content };
  }

  return fallback;
}


// Normalize a single result into {metric, label} shape
function normalizeResult(r) {
  if (!r) return { metric: "", label: "" };
  if (typeof r === "string") return { metric: r, label: "" };
  return {
    metric: r.metric ?? r.value ?? r.result ?? "",
    label:  r.label  ?? r.name  ?? r.text  ?? "",
  };
}

function normalizeResults(raw) {
  if (!raw) return [{ metric: "", label: "" }];
  let arr = raw;
  if (typeof raw === "string") {
    try { arr = JSON.parse(raw); } catch { return [{ metric: "", label: "" }]; }
  }
  if (!Array.isArray(arr) || arr.length === 0) return [{ metric: "", label: "" }];
  return arr.map(normalizeResult);
}

function normalizePortfolioData(initialData) {
  const parsed = parseContent(initialData?.content);

  return {
    title:            initialData?.title ?? "",
    slug:             initialData?.slug ?? "",
    category:         initialData?.category ?? "",
    clientName:       initialData?.client ?? initialData?.client_name ?? initialData?.clientName ?? "",
    year:             initialData?.year ?? parsed.year ?? "",
    industry:         initialData?.industry ?? parsed.industry ?? "",
    projectLink:      initialData?.project_url ?? initialData?.projectLink ?? parsed.projectLink ?? "",
    featured:         initialData?.featured ?? parsed.featured ?? false,
    caseStudyEnabled: initialData?.caseStudyEnabled ?? parsed.caseStudyEnabled ?? false,
    accent:           initialData?.accent_color ?? initialData?.accentColor ?? parsed.accent ?? "#e9afa3",
    summary:          initialData?.short_desc ?? initialData?.summary ?? "",
    problem:          initialData?.problem ?? parsed.problem ?? "",
    solution:         initialData?.solution ?? parsed.solution ?? "",
    results:          normalizeResults(parsed.results),
    coverImage:       initialData?.image ?? initialData?.cover_image ?? initialData?.coverImage ?? "",
    published:
      typeof initialData?.published === "boolean"
        ? initialData.published
        : initialData?.status === "published" || initialData?.status === "active" || initialData?.status === "live",
    metaTitle:       initialData?.meta_title ?? initialData?.metaTitle ?? "",
    metaDescription: initialData?.meta_description ?? initialData?.metaDescription ?? "",
  };
}

export default function PortfolioForm({ initialData, onSubmit, isSaving }) {
  const isEdit = !!initialData;
  const [form, setForm] = useState(normalizePortfolioData(initialData));
  const [imgPreview, setImgPreview] = useState(
    initialData?.image ?? initialData?.cover_image ?? initialData?.coverImage ?? ""
  );
  const [tab, setTab] = useState("details");

  useEffect(() => {
    const next = normalizePortfolioData(initialData);
    setForm(next);
    setImgPreview(next.coverImage || "");
  }, [initialData]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImg(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const value = ev.target?.result || "";
      set("coverImage", value);
      setImgPreview(value);
    };
    reader.readAsDataURL(file);
  }

  function setResult(i, key, value) {
    setForm((prev) => ({
      ...prev,
      results: prev.results.map((r, idx) => idx === i ? { ...r, [key]: value } : r),
    }));
  }

  function addResult() {
    setForm((prev) => ({ ...prev, results: [...prev.results, { metric: "", label: "" }] }));
  }

  function removeResult(i) {
    setForm((prev) => ({
      ...prev,
      results: prev.results.filter((_, idx) => idx !== i),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const cleanResults = form.results
      .map((r) => ({ metric: String(r.metric || "").trim(), label: String(r.label || "").trim() }))
      .filter((r) => r.metric || r.label);

    // content object matches actual DB schema exactly
    const contentObject = {
      industry:         form.industry,
      accent:           form.accent,
      year:             form.year,
      featured:         form.featured,
      projectLink:      form.projectLink,
      caseStudyEnabled: form.caseStudyEnabled,
      problem:          form.problem,
      solution:         form.solution,
      results:          cleanResults,
    };

    const payload = {
      title:            form.title,
      slug:             form.slug,
      category:         form.category,
      client:           form.clientName,       // DB column is `client`
      short_desc:       form.summary,
      image:            form.coverImage,       // DB column is `image`
      status:           form.published ? "published" : "draft",
      published:        form.published,
      meta_title:       form.metaTitle,
      meta_description: form.metaDescription,
      sort_order:       initialData?.sort_order ?? 1,
      content:          JSON.stringify(contentObject),
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
        .pf-tabs{display:flex;gap:4;margin-bottom:24px;border-bottom:1px solid rgba(104,80,68,0.09);flex-wrap:wrap;}
        .pf-tab{padding:10px 18px;border:none;background:none;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:400;color:rgba(104,80,68,0.50);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color 0.2s,border-color 0.2s;}
        .pf-tab.active{color:#3a405a;font-weight:500;border-bottom-color:#3a405a;}
        .pf-row2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .pf-swatches{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}
        .pf-swatch{width:28px;height:28px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:transform 0.15s,border-color 0.15s;}
        .pf-swatch.sel{border-color:#3a405a;transform:scale(1.15);}
        .pf-result-row{display:flex;gap:8px;align-items:center;margin-bottom:8px;}
        .pf-add-btn{padding:8px 16px;border-radius:8px;border:1px dashed rgba(104,80,68,0.20);background:none;font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(104,80,68,0.50);cursor:pointer;margin-top:4px;}
        .pf-save{padding:12px 32px;border-radius:10px;border:none;background:#3a405a;color:#f9dec9;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:0.10em;text-transform:uppercase;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;}
        .pf-save:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(58,64,90,0.20);}
        .pf-save:disabled{opacity:0.65;cursor:not-allowed;}
        @media(max-width:768px){.pf-row2{grid-template-columns:1fr;}}
      `}</style>

      <div className="pf-tabs">
        {["details", "case-study", "seo"].map((t) => (
          <button
            key={t}
            type="button"
            className={`pf-tab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "details" ? "Details" : t === "case-study" ? "Case Study" : "SEO"}
          </button>
        ))}
      </div>

      {tab === "details" && (
        <>
          <div style={fld}>
            <label style={lbl}>Title</label>
            <input style={inp} value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Project title" />
          </div>

          <div className="pf-row2">
            <div style={fld}>
              <label style={lbl}>Slug</label>
              <input style={inp} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="project-url-slug" />
            </div>
            <div style={fld}>
              <label style={lbl}>Category</label>
              <input style={inp} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Branding" />
            </div>
          </div>

          <div className="pf-row2">
            <div style={fld}>
              <label style={lbl}>Client Name</label>
              <input style={inp} value={form.clientName} onChange={(e) => set("clientName", e.target.value)} />
            </div>
            <div style={fld}>
              <label style={lbl}>Year</label>
              <input style={inp} value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2024" />
            </div>
          </div>

          <div className="pf-row2">
            <div style={fld}>
              <label style={lbl}>Industry</label>
              <input style={inp} value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="e.g. Finance" />
            </div>
            <div style={fld}>
              <label style={lbl}>Project Link</label>
              <input style={inp} value={form.projectLink} onChange={(e) => set("projectLink", e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div style={fld}>
            <label style={lbl}>Summary</label>
            <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>

          <div style={fld}>
            <label style={lbl}>Accent Colour</label>
            <div className="pf-swatches">
              {ACCENT_SWATCHES.map((c) => (
                <div
                  key={c}
                  className={`pf-swatch${form.accent === c ? " sel" : ""}`}
                  style={{ background: c }}
                  onClick={() => set("accent", c)}
                />
              ))}
            </div>
          </div>

          <div style={fld}>
            <label style={lbl}>Cover Image</label>
            <input type="file" accept="image/*" onChange={handleImg} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13 }} />
            {imgPreview && (
              <img src={imgPreview} alt="preview" style={{ marginTop: 8, borderRadius: 10, maxHeight: 180, objectFit: "cover", width: "100%" }} />
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
            {/* Published toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{ width: 40, height: 22, borderRadius: 11, background: form.published ? "#3a405a" : "rgba(104,80,68,0.15)", position: "relative", cursor: "pointer", transition: "background 0.2s" }}
                onClick={() => set("published", !form.published)}
              >
                <div style={{ position: "absolute", top: 3, left: form.published ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(104,80,68,0.60)" }}>
                {form.published ? "Published" : "Draft"}
              </span>
            </div>

            {/* Featured toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{ width: 40, height: 22, borderRadius: 11, background: form.featured ? "#3a405a" : "rgba(104,80,68,0.15)", position: "relative", cursor: "pointer", transition: "background 0.2s" }}
                onClick={() => set("featured", !form.featured)}
              >
                <div style={{ position: "absolute", top: 3, left: form.featured ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(104,80,68,0.60)" }}>
                {form.featured ? "Featured" : "Not Featured"}
              </span>
            </div>

            {/* Case Study toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{ width: 40, height: 22, borderRadius: 11, background: form.caseStudyEnabled ? "#3a405a" : "rgba(104,80,68,0.15)", position: "relative", cursor: "pointer", transition: "background 0.2s" }}
                onClick={() => set("caseStudyEnabled", !form.caseStudyEnabled)}
              >
                <div style={{ position: "absolute", top: 3, left: form.caseStudyEnabled ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(104,80,68,0.60)" }}>
                {form.caseStudyEnabled ? "Case Study On" : "Case Study Off"}
              </span>
            </div>
          </div>
        </>
      )}

      {tab === "case-study" && (
        <>
          <div style={fld}>
            <label style={lbl}>Problem</label>
            <textarea style={{ ...inp, minHeight: 100, resize: "vertical" }} value={form.problem} onChange={(e) => set("problem", e.target.value)} />
          </div>

          <div style={fld}>
            <label style={lbl}>Solution</label>
            <textarea style={{ ...inp, minHeight: 100, resize: "vertical" }} value={form.solution} onChange={(e) => set("solution", e.target.value)} />
          </div>

          <div style={fld}>
            <label style={lbl}>Results</label>
            {form.results.map((r, i) => (
              <div key={i} className="pf-result-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <input
                  style={inp}
                  value={r.metric ?? ""}
                  onChange={(e) => setResult(i, "metric", e.target.value)}
                  placeholder="Metric (e.g. +42%)"
                />
                <input
                  style={inp}
                  value={r.label ?? ""}
                  onChange={(e) => setResult(i, "label", e.target.value)}
                  placeholder="Label (e.g. Revenue Growth)"
                />
                {form.results.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResult(i)}
                    style={{ padding: "8px 12px", border: "1px solid rgba(192,57,43,0.18)", borderRadius: 8, background: "rgba(192,57,43,0.05)", color: "#c0392b", cursor: "pointer", fontSize: 16, flexShrink: 0 }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="pf-add-btn" onClick={addResult}>
              + Add Result
            </button>
          </div>
        </>
      )}

      {tab === "seo" && (
        <>
          <div style={fld}>
            <label style={lbl}>Meta Title</label>
            <input style={inp} value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
          </div>
          <div style={fld}>
            <label style={lbl}>Meta Description</label>
            <textarea style={{ ...inp, minHeight: 100, resize: "vertical" }} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />
          </div>
        </>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid rgba(104,80,68,0.07)", marginTop: 8 }}>
        <button type="submit" className="pf-save" disabled={isSaving}>
          {isSaving ? "Saving…" : isEdit ? "Update Project" : "Create Project"}
        </button>
      </div>
    </form>
  );
}