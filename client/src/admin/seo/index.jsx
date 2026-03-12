// src/admin/seo/index.jsx
import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../lib/api";

function Field({ label, value, onChange, placeholder, multiline }) {
  const base = {
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
      <label
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 10.5,
          fontWeight: 500,
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          color: "rgba(104,80,68,0.55)",
        }}
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          style={{ ...base, minHeight: 90, resize: "vertical" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          style={base}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: value ? "#3a405a" : "rgba(104,80,68,0.15)",
          position: "relative",
          cursor: "pointer",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
        onClick={() => onChange(!value)}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: value ? 21 : 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s",
          }}
        />
      </div>

      <span
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 13,
          color: "rgba(104,80,68,0.60)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SeoPreview({ title, url, desc }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 10,
        background: "rgba(153,178,221,0.07)",
        border: "1px solid rgba(153,178,221,0.15)",
        marginBottom: 20,
      }}
    >
      <p
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(104,80,68,0.35)",
          margin: "0 0 8px",
        }}
      >
        Search Preview
      </p>
      <p
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 17,
          fontWeight: 500,
          color: "#1a0dab",
          margin: "0 0 2px",
        }}
      >
        {title || "Page Title"}
      </p>
      <p
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 12,
          color: "#006621",
          margin: "0 0 4px",
        }}
      >
        {url || "https://yourdomain.com"}
      </p>
      <p
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 13,
          fontWeight: 300,
          color: "#545454",
          margin: 0,
        }}
      >
        {desc || "Meta description will appear here."}
      </p>
    </div>
  );
}

function normalizeGlobal(input = {}) {
  return {
    canonicalDomain: input.canonicalDomain ?? "",
    defaultMetaDescription: input.defaultMetaDescription ?? "",
    defaultMetaTitle: input.defaultMetaTitle ?? "",
    defaultOgImage: input.defaultOgImage ?? "",
    siteKeywords: input.siteKeywords ?? "",
  };
}

function normalizeSeo(input = {}) {
  return {
    metaTitle: input.metaTitle ?? "",
    metaDescription: input.metaDescription ?? "",
    canonicalUrl: input.canonicalUrl ?? "",
    ogTitle: input.ogTitle ?? "",
    ogDescription: input.ogDescription ?? "",
    ogImage: input.ogImage ?? "",
    indexEnabled: input.indexEnabled === 0 ? 0 : 1,
    keywords: input.keywords ?? "",
  };
}

function normalizePageRows(rows = []) {
  return rows.map((row) => ({
    ...row,
    seo: normalizeSeo(row.seo),
    _saving: false,
    _saved: false,
    _error: "",
  }));
}

function normalizeBlogRows(rows = []) {
  return rows.map((row) => ({
    ...row,
    seo: normalizeSeo(row.seo),
  }));
}

export default function SeoPage() {
  const [tab, setTab] = useState("global");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [globalSaving, setGlobalSaving] = useState(false);
  const [globalSaved, setGlobalSaved] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const [global, setGlobal] = useState(
    normalizeGlobal({
      canonicalDomain: "",
      defaultMetaDescription: "",
      defaultMetaTitle: "",
      defaultOgImage: "",
      siteKeywords: "",
    })
  );

  const [pages, setPages] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadSeo() {
      try {
        setLoading(true);
        setLoadError("");

        const res = await adminApi.getSeo();
        const payload = res?.data ?? res ?? {};

        if (!mounted) return;

        setGlobal(normalizeGlobal(payload.global || {}));
        setPages(normalizePageRows(payload.pages || []));
        setBlogs(normalizeBlogRows(payload.blogs || []));
      } catch (err) {
        console.error(err);
        if (mounted) {
          setLoadError(err?.message || "Failed to load SEO data.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSeo();

    return () => {
      mounted = false;
    };
  }, []);

  function setGlobalField(key, value) {
    setGlobal((prev) => ({ ...prev, [key]: value }));
  }

  function setPageSeoField(id, key, value) {
    setPages((prev) =>
      prev.map((page) =>
        page.id === id
          ? {
              ...page,
              seo: {
                ...page.seo,
                [key]: value,
              },
              _saved: false,
              _error: "",
            }
          : page
      )
    );
  }

  async function handleSaveGlobal() {
    try {
      setGlobalSaving(true);
      setGlobalSaved(false);
      setGlobalError("");

      await adminApi.updateGlobalSeo(global);

      setGlobalSaved(true);
      setTimeout(() => setGlobalSaved(false), 2500);
    } catch (err) {
      console.error(err);
      setGlobalError(err?.message || "Failed to save global SEO.");
    } finally {
      setGlobalSaving(false);
    }
  }

  async function handleSavePage(row) {
    setPages((prev) =>
      prev.map((page) =>
        page.id === row.id
          ? { ...page, _saving: true, _saved: false, _error: "" }
          : page
      )
    );

    try {
await adminApi.updateEntitySeo("page", row.id, row.seo);
      setPages((prev) =>
        prev.map((page) =>
          page.id === row.id
            ? { ...page, _saving: false, _saved: true, _error: "" }
            : page
        )
      );

      setTimeout(() => {
        setPages((prev) =>
          prev.map((page) =>
            page.id === row.id ? { ...page, _saved: false } : page
          )
        );
      }, 2500);
    } catch (err) {
      console.error(err);
      setPages((prev) =>
        prev.map((page) =>
          page.id === row.id
            ? {
                ...page,
                _saving: false,
                _saved: false,
                _error: err?.message || "Failed to save page SEO.",
              }
            : page
        )
      );
    }
  }

  const previewTitle = useMemo(
    () => global.defaultMetaTitle || "Page Title",
    [global.defaultMetaTitle]
  );

  const previewUrl = useMemo(
    () => global.canonicalDomain || "https://yourdomain.com",
    [global.canonicalDomain]
  );

  const previewDesc = useMemo(
    () => global.defaultMetaDescription || "Meta description will appear here.",
    [global.defaultMetaDescription]
  );

  return (
    <div className="seo-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .seo-root{
          display:flex;
          flex-direction:column;
          gap:24px;
          animation:seoFade 0.4s ease both;
        }

        @keyframes seoFade{
          from{opacity:0;transform:translateY(8px)}
          to{opacity:1;transform:translateY(0)}
        }

        .seo-heading{
          font-family:'Cormorant Garamond',serif;
          font-size:32px;
          font-weight:400;
          color:#3a405a;
          margin:0;
        }

        .seo-tabs{
          display:flex;
          gap:4px;
          border-bottom:1px solid rgba(104,80,68,0.09);
          flex-wrap:wrap;
        }

        .seo-tab{
          padding:11px 20px;
          border:none;
          background:none;
          font-family:'DM Sans',sans-serif;
          font-size:12px;
          font-weight:400;
          color:rgba(104,80,68,0.50);
          cursor:pointer;
          border-bottom:2px solid transparent;
          margin-bottom:-1px;
          transition:color 0.2s,border-color 0.2s;
        }

        .seo-tab.active{
          color:#3a405a;
          font-weight:500;
          border-bottom-color:#3a405a;
        }

        .seo-card{
          background:#ffffff;
          border:1px solid rgba(104,80,68,0.09);
          border-radius:16px;
          padding:28px;
        }

        .seo-save{
          padding:11px 28px;
          border-radius:10px;
          border:none;
          background:#3a405a;
          color:#f9dec9;
          font-family:'DM Sans',sans-serif;
          font-size:12px;
          font-weight:500;
          letter-spacing:0.10em;
          text-transform:uppercase;
          cursor:pointer;
          transition:transform 0.2s,box-shadow 0.2s;
        }

        .seo-save:hover:not(:disabled){
          transform:translateY(-1px);
          box-shadow:0 6px 20px rgba(58,64,90,0.20);
        }

        .seo-save:disabled{
          opacity:0.65;
          cursor:not-allowed;
        }

        .seo-saved{
          font-family:'DM Sans',sans-serif;
          font-size:12px;
          color:#27ae60;
          font-weight:400;
        }

        .seo-error{
          font-family:'DM Sans',sans-serif;
          font-size:12px;
          color:#c0392b;
          font-weight:400;
        }

        .seo-note{
          font-family:'DM Sans',sans-serif;
          font-size:12px;
          font-weight:300;
          color:"rgba(104,80,68,0.45)";
          margin-top:0;
        }

        .pt-table{
          width:100%;
          border-collapse:collapse;
        }

        .pt-table th{
          font-family:'DM Sans',sans-serif;
          font-size:9.5px;
          font-weight:500;
          letter-spacing:0.16em;
          text-transform:uppercase;
          color:rgba(104,80,68,0.40);
          padding:12px 16px;
          text-align:left;
          border-bottom:1px solid rgba(104,80,68,0.07);
          background:#fdfaf8;
          vertical-align:top;
        }

        .pt-table td{
          font-family:'DM Sans',sans-serif;
          font-size:13px;
          font-weight:300;
          color:#3a405a;
          padding:12px 16px;
          border-bottom:1px solid rgba(104,80,68,0.05);
          vertical-align:top;
        }

        .pt-table tr:last-child td{
          border-bottom:none;
        }

        .pt-inp{
          padding:8px 12px;
          border-radius:8px;
          border:1px solid rgba(104,80,68,0.12);
          background:#fdfaf8;
          font-family:'DM Sans',sans-serif;
          font-size:12px;
          color:#3a405a;
          width:100%;
          outline:none;
          box-sizing:border-box;
        }

        .pt-textarea{
          min-height:78px;
          resize:vertical;
        }

        .row-actions{
          display:flex;
          flex-direction:column;
          align-items:flex-start;
          gap:8px;
          min-width:130px;
        }

        .row-save{
          padding:8px 14px;
          border-radius:8px;
          border:none;
          background:#3a405a;
          color:#f9dec9;
          font-family:'DM Sans',sans-serif;
          font-size:11px;
          font-weight:500;
          letter-spacing:0.08em;
          text-transform:uppercase;
          cursor:pointer;
        }

        .row-save:disabled{
          opacity:0.65;
          cursor:not-allowed;
        }

        .meta-grid{
          display:grid;
          grid-template-columns:repeat(2, minmax(0, 1fr));
          gap:14px;
        }

        .meta-stack{
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .meta-label{
          font-family:'DM Sans',sans-serif;
          font-size:10px;
          font-weight:500;
          letter-spacing:0.12em;
          text-transform:uppercase;
          color:rgba(104,80,68,0.48);
        }

        @media (max-width: 1100px){
          .seo-card{
            padding:18px;
            overflow-x:auto;
          }

          .pt-table{
            min-width:1200px;
          }
        }

        @media (max-width: 700px){
          .meta-grid{
            grid-template-columns:1fr;
          }
        }
      `}</style>

      <h1 className="seo-heading">SEO</h1>

      <div className="seo-tabs">
        {["global", "pages", "posts"].map((t) => (
          <button
            key={t}
            className={`seo-tab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "global" ? "Global SEO" : t === "pages" ? "Pages" : "Blog Posts"}
          </button>
        ))}
      </div>

      {loading ? (
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 13,
            color: "rgba(104,80,68,0.45)",
          }}
        >
          Loading…
        </p>
      ) : loadError ? (
        <div className="seo-card">
          <p className="seo-error" style={{ margin: 0 }}>
            {loadError}
          </p>
        </div>
      ) : (
        <>
          {tab === "global" && (
            <div className="seo-card">
              <SeoPreview
                title={previewTitle}
                url={previewUrl}
                desc={previewDesc}
              />

              <Field
                label="Default Meta Title"
                value={global.defaultMetaTitle}
                onChange={(v) => setGlobalField("defaultMetaTitle", v)}
                placeholder="Used as fallback title"
              />

              <Field
                label="Default Meta Description"
                value={global.defaultMetaDescription}
                onChange={(v) => setGlobalField("defaultMetaDescription", v)}
                multiline
                placeholder="Fallback meta description…"
              />

              <Field
                label="Canonical Domain"
                value={global.canonicalDomain}
                onChange={(v) => setGlobalField("canonicalDomain", v)}
                placeholder="https://yourdomain.com"
              />

              <Field
                label="Default OG Image"
                value={global.defaultOgImage}
                onChange={(v) => setGlobalField("defaultOgImage", v)}
                placeholder="https://yourdomain.com/og-image.jpg"
              />

              <Field
                label="Site Keywords"
                value={global.siteKeywords}
                onChange={(v) => setGlobalField("siteKeywords", v)}
                placeholder="seo, web design, branding"
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  paddingTop: 8,
                  borderTop: "1px solid rgba(104,80,68,0.07)",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="seo-save"
                  disabled={globalSaving}
                  onClick={handleSaveGlobal}
                >
                  {globalSaving ? "Saving…" : "Save Global SEO"}
                </button>

                {globalSaved && <span className="seo-saved">✓ Saved</span>}
                {globalError && <span className="seo-error">{globalError}</span>}
              </div>
            </div>
          )}

          {tab === "pages" && (
            <div className="seo-card">
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  fontWeight: 300,
                  color: "rgba(104,80,68,0.45)",
                  marginTop: 0,
                }}
              >
                Edit SEO settings for individual site pages.
              </p>

              {pages.length === 0 ? (
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    color: "rgba(104,80,68,0.40)",
                  }}
                >
                  No pages configured yet.
                </p>
              ) : (
                <table className="pt-table">
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>SEO Settings</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.id}>
                        <td style={{ fontWeight: 400, whiteSpace: "nowrap" }}>
                          <div>{page.title || page.slug}</div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "rgba(104,80,68,0.45)",
                              marginTop: 4,
                            }}
                          >
                            /{page.slug}
                          </div>
                        </td>

                        <td>
                          <div className="meta-grid">
                            <div className="meta-stack">
                              <label className="meta-label">Meta Title</label>
                              <input
                                className="pt-inp"
                                value={page.seo.metaTitle}
                                onChange={(e) =>
                                  setPageSeoField(page.id, "metaTitle", e.target.value)
                                }
                                placeholder="Meta title…"
                              />
                            </div>

                            <div className="meta-stack">
                              <label className="meta-label">Keywords</label>
                              <input
                                className="pt-inp"
                                value={page.seo.keywords}
                                onChange={(e) =>
                                  setPageSeoField(page.id, "keywords", e.target.value)
                                }
                                placeholder="keyword1, keyword2"
                              />
                            </div>

                            <div className="meta-stack">
                              <label className="meta-label">Meta Description</label>
                              <textarea
                                className="pt-inp pt-textarea"
                                value={page.seo.metaDescription}
                                onChange={(e) =>
                                  setPageSeoField(page.id, "metaDescription", e.target.value)
                                }
                                placeholder="Meta description…"
                              />
                            </div>

                            <div className="meta-stack">
                              <label className="meta-label">Canonical URL</label>
                              <input
                                className="pt-inp"
                                value={page.seo.canonicalUrl}
                                onChange={(e) =>
                                  setPageSeoField(page.id, "canonicalUrl", e.target.value)
                                }
                                placeholder="https://yourdomain.com/page"
                              />
                            </div>

                            <div className="meta-stack">
                              <label className="meta-label">OG Title</label>
                              <input
                                className="pt-inp"
                                value={page.seo.ogTitle}
                                onChange={(e) =>
                                  setPageSeoField(page.id, "ogTitle", e.target.value)
                                }
                                placeholder="Open Graph title…"
                              />
                            </div>

                            <div className="meta-stack">
                              <label className="meta-label">OG Image</label>
                              <input
                                className="pt-inp"
                                value={page.seo.ogImage}
                                onChange={(e) =>
                                  setPageSeoField(page.id, "ogImage", e.target.value)
                                }
                                placeholder="https://yourdomain.com/og-image.jpg"
                              />
                            </div>

                            <div className="meta-stack">
                              <label className="meta-label">OG Description</label>
                              <textarea
                                className="pt-inp pt-textarea"
                                value={page.seo.ogDescription}
                                onChange={(e) =>
                                  setPageSeoField(page.id, "ogDescription", e.target.value)
                                }
                                placeholder="Open Graph description…"
                              />
                            </div>

                            <div className="meta-stack">
                              <label className="meta-label">Search Indexing</label>
                              <Toggle
                                label={page.seo.indexEnabled ? "Index Enabled" : "No Index"}
                                value={Boolean(page.seo.indexEnabled)}
                                onChange={(val) =>
                                  setPageSeoField(page.id, "indexEnabled", val ? 1 : 0)
                                }
                              />
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="row-actions">
                            <button
                              className="row-save"
                              disabled={page._saving}
                              onClick={() => handleSavePage(page)}
                            >
                              {page._saving ? "Saving…" : "Save"}
                            </button>

                            {page._saved && <span className="seo-saved">✓ Saved</span>}
                            {page._error && <span className="seo-error">{page._error}</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab === "posts" && (
            <div className="seo-card">
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  fontWeight: 300,
                  color: "rgba(104,80,68,0.45)",
                  marginTop: 0,
                }}
              >
                Review SEO for blog posts. Edit in the blog editor if needed.
              </p>

              {blogs.length === 0 ? (
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    color: "rgba(104,80,68,0.40)",
                  }}
                >
                  No blog posts yet.
                </p>
              ) : (
                <table className="pt-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Slug</th>
                      <th>Meta Title</th>
                      <th>Meta Description</th>
                      <th>Canonical</th>
                      <th>Index</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id}>
                        <td style={{ fontWeight: 400 }}>{blog.title}</td>
                        <td style={{ color: "rgba(104,80,68,0.45)", fontSize: 12 }}>
                          {blog.slug}
                        </td>
                        <td
                          style={{
                            color: blog.seo.metaTitle ? "#3a405a" : "rgba(104,80,68,0.30)",
                            fontSize: 12,
                          }}
                        >
                          {blog.seo.metaTitle || "—"}
                        </td>
                        <td
                          style={{
                            color: blog.seo.metaDescription
                              ? "#3a405a"
                              : "rgba(104,80,68,0.30)",
                            fontSize: 12,
                            maxWidth: 260,
                          }}
                        >
                          {blog.seo.metaDescription
                            ? blog.seo.metaDescription.length > 90
                              ? `${blog.seo.metaDescription.slice(0, 90)}…`
                              : blog.seo.metaDescription
                            : "—"}
                        </td>
                        <td
                          style={{
                            color: blog.seo.canonicalUrl
                              ? "#3a405a"
                              : "rgba(104,80,68,0.30)",
                            fontSize: 12,
                            maxWidth: 180,
                            wordBreak: "break-word",
                          }}
                        >
                          {blog.seo.canonicalUrl || "—"}
                        </td>
                        <td
                          style={{
                            color: blog.seo.indexEnabled ? "#27ae60" : "#c0392b",
                            fontSize: 12,
                            fontWeight: 400,
                          }}
                        >
                          {blog.seo.indexEnabled ? "Enabled" : "Disabled"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}