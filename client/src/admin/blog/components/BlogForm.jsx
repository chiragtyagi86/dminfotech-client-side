// src/admin/blog/components/BlogForm.jsx
import { useState, useEffect } from "react";
import { api } from "../../../lib/api";

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeFormData(initialData) {
  if (!initialData)
    return {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      tags: "",
      featuredImage: "",
      published: false,
      metaTitle: "",
      metaDescription: "",
    };

  let tags = initialData.tags ?? initialData.tag ?? "";
  if (Array.isArray(tags)) tags = tags.join(", ");

  return {
    title: initialData.title ?? "",
    slug: initialData.slug ?? "",
    excerpt: initialData.excerpt ?? initialData.short_desc ?? "",
    content: initialData.content ?? initialData.body ?? "",
    category:
      initialData.category_id ??
      initialData.category?.id ??
      initialData.category ??
      "",
    tags,
    featuredImage:
      initialData.featuredImage ??
      initialData.featured_image ??
      initialData.cover_image ??
      initialData.image ??
      "",
    published:
      typeof initialData.published === "boolean"
        ? initialData.published
        : initialData.status === "published" || initialData.status === "active",
    metaTitle: initialData.metaTitle ?? initialData.meta_title ?? "",
    metaDescription:
      initialData.metaDescription ?? initialData.meta_description ?? "",
  };
}

export default function BlogForm({ initialData, onSubmit, isSaving }) {
  const isEdit = !!initialData;

  const [form, setForm] = useState(normalizeFormData(initialData));
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    normalizeFormData(initialData).featuredImage
  );
  const [categories, setCategories] = useState([]);
  const [slugManual, setSlugManual] = useState(isEdit);
  const [tab, setTab] = useState("content");

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        setCategories(Array.isArray(res) ? res : res?.data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    const normalized = normalizeFormData(initialData);
    setForm(normalized);
    setImagePreview(normalized.featuredImage);
    setSlugManual(!!initialData);
  }, [initialData]);

  useEffect(() => {
    if (!slugManual && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, slugManual]);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const tagsArray = form.tags
      ? form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      category_id: form.category || null,
      tags: tagsArray,
      cover_image: form.featuredImage,
      featured_image: form.featuredImage,
      status: form.published ? "published" : "draft",
      published: form.published,
      meta_title: form.metaTitle,
      meta_description: form.metaDescription,
    };

    if (imageFile) payload._imageFile = imageFile;

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

  const field = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 18,
  };

  return (
    <form onSubmit={handleSubmit}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .bf-tabs { display:flex; gap:4; margin-bottom:24px; border-bottom:1px solid rgba(104,80,68,0.09); padding-bottom:0; }
        .bf-tab { padding:10px 18px; border:none; background:none; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:400; color:rgba(104,80,68,0.50); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; transition:color 0.2s,border-color 0.2s; }
        .bf-tab.active { color:#3a405a; font-weight:500; border-bottom-color:#3a405a; }
        .bf-row2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .bf-img-preview { width:100%; max-height:200px; object-fit:cover; border-radius:10px; margin-top:8px; }
        .bf-toggle { display:flex; align-items:center; gap:10px; }
        .bf-toggle-track { width:40px; height:22px; border-radius:11px; background:rgba(104,80,68,0.15); position:relative; cursor:pointer; transition:background 0.2s; flex-shrink:0; }
        .bf-toggle-track.on { background:#3a405a; }
        .bf-toggle-thumb { position:absolute; top:3px; left:3px; width:16px; height:16px; border-radius:50%; background:#fff; transition:transform 0.2s; }
        .bf-toggle-track.on .bf-toggle-thumb { transform:translateX(18px); }
        .bf-save { padding:12px 32px; border-radius:10px; border:none; background:#3a405a; color:#f9dec9; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; letter-spacing:0.10em; text-transform:uppercase; cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; }
        .bf-save:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(58,64,90,0.20); }
        .bf-save:disabled { opacity:0.65; cursor:not-allowed; }
        @media(max-width:768px){.bf-row2{grid-template-columns:1fr;}}
      `}</style>

      <div className="bf-tabs">
        {["content", "seo"].map((t) => (
          <button
            key={t}
            type="button"
            className={`bf-tab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "content" ? "Content" : "SEO"}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <>
          <div style={field}>
            <label style={lbl}>Title</label>
            <input
              style={inp}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              placeholder="Post title"
            />
          </div>

          <div style={field}>
            <label style={lbl}>Slug</label>
            <input
              style={inp}
              value={form.slug}
              onChange={(e) => {
                setSlugManual(true);
                set("slug", e.target.value);
              }}
              placeholder="post-url-slug"
            />
          </div>

          <div className="bf-row2">
            <div style={field}>
              <label style={lbl}>Category</label>
              <select
                style={inp}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon ? `${cat.icon} ` : ""}
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={field}>
              <label style={lbl}>Tags (comma-separated)</label>
              <input
                style={inp}
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="tag1, tag2"
              />
            </div>
          </div>

          <div style={field}>
            <label style={lbl}>Excerpt</label>
            <textarea
              style={{ ...inp, minHeight: 80, resize: "vertical" }}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Short summary…"
            />
          </div>

          <div style={field}>
            <label style={lbl}>Content (Markdown / HTML)</label>
            <textarea
              style={{
                ...inp,
                minHeight: 260,
                resize: "vertical",
                fontFamily: "monospace",
                fontSize: 13,
              }}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Write your post here…"
            />
          </div>

          <div style={field}>
            <label style={lbl}>Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="bf-img-preview"
              />
            )}
            {!imageFile && form.featuredImage && (
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  color: "rgba(104,80,68,0.45)",
                  marginTop: 4,
                }}
              >
                Current: {form.featuredImage.split("/").pop()}
              </span>
            )}
          </div>

          <div style={{ ...field, marginBottom: 24 }}>
            <label style={lbl}>Published</label>
            <div className="bf-toggle">
              <div
                className={`bf-toggle-track${form.published ? " on" : ""}`}
                onClick={() => set("published", !form.published)}
              >
                <div className="bf-toggle-thumb" />
              </div>
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 13,
                  color: "rgba(104,80,68,0.60)",
                }}
              >
                {form.published ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </>
      )}

      {tab === "seo" && (
        <>
          <div style={field}>
            <label style={lbl}>Meta Title</label>
            <input
              style={inp}
              value={form.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
              placeholder="SEO title (leave blank to use post title)"
            />
          </div>

          <div style={field}>
            <label style={lbl}>Meta Description</label>
            <textarea
              style={{ ...inp, minHeight: 100, resize: "vertical" }}
              value={form.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
              placeholder="Brief description for search engines…"
            />
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: 10,
              background: "rgba(153,178,221,0.08)",
              border: "1px solid rgba(153,178,221,0.18)",
              marginBottom: 24,
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(104,80,68,0.40)",
                margin: "0 0 8px",
              }}
            >
              Preview
            </p>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 16,
                fontWeight: 500,
                color: "#1a0dab",
                margin: "0 0 2px",
              }}
            >
              {form.metaTitle || form.title || "Post Title"}
            </p>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                color: "#006621",
                margin: "0 0 4px",
              }}
            >
              /blog/{form.slug || "post-slug"}
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
              {form.metaDescription ||
                form.excerpt ||
                "Meta description will appear here."}
            </p>
          </div>
        </>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 8,
          borderTop: "1px solid rgba(104,80,68,0.07)",
        }}
      >
        <button type="submit" className="bf-save" disabled={isSaving}>
          {isSaving ? "Saving…" : isEdit ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
}