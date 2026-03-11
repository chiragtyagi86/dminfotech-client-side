// pages/pages/PageEditor.jsx
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { adminApi } from "../../../lib/api";

export default function PageEditor() {
  const { slug } = useParams();

  const [page, setPage]       = useState(null);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (slug) fetchPage();
  }, [slug]);

  async function fetchPage() {
    try {
      setLoading(true);
      setError("");
      const json     = await adminApi.getPage(slug);
      const pageData = json.data ?? json;
      if (!pageData) { setError("Page not found"); return; }

      if (!pageData.content || Object.keys(pageData.content).length === 0) {
        setContent({
          heroHeadline: "", heroSubheading: "", heroImage: "",
          sections: [], ctaText: "Get Started", ctaLink: "/contact",
          seoTitle: pageData.title, seoDescription: pageData.description || "",
        });
      } else {
        const sections = (pageData.content.sections || []).map((s) => {
          if (s.type === "two-column" && !s.imageUrl) {
            const isUrl = /^https?:\/\/|^\//.test(s.content?.trim() || "");
            if (isUrl) return { ...s, imageUrl: s.content, content: "" };
          }
          return s;
        });
        setContent({ ...pageData.content, sections });
      }
      setPage(pageData);
    } catch (err) {
      setError(err?.message || "Failed to load page");
    } finally {
      setLoading(false);
    }
  }

  function updateContent(key, value) {
    setContent((c) => ({ ...c, [key]: value }));
    setSaved(false);
  }

  function addSection() {
    setContent((c) => ({
      ...c,
      sections: [...(c.sections || []), {
        id: Date.now().toString(),
        title: "New Section",
        content: "",
        imageUrl: "",
        type: "text",
      }],
    }));
  }

  function updateSection(id, field, value) {
    setContent((c) => ({
      ...c,
      sections: (c.sections || []).map((s) => s.id === id ? { ...s, [field]: value } : s),
    }));
    setSaved(false);
  }

  function removeSection(id) {
    setContent((c) => ({
      ...c,
      sections: (c.sections || []).filter((s) => s.id !== id),
    }));
  }

  async function handleSave() {
    if (!page) return;
    try {
      setSaving(true);
      setError("");
      await adminApi.updatePage(slug, { title: page.title, description: page.description, content });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err?.message || "Error saving page");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: "40px", textAlign: "center", fontFamily: "'DM Sans',sans-serif", color: "rgba(104,80,68,0.45)" }}>Loading page...</div>;
  if (error)   return <div style={{ padding: "40px", textAlign: "center", color: "#c0392b", fontFamily: "'DM Sans',sans-serif" }}>{error}<br /><Link to="/admin/pages">← Back</Link></div>;
  if (!page)   return <div style={{ padding: "40px", textAlign: "center" }}>Page not found</div>;

  const seoTitleLen = content.seoTitle?.length || 0;
  const seoDescLen  = content.seoDescription?.length || 0;

  return (
    <div className="pe-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .pe-root { display: flex; flex-direction: column; gap: 24px; max-width: 1000px; animation: peFade 0.4s ease both; }
        @keyframes peFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .pe-topbar { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .pe-back { display: inline-flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: rgba(104,80,68,0.55); text-decoration: none; padding: 7px 13px; border-radius: 8px; border: 1px solid rgba(104,80,68,0.12); background: #ffffff; }
        .pe-back:hover { background: rgba(104,80,68,0.04); }
        .pe-heading { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 400; color: #3a405a; margin: 0; flex: 1; }
        .pe-badge { font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(104,80,68,0.45); background: rgba(104,80,68,0.05); border: 1px solid rgba(104,80,68,0.10); padding: 4px 12px; border-radius: 100px; }
        .pe-error { font-family: 'DM Sans',sans-serif; font-size: 13px; color: #c0392b; background: rgba(192,57,43,0.06); border: 1px solid rgba(192,57,43,0.14); border-radius: 10px; padding: 12px 16px; }
        .pe-card { background: #ffffff; border: 1px solid rgba(104,80,68,0.09); border-radius: 16px; overflow: hidden; }
        .pe-tabs { display: flex; border-bottom: 1px solid rgba(104,80,68,0.09); background: rgba(104,80,68,0.02); }
        .pe-tab { padding: 13px 20px; font-family: 'DM Sans', sans-serif; font-size: 11.5px; font-weight: 400; color: rgba(104,80,68,0.50); border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
        .pe-tab.active { color: #3a405a; border-bottom-color: #3a405a; font-weight: 500; }
        .pe-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
        .pe-field { display: flex; flex-direction: column; gap: 6px; }
        .pe-label { font-family: 'DM Sans', sans-serif; font-size: 10.5px; font-weight: 500; letter-spacing: 0.13em; text-transform: uppercase; color: rgba(104,80,68,0.55); }
        .pe-input, .pe-textarea { width: 100%; padding: 12px 13px; border-radius: 9px; border: 1px solid rgba(104,80,68,0.14); background: #fdfaf8; font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 300; color: #3a405a; outline: none; box-sizing: border-box; }
        .pe-input:focus, .pe-textarea:focus { border-color: rgba(153,178,221,0.55); box-shadow: 0 0 0 3px rgba(153,178,221,0.10); background: #ffffff; }
        .pe-textarea { resize: vertical; min-height: 150px; line-height: 1.7; }
        .pe-section-label { font-size: 9.5px; font-weight: 500; letter-spacing: 0.20em; text-transform: uppercase; color: rgba(104,80,68,0.35); padding-bottom: 8px; border-bottom: 1px solid rgba(104,80,68,0.07); margin: 12px 0 -6px; font-family: 'DM Sans',sans-serif; }
        .pe-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .pe-row { grid-template-columns: 1fr; } }
        .pe-char-counter { font-size: 10.5px; font-weight: 300; text-align: right; margin-top: -10px; font-family: 'DM Sans',sans-serif; }
        .pe-char-ok   { color: rgba(60,160,60,0.70); }
        .pe-char-warn { color: rgba(200,140,40,0.80); }
        .pe-char-over { color: #c0392b; }
        .pe-preview { background: linear-gradient(160deg, #fffaf7 0%, #fdf3eb 100%); border: 1px solid rgba(104,80,68,0.09); border-radius: 12px; padding: 24px; text-align: center; }
        .pe-preview-headline { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: #3a405a; margin: 0 0 12px; }
        .pe-preview-sub { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 300; color: rgba(104,80,68,0.65); line-height: 1.6; }
        .pe-section-card { border: 1px solid rgba(104,80,68,0.11); border-radius: 12px; padding: 18px; background: rgba(104,80,68,0.02); display: flex; flex-direction: column; gap: 14px; }
        .pe-section-header { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .pe-section-num { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.12em; color: rgba(104,80,68,0.35); background: rgba(104,80,68,0.06); padding: 3px 9px; border-radius: 100px; white-space: nowrap; }
        .pe-section-title-input { flex: 1; min-width: 120px; padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(104,80,68,0.14); background: white; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #3a405a; outline: none; }
        .pe-type-select { padding: 7px 12px; border-radius: 6px; border: 1px solid rgba(153,178,221,0.30); background: rgba(153,178,221,0.10); color: #3a405a; font-family: 'DM Sans', sans-serif; font-size: 11px; cursor: pointer; outline: none; }
        .pe-section-remove { padding: 6px 12px; border-radius: 6px; border: none; background: rgba(192,57,43,0.10); color: #c0392b; font-family: 'DM Sans', sans-serif; font-size: 11px; cursor: pointer; }
        .pe-section-remove:hover { background: rgba(192,57,43,0.18); }
        .pe-two-col-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
        @media (max-width: 680px) { .pe-two-col-grid { grid-template-columns: 1fr; } }
        .pe-col-panel { display: flex; flex-direction: column; gap: 8px; padding: 14px; background: rgba(255,255,255,0.80); border: 1px solid rgba(104,80,68,0.09); border-radius: 10px; }
        .pe-col-panel-title { font-family: 'DM Sans', sans-serif; font-size: 9.5px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(104,80,68,0.40); margin: 0 0 2px; }
        .pe-img-preview { width: 100%; max-height: 160px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(104,80,68,0.10); display: block; }
        .pe-img-empty { width: 100%; height: 90px; border-radius: 8px; border: 1.5px dashed rgba(104,80,68,0.16); background: rgba(153,178,221,0.05); display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; font-size: 11.5px; color: rgba(104,80,68,0.35); }
        .pe-hint { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 300; color: rgba(104,80,68,0.42); line-height: 1.5; margin: 0; }
        .pe-add-section { padding: 10px 20px; border-radius: 9px; border: 1px solid rgba(153,178,221,0.35); background: rgba(153,178,221,0.10); color: #3a405a; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; text-transform: uppercase; letter-spacing: 0.08em; }
        .pe-add-section:hover { background: rgba(153,178,221,0.20); }
        .pe-save-bar { display: flex; align-items: center; gap: 12px; justify-content: flex-end; padding: 16px 22px; background: rgba(255,255,255,0.85); border: 1px solid rgba(104,80,68,0.09); border-radius: 14px; position: sticky; bottom: 16px; backdrop-filter: blur(12px); }
        .pe-saved-msg { font-family: 'DM Sans', sans-serif; font-size: 12px; color: #3a7a3a; flex: 1; }
        .pe-save-btn { padding: 10px 24px; border-radius: 9px; border: none; background: #3a405a; color: #f9dec9; font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; cursor: pointer; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
        .pe-save-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(58,64,90,0.18); }
        .pe-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .pe-spinner { width: 13px; height: 13px; border: 2px solid rgba(249,222,201,0.30); border-top-color: #f9dec9; border-radius: 50%; animation: pespin 0.7s linear infinite; }
        @keyframes pespin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="pe-topbar">
        <Link to="/admin/pages" className="pe-back">← Back</Link>
        <h1 className="pe-heading">{page.title}</h1>
        <span className="pe-badge">/{page.slug}</span>
      </div>

      {error && <p className="pe-error">⚠ {error}</p>}

      <div className="pe-card">
        <div className="pe-tabs">
          {["hero", "sections", "seo"].map((t) => (
            <button key={t} type="button"
              className={`pe-tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}>
              {t === "hero" ? "Hero" : t === "sections" ? "Content Sections" : "SEO"}
            </button>
          ))}
        </div>

        {activeTab === "hero" && (
          <div className="pe-body">
            <p className="pe-section-label">Hero Section</p>
            <div className="pe-field">
              <label className="pe-label">Headline</label>
              <input type="text" className="pe-input" placeholder="Page headline"
                value={content.heroHeadline || ""}
                onChange={(e) => updateContent("heroHeadline", e.target.value)} />
            </div>
            <div className="pe-field">
              <label className="pe-label">Subheading</label>
              <textarea className="pe-textarea" placeholder="Supporting text for the hero"
                value={content.heroSubheading || ""}
                onChange={(e) => updateContent("heroSubheading", e.target.value)} />
            </div>
            <div className="pe-field">
              <label className="pe-label">Hero Image URL</label>
              <input type="text" className="pe-input" placeholder="https://... or /images/hero.jpg"
                value={content.heroImage || ""}
                onChange={(e) => updateContent("heroImage", e.target.value)} />
              {content.heroImage
                ? <img src={content.heroImage} alt="Hero preview" className="pe-img-preview" style={{ maxHeight: "180px" }} />
                : <div className="pe-img-empty">No image URL entered</div>
              }
            </div>
            {content.heroHeadline && (
              <>
                <p className="pe-section-label">Live Preview</p>
                <div className="pe-preview">
                  <h1 className="pe-preview-headline">{content.heroHeadline}</h1>
                  <p className="pe-preview-sub">{content.heroSubheading}</p>
                </div>
              </>
            )}
            <p className="pe-section-label">Call to Action</p>
            <div className="pe-row">
              <div className="pe-field">
                <label className="pe-label">CTA Button Text</label>
                <input type="text" className="pe-input" placeholder="e.g., Get Started"
                  value={content.ctaText || ""}
                  onChange={(e) => updateContent("ctaText", e.target.value)} />
              </div>
              <div className="pe-field">
                <label className="pe-label">CTA Button Link</label>
                <input type="text" className="pe-input" placeholder="/contact"
                  value={content.ctaLink || ""}
                  onChange={(e) => updateContent("ctaLink", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "sections" && (
          <div className="pe-body">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p className="pe-section-label" style={{ margin: 0 }}>Content Sections</p>
              <button className="pe-add-section" onClick={addSection}>+ Add Section</button>
            </div>
            {(content.sections || []).length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "rgba(104,80,68,0.45)", borderRadius: "10px", background: "rgba(104,80,68,0.02)", border: "1.5px dashed rgba(104,80,68,0.12)", fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
                No sections yet. Click <strong>+ Add Section</strong> to create one.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {(content.sections || []).map((section, idx) => (
                  <div key={section.id} className="pe-section-card">
                    <div className="pe-section-header">
                      <span className="pe-section-num">#{idx + 1}</span>
                      <input type="text" className="pe-section-title-input"
                        value={section.title} placeholder="Section title"
                        onChange={(e) => updateSection(section.id, "title", e.target.value)} />
                      <select className="pe-type-select" value={section.type}
                        onChange={(e) => updateSection(section.id, "type", e.target.value)}>
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                        <option value="two-column">2 Columns</option>
                      </select>
                      <button className="pe-section-remove" onClick={() => removeSection(section.id)}>Remove</button>
                    </div>
                    {section.type === "text" && (
                      <div className="pe-field">
                        <label className="pe-label">Text Content</label>
                        <textarea className="pe-textarea" style={{ minHeight: "130px" }}
                          value={section.content} placeholder="Enter the text content..."
                          onChange={(e) => updateSection(section.id, "content", e.target.value)} />
                      </div>
                    )}
                    {section.type === "image" && (
                      <div className="pe-field">
                        <label className="pe-label">Image URL</label>
                        <input type="text" className="pe-input"
                          value={section.content} placeholder="https://... or /images/photo.jpg"
                          onChange={(e) => updateSection(section.id, "content", e.target.value)} />
                        {section.content
                          ? <img src={section.content} alt={section.title} className="pe-img-preview" style={{ maxHeight: "200px" }} />
                          : <div className="pe-img-empty">Paste an image URL above to preview</div>
                        }
                      </div>
                    )}
                    {section.type === "two-column" && (
                      <div className="pe-two-col-grid">
                        <div className="pe-col-panel">
                          <p className="pe-col-panel-title">← Left — Text</p>
                          <textarea className="pe-textarea" style={{ minHeight: "140px", background: "white" }}
                            value={section.content} placeholder="Enter the text for the left column..."
                            onChange={(e) => updateSection(section.id, "content", e.target.value)} />
                        </div>
                        <div className="pe-col-panel">
                          <p className="pe-col-panel-title">→ Right — Image</p>
                          <input type="text" className="pe-input" style={{ background: "white" }}
                            value={section.imageUrl || ""} placeholder="https://... or /images/photo.jpg"
                            onChange={(e) => updateSection(section.id, "imageUrl", e.target.value)} />
                          {section.imageUrl
                            ? <img src={section.imageUrl} alt="Right column" className="pe-img-preview" />
                            : <div className="pe-img-empty">Paste an image URL to preview</div>
                          }
                          <p className="pe-hint">Leave blank to show a placeholder on the page.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "seo" && (
          <div className="pe-body">
            <p className="pe-section-label">Search Engine Optimization</p>
            <div className="pe-field">
              <label className="pe-label">SEO Title (50–60 chars ideal)</label>
              <input type="text" className="pe-input"
                value={content.seoTitle || ""}
                onChange={(e) => updateContent("seoTitle", e.target.value)} />
              <span className={`pe-char-counter ${seoTitleLen <= 60 ? "pe-char-ok" : seoTitleLen <= 70 ? "pe-char-warn" : "pe-char-over"}`}>
                {seoTitleLen} / 60
              </span>
            </div>
            <div className="pe-field">
              <label className="pe-label">SEO Description (120–160 chars ideal)</label>
              <textarea className="pe-textarea" style={{ minHeight: "100px" }}
                value={content.seoDescription || ""}
                onChange={(e) => updateContent("seoDescription", e.target.value)} />
              <span className={`pe-char-counter ${seoDescLen <= 160 ? "pe-char-ok" : seoDescLen <= 180 ? "pe-char-warn" : "pe-char-over"}`}>
                {seoDescLen} / 160
              </span>
            </div>
            <div style={{ padding: "16px", background: "rgba(104,80,68,0.02)", borderRadius: "10px", border: "1px solid rgba(104,80,68,0.08)" }}>
              <p style={{ fontSize: "9.5px", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(104,80,68,0.38)", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>Search Preview</p>
              <p style={{ fontSize: 18, color: "#1a0dab", marginBottom: 3, fontFamily: "arial" }}>{content.seoTitle || page.title}</p>
              <p style={{ fontSize: 12, color: "#006621", marginBottom: 4, fontFamily: "arial" }}>dhanamitra.com/{page.slug}</p>
              <p style={{ fontSize: 13, color: "#545454", lineHeight: 1.5, fontFamily: "arial" }}>{content.seoDescription || page.description}</p>
            </div>
          </div>
        )}
      </div>

      <div className="pe-save-bar">
        {saved && <span className="pe-saved-msg">✓ Changes saved successfully</span>}
        <button className="pe-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? <><span className="pe-spinner" />Saving…</> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}